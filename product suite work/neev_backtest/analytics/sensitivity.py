"""
Sensitivity analysis: Test parameter ranges for each product.
Identifies whether current parameter choices are in the optimal zone.
"""

import pandas as pd
import numpy as np
from itertools import product as iterproduct

from ..products.reserve import backtest_reserve
from ..products.market_entry import backtest_market_entry
from ..products.grow import backtest_grow
from .risk_metrics import sharpe_ratio, compute_all_risk_metrics


def _extract_summary(result):
    """Extract summary metrics from a backtest result."""
    if result is None:
        return None
    monthly = result["monthly"]
    if monthly.empty:
        return None
    last = monthly.iloc[-1]
    xirr = result["cashflows"].get_xirr_pct()
    xirr_annual = result["cashflows"].get_xirr()
    metrics = compute_all_risk_metrics(monthly, xirr_annual=xirr_annual)
    return {
        "final_value": last["portfolio_value"],
        "gain": last["gain"],
        "return_pct": last["return_pct"],
        "xirr": xirr,
        "sharpe": metrics["sharpe_ratio"] if metrics else 0,
        "sortino": metrics["sortino_ratio"] if metrics else 0,
        "max_drawdown_pct": metrics["max_drawdown_pct"] if metrics else 0,
    }


def sensitivity_reserve(nav_data, profile, start_date, end_date):
    """Sensitivity analysis for Reserve parameters.

    Tests: liquid/arb split, liquid cap.
    Returns DataFrame of results.
    """
    # We test by modifying config temporarily via monkey-patching the module
    # Actually, Reserve's allocation is hardcoded. We'll re-implement inline.
    from ..config import RESERVE_LIQUID_CAP
    from ..utils import (
        month_range, get_nav_value, LotTracker, CashFlowTracker,
    )
    from ..config import BANK_FLOOR

    liquid_df = nav_data.get("parag_parikh_liquid")
    arb_df = nav_data.get("kotak_arbitrage")
    if liquid_df is None or arb_df is None:
        return pd.DataFrame()

    liquid_pcts = [0.10, 0.20, 0.30]
    liquid_caps = [100000, 200000, 300000]

    rows = []
    for liq_pct, liq_cap in iterproduct(liquid_pcts, liquid_caps):
        liquid_lots = LotTracker(is_arbitrage=False)
        arb_lots = LotTracker(is_arbitrage=True)
        cf = CashFlowTracker()
        total_invested = 0

        for month_idx, current in enumerate(month_range(start_date, end_date)):
            liquid_nav = get_nav_value(liquid_df, current)
            arb_nav = get_nav_value(arb_df, current)
            if liquid_nav is None or arb_nav is None:
                continue

            amount = (max(0, profile["initial_idle"] - BANK_FLOOR)
                      if month_idx == 0 else profile["monthly_surplus"])
            if amount <= 0:
                continue

            total_invested += amount
            cf.invest(current, amount)

            current_liquid_value = liquid_lots.value(liquid_nav)
            liquid_target = min(total_invested * liq_pct, liq_cap)
            liquid_alloc = min(amount, max(0, liquid_target - current_liquid_value))
            arb_alloc = amount - liquid_alloc

            if liquid_alloc > 0:
                liquid_lots.buy(current, liquid_alloc, liquid_nav)
            if arb_alloc > 0:
                arb_lots.buy(current, arb_alloc, arb_nav)

        final_nav_l = get_nav_value(liquid_df, end_date)
        final_nav_a = get_nav_value(arb_df, end_date)
        if final_nav_l and final_nav_a:
            final_value = liquid_lots.value(final_nav_l) + arb_lots.value(final_nav_a)
            last_date = list(month_range(start_date, end_date))[-1]
            cf.redeem(last_date, final_value)
            xirr_val = cf.get_xirr_pct()
            xirr_dec = cf.get_xirr()
            # Reserve has near-zero volatility, so Sharpe is very high
            # Use XIRR directly as a comparable metric
            rows.append({
                "liquid_pct": liq_pct,
                "liquid_cap": liq_cap,
                "final_value": final_value,
                "gain": final_value - total_invested,
                "xirr": xirr_val,
                "sharpe": xirr_dec / 0.01 if xirr_dec > 0 else 0,  # Proxy: higher XIRR = better
                "sortino": 0,
                "max_drawdown_pct": 0,
            })

    return pd.DataFrame(rows)


def sensitivity_market_entry(nav_data, profile, start_date, end_date,
                             pe_df=None):
    """Sensitivity analysis for Market Entry parameters.

    Tests: reserve threshold multiplier, deployment rate, PE bands.
    """
    threshold_mults = [2, 3, 4]
    deploy_rates = [0.10, 0.15, 0.20, 0.25, 0.30]

    rows = []
    for thresh, rate in iterproduct(threshold_mults, deploy_rates):
        result = backtest_market_entry(
            nav_data, profile, start_date, end_date,
            pe_df=pe_df,
            reserve_threshold_mult=thresh,
            deploy_rate=rate,
        )
        summary = _extract_summary(result)
        if summary:
            summary["threshold_mult"] = thresh
            summary["deploy_rate"] = rate
            rows.append(summary)

    return pd.DataFrame(rows)


def sensitivity_grow(nav_data, profile, start_date, end_date, pe_df=None):
    """Sensitivity analysis for Grow parameters.

    Tests: core/satellite split, momentum tilt factor, rebalance frequency.
    """
    core_pcts = [0.30, 0.40, 0.50]
    tilt_variants = ["conservative", "moderate", "aggressive"]
    # Test quarterly vs bi-monthly vs semi-annual
    rebalance_options = [
        ("quarterly", {3, 6, 9, 12}),
        ("bi-monthly", {2, 4, 6, 8, 10, 12}),
        ("semi-annual", {6, 12}),
    ]

    rows = []
    for core_pct, tilt_var in iterproduct(core_pcts, tilt_variants):
        for rebal_name, rebal_months in rebalance_options:
            result = backtest_grow(
                nav_data, profile, start_date, end_date,
                pe_df=pe_df,
                tilt_variant=tilt_var,
                core_pct=core_pct,
                rebalance_months=rebal_months,
            )
            summary = _extract_summary(result)
            if summary:
                summary["core_pct"] = core_pct
                summary["tilt_variant"] = tilt_var
                summary["rebalance"] = rebal_name
                rows.append(summary)

    return pd.DataFrame(rows)


def find_optimal(sensitivity_df, metric="sharpe"):
    """Find the parameter combination with best risk-adjusted returns.

    Returns the row with highest Sharpe ratio (or other metric).
    Falls back to 'xirr' if primary metric not available.
    """
    if sensitivity_df.empty:
        return None
    if metric not in sensitivity_df.columns:
        metric = "xirr" if "xirr" in sensitivity_df.columns else sensitivity_df.columns[0]
    return sensitivity_df.loc[sensitivity_df[metric].idxmax()].to_dict()
