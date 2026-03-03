"""
Risk-adjusted return metrics: Sharpe, Sortino, Calmar ratios.

For DCA (dollar-cost-averaging) portfolios, standard total-return calculations
are misleading because portfolio growth includes new money flowing in. We use:
- XIRR for annualized returns
- "Investment-adjusted returns" for monthly return series: each month's return
  is calculated as (end_value - start_value - new_investment) / start_value
"""

import numpy as np
import pandas as pd

from .drawdown import max_drawdown


def monthly_returns(monthly_df):
    """Calculate investment-adjusted monthly returns for DCA portfolios.

    For each month: return = (V_end - V_start - new_money) / V_start
    This isolates the market return from new cash flows.

    Returns numpy array of decimal returns.
    """
    values = monthly_df["portfolio_value"].values
    invested = monthly_df["invested"].values

    if len(values) < 2:
        return np.array([])

    returns = []
    for i in range(1, len(values)):
        new_money = invested[i] - invested[i - 1]
        if values[i - 1] > 0:
            r = (values[i] - values[i - 1] - new_money) / values[i - 1]
            returns.append(r)
        else:
            returns.append(0.0)

    return np.array(returns)


def annualized_volatility(monthly_df):
    """Annualized volatility from investment-adjusted monthly returns."""
    rets = monthly_returns(monthly_df)
    if len(rets) < 2:
        return 0.0
    return float(np.std(rets, ddof=1) * np.sqrt(12))


def sharpe_ratio(monthly_df, xirr_annual, risk_free_annual=0.06):
    """Sharpe ratio: (XIRR - risk-free) / annualized volatility.

    Uses XIRR (from CashFlowTracker) as the return measure, not
    simple total return which is distorted by DCA cash flows.
    """
    ann_vol = annualized_volatility(monthly_df)
    if ann_vol == 0:
        return 0.0
    return (xirr_annual - risk_free_annual) / ann_vol


def sortino_ratio(monthly_df, xirr_annual, risk_free_annual=0.06):
    """Sortino ratio: uses downside deviation instead of total volatility."""
    rets = monthly_returns(monthly_df)
    if len(rets) < 2:
        return 0.0

    risk_free_monthly = (1 + risk_free_annual) ** (1/12) - 1
    excess_returns = rets - risk_free_monthly
    downside = excess_returns[excess_returns < 0]

    if len(downside) == 0:
        return float('inf')

    downside_dev = float(np.sqrt(np.mean(downside ** 2)) * np.sqrt(12))

    if downside_dev == 0:
        return float('inf')

    return (xirr_annual - risk_free_annual) / downside_dev


def calmar_ratio(monthly_df, xirr_annual):
    """Calmar ratio: XIRR / abs(max drawdown %)."""
    dd = max_drawdown(monthly_df)
    if dd is None or dd["max_drawdown_pct"] == 0:
        return float('inf') if xirr_annual > 0 else 0.0
    return xirr_annual / abs(dd["max_drawdown_pct"] / 100)


def compute_all_risk_metrics(monthly_df, xirr_annual=None,
                             risk_free_annual=0.06):
    """Compute all risk metrics for a product.

    Args:
        monthly_df: Product monthly DataFrame
        xirr_annual: XIRR as decimal (e.g., 0.12 for 12%). If None,
                     falls back to simple estimate from monthly returns.
        risk_free_annual: Risk-free rate as decimal.
    """
    if monthly_df is None or monthly_df.empty or len(monthly_df) < 3:
        return None

    # If no XIRR provided, estimate from mean monthly return
    if xirr_annual is None:
        rets = monthly_returns(monthly_df)
        if len(rets) > 0:
            xirr_annual = float((1 + np.mean(rets)) ** 12 - 1)
        else:
            xirr_annual = 0.0

    dd = max_drawdown(monthly_df)

    return {
        "annualized_return": xirr_annual,
        "annualized_volatility": annualized_volatility(monthly_df),
        "sharpe_ratio": sharpe_ratio(monthly_df, xirr_annual, risk_free_annual),
        "sortino_ratio": sortino_ratio(monthly_df, xirr_annual, risk_free_annual),
        "calmar_ratio": calmar_ratio(monthly_df, xirr_annual),
        "max_drawdown_pct": dd["max_drawdown_pct"] if dd else 0,
        "max_drawdown_recovery_months": dd["recovery_months"] if dd else None,
    }
