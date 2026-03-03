"""
Utilities: Calendar stepping, NAV lookup (backward-only), XIRR (Brent's method),
currency formatting, unit lot tracking with FIFO.
"""

from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from scipy.optimize import brentq
import numpy as np

from .config import SWEEP_DAY, ARB_EXIT_LOAD_PCT, ARB_EXIT_LOAD_DAYS


# ============================================================
# CALENDAR MONTH STEPPING (Fix 1.1)
# ============================================================

def month_range(start_date, end_date):
    """Generate dates on the SWEEP_DAY of each month from start to end.

    Replaces timedelta(days=30) stepping. Anchors to 7th of each month.
    """
    # Anchor start to sweep day
    current = start_date.replace(day=SWEEP_DAY)
    if current < start_date:
        current += relativedelta(months=1)

    while current <= end_date:
        yield current
        current += relativedelta(months=1)


# ============================================================
# NAV LOOKUP — BACKWARD ONLY (Fix 1.2)
# ============================================================

def get_nav_on_date(df, target_date, tolerance_days=5):
    """Get most recent past NAV on or before target_date.

    Returns (nav, actual_date) tuple. Searches backward only — never uses
    future data. Returns (None, None) if no NAV found within tolerance.
    """
    if df is None:
        return None, None
    for delta in range(tolerance_days + 1):
        check_date = target_date - timedelta(days=delta)
        if check_date in df.index:
            return df.loc[check_date, "nav"], check_date
    return None, None


def get_nav_value(df, target_date, tolerance_days=5):
    """Convenience: return just the NAV float (or None)."""
    nav, _ = get_nav_on_date(df, target_date, tolerance_days)
    return nav


# ============================================================
# XIRR — BRENT'S METHOD (Fix 1.3)
# ============================================================

def xirr(cashflows):
    """Calculate XIRR using Brent's method.

    cashflows: list of (date, amount) tuples.
        Negative amounts = money going in (investments).
        Positive amounts = money coming out (final valuation).

    Returns annualized rate as a decimal (e.g., 0.12 for 12%).
    Returns 0 if calculation fails.
    """
    if len(cashflows) < 2:
        return 0.0

    # Sort by date
    cashflows = sorted(cashflows, key=lambda x: x[0])

    # Base date is the first cash flow
    t0 = cashflows[0][0]

    def npv(rate):
        """Net present value at given annual rate."""
        total = 0.0
        for dt, amount in cashflows:
            years = (dt - t0).days / 365.25
            if rate <= -1.0:
                return float('inf')
            total += amount / ((1 + rate) ** years)
        return total

    # Try to find root in reasonable range
    try:
        result = brentq(npv, -0.5, 5.0, xtol=1e-8, maxiter=200)
        return result
    except ValueError:
        # Brentq requires sign change in interval; try wider range
        try:
            result = brentq(npv, -0.9, 10.0, xtol=1e-8, maxiter=200)
            return result
        except (ValueError, RuntimeError):
            return 0.0


def xirr_pct(cashflows):
    """XIRR as percentage (e.g., 12.5 for 12.5%)."""
    return xirr(cashflows) * 100


# ============================================================
# UNIT LOT TRACKING (for tax & exit load)
# ============================================================

class UnitLot:
    """A single purchase lot: units bought at a specific NAV on a date."""
    __slots__ = ("date", "units", "nav")

    def __init__(self, date, units, nav):
        self.date = date
        self.units = units
        self.nav = nav

    @property
    def cost(self):
        return self.units * self.nav


class LotTracker:
    """FIFO lot tracker for a single fund.

    Tracks purchase lots, sells in FIFO order, calculates exit loads
    and per-lot holding periods for tax.
    """

    def __init__(self, is_arbitrage=False):
        self.lots = []  # list of UnitLot, oldest first
        self.is_arbitrage = is_arbitrage
        self.total_units = 0.0

    def buy(self, date, amount, nav):
        """Buy units at NAV on date. Returns units purchased."""
        if nav <= 0 or amount <= 0:
            return 0.0
        units = amount / nav
        self.lots.append(UnitLot(date, units, nav))
        self.total_units += units
        return units

    def sell_fifo(self, amount, current_nav, current_date):
        """Sell units worth `amount` in FIFO order.

        Returns (units_sold, proceeds_after_exit_load, lot_details).
        lot_details is a list of dicts with holding info for tax calculation.
        """
        if current_nav <= 0 or amount <= 0:
            return 0.0, 0.0, []

        units_needed = amount / current_nav
        units_sold = 0.0
        proceeds = 0.0
        lot_details = []  # For tax: [{cost, proceeds, holding_days, units}]

        remaining = units_needed
        new_lots = []

        for lot in self.lots:
            if remaining <= 0:
                new_lots.append(lot)
                continue

            sell_from_lot = min(lot.units, remaining)
            leftover = lot.units - sell_from_lot

            holding_days = (current_date - lot.date).days
            gross_proceeds = sell_from_lot * current_nav

            # Exit load for arbitrage lots < 30 days
            exit_load = 0.0
            if self.is_arbitrage and holding_days < ARB_EXIT_LOAD_DAYS:
                exit_load = gross_proceeds * ARB_EXIT_LOAD_PCT

            net_proceeds = gross_proceeds - exit_load
            proceeds += net_proceeds
            units_sold += sell_from_lot

            lot_details.append({
                "buy_date": lot.date,
                "buy_nav": lot.nav,
                "units": sell_from_lot,
                "cost": sell_from_lot * lot.nav,
                "gross_proceeds": gross_proceeds,
                "exit_load": exit_load,
                "net_proceeds": net_proceeds,
                "holding_days": holding_days,
            })

            if leftover > 0:
                new_lots.append(UnitLot(lot.date, leftover, lot.nav))

            remaining -= sell_from_lot

        self.lots = new_lots
        self.total_units -= units_sold
        return units_sold, proceeds, lot_details

    def value(self, current_nav):
        """Current market value of all lots."""
        if current_nav is None or current_nav <= 0:
            return 0.0
        return self.total_units * current_nav

    def cost_basis(self):
        """Total cost basis of remaining lots."""
        return sum(lot.cost for lot in self.lots)

    def unrealized_gain(self, current_nav):
        """Unrealized gain at current NAV."""
        return self.value(current_nav) - self.cost_basis()

    def lot_details_for_tax(self, current_nav, current_date):
        """Get per-lot details for tax calculation without selling."""
        details = []
        for lot in self.lots:
            details.append({
                "buy_date": lot.date,
                "buy_nav": lot.nav,
                "units": lot.units,
                "cost": lot.cost,
                "current_value": lot.units * current_nav,
                "gain": lot.units * (current_nav - lot.nav),
                "holding_days": (current_date - lot.date).days,
            })
        return details


# ============================================================
# CASH FLOW TRACKING
# ============================================================

class CashFlowTracker:
    """Track dated cash flows for XIRR calculation."""

    def __init__(self):
        self.flows = []  # list of (date, amount)

    def invest(self, date, amount):
        """Record an investment (money going in = negative flow)."""
        self.flows.append((date, -abs(amount)))

    def redeem(self, date, amount):
        """Record a redemption or final valuation (money out = positive)."""
        self.flows.append((date, abs(amount)))

    def get_xirr(self):
        """Calculate XIRR from all recorded flows."""
        return xirr(self.flows)

    def get_xirr_pct(self):
        return xirr_pct(self.flows)


# ============================================================
# CURRENCY FORMATTING
# ============================================================

def format_currency(amount):
    """Format number as Indian currency."""
    if amount is None:
        return "N/A"
    neg = amount < 0
    amount = abs(amount)
    if amount >= 10000000:
        s = f"{amount/10000000:.2f} Cr"
    elif amount >= 100000:
        s = f"{amount/100000:.2f} L"
    elif amount >= 1000:
        s = f"{amount/1000:.1f}K"
    else:
        s = f"{amount:.0f}"
    return f"-₹{s}" if neg else f"₹{s}"


def format_pct(value, decimals=2):
    """Format as percentage string."""
    if value is None:
        return "N/A"
    return f"{value:.{decimals}f}%"
