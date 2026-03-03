"""
Neev Market Entry (was Systematic): Reserve base + valuation-aware STP into Nifty 50.

Uses actual Nifty PE data for deployment pacing:
  PE < 18 -> 1.5x pace (cheap, deploy faster)
  PE 18-22 -> 1.0x pace (normal)
  PE > 22 -> 0.5x pace (expensive, slow down)
  PE < 16 -> bonus 2x deployment (deep value, rare)
"""

import pandas as pd

from ..config import (
    RESERVE_LIQUID_PCT, RESERVE_LIQUID_CAP, BANK_FLOOR,
    MARKET_ENTRY_RESERVE_THRESHOLD_MULTIPLIER,
    MARKET_ENTRY_DEPLOY_RATE, MARKET_ENTRY_PE_BANDS,
    MARKET_ENTRY_DEEP_VALUE_PE, MARKET_ENTRY_DEEP_VALUE_BONUS,
)
from ..utils import (
    month_range, get_nav_on_date, get_nav_value,
    LotTracker, CashFlowTracker,
)
from ..data import get_pe_on_date


def _get_pace_multiplier(pe_value):
    """Determine deployment pace from PE ratio."""
    if pe_value is None:
        return 1.0

    bands = MARKET_ENTRY_PE_BANDS
    if pe_value < bands["cheap"]["max_pe"]:
        return bands["cheap"]["pace"]
    elif pe_value > bands["expensive"]["min_pe"]:
        return bands["expensive"]["pace"]
    else:
        return bands["normal"]["pace"]


def backtest_market_entry(nav_data, profile, start_date, end_date,
                          pe_df=None, deduct_bank_floor=True,
                          reserve_threshold_mult=None,
                          deploy_rate=None):
    """Backtest Neev Market Entry.

    Args:
        pe_df: Nifty PE DataFrame (from data.load_nifty_pe). If None, uses 1x pace.
        reserve_threshold_mult: Override for reserve threshold multiplier.
        deploy_rate: Override for deployment rate.
    """
    liquid_df = nav_data.get("parag_parikh_liquid")
    arb_df = nav_data.get("kotak_arbitrage")
    nifty_df = nav_data.get("uti_nifty50")

    if any(df is None for df in [liquid_df, arb_df, nifty_df]):
        return None

    monthly_surplus = profile["monthly_surplus"]
    initial_idle = profile["initial_idle"]
    threshold_mult = reserve_threshold_mult or MARKET_ENTRY_RESERVE_THRESHOLD_MULTIPLIER
    dep_rate = deploy_rate or MARKET_ENTRY_DEPLOY_RATE
    reserve_threshold = monthly_surplus * threshold_mult

    # Lot trackers
    liquid_lots = LotTracker(is_arbitrage=False)
    arb_lots = LotTracker(is_arbitrage=True)
    nifty_lots = LotTracker(is_arbitrage=False)
    cf = CashFlowTracker()

    total_invested = 0
    monthly_data = []
    deep_value_used = set()  # Track months where deep-value bonus was applied

    for month_idx, current in enumerate(month_range(start_date, end_date)):
        liquid_nav = get_nav_value(liquid_df, current)
        arb_nav = get_nav_value(arb_df, current)
        nifty_nav = get_nav_value(nifty_df, current)

        if any(v is None for v in [liquid_nav, arb_nav, nifty_nav]):
            continue

        # Determine inflow
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

        # Add to Reserve first (liquid + arb)
        current_liquid_value = liquid_lots.value(liquid_nav)
        liquid_target = min(total_invested * RESERVE_LIQUID_PCT, RESERVE_LIQUID_CAP)
        liquid_alloc = min(amount, max(0, liquid_target - current_liquid_value))
        arb_alloc = amount - liquid_alloc

        if liquid_alloc > 0:
            liquid_lots.buy(current, liquid_alloc, liquid_nav)
        if arb_alloc > 0:
            arb_lots.buy(current, arb_alloc, arb_nav)

        # Get PE-based pace
        pe_value = get_pe_on_date(pe_df, current) if pe_df is not None else None
        pace_multiplier = _get_pace_multiplier(pe_value)

        # Deep value bonus: PE < 16 -> one-time 2x bonus for the month
        deep_value_bonus = False
        if (pe_value is not None and pe_value < MARKET_ENTRY_DEEP_VALUE_PE
                and current.month not in deep_value_used):
            pace_multiplier *= MARKET_ENTRY_DEEP_VALUE_BONUS
            deep_value_bonus = True
            deep_value_used.add(current.month)

        # Deploy from Reserve to Nifty if threshold met
        reserve_value = liquid_lots.value(liquid_nav) + arb_lots.value(arb_nav)
        deploy_amount_actual = 0

        if month_idx >= 3 and reserve_value > reserve_threshold:
            excess = reserve_value - reserve_threshold
            deploy_amount = excess * dep_rate * pace_multiplier
            deploy_amount = min(deploy_amount, arb_lots.value(arb_nav))

            if deploy_amount > 0:
                # Sell arb (FIFO, with exit load), buy Nifty
                _, proceeds, _ = arb_lots.sell_fifo(
                    deploy_amount, arb_nav, current
                )
                if proceeds > 0:
                    nifty_lots.buy(current, proceeds, nifty_nav)
                    deploy_amount_actual = proceeds

        # Record snapshot
        reserve_val = liquid_lots.value(liquid_nav) + arb_lots.value(arb_nav)
        equity_val = nifty_lots.value(nifty_nav)
        portfolio_value = reserve_val + equity_val

        monthly_data.append({
            "date": current,
            "month": month_idx,
            "invested": total_invested,
            "portfolio_value": portfolio_value,
            "reserve_value": reserve_val,
            "equity_value": equity_val,
            "equity_pct": (equity_val / portfolio_value * 100)
                          if portfolio_value > 0 else 0,
            "pace_multiplier": pace_multiplier,
            "pe_value": pe_value,
            "deep_value_bonus": deep_value_bonus,
            "deployed": deploy_amount_actual,
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
        "lot_trackers": {
            "liquid": liquid_lots,
            "arb": arb_lots,
            "nifty": nifty_lots,
        },
        "final_date": last["date"],
    }
