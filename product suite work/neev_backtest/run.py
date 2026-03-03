"""
Main entry point: Run the complete Neev backtest suite.

Products: Reserve, Market Entry, Accelerate, Navigate (Tactical dropped).
Fixes applied: Calendar stepping, backward NAV, proper XIRR, post-tax, exit loads.
"""

import sys
import os
import time
from pathlib import Path
from datetime import datetime

# Add parent to path for module imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from neev_backtest.config import (
    USER_PROFILES, BACKTEST_WINDOWS, FEE_TIERS,
)
from neev_backtest.data import load_all_nav_data, load_nifty_pe
from neev_backtest.utils import format_currency, format_pct

from neev_backtest.products.reserve import backtest_reserve
from neev_backtest.products.market_entry import backtest_market_entry
from neev_backtest.products.grow import backtest_grow
from neev_backtest.benchmarks import (
    calculate_savings_account, calculate_fd, calculate_blind_sip,
)

from neev_backtest.analytics.risk_metrics import compute_all_risk_metrics
from neev_backtest.analytics.drawdown import max_drawdown
from neev_backtest.analytics.stress_test import stress_test_all_products
from neev_backtest.analytics.rolling import rolling_backtests, rolling_summary
from neev_backtest.analytics.sensitivity import (
    sensitivity_reserve, sensitivity_market_entry, sensitivity_grow,
    find_optimal,
)

from neev_backtest.reporting.tables import (
    generate_comparison_table, generate_risk_table, generate_stress_table,
)
from neev_backtest.reporting.markdown import generate_report


def run_backtest(use_cache=True, run_rolling=True, run_sensitivity=True):
    """Run the complete backtest suite.

    Args:
        use_cache: Use parquet-cached NAV data if fresh
        run_rolling: Run rolling 3-year backtests (slower)
        run_sensitivity: Run sensitivity analysis (slower)
    """
    start_time = time.time()

    # ── Load data ──
    nav_data = load_all_nav_data(use_cache=use_cache)
    pe_df = load_nifty_pe()

    output_lines = []
    output_lines.append("\n" + "=" * 110)
    output_lines.append("  NEEV PRODUCT SUITE v2 -- BACKTEST RESULTS")
    output_lines.append("  Real NAV data | mfapi.in | Calendar month stepping | "
                        "Backward NAV | XIRR (Brent) | Post-tax")
    output_lines.append("  Products: Reserve, Market Entry, Accelerate, Navigate "
                        "(Tactical dropped)")
    output_lines.append("=" * 110)

    all_results = {}        # window -> profile -> product -> result
    all_risk_metrics = {}   # product -> metrics (for default window/profile)
    all_stress = {}

    # ── Main backtests ──
    for window_label, window in BACKTEST_WINDOWS.items():
        start = window["start"]
        end = window["end"]

        output_lines.append(f"\n\n{'=' * 110}")
        output_lines.append(f"  WINDOW: {window_label}")
        output_lines.append(f"{'=' * 110}")

        all_results[window_label] = {}

        for profile_name, profile in USER_PROFILES.items():
            print(f"\n>> Running: {window_label} x {profile['label']}...")

            results = {}

            # Benchmarks
            results["savings"] = calculate_savings_account(profile, start, end)
            results["fd"] = calculate_fd(profile, start, end)
            results["blind_sip"] = calculate_blind_sip(nav_data, profile, start, end)

            # Neev products (no more Tactical)
            results["reserve"] = backtest_reserve(nav_data, profile, start, end)
            results["market_entry"] = backtest_market_entry(
                nav_data, profile, start, end, pe_df=pe_df)
            results["grow"] = backtest_grow(
                nav_data, profile, start, end, pe_df=pe_df,
                tilt_variant="moderate")

            # Navigate: Index-only variant (same allocation system, pure index funds)
            results["grow_index"] = backtest_grow(
                nav_data, profile, start, end, pe_df=pe_df,
                tilt_variant="moderate", use_index_only=True)

            # Generate comparison table
            table = generate_comparison_table(
                results, profile_name, window_label)
            output_lines.append(table)
            print(table)

            all_results[window_label][profile_name] = results

    # ── Risk metrics (using 5-year moderate as primary) ──
    primary_key = "5-Year (Mar 2021 - Mar 2026)"
    primary_profile = "moderate"
    primary_results = all_results.get(primary_key, {}).get(primary_profile, {})

    if primary_results:
        print("\n>> Computing risk-adjusted metrics...")
        for prod_key in ["savings", "fd", "blind_sip",
                          "reserve", "market_entry", "grow", "grow_index"]:
            result = primary_results.get(prod_key)
            if result and "monthly" in result:
                # Use XIRR as the annualized return for risk metrics
                xirr_annual = result["cashflows"].get_xirr() if "cashflows" in result else None
                metrics = compute_all_risk_metrics(
                    result["monthly"], xirr_annual=xirr_annual)
                if metrics:
                    all_risk_metrics[prod_key] = metrics

        risk_table = generate_risk_table(all_risk_metrics)
        output_lines.append(risk_table)
        print(risk_table)

        # ── Drawdown analysis ──
        output_lines.append(f"\n{'=' * 100}")
        output_lines.append("  DRAWDOWN ANALYSIS")
        output_lines.append(f"{'=' * 100}")

        for prod_key in ["reserve", "market_entry", "grow", "blind_sip"]:
            result = primary_results.get(prod_key)
            if result and "monthly" in result:
                dd = max_drawdown(result["monthly"])
                if dd:
                    name = prod_key.replace("_", " ").title()
                    rec = (f"{dd['recovery_months']} months"
                           if dd['recovery_months'] is not None else "Not recovered")
                    line = (f"  {name:<20} Max DD: {format_pct(dd['max_drawdown_pct'])} | "
                            f"Peak-to-trough: {dd['peak_to_trough_months']} mo | "
                            f"Recovery: {rec}")
                    output_lines.append(line)
                    print(line)

        # ── Stress testing ──
        print("\n>> Running stress tests...")
        all_stress = stress_test_all_products(primary_results)
        stress_table = generate_stress_table(all_stress)
        output_lines.append(stress_table)
        print(stress_table)

    # ── Rolling returns ──
    roll_summary = {}
    if run_rolling:
        print("\n>> Running rolling 3-year backtests (this takes a while)...")
        roll_results = rolling_backtests(
            nav_data, USER_PROFILES["moderate"], pe_df=pe_df,
            window_months=36, step_months=3,  # Every 3 months to keep it fast
        )
        roll_summary = rolling_summary(roll_results)

        output_lines.append(f"\n{'=' * 100}")
        output_lines.append("  ROLLING 3-YEAR RETURNS (every 3 months)")
        output_lines.append(f"{'=' * 100}")

        for prod_key in ["reserve", "market_entry", "grow"]:
            s = roll_summary.get(prod_key)
            if s:
                name = prod_key.replace("_", " ").title()
                line = (f"  {name:<20} {s['num_windows']} windows | "
                        f"Median XIRR: {format_pct(s['median_xirr'])} | "
                        f"Range: [{format_pct(s['min_xirr'])}, {format_pct(s['max_xirr'])}] | "
                        f"% Positive extra vs SA: {s['pct_positive_extra_vs_savings']:.0f}%")
                output_lines.append(line)
                print(line)

    # ── Sensitivity analysis ──
    sens_results = {}
    if run_sensitivity and primary_results:
        print("\n>> Running sensitivity analysis...")
        start = BACKTEST_WINDOWS[primary_key]["start"]
        end = BACKTEST_WINDOWS[primary_key]["end"]
        profile = USER_PROFILES[primary_profile]

        sens_reserve = sensitivity_reserve(nav_data, profile, start, end)
        sens_me = sensitivity_market_entry(
            nav_data, profile, start, end, pe_df=pe_df)
        sens_grow = sensitivity_grow(
            nav_data, profile, start, end, pe_df=pe_df)

        sens_results = {
            "reserve": sens_reserve,
            "market_entry": sens_me,
            "grow": sens_grow,
        }

        output_lines.append(f"\n{'=' * 100}")
        output_lines.append("  SENSITIVITY ANALYSIS")
        output_lines.append(f"{'=' * 100}")

        for name, df in sens_results.items():
            if df is not None and not df.empty:
                optimal = find_optimal(df)
                if optimal:
                    display = name.replace("_", " ").title()
                    output_lines.append(f"\n  {display} — Best Sharpe configuration:")
                    for k, v in optimal.items():
                        if k not in ("final_value",):
                            output_lines.append(f"    {k}: {v}")
                    print(f"  {display} optimal Sharpe: {optimal.get('sharpe', 'N/A')}")

    # ── Detailed product journeys ──
    if primary_results:
        output_lines.append(f"\n\n{'=' * 110}")
        output_lines.append("  DETAILED PRODUCT JOURNEYS (1L/month, 5-year)")
        output_lines.append(f"{'=' * 110}")

        for prod_key in ["reserve", "market_entry", "grow"]:
            result = primary_results.get(prod_key)
            if result is None:
                continue
            df = result["monthly"]
            if df.empty:
                continue

            display = prod_key.replace("_", " ").title()
            output_lines.append(f"\n{'-' * 60}")
            output_lines.append(f"  {display} -- 1L/month, 5-year")
            output_lines.append(f"{'-' * 60}")

            milestones = [0, 5, 11, 17, 23, 35, 47, 59]
            for m in milestones:
                if m < len(df):
                    row = df.iloc[m]
                    extra_info = ""
                    if "equity_pct" in row and row["equity_pct"] > 0:
                        extra_info = f"  Equity: {row['equity_pct']:.0f}%"
                    output_lines.append(
                        f"  Month {row['month']:>2}: Invested {format_currency(row['invested']):>10} -> "
                        f"Value {format_currency(row['portfolio_value']):>10} "
                        f"(+{format_currency(row['gain']):>8}){extra_info}"
                    )

    # ── Honest "extra earned" metric ──
    if primary_results:
        output_lines.append(f"\n\n{'=' * 110}")
        output_lines.append("  HONEST 'EXTRA EARNED' METRIC (Post-tax, net-of-fee vs Savings)")
        output_lines.append(f"{'=' * 110}")

        savings_result = primary_results.get("savings")
        if savings_result:
            savings_gain = savings_result["monthly"].iloc[-1]["gain"]
            for fee_name, fee_amount in FEE_TIERS.items():
                output_lines.append(f"\n  Fee tier: {fee_name} ({format_currency(fee_amount)}/yr)")
                for prod_key in ["reserve", "market_entry", "grow"]:
                    result = primary_results.get(prod_key)
                    if result is None:
                        continue
                    monthly = result["monthly"]
                    gain = monthly.iloc[-1]["gain"]
                    n_months = len(monthly)
                    total_fee = fee_amount * (n_months / 12)
                    extra = gain - savings_gain - total_fee
                    display = prod_key.replace("_", " ").title()
                    output_lines.append(
                        f"    {display:<20} Extra earned: {format_currency(extra)}"
                        f"  (gain {format_currency(gain)} - savings {format_currency(savings_gain)}"
                        f" - fees {format_currency(total_fee)})"
                    )

    # ── Save results ──
    elapsed = time.time() - start_time
    output_lines.append(f"\n\nCompleted in {elapsed:.1f}s")

    output_text = "\n".join(output_lines)
    output_path = Path(__file__).parent.parent / "backtest_results_v2.txt"
    with open(output_path, "w") as f:
        f.write(output_text)
    print(f"\n\nResults saved to {output_path}")

    # Generate markdown report
    report = generate_report(
        all_results, all_risk_metrics, all_stress,
        roll_summary, sens_results,
    )
    report_path = Path(__file__).parent.parent / "neev_product_suite_report_v2.md"
    with open(report_path, "w") as f:
        f.write(report)
    print(f"Report saved to {report_path}")

    return {
        "results": all_results,
        "risk_metrics": all_risk_metrics,
        "stress": all_stress,
        "rolling": roll_summary,
        "sensitivity": sens_results,
    }


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Neev Product Suite Backtest v2")
    parser.add_argument("--no-cache", action="store_true",
                        help="Force re-fetch all NAV data")
    parser.add_argument("--no-rolling", action="store_true",
                        help="Skip rolling returns analysis")
    parser.add_argument("--no-sensitivity", action="store_true",
                        help="Skip sensitivity analysis")
    parser.add_argument("--quick", action="store_true",
                        help="Quick run: skip rolling and sensitivity")
    args = parser.parse_args()

    run_backtest(
        use_cache=not args.no_cache,
        run_rolling=not (args.no_rolling or args.quick),
        run_sensitivity=not (args.no_sensitivity or args.quick),
    )
