"""
Rolling returns: Run 3-year backtests starting every month across the full
NAV data range. Shows if results are robust or path-dependent.
"""

from datetime import datetime
from dateutil.relativedelta import relativedelta
import pandas as pd

from ..products.reserve import backtest_reserve
from ..products.market_entry import backtest_market_entry
from ..products.grow import backtest_grow
from ..benchmarks import calculate_savings_account


def rolling_backtests(nav_data, profile, pe_df=None,
                      window_months=36,
                      earliest_start=None,
                      latest_end=None,
                      step_months=1):
    """Run rolling backtests for all products.

    Args:
        window_months: Length of each backtest window (default 36 = 3 years)
        earliest_start: Earliest possible start date (default: 2019-01-07)
        latest_end: Latest possible end date (default: 2026-02-07)
        step_months: Step between start dates (default: 1 month)

    Returns dict of product_name -> list of result summaries.
    """
    if earliest_start is None:
        earliest_start = datetime(2019, 1, 7)
    if latest_end is None:
        latest_end = datetime(2026, 2, 7)

    results = {
        "reserve": [],
        "market_entry": [],
        "grow": [],
        "savings": [],
    }

    current_start = earliest_start
    window_count = 0

    while True:
        end_date = current_start + relativedelta(months=window_months)
        if end_date > latest_end:
            break

        window_label = (f"{current_start.strftime('%b %Y')} - "
                        f"{end_date.strftime('%b %Y')}")

        # Run each product
        reserve_result = backtest_reserve(
            nav_data, profile, current_start, end_date)
        me_result = backtest_market_entry(
            nav_data, profile, current_start, end_date, pe_df=pe_df)
        grow_result = backtest_grow(
            nav_data, profile, current_start, end_date, pe_df=pe_df)
        savings_result = calculate_savings_account(
            profile, current_start, end_date)

        for name, result in [
            ("reserve", reserve_result),
            ("market_entry", me_result),
            ("grow", grow_result),
            ("savings", savings_result),
        ]:
            if result is not None:
                monthly = result["monthly"]
                last = monthly.iloc[-1]
                xirr = result["cashflows"].get_xirr_pct()

                savings_gain = 0
                if savings_result:
                    savings_gain = savings_result["monthly"].iloc[-1]["gain"]

                results[name].append({
                    "window": window_label,
                    "start": current_start,
                    "end": end_date,
                    "invested": last["invested"],
                    "final_value": last["portfolio_value"],
                    "gain": last["gain"],
                    "return_pct": last["return_pct"],
                    "xirr": xirr,
                    "extra_vs_savings": last["gain"] - savings_gain,
                })

        current_start += relativedelta(months=step_months)
        window_count += 1

    return results


def rolling_summary(rolling_results):
    """Summarize rolling backtest results per product.

    Returns dict of product_name -> summary dict.
    """
    summaries = {}

    for product_name, windows in rolling_results.items():
        if not windows:
            continue

        xirrs = [w["xirr"] for w in windows if w["xirr"] != 0]
        extras = [w["extra_vs_savings"] for w in windows]

        positive_extra = sum(1 for e in extras if e > 0)

        summaries[product_name] = {
            "num_windows": len(windows),
            "median_xirr": pd.Series(xirrs).median() if xirrs else 0,
            "mean_xirr": pd.Series(xirrs).mean() if xirrs else 0,
            "min_xirr": min(xirrs) if xirrs else 0,
            "max_xirr": max(xirrs) if xirrs else 0,
            "pct_positive_extra_vs_savings": (
                positive_extra / len(extras) * 100 if extras else 0
            ),
            "median_extra_vs_savings": (
                pd.Series(extras).median() if extras else 0
            ),
        }

    return summaries
