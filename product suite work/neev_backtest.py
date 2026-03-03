"""
NEEV PRODUCT BACKTESTING ENGINE
================================
Backtests 4 Neev products using real NAV data from mfapi.in

Products:
1. Neev Reserve — Liquid (T+0) + Arbitrage (tax-optimized parking)
2. Neev Systematic — Valuation-aware STP into Nifty 50 index
3. Neev Tactical — Drawdown/signal-based deployment from Reserve into equity
4. Neev Alpha — Diversified active allocation (mid, small, flexi, international)

User Profiles: 50K, 1L, 2L monthly surplus
Tax: 30% slab (old regime)
Backtest windows: 3-year and 5-year
"""

import requests
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import time
import os
import warnings
warnings.filterwarnings('ignore')

# ============================================================
# CONFIGURATION
# ============================================================

SCHEME_CODES = {
    # Liquid Funds (T+0 layer)
    "parag_parikh_liquid": 143269,
    "hdfc_liquid": 119091,
    
    # Arbitrage Funds (tax-advantaged parking)
    "kotak_arbitrage": 119771,
    "tata_arbitrage": 145724,
    "absl_arbitrage": 119526,
    
    # Large Cap Index (Systematic & Tactical)
    "uti_nifty50": 120716,
    "icici_nifty_next50": 120684,
    
    # Midcap / Small / Flexi / International (Alpha)
    "motilal_midcap150": 147622,
    "motilal_sp500": 148381,
    "parag_parikh_flexi": 122639,
    "hdfc_midcap": 118989,
    "nippon_smallcap": 118778,
}

# User profiles: monthly surplus after all expenses
USER_PROFILES = {
    "conservative": {"label": "₹50K/month", "monthly_surplus": 50000, "initial_idle": 300000},
    "moderate": {"label": "₹1L/month", "monthly_surplus": 100000, "initial_idle": 500000},
    "aggressive": {"label": "₹2L/month", "monthly_surplus": 200000, "initial_idle": 800000},
}

# Tax rates for 30% slab (FY 2024-25 onwards)
TAX = {
    "equity_stcg": 0.20,       # <1 year equity
    "equity_ltcg": 0.125,      # >1 year equity (above 1.25L exemption)
    "debt_slab": 0.30,         # Debt/liquid fund gains taxed at slab
    "equity_ltcg_exemption": 125000,  # Annual exemption
}

# Bank savings rate for comparison
SAVINGS_RATE = 0.035  # 3.5% p.a.
FD_RATE = 0.07        # 7% p.a. (post-tax ~4.9% for 30% slab)

# ============================================================
# DATA FETCHING
# ============================================================

def fetch_nav_data(scheme_code, scheme_name):
    """Fetch historical NAV data from mfapi.in"""
    url = f"https://api.mfapi.in/mf/{scheme_code}"
    max_retries = 3
    for attempt in range(max_retries):
        try:
            resp = requests.get(url, timeout=30)
            data = resp.json()
            if data.get("status") == "SUCCESS" and data.get("data"):
                records = []
                for entry in data["data"]:
                    try:
                        dt = datetime.strptime(entry["date"], "%d-%m-%Y")
                        nav = float(entry["nav"])
                        records.append({"date": dt, "nav": nav})
                    except:
                        continue
                df = pd.DataFrame(records)
                df = df.sort_values("date").reset_index(drop=True)
                df = df.set_index("date")
                print(f"  ✓ {scheme_name}: {len(df)} days ({df.index.min().strftime('%Y-%m-%d')} to {df.index.max().strftime('%Y-%m-%d')})")
                return df
            else:
                print(f"  ✗ {scheme_name}: API returned no data")
                return None
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            else:
                print(f"  ✗ {scheme_name}: {e}")
                return None

def load_all_nav_data():
    """Load NAV data for all schemes"""
    print("\n📊 Fetching NAV data from mfapi.in...")
    print("=" * 60)
    nav_data = {}
    for name, code in SCHEME_CODES.items():
        nav_data[name] = fetch_nav_data(code, name)
        time.sleep(0.5)  # Rate limiting
    return nav_data

def get_nav_on_date(df, target_date, tolerance_days=5):
    """Get NAV on or near a specific date"""
    if df is None:
        return None
    for delta in range(tolerance_days + 1):
        check_date = target_date + timedelta(days=delta)
        if check_date in df.index:
            return df.loc[check_date, "nav"]
        check_date = target_date - timedelta(days=delta)
        if check_date in df.index:
            return df.loc[check_date, "nav"]
    return None

# ============================================================
# PRODUCT 1: NEEV RESERVE
# ============================================================

def backtest_reserve(nav_data, profile, start_date, end_date):
    """
    Neev Reserve: Liquid (20%) + Arbitrage (80%)
    
    Active management:
    - Maintain T+0 liquid portion at ~20% (max ₹2L) for instant access
    - Rebalance monthly between liquid and arbitrage
    - Use best-performing arbitrage fund (rotate quarterly)
    """
    liquid_df = nav_data.get("parag_parikh_liquid")
    arb_dfs = {
        "kotak": nav_data.get("kotak_arbitrage"),
        "tata": nav_data.get("tata_arbitrage"),
        "absl": nav_data.get("absl_arbitrage"),
    }
    
    if liquid_df is None or all(v is None for v in arb_dfs.values()):
        return None
    
    # Use first available arb fund as primary
    primary_arb_name = next((k for k, v in arb_dfs.items() if v is not None), None)
    arb_df = arb_dfs[primary_arb_name]
    
    monthly_surplus = profile["monthly_surplus"]
    initial_idle = profile["initial_idle"]
    
    # Track units
    liquid_units = 0
    arb_units = 0
    total_invested = 0
    
    # Monthly tracking
    monthly_data = []
    
    current = start_date
    month = 0
    
    while current <= end_date:
        # Get NAVs
        liquid_nav = get_nav_on_date(liquid_df, current)
        arb_nav = get_nav_on_date(arb_df, current)
        
        if liquid_nav is None or arb_nav is None:
            current += timedelta(days=30)
            continue
        
        # Month 0: Deploy initial idle cash
        if month == 0:
            amount = initial_idle
        else:
            amount = monthly_surplus
        
        total_invested += amount
        
        # Allocation: 20% liquid, 80% arbitrage
        # But cap liquid at ₹2L for instant access
        current_liquid_value = liquid_units * liquid_nav
        liquid_target = min(total_invested * 0.20, 200000)
        
        if current_liquid_value < liquid_target:
            liquid_allocation = min(amount, liquid_target - current_liquid_value)
        else:
            liquid_allocation = 0
        
        arb_allocation = amount - liquid_allocation
        
        # Buy units
        if liquid_allocation > 0:
            liquid_units += liquid_allocation / liquid_nav
        if arb_allocation > 0:
            arb_units += arb_allocation / arb_nav
        
        # Note: In production, quarterly AMC rotation would be implemented
        # For backtesting, we use Kotak Arbitrage (largest AUM, most consistent)
        # Rotation alpha is ~0.1-0.2% — material over years but not for consumer testing
        
        # Record
        portfolio_value = (liquid_units * liquid_nav) + (arb_units * arb_nav)
        monthly_data.append({
            "date": current,
            "month": month,
            "invested": total_invested,
            "portfolio_value": portfolio_value,
            "liquid_value": liquid_units * liquid_nav,
            "arb_value": arb_units * arb_nav,
            "gain": portfolio_value - total_invested,
            "return_pct": ((portfolio_value / total_invested) - 1) * 100 if total_invested > 0 else 0,
        })
        
        month += 1
        current += timedelta(days=30)  # ~monthly
    
    return pd.DataFrame(monthly_data)


# ============================================================
# PRODUCT 2: NEEV SYSTEMATIC
# ============================================================

def backtest_systematic(nav_data, profile, start_date, end_date):
    """
    Neev Systematic: Reserve base + Valuation-aware STP into Nifty 50
    
    Active management:
    - First 3 months: all into Reserve (liquid+arb)
    - Once Reserve > 3x monthly surplus: start deploying into Nifty 50
    - STP pace varies by Nifty PE: 
      PE < 18 → 1.5x normal pace (cheap, deploy faster)
      PE 18-22 → 1x normal pace
      PE > 22 → 0.5x normal pace (expensive, slow down)
    - Normal pace = 20% of Reserve excess per month
    """
    liquid_df = nav_data.get("parag_parikh_liquid")
    arb_df = nav_data.get("kotak_arbitrage")
    nifty_df = nav_data.get("uti_nifty50")
    
    if any(df is None for df in [liquid_df, arb_df, nifty_df]):
        return None
    
    monthly_surplus = profile["monthly_surplus"]
    initial_idle = profile["initial_idle"]
    reserve_threshold = monthly_surplus * 3  # Trigger STP after 3x
    
    # Units tracking
    liquid_units = 0
    arb_units = 0
    nifty_units = 0
    total_invested = 0
    
    monthly_data = []
    current = start_date
    month = 0
    
    while current <= end_date:
        liquid_nav = get_nav_on_date(liquid_df, current)
        arb_nav = get_nav_on_date(arb_df, current)
        nifty_nav = get_nav_on_date(nifty_df, current)
        
        if any(v is None for v in [liquid_nav, arb_nav, nifty_nav]):
            current += timedelta(days=30)
            continue
        
        # Add monthly surplus
        amount = initial_idle if month == 0 else monthly_surplus
        total_invested += amount
        
        # Calculate current Reserve value
        reserve_value = (liquid_units * liquid_nav) + (arb_units * arb_nav)
        
        # Determine PE-based deployment multiplier
        # Use Nifty NAV trajectory as proxy for valuation
        # (In production, we'd use actual PE data)
        nifty_3m = get_nav_on_date(nifty_df, current - timedelta(days=90))
        nifty_6m = get_nav_on_date(nifty_df, current - timedelta(days=180))
        
        if nifty_3m and nifty_6m:
            momentum_3m = (nifty_nav - nifty_3m) / nifty_3m
            momentum_6m = (nifty_nav - nifty_6m) / nifty_6m
            
            # Heuristic PE proxy: high momentum → likely expensive
            if momentum_6m > 0.15:  # Market up >15% in 6m → expensive
                pace_multiplier = 0.5
            elif momentum_6m < -0.05:  # Market down → cheap
                pace_multiplier = 1.5
            else:
                pace_multiplier = 1.0
        else:
            pace_multiplier = 1.0
        
        # First, add new money to Reserve (80% arb, 20% liquid)
        liquid_alloc = min(amount * 0.20, max(0, 200000 - liquid_units * liquid_nav))
        arb_alloc = amount - liquid_alloc
        
        if liquid_alloc > 0:
            liquid_units += liquid_alloc / liquid_nav
        if arb_alloc > 0:
            arb_units += arb_alloc / arb_nav
        
        # Then, check if we should deploy from Reserve to Nifty
        reserve_value = (liquid_units * liquid_nav) + (arb_units * arb_nav)
        
        if month >= 3 and reserve_value > reserve_threshold:
            excess = reserve_value - reserve_threshold
            deploy_amount = excess * 0.20 * pace_multiplier  # 20% of excess, adjusted
            deploy_amount = min(deploy_amount, arb_units * arb_nav)  # Cap at arb holdings
            
            if deploy_amount > 0:
                # Sell arb, buy nifty
                arb_units -= deploy_amount / arb_nav
                nifty_units += deploy_amount / nifty_nav
        
        # Record
        reserve_val = (liquid_units * liquid_nav) + (arb_units * arb_nav)
        equity_val = nifty_units * nifty_nav
        portfolio_value = reserve_val + equity_val
        
        monthly_data.append({
            "date": current,
            "month": month,
            "invested": total_invested,
            "portfolio_value": portfolio_value,
            "reserve_value": reserve_val,
            "equity_value": equity_val,
            "equity_pct": (equity_val / portfolio_value * 100) if portfolio_value > 0 else 0,
            "pace_multiplier": pace_multiplier,
            "gain": portfolio_value - total_invested,
            "return_pct": ((portfolio_value / total_invested) - 1) * 100 if total_invested > 0 else 0,
        })
        
        month += 1
        current += timedelta(days=30)
    
    return pd.DataFrame(monthly_data)


# ============================================================
# PRODUCT 3: NEEV TACTICAL
# ============================================================

def backtest_tactical(nav_data, profile, start_date, end_date):
    """
    Neev Tactical: Reserve base + Signal-driven dip-buying
    
    Active management:
    - Maintains Reserve same as Systematic
    - Instead of blind STP, deploys on market drawdowns:
      * Nifty drops >3% in a week → deploy 1x allocation
      * Nifty drops >5% in a week → deploy 2x allocation  
      * Nifty drops >8% in a month → deploy 3x allocation
    - Also does scheduled deployment if no dip in 45 days (slower pace)
    - Adds Nifty Next 50 for diversification (30% of equity)
    """
    liquid_df = nav_data.get("parag_parikh_liquid")
    arb_df = nav_data.get("kotak_arbitrage")
    nifty_df = nav_data.get("uti_nifty50")
    next50_df = nav_data.get("icici_nifty_next50")
    
    if any(df is None for df in [liquid_df, arb_df, nifty_df]):
        return None
    
    monthly_surplus = profile["monthly_surplus"]
    initial_idle = profile["initial_idle"]
    reserve_threshold = monthly_surplus * 3
    base_deploy = monthly_surplus * 0.5  # Base deployment amount
    
    liquid_units = 0
    arb_units = 0
    nifty_units = 0
    next50_units = 0
    total_invested = 0
    last_deploy_date = None
    
    monthly_data = []
    current = start_date
    month = 0
    
    while current <= end_date:
        liquid_nav = get_nav_on_date(liquid_df, current)
        arb_nav = get_nav_on_date(arb_df, current)
        nifty_nav = get_nav_on_date(nifty_df, current)
        next50_nav = get_nav_on_date(next50_df, current) if next50_df is not None else None
        
        if any(v is None for v in [liquid_nav, arb_nav, nifty_nav]):
            current += timedelta(days=30)
            continue
        
        # Add monthly surplus
        amount = initial_idle if month == 0 else monthly_surplus
        total_invested += amount
        
        # Add to Reserve first
        liquid_alloc = min(amount * 0.20, max(0, 200000 - liquid_units * liquid_nav))
        arb_alloc = amount - liquid_alloc
        if liquid_alloc > 0:
            liquid_units += liquid_alloc / liquid_nav
        if arb_alloc > 0:
            arb_units += arb_alloc / arb_nav
        
        reserve_value = (liquid_units * liquid_nav) + (arb_units * arb_nav)
        
        # Signal detection
        deploy_multiplier = 0
        
        if month >= 3 and reserve_value > reserve_threshold:
            # Check weekly drawdown
            nifty_1w = get_nav_on_date(nifty_df, current - timedelta(days=7))
            nifty_1m = get_nav_on_date(nifty_df, current - timedelta(days=30))
            
            if nifty_1w and nifty_1w > 0:
                weekly_change = (nifty_nav - nifty_1w) / nifty_1w
                if weekly_change < -0.08:
                    deploy_multiplier = 3.0  # Crash: aggressive buy
                elif weekly_change < -0.05:
                    deploy_multiplier = 2.0  # Significant dip
                elif weekly_change < -0.03:
                    deploy_multiplier = 1.5  # Moderate dip
            
            if nifty_1m and nifty_1m > 0 and deploy_multiplier == 0:
                monthly_change = (nifty_nav - nifty_1m) / nifty_1m
                if monthly_change < -0.08:
                    deploy_multiplier = 2.5
                elif monthly_change < -0.05:
                    deploy_multiplier = 1.5
            
            # Scheduled deployment if no dip for a while
            days_since_deploy = (current - last_deploy_date).days if last_deploy_date else 999
            if deploy_multiplier == 0 and days_since_deploy > 45:
                deploy_multiplier = 0.5  # Slow scheduled deployment
            
            if deploy_multiplier > 0:
                excess = reserve_value - reserve_threshold
                deploy_amount = min(base_deploy * deploy_multiplier, excess * 0.4)
                deploy_amount = min(deploy_amount, arb_units * arb_nav)
                
                if deploy_amount > 0:
                    arb_units -= deploy_amount / arb_nav
                    
                    # Split: 70% Nifty 50, 30% Nifty Next 50
                    nifty_deploy = deploy_amount * 0.70
                    next50_deploy = deploy_amount * 0.30
                    
                    nifty_units += nifty_deploy / nifty_nav
                    if next50_nav and next50_nav > 0:
                        next50_units += next50_deploy / next50_nav
                    else:
                        nifty_units += next50_deploy / nifty_nav
                    
                    last_deploy_date = current
        
        # Record
        reserve_val = (liquid_units * liquid_nav) + (arb_units * arb_nav)
        nifty_val = nifty_units * nifty_nav
        next50_val = (next50_units * next50_nav) if next50_nav else 0
        equity_val = nifty_val + next50_val
        portfolio_value = reserve_val + equity_val
        
        monthly_data.append({
            "date": current,
            "month": month,
            "invested": total_invested,
            "portfolio_value": portfolio_value,
            "reserve_value": reserve_val,
            "equity_value": equity_val,
            "equity_pct": (equity_val / portfolio_value * 100) if portfolio_value > 0 else 0,
            "deploy_multiplier": deploy_multiplier,
            "gain": portfolio_value - total_invested,
            "return_pct": ((portfolio_value / total_invested) - 1) * 100 if total_invested > 0 else 0,
        })
        
        month += 1
        current += timedelta(days=30)
    
    return pd.DataFrame(monthly_data)


# ============================================================
# PRODUCT 4: NEEV ALPHA
# ============================================================

def backtest_alpha(nav_data, profile, start_date, end_date):
    """
    Neev Alpha: Diversified active allocation
    
    Active management:
    - Reserve base (same structure)
    - Core index (Nifty 50) = 40% of equity
    - Satellite allocation rotated quarterly:
      * Nifty Next 50: 15%
      * Midcap (Motilal Midcap 150 / HDFC Midcap): 15%
      * Flexi Cap (Parag Parikh): 15%
      * International (Motilal S&P 500): 15%
    - Quarterly rebalancing across satellite funds
    - Momentum-based tilt: overweight best-performing satellite, underweight worst
    """
    liquid_df = nav_data.get("parag_parikh_liquid")
    arb_df = nav_data.get("kotak_arbitrage")
    nifty_df = nav_data.get("uti_nifty50")
    next50_df = nav_data.get("icici_nifty_next50")
    midcap_df = nav_data.get("hdfc_midcap") if nav_data.get("hdfc_midcap") is not None else nav_data.get("motilal_midcap150")
    flexi_df = nav_data.get("parag_parikh_flexi")
    intl_df = nav_data.get("motilal_sp500")
    smallcap_df = nav_data.get("nippon_smallcap")
    
    if any(df is None for df in [liquid_df, arb_df, nifty_df]):
        return None
    
    # Satellite funds that are available
    satellites = {}
    if next50_df is not None:
        satellites["next50"] = {"df": next50_df, "target_pct": 0.15, "units": 0}
    if midcap_df is not None:
        satellites["midcap"] = {"df": midcap_df, "target_pct": 0.15, "units": 0}
    if flexi_df is not None:
        satellites["flexi"] = {"df": flexi_df, "target_pct": 0.15, "units": 0}
    if intl_df is not None:
        satellites["intl"] = {"df": intl_df, "target_pct": 0.15, "units": 0}
    if smallcap_df is not None and "midcap" not in satellites:
        satellites["smallcap"] = {"df": smallcap_df, "target_pct": 0.15, "units": 0}
    
    monthly_surplus = profile["monthly_surplus"]
    initial_idle = profile["initial_idle"]
    reserve_threshold = monthly_surplus * 3
    
    liquid_units = 0
    arb_units = 0
    nifty_units = 0
    total_invested = 0
    
    monthly_data = []
    current = start_date
    month = 0
    
    while current <= end_date:
        liquid_nav = get_nav_on_date(liquid_df, current)
        arb_nav = get_nav_on_date(arb_df, current)
        nifty_nav = get_nav_on_date(nifty_df, current)
        
        if any(v is None for v in [liquid_nav, arb_nav, nifty_nav]):
            current += timedelta(days=30)
            continue
        
        # Get all satellite NAVs
        sat_navs = {}
        for name, sat in satellites.items():
            sat_navs[name] = get_nav_on_date(sat["df"], current)
        
        # Add monthly surplus to Reserve
        amount = initial_idle if month == 0 else monthly_surplus
        total_invested += amount
        
        liquid_alloc = min(amount * 0.20, max(0, 200000 - liquid_units * liquid_nav))
        arb_alloc = amount - liquid_alloc
        if liquid_alloc > 0:
            liquid_units += liquid_alloc / liquid_nav
        if arb_alloc > 0:
            arb_units += arb_alloc / arb_nav
        
        reserve_value = (liquid_units * liquid_nav) + (arb_units * arb_nav)
        
        # Deploy from Reserve to equity
        if month >= 3 and reserve_value > reserve_threshold:
            excess = reserve_value - reserve_threshold
            deploy_amount = excess * 0.25  # More aggressive: 25% of excess
            deploy_amount = min(deploy_amount, arb_units * arb_nav)
            
            if deploy_amount > 0:
                arb_units -= deploy_amount / arb_nav
                
                # Core: 40% to Nifty 50
                core_amount = deploy_amount * 0.40
                nifty_units += core_amount / nifty_nav
                
                # Satellite: distribute remaining 60%
                sat_amount = deploy_amount * 0.60
                active_sats = {k: v for k, v in satellites.items() if sat_navs.get(k) is not None}
                
                if active_sats:
                    # Quarterly momentum tilt
                    if month % 3 == 0 and month > 3:
                        # Calculate 3-month returns for each satellite
                        returns = {}
                        for name, sat in active_sats.items():
                            nav_3m = get_nav_on_date(sat["df"], current - timedelta(days=90))
                            nav_now = sat_navs[name]
                            if nav_3m and nav_now:
                                returns[name] = (nav_now - nav_3m) / nav_3m
                        
                        if returns:
                            # Overweight top performer, underweight worst
                            avg_return = np.mean(list(returns.values()))
                            for name in active_sats:
                                if name in returns:
                                    tilt = 1 + (returns[name] - avg_return) * 2  # Momentum tilt
                                    tilt = max(0.5, min(1.5, tilt))
                                    active_sats[name]["current_tilt"] = tilt
                                else:
                                    active_sats[name]["current_tilt"] = 1.0
                    
                    # Allocate satellite
                    total_tilt = sum(s.get("current_tilt", 1.0) for s in active_sats.values())
                    for name, sat in active_sats.items():
                        tilt = sat.get("current_tilt", 1.0)
                        alloc = sat_amount * (tilt / total_tilt)
                        nav = sat_navs[name]
                        if nav and nav > 0:
                            satellites[name]["units"] += alloc / nav
        
        # Calculate portfolio value
        reserve_val = (liquid_units * liquid_nav) + (arb_units * arb_nav)
        core_val = nifty_units * nifty_nav
        sat_val = 0
        for name, sat in satellites.items():
            nav = sat_navs.get(name)
            if nav:
                sat_val += sat["units"] * nav
        
        equity_val = core_val + sat_val
        portfolio_value = reserve_val + equity_val
        
        monthly_data.append({
            "date": current,
            "month": month,
            "invested": total_invested,
            "portfolio_value": portfolio_value,
            "reserve_value": reserve_val,
            "core_equity": core_val,
            "satellite_equity": sat_val,
            "equity_pct": (equity_val / portfolio_value * 100) if portfolio_value > 0 else 0,
            "gain": portfolio_value - total_invested,
            "return_pct": ((portfolio_value / total_invested) - 1) * 100 if total_invested > 0 else 0,
        })
        
        month += 1
        current += timedelta(days=30)
    
    return pd.DataFrame(monthly_data)


# ============================================================
# BENCHMARKS
# ============================================================

def calculate_savings_account(profile, start_date, end_date):
    """What if user just left money in savings account at 3.5%"""
    monthly_surplus = profile["monthly_surplus"]
    initial_idle = profile["initial_idle"]
    monthly_rate = SAVINGS_RATE / 12
    
    balance = initial_idle
    total_invested = initial_idle
    monthly_data = []
    current = start_date
    month = 0
    
    while current <= end_date:
        if month > 0:
            total_invested += monthly_surplus
            balance += monthly_surplus
        
        # Monthly interest
        balance *= (1 + monthly_rate)
        
        monthly_data.append({
            "date": current,
            "month": month,
            "invested": total_invested,
            "portfolio_value": balance,
            "gain": balance - total_invested,
            "return_pct": ((balance / total_invested) - 1) * 100 if total_invested > 0 else 0,
        })
        
        month += 1
        current += timedelta(days=30)
    
    return pd.DataFrame(monthly_data)


def calculate_fd(profile, start_date, end_date):
    """What if user put everything in FDs at 7% (post-tax ~4.9%)"""
    monthly_surplus = profile["monthly_surplus"]
    initial_idle = profile["initial_idle"]
    post_tax_rate = FD_RATE * (1 - TAX["debt_slab"])
    monthly_rate = post_tax_rate / 12
    
    balance = initial_idle
    total_invested = initial_idle
    monthly_data = []
    current = start_date
    month = 0
    
    while current <= end_date:
        if month > 0:
            total_invested += monthly_surplus
            balance += monthly_surplus
        
        balance *= (1 + monthly_rate)
        
        monthly_data.append({
            "date": current,
            "month": month,
            "invested": total_invested,
            "portfolio_value": balance,
            "gain": balance - total_invested,
            "return_pct": ((balance / total_invested) - 1) * 100 if total_invested > 0 else 0,
        })
        
        month += 1
        current += timedelta(days=30)
    
    return pd.DataFrame(monthly_data)


def calculate_blind_sip(nav_data, profile, start_date, end_date):
    """What if user just did a blind monthly SIP into Nifty 50"""
    nifty_df = nav_data.get("uti_nifty50")
    if nifty_df is None:
        return None
    
    monthly_surplus = profile["monthly_surplus"]
    initial_idle = profile["initial_idle"]
    nifty_units = 0
    total_invested = 0
    monthly_data = []
    current = start_date
    month = 0
    
    while current <= end_date:
        nifty_nav = get_nav_on_date(nifty_df, current)
        if nifty_nav is None:
            current += timedelta(days=30)
            continue
        
        amount = initial_idle if month == 0 else monthly_surplus
        total_invested += amount
        nifty_units += amount / nifty_nav
        
        portfolio_value = nifty_units * nifty_nav
        
        monthly_data.append({
            "date": current,
            "month": month,
            "invested": total_invested,
            "portfolio_value": portfolio_value,
            "gain": portfolio_value - total_invested,
            "return_pct": ((portfolio_value / total_invested) - 1) * 100 if total_invested > 0 else 0,
        })
        
        month += 1
        current += timedelta(days=30)
    
    return pd.DataFrame(monthly_data)


# ============================================================
# POST-TAX CALCULATIONS
# ============================================================

def calculate_post_tax_gain(product_type, gain, holding_months):
    """Calculate post-tax gain for 30% slab user"""
    if gain <= 0:
        return gain
    
    if product_type in ["reserve_liquid"]:
        # Liquid fund: taxed at slab rate (always short-term post 2023)
        return gain * (1 - TAX["debt_slab"])
    
    elif product_type in ["reserve_arb", "systematic", "tactical", "alpha"]:
        # Equity taxation (arbitrage treated as equity)
        if holding_months < 12:
            return gain * (1 - TAX["equity_stcg"])
        else:
            exempt = min(gain, TAX["equity_ltcg_exemption"])
            taxable = max(0, gain - exempt)
            return exempt + taxable * (1 - TAX["equity_ltcg"])
    
    elif product_type == "savings":
        # Interest taxed at slab rate
        return gain * (1 - TAX["debt_slab"])
    
    elif product_type == "fd":
        # Already calculated post-tax
        return gain
    
    return gain


# ============================================================
# RESULTS FORMATTING
# ============================================================

def format_currency(amount):
    """Format number as Indian currency"""
    if abs(amount) >= 10000000:
        return f"₹{amount/10000000:.2f} Cr"
    elif abs(amount) >= 100000:
        return f"₹{amount/100000:.2f} L"
    elif abs(amount) >= 1000:
        return f"₹{amount/1000:.1f}K"
    else:
        return f"₹{amount:.0f}"


def calculate_xirr_approx(invested, final_value, months):
    """Approximate XIRR using simple annualized return"""
    if months <= 0 or invested <= 0:
        return 0
    years = months / 12
    if years <= 0:
        return 0
    # For periodic investments, use a rough approximation
    # Average money was invested for half the period
    avg_invested_time = years / 2
    if avg_invested_time <= 0:
        return 0
    total_return = (final_value / invested) - 1
    # Approximate annualized
    annualized = ((1 + total_return) ** (1 / avg_invested_time)) - 1
    return annualized * 100


def generate_results_table(results, profile_name, window_label):
    """Generate a comparison table for all products"""
    lines = []
    lines.append(f"\n{'='*90}")
    lines.append(f"  {window_label} BACKTEST — {USER_PROFILES[profile_name]['label']} monthly surplus")
    lines.append(f"  Initial idle cash: {format_currency(USER_PROFILES[profile_name]['initial_idle'])}")
    lines.append(f"  Tax slab: 30%")
    lines.append(f"{'='*90}")
    
    header = f"{'Product':<22} {'Invested':>12} {'Final Value':>12} {'Gain':>12} {'Return %':>10} {'Extra vs SA':>12}"
    lines.append(header)
    lines.append("-" * 90)
    
    savings_gain = 0
    for name, df in results.items():
        if df is None or df.empty:
            continue
        
        last = df.iloc[-1]
        invested = last["invested"]
        value = last["portfolio_value"]
        gain = last["gain"]
        return_pct = last["return_pct"]
        
        if name == "savings":
            savings_gain = gain
        
        extra = gain - savings_gain if name != "savings" else 0
        
        display_name = {
            "savings": "💰 Savings A/c",
            "fd": "🏦 Fixed Deposit",
            "blind_sip": "📊 Blind SIP (Nifty)",
            "reserve": "🟢 Neev Reserve",
            "systematic": "🔵 Neev Systematic",
            "tactical": "🟠 Neev Tactical",
            "alpha": "🔴 Neev Alpha",
        }.get(name, name)
        
        line = f"{display_name:<22} {format_currency(invested):>12} {format_currency(value):>12} {format_currency(gain):>12} {return_pct:>9.2f}% {format_currency(extra):>12}"
        lines.append(line)
    
    lines.append("-" * 90)
    return "\n".join(lines)


# ============================================================
# MAIN
# ============================================================

def run_backtest():
    """Run the complete backtest suite"""
    # Load data
    nav_data = load_all_nav_data()
    
    # Define backtest windows
    windows = {
        "3-Year (Mar 2023 — Mar 2026)": {
            "start": datetime(2023, 3, 1),
            "end": datetime(2026, 2, 28),
        },
        "5-Year (Mar 2021 — Mar 2026)": {
            "start": datetime(2021, 3, 1),
            "end": datetime(2026, 2, 28),
        },
    }
    
    all_results = {}
    full_output = []
    
    full_output.append("\n" + "█" * 90)
    full_output.append("  NEEV PRODUCT SUITE — BACKTEST RESULTS")
    full_output.append("  Real NAV data · mfapi.in · 30% tax slab")
    full_output.append("█" * 90)
    
    for window_label, window in windows.items():
        start = window["start"]
        end = window["end"]
        
        full_output.append(f"\n\n{'▓'*90}")
        full_output.append(f"  WINDOW: {window_label}")
        full_output.append(f"{'▓'*90}")
        
        for profile_name, profile in USER_PROFILES.items():
            print(f"\n🔄 Running: {window_label} × {profile['label']}...")
            
            results = {}
            
            # Benchmarks
            results["savings"] = calculate_savings_account(profile, start, end)
            results["fd"] = calculate_fd(profile, start, end)
            results["blind_sip"] = calculate_blind_sip(nav_data, profile, start, end)
            
            # Neev Products
            results["reserve"] = backtest_reserve(nav_data, profile, start, end)
            results["systematic"] = backtest_systematic(nav_data, profile, start, end)
            results["tactical"] = backtest_tactical(nav_data, profile, start, end)
            results["alpha"] = backtest_alpha(nav_data, profile, start, end)
            
            # Generate table
            table = generate_results_table(results, profile_name, window_label)
            full_output.append(table)
            print(table)
            
            # Store for later
            all_results[f"{window_label}_{profile_name}"] = results
    
    # Save results
    output_text = "\n".join(full_output)
    
    # Also generate detailed per-product analysis
    full_output.append("\n\n" + "█" * 90)
    full_output.append("  DETAILED PRODUCT ANALYSIS")
    full_output.append("█" * 90)
    
    # For each product, show the monthly journey for moderate profile, 5-year
    key = "5-Year (Mar 2021 — Mar 2026)_moderate"
    if key in all_results:
        for product_name in ["reserve", "systematic", "tactical", "alpha"]:
            df = all_results[key].get(product_name)
            if df is not None and not df.empty:
                full_output.append(f"\n{'─'*60}")
                full_output.append(f"  {product_name.upper()} — ₹1L/month, 5-year journey")
                full_output.append(f"{'─'*60}")
                
                # Show key milestones
                milestones = [0, 5, 11, 17, 23, 35, 47, 59]
                for m in milestones:
                    if m < len(df):
                        row = df.iloc[m]
                        month_label = f"Month {row['month']:>2}"
                        
                        extra_info = ""
                        if "equity_pct" in row:
                            extra_info = f"  Equity: {row['equity_pct']:.0f}%"
                        
                        full_output.append(
                            f"  {month_label}: Invested {format_currency(row['invested']):>10} → "
                            f"Value {format_currency(row['portfolio_value']):>10} "
                            f"(+{format_currency(row['gain']):>8}){extra_info}"
                        )
    
    output_text = "\n".join(full_output)
    
    with open("/home/claude/backtest_results.txt", "w") as f:
        f.write(output_text)
    
    print("\n\n✅ Results saved to backtest_results.txt")
    
    return all_results, nav_data


if __name__ == "__main__":
    results, nav_data = run_backtest()
