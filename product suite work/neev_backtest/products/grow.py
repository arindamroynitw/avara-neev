"""
Neev Grow (was Alpha): Diversified active allocation with momentum tilt.

Reserve base -> Deploy into:
  Core: 40% Nifty 50
  Satellite: 15% each of Nifty Next 50, Midcap, Flexi, International

Quarterly rebalancing on calendar quarters (Mar/Jun/Sep/Dec).
Momentum-based tilt: overweight outperformers, underweight laggards.

Also supports an "index-only" variant to decompose alpha from fund picking
vs asset allocation + momentum.
"""

import numpy as np
import pandas as pd

from ..config import (
    RESERVE_LIQUID_PCT, RESERVE_LIQUID_CAP, BANK_FLOOR,
    GROW_RESERVE_THRESHOLD_MULTIPLIER, GROW_DEPLOY_RATE,
    GROW_CORE_PCT, GROW_REBALANCE_MONTHS,
    GROW_MOMENTUM_TILT_VARIANTS,
)
from ..utils import (
    month_range, get_nav_on_date, get_nav_value,
    LotTracker, CashFlowTracker,
)
from ..data import get_pe_on_date
from dateutil.relativedelta import relativedelta


# Satellite fund configurations
ACTIVE_SATELLITES = {
    "next50": {"key": "icici_nifty_next50", "target_pct": 0.15},
    "midcap": {"key": "hdfc_midcap", "target_pct": 0.15},
    "flexi":  {"key": "parag_parikh_flexi", "target_pct": 0.15},
    "intl":   {"key": "motilal_sp500", "target_pct": 0.15},
}

INDEX_SATELLITES = {
    "next50":  {"key": "icici_nifty_next50", "target_pct": 0.15},
    "midcap":  {"key": "motilal_midcap150", "target_pct": 0.15},
    "flexi":   {"key": "parag_parikh_flexi", "target_pct": 0.15},
    "intl":    {"key": "motilal_sp500", "target_pct": 0.15},
}


def backtest_grow(nav_data, profile, start_date, end_date,
                  pe_df=None, deduct_bank_floor=True,
                  tilt_variant="moderate", use_index_only=False,
                  core_pct=None, deploy_rate=None,
                  rebalance_months=None):
    """Backtest Neev Grow.

    Args:
        tilt_variant: 'conservative', 'moderate', or 'aggressive'
        use_index_only: If True, use index funds for satellites (survivorship bias test)
        core_pct: Override core allocation percentage
        deploy_rate: Override deployment rate
        rebalance_months: Override rebalance calendar months
    """
    liquid_df = nav_data.get("parag_parikh_liquid")
    arb_df = nav_data.get("kotak_arbitrage")
    nifty_df = nav_data.get("uti_nifty50")

    if any(df is None for df in [liquid_df, arb_df, nifty_df]):
        return None

    # Select satellite config
    sat_config = INDEX_SATELLITES if use_index_only else ACTIVE_SATELLITES

    # Resolve available satellite fund DataFrames
    satellites = {}
    for name, cfg in sat_config.items():
        df = nav_data.get(cfg["key"])
        if df is not None:
            satellites[name] = {
                "df": df,
                "target_pct": cfg["target_pct"],
            }

    monthly_surplus = profile["monthly_surplus"]
    initial_idle = profile["initial_idle"]
    reserve_threshold = monthly_surplus * GROW_RESERVE_THRESHOLD_MULTIPLIER
    core_allocation = core_pct or GROW_CORE_PCT
    dep_rate = deploy_rate or GROW_DEPLOY_RATE
    rebal_months = rebalance_months or GROW_REBALANCE_MONTHS

    tilt_config = GROW_MOMENTUM_TILT_VARIANTS[tilt_variant]
    tilt_factor = tilt_config["factor"]
    tilt_clamp = tilt_config["clamp"]

    # Lot trackers
    liquid_lots = LotTracker(is_arbitrage=False)
    arb_lots = LotTracker(is_arbitrage=True)
    nifty_lots = LotTracker(is_arbitrage=False)
    sat_lots = {name: LotTracker(is_arbitrage=False) for name in satellites}
    cf = CashFlowTracker()

    # Current tilt weights (updated quarterly)
    current_tilts = {name: 1.0 for name in satellites}

    total_invested = 0
    monthly_data = []

    for month_idx, current in enumerate(month_range(start_date, end_date)):
        liquid_nav = get_nav_value(liquid_df, current)
        arb_nav = get_nav_value(arb_df, current)
        nifty_nav = get_nav_value(nifty_df, current)

        if any(v is None for v in [liquid_nav, arb_nav, nifty_nav]):
            continue

        # Get satellite NAVs
        sat_navs = {}
        for name, sat in satellites.items():
            sat_navs[name] = get_nav_value(sat["df"], current)

        # Inflow
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

        # Add to Reserve
        current_liquid_value = liquid_lots.value(liquid_nav)
        liquid_target = min(total_invested * RESERVE_LIQUID_PCT, RESERVE_LIQUID_CAP)
        liquid_alloc = min(amount, max(0, liquid_target - current_liquid_value))
        arb_alloc = amount - liquid_alloc

        if liquid_alloc > 0:
            liquid_lots.buy(current, liquid_alloc, liquid_nav)
        if arb_alloc > 0:
            arb_lots.buy(current, arb_alloc, arb_nav)

        # Quarterly momentum tilt recalculation (Fix 3.4: use calendar quarters)
        if current.month in rebal_months and month_idx > 3:
            returns_3m = {}
            for name, sat in satellites.items():
                nav_now = sat_navs.get(name)
                past_date = current - relativedelta(months=3)
                nav_past = get_nav_value(sat["df"], past_date)
                if nav_now and nav_past and nav_past > 0:
                    returns_3m[name] = (nav_now - nav_past) / nav_past

            if returns_3m:
                avg_return = np.mean(list(returns_3m.values()))
                for name in satellites:
                    if name in returns_3m:
                        raw_tilt = 1 + (returns_3m[name] - avg_return) * tilt_factor
                        current_tilts[name] = max(tilt_clamp[0],
                                                  min(tilt_clamp[1], raw_tilt))
                    else:
                        current_tilts[name] = 1.0

        # Deploy from Reserve to equity
        reserve_value = liquid_lots.value(liquid_nav) + arb_lots.value(arb_nav)
        deploy_amount_actual = 0

        if month_idx >= 3 and reserve_value > reserve_threshold:
            excess = reserve_value - reserve_threshold
            deploy_amount = excess * dep_rate
            deploy_amount = min(deploy_amount, arb_lots.value(arb_nav))

            if deploy_amount > 0:
                _, proceeds, _ = arb_lots.sell_fifo(
                    deploy_amount, arb_nav, current
                )
                if proceeds > 0:
                    deploy_amount_actual = proceeds

                    # Core: Nifty 50
                    core_amount = proceeds * core_allocation
                    nifty_lots.buy(current, core_amount, nifty_nav)

                    # Satellite: distribute remaining with momentum tilt
                    sat_total = proceeds * (1 - core_allocation)
                    active_sats = {k: v for k, v in satellites.items()
                                   if sat_navs.get(k) is not None}

                    if active_sats:
                        total_tilt = sum(current_tilts.get(n, 1.0)
                                         for n in active_sats)
                        for name in active_sats:
                            tilt = current_tilts.get(name, 1.0)
                            alloc = sat_total * (tilt / total_tilt)
                            nav = sat_navs[name]
                            if nav and nav > 0:
                                sat_lots[name].buy(current, alloc, nav)

        # Portfolio value
        reserve_val = liquid_lots.value(liquid_nav) + arb_lots.value(arb_nav)
        core_val = nifty_lots.value(nifty_nav)
        sat_val = sum(
            sat_lots[name].value(sat_navs.get(name) or 0)
            for name in satellites
        )
        equity_val = core_val + sat_val
        portfolio_value = reserve_val + equity_val

        monthly_data.append({
            "date": current,
            "month": month_idx,
            "invested": total_invested,
            "portfolio_value": portfolio_value,
            "reserve_value": reserve_val,
            "core_equity": core_val,
            "satellite_equity": sat_val,
            "equity_pct": (equity_val / portfolio_value * 100)
                          if portfolio_value > 0 else 0,
            "deployed": deploy_amount_actual,
            "gain": portfolio_value - total_invested,
            "return_pct": ((portfolio_value / total_invested) - 1) * 100
                          if total_invested > 0 else 0,
        })

    if not monthly_data:
        return None

    last = monthly_data[-1]
    cf.redeem(last["date"], last["portfolio_value"])

    all_lot_trackers = {
        "liquid": liquid_lots,
        "arb": arb_lots,
        "nifty": nifty_lots,
    }
    all_lot_trackers.update(sat_lots)

    return {
        "monthly": pd.DataFrame(monthly_data),
        "cashflows": cf,
        "lot_trackers": all_lot_trackers,
        "final_date": last["date"],
        "tilt_variant": tilt_variant,
        "index_only": use_index_only,
    }
