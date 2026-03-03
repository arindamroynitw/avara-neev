"""
Neev Reserve: Liquid (20%) + Arbitrage (80%) parking product.

Tax-optimized parking with instant T+0 access via liquid fund layer.
Monthly rebalancing to maintain target allocation.
"""

import pandas as pd

from ..config import (
    RESERVE_LIQUID_PCT, RESERVE_LIQUID_CAP, BANK_FLOOR,
)
from ..utils import (
    month_range, get_nav_value, LotTracker, CashFlowTracker,
    format_currency,
)


def backtest_reserve(nav_data, profile, start_date, end_date,
                     deduct_bank_floor=True):
    """Backtest Neev Reserve.

    Returns dict with:
        - 'monthly': DataFrame of monthly snapshots
        - 'cashflows': CashFlowTracker for XIRR
        - 'lot_trackers': dict of LotTracker for tax
    """
    liquid_df = nav_data.get("parag_parikh_liquid")
    arb_df = nav_data.get("kotak_arbitrage")

    if liquid_df is None or arb_df is None:
        return None

    monthly_surplus = profile["monthly_surplus"]
    initial_idle = profile["initial_idle"]

    liquid_lots = LotTracker(is_arbitrage=False)
    arb_lots = LotTracker(is_arbitrage=True)
    cf = CashFlowTracker()

    total_invested = 0
    monthly_data = []

    for month_idx, current in enumerate(month_range(start_date, end_date)):
        liquid_nav = get_nav_value(liquid_df, current)
        arb_nav = get_nav_value(arb_df, current)

        if liquid_nav is None or arb_nav is None:
            continue

        # Determine inflow
        if month_idx == 0:
            amount = initial_idle
            if deduct_bank_floor:
                amount = max(0, amount - BANK_FLOOR)
        else:
            amount = monthly_surplus
            if deduct_bank_floor and month_idx == 1:
                # Ongoing bank floor already maintained from month 0
                pass

        if amount <= 0:
            continue

        total_invested += amount
        cf.invest(current, amount)

        # Allocation: 20% liquid (capped), 80% arbitrage
        current_liquid_value = liquid_lots.value(liquid_nav)
        liquid_target = min(total_invested * RESERVE_LIQUID_PCT, RESERVE_LIQUID_CAP)

        if current_liquid_value < liquid_target:
            liquid_allocation = min(amount, liquid_target - current_liquid_value)
        else:
            liquid_allocation = 0

        arb_allocation = amount - liquid_allocation

        # Buy units
        if liquid_allocation > 0:
            liquid_lots.buy(current, liquid_allocation, liquid_nav)
        if arb_allocation > 0:
            arb_lots.buy(current, arb_allocation, arb_nav)

        # Record snapshot
        liquid_value = liquid_lots.value(liquid_nav)
        arb_value = arb_lots.value(arb_nav)
        portfolio_value = liquid_value + arb_value

        monthly_data.append({
            "date": current,
            "month": month_idx,
            "invested": total_invested,
            "portfolio_value": portfolio_value,
            "liquid_value": liquid_value,
            "arb_value": arb_value,
            "gain": portfolio_value - total_invested,
            "return_pct": ((portfolio_value / total_invested) - 1) * 100
                          if total_invested > 0 else 0,
        })

    if not monthly_data:
        return None

    # Record final valuation for XIRR
    last = monthly_data[-1]
    cf.redeem(last["date"], last["portfolio_value"])

    return {
        "monthly": pd.DataFrame(monthly_data),
        "cashflows": cf,
        "lot_trackers": {
            "liquid": liquid_lots,
            "arb": arb_lots,
        },
        "final_date": last["date"],
    }
