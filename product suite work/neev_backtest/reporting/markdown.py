"""
Markdown report generation: Auto-generate updated product report with
corrected, post-tax, risk-adjusted, honest numbers.
"""

from datetime import datetime
from ..utils import format_currency, format_pct
from .tables import _get_post_tax_gain


def generate_report(all_results, risk_metrics, stress_results,
                    rolling_summary, sensitivity_results):
    """Generate comprehensive markdown report.

    Returns string of markdown content.
    """
    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    sections = []
    sections.append(f"# Neev Product Suite — Backtest Report v2\n")
    sections.append(f"Generated: {now}\n")
    sections.append("**Methodology:** Calendar month stepping (7th of each month), "
                    "backward-only NAV lookup, Brent's method XIRR, "
                    "post-tax with shared LTCG exemption, "
                    "exit load on arb FIFO, bank floor deducted.\n")
    sections.append("**Products:** Reserve, Market Entry, Accelerate, Navigate "
                    "(Tactical dropped — structurally unviable on MF rails).\n")
    sections.append("---\n")

    # Section 1: Summary tables
    sections.append("## 1. Return Comparison\n")
    sections.append("### Pre-Tax and Post-Tax Returns\n")

    for window_label, window_results in all_results.items():
        for profile_name, results in window_results.items():
            sections.append(f"#### {window_label} | {profile_name}\n")
            sections.append("| Product | Invested | Final Value | Pre-Tax Gain | "
                            "Post-Tax Gain | XIRR | Extra vs SA |")
            sections.append("|---------|----------|-------------|--------------|"
                            "---------------|------|-------------|")

            # Get savings post-tax gain for "extra" calculation
            savings_result = results.get("savings")
            savings_post_tax = (_get_post_tax_gain("savings", savings_result)
                                if savings_result else 0) or 0

            for prod_key, display_name in [
                ("savings", "Savings A/c"),
                ("fd", "Fixed Deposit"),
                ("blind_sip", "Blind SIP"),
                ("reserve", "Neev Reserve"),
                ("market_entry", "Neev Market Entry"),
                ("grow", "Neev Accelerate"),
                ("grow_index", "Neev Navigate"),
            ]:
                result = results.get(prod_key)
                if result is None:
                    continue
                monthly = result.get("monthly")
                if monthly is None or monthly.empty:
                    continue
                last = monthly.iloc[-1]
                xirr_val = result["cashflows"].get_xirr_pct()
                post_tax_gain = _get_post_tax_gain(prod_key, result) or last['gain']
                extra = (post_tax_gain - savings_post_tax
                         if prod_key != "savings" else 0)
                sections.append(
                    f"| {display_name} | {format_currency(last['invested'])} | "
                    f"{format_currency(last['portfolio_value'])} | "
                    f"{format_currency(last['gain'])} | "
                    f"{format_currency(post_tax_gain)} | "
                    f"{format_pct(xirr_val)} | "
                    f"{format_currency(extra)} |"
                )

            sections.append("")

    # Section 2: Risk metrics
    sections.append("## 2. Risk-Adjusted Metrics\n")
    sections.append("| Product | Ann. Return | Volatility | Sharpe | "
                    "Sortino | Calmar | Max DD |")
    sections.append("|---------|-------------|------------|--------|"
                    "---------|--------|--------|")

    for prod_key, display_name in [
        ("savings", "Savings A/c"),
        ("fd", "Fixed Deposit"),
        ("reserve", "Reserve"),
        ("market_entry", "Market Entry"),
        ("grow", "Accelerate"),
        ("grow_index", "Navigate"),
        ("blind_sip", "Blind SIP"),
    ]:
        metrics = risk_metrics.get(prod_key)
        if metrics is None:
            continue

        def _fmt(val):
            if val is None:
                return "N/A"
            if val == float('inf'):
                return "inf"
            return f"{val:.2f}"

        sections.append(
            f"| {display_name} | "
            f"{format_pct(metrics['annualized_return'] * 100)} | "
            f"{format_pct(metrics['annualized_volatility'] * 100)} | "
            f"{_fmt(metrics['sharpe_ratio'])} | "
            f"{_fmt(metrics['sortino_ratio'])} | "
            f"{_fmt(metrics['calmar_ratio'])} | "
            f"{format_pct(metrics['max_drawdown_pct'])} |"
        )
    sections.append("")

    # Section 3: Stress tests
    sections.append("## 3. Stress Test Results\n")
    if stress_results:
        for event_name, products in _pivot_stress(stress_results).items():
            sections.append(f"### {event_name}\n")
            sections.append("| Product | Event Return | Max Drop | Recovery |")
            sections.append("|---------|--------------|----------|----------|")
            for prod_key, data in products.items():
                if not data.get("available"):
                    continue
                rec = (f"{data['recovery_months']} mo"
                       if data.get("recovery_months") is not None else "Not recovered")
                sections.append(
                    f"| {prod_key} | "
                    f"{format_pct(data['event_return_pct'])} | "
                    f"{format_pct(data['max_drop_pct'])} | "
                    f"{rec} |"
                )
            sections.append("")

    # Section 4: Rolling returns
    sections.append("## 4. Rolling 3-Year Returns\n")
    if rolling_summary:
        sections.append("| Product | Windows | Median XIRR | Min XIRR | "
                        "Max XIRR | % Positive Extra vs SA |")
        sections.append("|---------|---------|-------------|----------|"
                        "----------|------------------------|")
        for prod_key in ["reserve", "market_entry", "grow"]:
            summary = rolling_summary.get(prod_key)
            if summary is None:
                continue
            sections.append(
                f"| {prod_key.replace('_', ' ').title()} | "
                f"{summary['num_windows']} | "
                f"{format_pct(summary['median_xirr'])} | "
                f"{format_pct(summary['min_xirr'])} | "
                f"{format_pct(summary['max_xirr'])} | "
                f"{summary['pct_positive_extra_vs_savings']:.0f}% |"
            )
        sections.append("")

    # Section 5: Sensitivity
    sections.append("## 5. Sensitivity Analysis\n")
    if sensitivity_results:
        for product_name, df in sensitivity_results.items():
            if df is None or df.empty:
                continue
            sections.append(f"### {product_name.replace('_', ' ').title()}\n")
            sections.append(f"Tested {len(df)} parameter combinations. "
                            f"Best Sharpe ratio configuration:\n")
            best = df.loc[df["sharpe"].idxmax()] if "sharpe" in df.columns else None
            if best is not None:
                for col in df.columns:
                    if col not in ("final_value", "gain"):
                        sections.append(f"- **{col}**: {best[col]}")
            sections.append("")

    # Section 6: Why Tactical was dropped
    sections.append("## 6. Product Decision: Tactical Dropped\n")
    sections.append("Tactical dip-buying is structurally unviable on mutual fund rails:\n")
    sections.append("1. **MF settlement latency** — 1-3 day gap means you buy the bounce, "
                    "not the dip")
    sections.append("2. **Cash drag** — Money at 7% while equity averages 12-13% CAGR")
    sections.append("3. **BAFs solve it better** — ICICI Pru BAF does dynamic allocation "
                    "internally")
    sections.append("4. **No platform offers it** — Not Scripbox, Groww, Kuvera, or Smallcase")
    sections.append("5. **BSE StAR MF limitation** — No conditional STP\n")
    sections.append("The defensible version (PE-based pace modulation) is in Market Entry.\n")

    sections.append("---\n")
    sections.append("*Four products: Reserve (park), Market Entry (deploy), Accelerate (grow — active), Navigate (grow — index).*\n")

    return "\n".join(sections)


def _pivot_stress(stress_results):
    """Pivot stress results: event_name -> {product_name -> data}."""
    pivoted = {}
    for prod_name, events in stress_results.items():
        for event_name, data in events.items():
            if event_name not in pivoted:
                pivoted[event_name] = {}
            pivoted[event_name][prod_name] = data
    return pivoted
