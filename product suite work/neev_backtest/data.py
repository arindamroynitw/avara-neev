"""
Data layer: NAV fetching, parquet caching, Nifty PE data loading.
"""

import os
import time
import requests
import pandas as pd
from datetime import datetime
from pathlib import Path

from .config import SCHEME_CODES

CACHE_DIR = Path(__file__).parent / "data" / "nav_cache"


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
                    except (ValueError, KeyError):
                        continue
                df = pd.DataFrame(records)
                df = df.sort_values("date").reset_index(drop=True)
                df = df.set_index("date")
                print(f"  + {scheme_name}: {len(df)} days "
                      f"({df.index.min().strftime('%Y-%m-%d')} to "
                      f"{df.index.max().strftime('%Y-%m-%d')})")
                return df
            else:
                print(f"  x {scheme_name}: API returned no data")
                return None
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            else:
                print(f"  x {scheme_name}: {e}")
                return None


def _cache_path(scheme_name):
    return CACHE_DIR / f"{scheme_name}.parquet"


def load_nav_cached(scheme_code, scheme_name, max_age_hours=12):
    """Load NAV data, using parquet cache if fresh enough."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_file = _cache_path(scheme_name)

    if cache_file.exists():
        age_hours = (time.time() - cache_file.stat().st_mtime) / 3600
        if age_hours < max_age_hours:
            df = pd.read_parquet(cache_file)
            print(f"  [cached] {scheme_name}: {len(df)} days")
            return df

    df = fetch_nav_data(scheme_code, scheme_name)
    if df is not None:
        df.to_parquet(cache_file)
    return df


def load_all_nav_data(use_cache=True):
    """Load NAV data for all schemes."""
    print("\nFetching NAV data from mfapi.in...")
    print("=" * 60)
    nav_data = {}
    for name, code in SCHEME_CODES.items():
        if use_cache:
            nav_data[name] = load_nav_cached(code, name)
        else:
            nav_data[name] = fetch_nav_data(code, name)
        time.sleep(0.3)
    return nav_data


def load_nifty_pe():
    """Load monthly Nifty 50 PE ratio data from bundled CSV.

    CSV format: date,pe (one row per month, date is first of month).
    Returns a DataFrame indexed by date with a 'pe' column.
    """
    pe_path = Path(__file__).parent / "data" / "nifty_pe.csv"
    if not pe_path.exists():
        print(f"  [warn] Nifty PE data not found at {pe_path}; "
              "falling back to None")
        return None
    df = pd.read_csv(pe_path, parse_dates=["date"])
    df = df.sort_values("date").set_index("date")
    print(f"  + Nifty PE data: {len(df)} months "
          f"({df.index.min().strftime('%Y-%m-%d')} to "
          f"{df.index.max().strftime('%Y-%m-%d')})")
    return df


def get_pe_on_date(pe_df, target_date):
    """Get the most recent PE reading on or before target_date."""
    if pe_df is None:
        return None
    mask = pe_df.index <= target_date
    if mask.any():
        return pe_df.loc[mask].iloc[-1]["pe"]
    return None
