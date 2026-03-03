"""
Table generation: Pre-tax and post-tax comparison tables.
"""

from ..config import USER_PROFILES, FEE_TIERS, TAX
from ..utils import format_currency, format_pct
from ..tax import calculate_portfolio_tax, post_tax_fd_gain, post_tax_savings_gain


def _get_post_tax_gain(product_name, result):
    """Calculate post-tax gain using lot trackers."""
    if result is None:
        return None

    lot_trackers = result.get("lot_trackers", {})
    final_date = result.get("final_date")

    if not lot_trackers or final_date is None:
        # Savings/FD — handle separately
        monthly = result.get("monthly")
        if monthly is None or monthly.empty:
            return None
        gain = monthly.iloc[-1]["gain"]
        if product_name == "savings":
            return post_tax_savings_gain(gain)
        elif product_name == "fd":
            return post_tax_fd_gain(gain)
        return gain

    # Build components for tax calculation
    components = []
    for tracker_name, tracker in lot_trackers.items():
        # Determine if equity-taxed
        is_equity = tracker_name in ("arb", "nifty", "next50", "midcap",
                                     "flexi", "intl", "smallcap")
        # We need current NAV for lot details — use the final portfolio value approach
        # Since lot_details_for_tax needs current_nav, we store it differently
        # For now, use the unrealized gain approach
        gain = tracker.unrealized_gain(None)  # We need NAV...

    # Simplified approach: use the portfolio-level gain and estimate tax
    monthly = result.get("monthly")
    if monthly is None or monthly.empty:
        return None

    total_gain = monthly.iloc[-1]["gain"]
    if total_gain <= 0:
        return total_gain

    # Approximate: for Reserve, mostly arb (equity LTCG treatment)
    # For Market Entry / Grow, mix of arb (short-hold) and equity (long-hold)
    if product_name == "reserve":
        # Most gains are from arb held >1 year → LTCG
        exempt = min(total_gain, TAX["equity_ltcg_exemption"])
        taxable = max(0, total_gain - exempt)
        tax = taxable * TAX["equity_ltcg"]
        return total_gain - tax

    elif product_name in ("market_entry", "grow", "grow_index", "blind_sip"):
        # Conservative estimate: assume 70% LTCG, 30% STCG
        # (early lots are STCG; applies to all equity deployment products)
        ltcg_portion = total_gain * 0.70
        stcg_portion = total_gain * 0.30

        exempt = min(ltcg_portion, TAX["equity_ltcg_exemption"])
        ltcg_tax = max(0, ltcg_portion - exempt) * TAX["equity_ltcg"]
        stcg_tax = stcg_portion * TAX["equity_stcg"]
        return total_gain - ltcg_tax - stcg_tax

    return total_gain


def generate_comparison_table(results, profile_name, window_label,
                              fee_tier="diy"):
    """Generate pre-tax and post-tax comparison tables.

    Args:
        results: dict of product_name -> backtest result dict
        profile_name: key into USER_PROFILES
        window_label: display label for the window
        fee_tier: key into FEE_TIERS

    Returns string with formatted table.
    """
    profile = USER_PROFILES[profile_name]
    annual_fee = FEE_TIERS.get(fee_tier, 0)

    lines = []
    lines.append(f"\n{'=' * 110}")
    lines.append(f"  {window_label} -- {profile['label']} monthly surplus")
    lines.append(f"  Initial idle cash: {format_currency(profile['initial_idle'])} "
                 f"(minus {format_currency(30000)} bank floor)")
    lines.append(f"  Advisory fee: {format_currency(annual_fee)}/year" if annual_fee > 0
                 else "  Advisory fee: None (DIY)")
    lines.append(f"{'=' * 110}")

    # Header
    header = (f"{'Product':<22} {'Invested':>12} {'Final Value':>12} "
              f"{'Pre-Tax Gain':>12} {'Post-Tax Gain':>13} "
              f"{'XIRR':>8} {'Extra vs SA':>12}")
    lines.append(header)
    lines.append("-" * 110)

    # Get savings gain for "extra" calculation
    savings_post_tax_gain = 0
    savings_result = results.get("savings")
    if savings_result:
        savings_post_tax_gain = _get_post_tax_gain("savings", savings_result) or 0

    product_order = [
        ("savings", "Savings A/c"),
        ("fd", "Fixed Deposit"),
        ("blind_sip", "Blind SIP (Nifty)"),
        ("reserve", "Neev Reserve"),
        ("market_entry", "Neev Market Entry"),
        ("grow", "Neev Accelerate"),
        ("grow_index", "Neev Navigate"),
    ]

    for prod_key, display_name in product_order:
        result = results.get(prod_key)
        if result is None:
            continue

        monthly = result.get("monthly")
        if monthly is None or monthly.empty:
            continue

        last = monthly.iloc[-1]
        invested = last["invested"]
        value = last["portfolio_value"]
        pre_tax_gain = last["gain"]
        post_tax_gain = _get_post_tax_gain(prod_key, result) or pre_tax_gain

        # Deduct advisory fee
        if annual_fee > 0 and prod_key not in ("savings", "fd", "blind_sip"):
            n_months = len(monthly)
            total_fee = annual_fee * (n_months / 12)
            post_tax_gain -= total_fee
            value -= total_fee

        # XIRR
        xirr_val = result["cashflows"].get_xirr_pct()

        # Extra vs savings
        extra = post_tax_gain - savings_post_tax_gain if prod_key != "savings" else 0

        line = (f"{display_name:<22} {format_currency(invested):>12} "
                f"{format_currency(value):>12} "
                f"{format_currency(pre_tax_gain):>12} "
                f"{format_currency(post_tax_gain):>13} "
                f"{format_pct(xirr_val):>8} "
                f"{format_currency(extra):>12}")
        lines.append(line)

    lines.append("-" * 110)
    return "\n".join(lines)


def generate_risk_table(risk_metrics_by_product):
    """Generate risk-adjusted metrics comparison table."""
    lines = []
    lines.append(f"\n{'=' * 100}")
    lines.append("  RISK-ADJUSTED METRICS")
    lines.append(f"{'=' * 100}")

    header = (f"{'Product':<22} {'Ann. Return':>11} {'Volatility':>11} "
              f"{'Sharpe':>8} {'Sortino':>8} {'Calmar':>8} {'Max DD':>8}")
    lines.append(header)
    lines.append("-" * 100)

    name_map = {
        "reserve": "Neev Reserve",
        "market_entry": "Neev Market Entry",
        "grow": "Neev Accelerate",
        "grow_index": "Neev Navigate",
        "savings": "Savings A/c",
        "fd": "Fixed Deposit",
        "blind_sip": "Blind SIP (Nifty)",
    }

    # Products where Sharpe/Sortino are meaningless (return < risk-free rate)
    benchmark_products = {"savings", "fd"}

    for prod_key in ["savings", "fd", "blind_sip",
                      "reserve", "market_entry", "grow", "grow_index"]:
        metrics = risk_metrics_by_product.get(prod_key)
        if metrics is None:
            continue

        display_name = name_map.get(prod_key, prod_key)

        def _fmt_ratio(val, suppress=False):
            if suppress:
                return "N/A*"
            if val is None:
                return "N/A"
            if val == float('inf'):
                return "inf"
            return f"{val:.2f}"

        is_benchmark = prod_key in benchmark_products
        line = (f"{display_name:<22} "
                f"{format_pct(metrics['annualized_return'] * 100):>11} "
                f"{format_pct(metrics['annualized_volatility'] * 100):>11} "
                f"{_fmt_ratio(metrics['sharpe_ratio'], suppress=is_benchmark):>8} "
                f"{_fmt_ratio(metrics['sortino_ratio'], suppress=is_benchmark):>8} "
                f"{_fmt_ratio(metrics['calmar_ratio'], suppress=is_benchmark):>8} "
                f"{format_pct(metrics['max_drawdown_pct']):>8}")
        lines.append(line)

    lines.append("-" * 100)
    lines.append("  * Sharpe/Sortino/Calmar not meaningful — product returns below risk-free rate (6%)")
    return "\n".join(lines)


def generate_stress_table(stress_results):
    """Generate stress test results table."""
    from ..config import STRESS_EVENTS

    lines = []
    lines.append(f"\n{'=' * 110}")
    lines.append("  STRESS TEST RESULTS")
    lines.append(f"{'=' * 110}")

    name_map = {
        "reserve": "Reserve",
        "market_entry": "Market Entry",
        "grow": "Accelerate",
        "blind_sip": "Blind SIP",
    }

    for event_name in STRESS_EVENTS:
        lines.append(f"\n  >> {event_name} ({STRESS_EVENTS[event_name]['description']})")
        header = (f"  {'Product':<18} {'Event Return':>12} {'Max Drop':>10} "
                  f"{'Recovery (mo)':>14} {'Equity % Start':>14} {'Equity % End':>14}")
        lines.append(header)
        lines.append("  " + "-" * 90)

        for prod_key in ["reserve", "market_entry", "grow", "blind_sip"]:
            prod_stress = stress_results.get(prod_key, {})
            event_data = prod_stress.get(event_name)
            if event_data is None or not event_data.get("available", False):
                continue

            display = name_map.get(prod_key, prod_key)
            rec = (str(event_data["recovery_months"]) + " mo"
                   if event_data["recovery_months"] is not None else "N/R")
            eq_start = (format_pct(event_data["equity_pct_start"])
                        if event_data["equity_pct_start"] is not None else "N/A")
            eq_end = (format_pct(event_data["equity_pct_end"])
                      if event_data["equity_pct_end"] is not None else "N/A")

            line = (f"  {display:<18} "
                    f"{format_pct(event_data['event_return_pct']):>12} "
                    f"{format_pct(event_data['max_drop_pct']):>10} "
                    f"{rec:>14} "
                    f"{eq_start:>14} {eq_end:>14}")
            lines.append(line)

    lines.append("")
    return "\n".join(lines)
