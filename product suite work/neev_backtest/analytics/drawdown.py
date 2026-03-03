"""
Drawdown analysis: max drawdown, peak-to-trough duration, recovery time.
"""

import pandas as pd
import numpy as np


def calculate_drawdown_series(monthly_df):
    """Calculate running drawdown from portfolio_value column.

    Returns DataFrame with columns: peak, drawdown, drawdown_pct.
    """
    values = monthly_df["portfolio_value"].values
    dates = monthly_df["date"].values

    peak = np.maximum.accumulate(values)
    drawdown = values - peak
    drawdown_pct = np.where(peak > 0, drawdown / peak * 100, 0)

    return pd.DataFrame({
        "date": dates,
        "portfolio_value": values,
        "peak": peak,
        "drawdown": drawdown,
        "drawdown_pct": drawdown_pct,
    })


def max_drawdown(monthly_df):
    """Calculate max drawdown statistics.

    Returns dict with:
        max_drawdown_pct: worst peak-to-trough drop (negative %)
        max_drawdown_abs: absolute rupee amount of worst drop
        peak_date: date of the peak before the worst drop
        trough_date: date of the trough
        recovery_date: date portfolio recovered to peak (or None)
        peak_to_trough_months: duration of the drop
        recovery_months: months from trough to recovery (or None)
    """
    if monthly_df is None or monthly_df.empty:
        return None

    dd = calculate_drawdown_series(monthly_df)

    worst_idx = dd["drawdown_pct"].idxmin()
    worst_row = dd.loc[worst_idx]

    # Find peak date (last date where portfolio_value == peak before trough)
    pre_trough = dd.loc[:worst_idx]
    peak_mask = pre_trough["portfolio_value"] == pre_trough["peak"]
    if peak_mask.any():
        peak_idx = pre_trough[peak_mask].index[-1]
        peak_date = dd.loc[peak_idx, "date"]
    else:
        peak_date = dd.loc[0, "date"]
        peak_idx = 0

    trough_date = worst_row["date"]
    peak_value = worst_row["peak"]

    # Find recovery date
    post_trough = dd.loc[worst_idx:]
    recovered = post_trough[post_trough["portfolio_value"] >= peak_value]
    if len(recovered) > 0:
        recovery_date = recovered.iloc[0]["date"]
        recovery_months = int((pd.Timestamp(recovery_date) -
                               pd.Timestamp(trough_date)).days / 30)
    else:
        recovery_date = None
        recovery_months = None

    peak_to_trough_months = int((pd.Timestamp(trough_date) -
                                 pd.Timestamp(peak_date)).days / 30)

    return {
        "max_drawdown_pct": float(worst_row["drawdown_pct"]),
        "max_drawdown_abs": float(worst_row["drawdown"]),
        "peak_date": peak_date,
        "trough_date": trough_date,
        "recovery_date": recovery_date,
        "peak_to_trough_months": peak_to_trough_months,
        "recovery_months": recovery_months,
    }


def all_drawdowns(monthly_df, threshold_pct=-2.0):
    """List all drawdown episodes deeper than threshold.

    Returns list of dicts sorted by severity.
    """
    if monthly_df is None or monthly_df.empty:
        return []

    dd = calculate_drawdown_series(monthly_df)
    episodes = []
    in_drawdown = False
    episode_start = None
    episode_peak_val = None

    for i, row in dd.iterrows():
        if row["drawdown_pct"] < threshold_pct:
            if not in_drawdown:
                in_drawdown = True
                episode_start = i
                episode_peak_val = row["peak"]
        else:
            if in_drawdown:
                # End of episode
                episode_data = dd.loc[episode_start:i]
                worst = episode_data["drawdown_pct"].min()
                trough_idx = episode_data["drawdown_pct"].idxmin()
                episodes.append({
                    "start_date": dd.loc[episode_start, "date"],
                    "trough_date": dd.loc[trough_idx, "date"],
                    "end_date": row["date"],
                    "max_drawdown_pct": float(worst),
                    "duration_months": int(
                        (pd.Timestamp(row["date"]) -
                         pd.Timestamp(dd.loc[episode_start, "date"])).days / 30
                    ),
                })
                in_drawdown = False

    return sorted(episodes, key=lambda x: x["max_drawdown_pct"])
