"""
Stress testing: Run each product through specific market events.
Shows per-event portfolio drop, recovery time, and product behavior.
"""

from datetime import datetime
from dateutil.relativedelta import relativedelta
import pandas as pd
import numpy as np

from ..config import STRESS_EVENTS
from .drawdown import max_drawdown


def stress_test_product(monthly_df, events=None):
    """Analyze product behavior during specific stress events.

    Args:
        monthly_df: Product's monthly DataFrame with 'date' and 'portfolio_value'
        events: dict of event_name -> {start, end, description} (defaults to STRESS_EVENTS)

    Returns dict of event_name -> analysis dict.
    """
    if monthly_df is None or monthly_df.empty:
        return {}

    if events is None:
        events = STRESS_EVENTS

    results = {}

    for event_name, event in events.items():
        event_start = event["start"]
        event_end = event["end"]

        # Filter monthly data to event window
        mask = ((monthly_df["date"] >= pd.Timestamp(event_start)) &
                (monthly_df["date"] <= pd.Timestamp(event_end)))
        event_data = monthly_df[mask]

        if event_data.empty or len(event_data) < 2:
            results[event_name] = {
                "description": event["description"],
                "available": False,
            }
            continue

        # Portfolio behavior during event
        start_value = event_data.iloc[0]["portfolio_value"]
        end_value = event_data.iloc[-1]["portfolio_value"]
        min_value = event_data["portfolio_value"].min()

        # Raw portfolio return (includes new money flowing in — misleading for DCA)
        raw_return = (end_value / start_value - 1) * 100 if start_value > 0 else 0

        # Investment-adjusted return: strip out new money to show market-only impact
        start_invested = event_data.iloc[0]["invested"]
        end_invested = event_data.iloc[-1]["invested"]
        new_investment = end_invested - start_invested

        if start_value > 0:
            event_return = ((end_value - new_investment) / start_value - 1) * 100
        else:
            event_return = 0

        # Investment-adjusted max drop: for each month, remove cumulative new money
        # to isolate market-driven drawdown from the starting portfolio
        adj_values = []
        for _, row in event_data.iterrows():
            cumulative_new = row["invested"] - start_invested
            adj_val = row["portfolio_value"] - cumulative_new
            adj_values.append(adj_val)

        if adj_values and adj_values[0] > 0:
            adj_min = min(adj_values)
            max_drop = ((adj_min / adj_values[0]) - 1) * 100
        else:
            max_drop = 0

        # Check equity percentage if available
        equity_start = event_data.iloc[0].get("equity_pct", None)
        equity_end = event_data.iloc[-1].get("equity_pct", None)

        # Recovery: when did investment-adjusted value recover to pre-event level?
        post_event = monthly_df[monthly_df["date"] > pd.Timestamp(event_end)]
        recovery_date = None
        recovery_months = None
        if not post_event.empty and start_value > 0:
            for _, row in post_event.iterrows():
                cumulative_new = row["invested"] - start_invested
                adj_val = row["portfolio_value"] - cumulative_new
                if adj_val >= start_value:
                    recovery_date = row["date"]
                    recovery_months = int(
                        (pd.Timestamp(recovery_date) -
                         pd.Timestamp(event_end)).days / 30
                    )
                    break

        results[event_name] = {
            "description": event["description"],
            "available": True,
            "start_value": start_value,
            "end_value": end_value,
            "min_value": min_value,
            "event_return_pct": event_return,
            "max_drop_pct": max_drop,
            "new_investment_during": new_investment,
            "equity_pct_start": equity_start,
            "equity_pct_end": equity_end,
            "recovery_date": recovery_date,
            "recovery_months": recovery_months,
        }

    return results


def stress_test_all_products(product_results):
    """Run stress tests across all products.

    Args:
        product_results: dict of product_name -> backtest result dict

    Returns dict of product_name -> stress test results.
    """
    all_stress = {}
    for name, result in product_results.items():
        if result is not None and "monthly" in result:
            all_stress[name] = stress_test_product(result["monthly"])
    return all_stress
