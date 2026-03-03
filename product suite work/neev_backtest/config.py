"""
Configuration: Constants, tax rates, scheme codes, user profiles, fee tiers.
"""

from datetime import datetime

# ============================================================
# SCHEME CODES (mfapi.in)
# ============================================================

SCHEME_CODES = {
    # Liquid Funds (T+0 layer)
    "parag_parikh_liquid": 143269,
    "hdfc_liquid": 119091,

    # Arbitrage Funds (tax-advantaged parking)
    "kotak_arbitrage": 119771,
    "tata_arbitrage": 145724,
    "absl_arbitrage": 119526,

    # Large Cap Index (Market Entry)
    "uti_nifty50": 120716,
    "icici_nifty_next50": 120684,

    # Active satellite funds (Accelerate) / Index satellites (Navigate)
    "motilal_midcap150": 147622,
    "motilal_sp500": 148381,
    "parag_parikh_flexi": 122639,
    "hdfc_midcap": 118989,
    "nippon_smallcap": 118778,
}

# ============================================================
# USER PROFILES
# ============================================================

USER_PROFILES = {
    "conservative": {
        "label": "₹50K/month",
        "monthly_surplus": 50000,
        "initial_idle": 300000,
    },
    "moderate": {
        "label": "₹1L/month",
        "monthly_surplus": 100000,
        "initial_idle": 500000,
    },
    "aggressive": {
        "label": "₹2L/month",
        "monthly_surplus": 200000,
        "initial_idle": 800000,
    },
}

# ============================================================
# TAX RATES (FY 2024-25 onwards, 30% slab)
# ============================================================

TAX = {
    "equity_stcg": 0.20,          # <1 year equity
    "equity_ltcg": 0.125,         # >1 year equity (above exemption)
    "debt_slab": 0.30,            # Debt/liquid fund gains taxed at slab
    "equity_ltcg_exemption": 125000,  # Annual LTCG exemption (shared across ALL equity)
    "savings_interest_exempt": 10000,  # Sec 80TTA
}

# ============================================================
# BENCHMARKS
# ============================================================

SAVINGS_RATE = 0.035  # 3.5% p.a.
FD_RATE = 0.07        # 7% p.a.

# ============================================================
# PRODUCT PARAMETERS
# ============================================================

BANK_FLOOR = 30000  # Layer 1: minimum bank balance

# Reserve
RESERVE_LIQUID_PCT = 0.20
RESERVE_LIQUID_CAP = 200000  # Max liquid for instant access

# Arbitrage exit load
ARB_EXIT_LOAD_PCT = 0.0025   # 0.25% within 30 days (Kotak Arbitrage)
ARB_EXIT_LOAD_DAYS = 30

# Market Entry (was Systematic)
MARKET_ENTRY_RESERVE_THRESHOLD_MULTIPLIER = 3  # Start deploying after 3x surplus
MARKET_ENTRY_DEPLOY_RATE = 0.20                # 20% of excess per month
MARKET_ENTRY_PE_BANDS = {
    "cheap": {"max_pe": 18, "pace": 1.5},
    "normal": {"min_pe": 18, "max_pe": 22, "pace": 1.0},
    "expensive": {"min_pe": 22, "pace": 0.5},
}
MARKET_ENTRY_DEEP_VALUE_PE = 16  # Bonus 2x deployment when PE < 16
MARKET_ENTRY_DEEP_VALUE_BONUS = 2.0

# Accelerate / Navigate (was Grow / Alpha)
GROW_RESERVE_THRESHOLD_MULTIPLIER = 3
GROW_DEPLOY_RATE = 0.25           # 25% of excess
GROW_CORE_PCT = 0.40              # 40% Nifty 50
GROW_REBALANCE_MONTHS = {3, 6, 9, 12}  # Calendar quarters
GROW_MOMENTUM_TILT_VARIANTS = {
    "conservative": {"factor": 1, "clamp": (0.7, 1.3)},
    "moderate":     {"factor": 2, "clamp": (0.5, 1.5)},
    "aggressive":   {"factor": 3, "clamp": (0.3, 2.0)},
}

# ============================================================
# ADVISORY FEES (annual)
# ============================================================

FEE_TIERS = {
    "diy": 0,
    "starter": 25000,
    "typical": 50000,
}

# ============================================================
# BACKTEST WINDOWS
# ============================================================

BACKTEST_WINDOWS = {
    "3-Year (Mar 2023 - Mar 2026)": {
        "start": datetime(2023, 3, 7),
        "end": datetime(2026, 2, 7),
    },
    "5-Year (Mar 2021 - Mar 2026)": {
        "start": datetime(2021, 3, 7),
        "end": datetime(2026, 2, 7),
    },
}

# Sweep anchor day — 7th of each month (after salary + outflows settle)
SWEEP_DAY = 7

# ============================================================
# STRESS TEST EVENTS
# ============================================================

STRESS_EVENTS = {
    "COVID crash": {
        "start": datetime(2020, 2, 1),
        "end": datetime(2020, 3, 31),
        "description": "Nifty -38%",
    },
    "COVID recovery": {
        "start": datetime(2020, 3, 1),
        "end": datetime(2020, 9, 30),
        "description": "Nifty +60%",
    },
    "2021-22 correction": {
        "start": datetime(2021, 10, 1),
        "end": datetime(2022, 6, 30),
        "description": "Nifty -17%",
    },
    "2024 consolidation": {
        "start": datetime(2024, 9, 1),
        "end": datetime(2025, 1, 31),
        "description": "Flat/down market",
    },
}
