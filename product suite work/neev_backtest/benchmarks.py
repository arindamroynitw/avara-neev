"""
Benchmarks: Savings account, FD, Blind SIP.
All use calendar month stepping for fair comparison.
"""

import pandas as pd

from .config import SAVINGS_RATE, FD_RATE, TAX, BANK_FLOOR
from .utils import month_range, get_nav_value, LotTracker, CashFlowTracker


def calculate_savings_account(profile, start_date, end_date,
                              deduct_bank_floor=True):
    """Savings account at 3.5% p.a. — pre-tax returns."""
    monthly_surplus = profile["monthly_surplus"]
    initial_idle = profile["initial_idle"]
    monthly_rate = SAVINGS_RATE / 12

    balance = initial_idle
    if deduct_bank_floor:
        balance = max(0, balance - BANK_FLOOR)
    total_invested = balance

    cf = CashFlowTracker()
    monthly_data = []

    for month_idx, current in enumerate(month_range(start_date, end_date)):
        if month_idx == 0:
            cf.invest(current, balance)
        else:
            total_invested += monthly_surplus
            balance += monthly_surplus
            cf.invest(current, monthly_surplus)

        balance *= (1 + monthly_rate)

        monthly_data.append({
            "date": current,
            "month": month_idx,
            "invested": total_invested,
            "portfolio_value": balance,
            "gain": balance - total_invested,
            "return_pct": ((balance / total_invested) - 1) * 100
                          if total_invested > 0 else 0,
        })

    if not monthly_data:
        return None

    last = monthly_data[-1]
    cf.redeem(last["date"], last["portfolio_value"])

    return {
        "monthly": pd.DataFrame(monthly_data),
        "cashflows": cf,
        "lot_trackers": {},
        "final_date": last["date"],
    }


def calculate_fd(profile, start_date, end_date, deduct_bank_floor=True):
    """FD at 7% p.a. — PRE-tax returns (post-tax calculated separately).

    Previous code hardcoded post-tax rate here. Now we track pre-tax
    and let the tax module handle it, for apples-to-apples comparison.
    """
    monthly_surplus = profile["monthly_surplus"]
    initial_idle = profile["initial_idle"]
    monthly_rate = FD_RATE / 12  # Pre-tax rate

    balance = initial_idle
    if deduct_bank_floor:
        balance = max(0, balance - BANK_FLOOR)
    total_invested = balance

    cf = CashFlowTracker()
    monthly_data = []

    for month_idx, current in enumerate(month_range(start_date, end_date)):
        if month_idx == 0:
            cf.invest(current, balance)
        else:
            total_invested += monthly_surplus
            balance += monthly_surplus
            cf.invest(current, monthly_surplus)

        balance *= (1 + monthly_rate)

        monthly_data.append({
            "date": current,
            "month": month_idx,
            "invested": total_invested,
            "portfolio_value": balance,
            "gain": balance - total_invested,
            "return_pct": ((balance / total_invested) - 1) * 100
                          if total_invested > 0 else 0,
        })

    if not monthly_data:
        return None

    last = monthly_data[-1]
    cf.redeem(last["date"], last["portfolio_value"])

    return {
        "monthly": pd.DataFrame(monthly_data),
        "cashflows": cf,
        "lot_trackers": {},
        "final_date": last["date"],
    }


def calculate_blind_sip(nav_data, profile, start_date, end_date,
                        deduct_bank_floor=True):
    """Blind monthly SIP into Nifty 50 — no Reserve, no valuation awareness."""
    nifty_df = nav_data.get("uti_nifty50")
    if nifty_df is None:
        return None

    monthly_surplus = profile["monthly_surplus"]
    initial_idle = profile["initial_idle"]

    nifty_lots = LotTracker(is_arbitrage=False)
    cf = CashFlowTracker()
    total_invested = 0
    monthly_data = []

    for month_idx, current in enumerate(month_range(start_date, end_date)):
        nifty_nav = get_nav_value(nifty_df, current)
        if nifty_nav is None:
            continue

        if month_idx == 0:
            amount = initial_idle
            if deduct_bank_floor:
                amount = max(0, amount - BANK_FLOOR)
        else:
            amount = monthly_surplus

        if amount <= 0:
            continue

        total_invested += amount
        cf.invest(current, amount)
        nifty_lots.buy(current, amount, nifty_nav)

        portfolio_value = nifty_lots.value(nifty_nav)

        monthly_data.append({
            "date": current,
            "month": month_idx,
            "invested": total_invested,
            "portfolio_value": portfolio_value,
            "gain": portfolio_value - total_invested,
            "return_pct": ((portfolio_value / total_invested) - 1) * 100
                          if total_invested > 0 else 0,
        })

    if not monthly_data:
        return None

    last = monthly_data[-1]
    cf.redeem(last["date"], last["portfolio_value"])

    return {
        "monthly": pd.DataFrame(monthly_data),
        "cashflows": cf,
        "lot_trackers": {"nifty": nifty_lots},
        "final_date": last["date"],
    }
