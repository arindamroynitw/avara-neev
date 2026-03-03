# Neev — Strategy Note

**A Foundation-First Approach to Personal Finance**

Date: March 2026 | Version 1.0

---

## 1. The Neev Philosophy

Neev (Hindi: "foundation") is built on a simple principle: **every rupee should have an assignment**.

Most Indians don't have a savings problem — they have an allocation problem. Surplus cash sits in savings accounts earning 3.5%, fixed deposits lock money at 7% with tax leakage, and equity SIPs run on autopilot without regard for valuations or portfolio construction. The result: money works far below its potential.

Neev solves this with a progressive risk ladder — a system where surplus flows through four products in order of increasing risk and return, with each layer building on the one below it. No rupee sits idle. No allocation is accidental.

---

## 2. The Problem

### Savings accounts destroy purchasing power

At 3.5% interest and 6%+ inflation, a savings account loses ~2.5% of purchasing power annually. Over 5 years, ₹63.70L invested monthly at ₹1L/month yields just ₹4.48L in post-tax gains — barely keeping pace with inflation.

### Fixed deposits offer false safety

FDs return 7.44% gross, but after 30% slab taxation, effective returns drop to ~5.2%. This barely matches inflation and locks your money for years.

### Blind SIPs leave money on the table

A standard Nifty SIP ignores valuations entirely — buying the same amount whether PE is 15 or 25. It also ignores the surplus sitting in savings while SIP amounts are fixed. Most people's investable surplus is much larger than their SIP allocation.

### Most surplus cash sits idle

The core problem: the gap between what people earn, what they spend, and what they actively invest. For a ₹1L/month surplus earner, typically ₹50-70K/month piles up in savings accounts while only ₹10-20K goes to SIPs. Neev captures the entire surplus.

---

## 3. The Neev Framework

**Park → Deploy → Diversify**

Every rupee follows a progression:

```
Income → Expenses → Bank Floor (₹30K) → NEEV RESERVE (park)
                                              ↓
                                     NEEV MARKET ENTRY (deploy)
                                              ↓
                                  NEEV ACCELERATE or NAVIGATE (diversify)
```

The four products form a ladder:

| Layer | Product | Role | Target Return | Risk |
|-------|---------|------|--------------|------|
| 1 | **Reserve** | Park surplus cash | 7.20% XIRR | Zero drawdown |
| 2 | **Market Entry** | Deploy into large-cap equity | 10.53% XIRR | -2.47% max DD |
| 3a | **Accelerate** | Diversify with active funds | 14.20% XIRR | -6.25% max DD |
| 3b | **Navigate** | Diversify with index funds | 13.66% XIRR | -6.39% max DD |

Each layer has a clear purpose, and capital naturally flows upward as the foundation strengthens.

---

## 4. Product Architecture

```
┌─────────────────────────────────────────────────────────┐
│               NEEV ACCELERATE (14.20%)                  │
│     Curated active funds + momentum rebalancing         │
│    ─ ─ ─ ─ ─ ─ ─ ─ ─ OR ─ ─ ─ ─ ─ ─ ─ ─ ─           │
│               NEEV NAVIGATE (13.66%)                    │
│       Pure index funds + same momentum system           │
├─────────────────────────────────────────────────────────┤
│             NEEV MARKET ENTRY (10.53%)                  │
│       PE-aware STP into Nifty 50 from Reserve           │
├─────────────────────────────────────────────────────────┤
│               NEEV RESERVE (7.20%)                      │
│          20% Liquid + 80% Arbitrage                     │
├─────────────────────────────────────────────────────────┤
│              BANK FLOOR (₹30,000)                       │
│            Daily expenses buffer                        │
└─────────────────────────────────────────────────────────┘
```

---

## 5. How Reserve Works

**Role**: The default home for every rupee of surplus

### Mechanism

- Monthly surplus (post-expenses) enters Reserve after maintaining ₹30,000 bank floor
- Split: **20% liquid fund** (Parag Parikh Liquid) + **80% arbitrage** (Kotak Equity Arbitrage)
- Liquid fund provides T+0 access for emergencies; capped at ₹2L
- Arbitrage fund provides yield with equity tax treatment
- Monthly rebalancing back to 20/80 target

### Why arbitrage, not FD?

Arbitrage funds earn similar returns to FDs (7%+) but are taxed as equity instruments:
- **Held >1 year**: 12.5% LTCG (vs 30% slab for FD interest)
- **Tax savings**: On ₹10L gains, arbitrage saves ₹1.75L in taxes vs FD

### Performance

- **XIRR**: 7.20% (vs 3.66% savings, 7.44% FD)
- **Max drawdown**: 0.00% — zero drawdown in 5 years, including COVID crash
- **Sharpe ratio**: 2.08 — highest risk-adjusted return in the suite
- **Post-tax extra vs savings**: ₹7.11L over 5 years (₹1L/month)

---

## 6. How Market Entry Works

**Role**: Systematic, valuation-aware deployment from Reserve into equity

### Mechanism

- Once Reserve corpus exceeds **3x monthly surplus**, excess begins deploying into equity
- **20% of excess** deployed each month into UTI Nifty 50 Index Fund
- **PE-based pace modulation** adjusts deployment speed:

| Nifty PE | Market Condition | Deployment Pace |
|----------|-----------------|-----------------|
| < 16 | Deep value | 2.0x bonus |
| < 18 | Cheap | 1.5x |
| 18–22 | Normal | 1.0x |
| > 22 | Expensive | 0.5x |

- Undeployed surplus stays in Reserve earning 7%+
- No sell triggers — deployment is one-way (Reserve → Equity)

### Why PE-based pacing?

Blind SIPs invest the same amount regardless of valuations. Market Entry deploys more when markets are cheap and less when expensive — a simple but effective form of tactical allocation that doesn't require predicting market direction.

### Performance

- **XIRR**: 10.53% (vs 11.95% Blind SIP)
- **Max drawdown**: -2.47% (vs -4.40% Blind SIP) — **44% less downside**
- **Volatility**: 8.03% (vs 12.73% Blind SIP) — **37% lower**
- **Post-tax extra vs savings**: ₹12.67L over 5 years (₹1L/month)

Market Entry slightly trails Blind SIP on absolute returns because Reserve earns less than equity during bull markets. The trade-off: substantially lower risk and smoother journey.

---

## 7. How Accelerate Works

**Role**: Diversified growth with active fund selection and momentum rebalancing

### Mechanism

- Same Reserve base and deployment trigger as Market Entry (3x surplus threshold, 25% monthly deployment)
- Capital deploys into a **5-fund portfolio**:
  - **Core (40%)**: UTI Nifty 50 — stable large-cap anchor
  - **Satellites (15% each)**:
    - ICICI Nifty Next 50 — large-cap breadth
    - HDFC Midcap Opportunities — active mid-cap alpha
    - Parag Parikh Flexi Cap — multi-cap + international
    - Motilal Oswal S&P 500 — US equity diversification
- **Quarterly momentum rebalancing**: Every quarter, satellite weights are adjusted based on recent performance
  - Funds with positive momentum get tilted up (max 1.5x base weight)
  - Funds with negative momentum get tilted down (min 0.5x base weight)
  - Core (Nifty 50) is never tilted — it stays at 40%

### Why these funds?

- **HDFC Midcap**: Consistent outperformer in mid-cap space with long track record
- **Parag Parikh Flexi Cap**: Only flexi-cap with built-in international allocation (25-35% in international equities)
- **S&P 500**: Genuine geographic diversification; USD hedge against INR depreciation
- **Next 50**: Captures the next tier of blue-chips at lower cost than active large-cap funds

### Performance

- **XIRR**: 14.20% — highest in the suite
- **Sharpe ratio**: 0.89 — best risk-adjusted return among equity products
- **Max drawdown**: -6.25%
- **Post-tax extra vs savings**: ₹19.67L over 5 years (₹1L/month)
- **Alpha over Navigate**: 54 bps (from active fund selection)

---

## 8. How Navigate Works

**Role**: Same diversified growth system as Accelerate, but with pure index funds

### Mechanism

- Identical to Accelerate in every way except fund selection:
  - Same Reserve base, same deployment trigger, same 25% monthly deployment
  - Same 40% core + 60% satellite structure
  - Same quarterly momentum rebalancing
- **Satellite funds are all index funds** — no active manager dependency:
  - ICICI Nifty Next 50 (same as Accelerate)
  - Motilal Oswal Nifty Midcap 150 (replaces HDFC Midcap active)
  - Motilal Oswal Nifty Midcap 150 (replaces Parag Parikh Flexi active)
  - Motilal Oswal S&P 500 (same as Accelerate)

### Why Navigate exists

Navigate serves as both a **product choice** and a **control variable**:
- As a product: For investors who prefer index funds over active management
- As a control: Proves that Neev's outperformance comes from the system (allocation + momentum), not from fund picking

### Performance

- **XIRR**: 13.66% — only 54 bps below Accelerate
- **Max drawdown**: -6.39%
- **Post-tax extra vs savings**: ₹18.60L over 5 years (₹1L/month)
- Captures **96% of Accelerate's returns** with zero fund-picking risk

---

## 9. Accelerate vs Navigate: An Honest Comparison

This is perhaps the most important comparison in the Neev suite. Both products use the same system — the only difference is whether satellite funds are actively managed or pure index.

| Dimension | Accelerate | Navigate | Verdict |
|-----------|------------|----------|---------|
| 5-year XIRR | 14.20% | 13.66% | Accelerate +54 bps |
| Sharpe ratio | 0.89 | 0.81 | Accelerate |
| Sortino ratio | 1.03 | 0.95 | Accelerate |
| Max drawdown | -6.25% | -6.39% | Accelerate (marginally) |
| Volatility | 9.23% | 9.44% | Accelerate (marginally) |
| Extra vs savings (5yr, ₹1L/mo) | ₹19.67L | ₹18.60L | Accelerate +₹1.07L |
| Fund-picking risk | Present | None | Navigate |
| Survivorship bias | Present | None | Navigate |
| Expense ratios | Higher (~0.5-1%) | Lower (~0.1%) | Navigate |
| Manager dependency | Yes | No | Navigate |

### Key insight: The active premium is slim

The 54 bps difference translates to ₹1.07L over 5 years on ₹1L/month investment. This is meaningful but modest — roughly ₹18K/year of additional return from active fund picking.

### Where does the outperformance really come from?

Both products beat Blind SIP by a wide margin:
- Accelerate: 14.20% vs 11.95% = **+225 bps**
- Navigate: 13.66% vs 11.95% = **+171 bps**

Of Accelerate's 225 bps outperformance over Blind SIP:
- **171 bps** (76%) comes from the shared system (allocation + momentum + Reserve cushion)
- **54 bps** (24%) comes from active fund selection

**Navigate is the default recommendation** for most investors. Accelerate is for those who actively want exposure to curated fund picks and are comfortable with the associated risks (survivorship bias, manager dependency, higher expense ratios).

---

## 10. Tax Optimization

Neev's structure is inherently tax-efficient:

### Arbitrage = equity taxation

Reserve's 80% arbitrage allocation gets equity LTCG treatment (12.5% above ₹1.25L exemption) instead of debt taxation (30% slab). This is the single largest tax optimization in the suite — saving ~₹1.75L in taxes per ₹10L of gains compared to FDs.

### Shared LTCG exemption

The ₹1.25L annual LTCG exemption is shared across all equity holdings. Neev's backtest models this correctly — the exemption is applied once across the entire portfolio, not per-fund.

### Estimated tax split

For equity deployment products (Market Entry, Accelerate, Navigate), the backtest estimates:
- **70% of gains as LTCG** (held >1 year) — taxed at 12.5% above exemption
- **30% of gains as STCG** (held <1 year) — taxed at 20%

This is conservative — actual LTCG proportion may be higher for long-term investors, improving post-tax returns.

### Exit load awareness

Kotak Arbitrage charges 0.25% exit load on redemptions within 30 days. Neev's FIFO lot tracking ensures that oldest lots (beyond exit load period) are redeemed first.

---

## 11. Methodology & Backtesting

### Data source

All backtests use **real mutual fund NAV data** sourced from mfapi.in (which mirrors AMFI data). No synthetic or modeled returns.

### Calendar month stepping

Investments are simulated on the **7th of each month** (after typical salary credit and bill payments). If the 7th falls on a holiday, the nearest previous trading day's NAV is used (backward-only lookup — never forward).

### Return calculation

**XIRR** (Extended Internal Rate of Return) using Brent's method — the gold standard for irregular cash flow return calculation. Every monthly investment is tracked as a separate cash flow.

### Post-tax calculation

- All gains are calculated post-tax using FY 2024-25 tax rates
- Equity LTCG: 12.5% above ₹1.25L shared exemption
- Equity STCG: 20%
- Debt gains: 30% slab
- Savings interest: ₹10,000 exempt under Sec 80TTA
- FD interest: 30% slab on full amount

### Stress testing

Four historical stress events are tested:
1. **COVID crash** (Feb–Mar 2020): Nifty -38%
2. **COVID recovery** (Mar–Sep 2020): Nifty +60%
3. **2021–22 correction** (Oct 2021–Jun 2022): Nifty -17%
4. **2024 consolidation** (Sep 2024–Jan 2025): Flat/down market

### Backtest windows

- **3-year**: March 2023 – March 2026
- **5-year**: March 2021 – March 2026

Both windows are tested across three profiles: Conservative (₹50K/mo), Moderate (₹1L/mo), Aggressive (₹2L/mo).

---

## 12. Performance Summary Table

*5-Year backtest (Mar 2021 – Mar 2026) | ₹1L/month moderate profile | DIY*

| Product | XIRR | Post-Tax Gain | Extra vs SA | Max DD | Sharpe | Volatility |
|---------|------|--------------|-------------|--------|--------|------------|
| Savings A/c | 3.66% | ₹4.48L | — | 0.00% | N/A | 0.04% |
| Fixed Deposit | 7.44% | ₹9.49L | ₹5.00L | 0.00% | N/A | 0.08% |
| Blind SIP (Nifty) | 11.95% | ₹19.79L | ₹15.30L | -4.40% | 0.47 | 12.73% |
| **Neev Reserve** | **7.20%** | **₹11.59L** | **₹7.11L** | **0.00%** | **2.08** | **0.58%** |
| **Neev Market Entry** | **10.53%** | **₹17.15L** | **₹12.67L** | **-2.47%** | **0.56** | **8.03%** |
| **Neev Accelerate** | **14.20%** | **₹24.16L** | **₹19.67L** | **-6.25%** | **0.89** | **9.23%** |
| **Neev Navigate** | **13.66%** | **₹23.08L** | **₹18.60L** | **-6.39%** | **0.81** | **9.44%** |

### With advisory fees (5-year, ₹1L/month, extra vs savings)

| Product | DIY (₹0) | Starter (₹25K/yr) | Typical (₹50K/yr) |
|---------|----------|--------------------|--------------------|
| Reserve | ₹7.11L | ₹5.86L | ₹4.61L |
| Market Entry | ₹12.67L | ₹11.42L | ₹10.17L |
| Accelerate | ₹19.67L | ₹18.42L | ₹17.17L |
| Navigate | ₹18.60L | ₹17.35L | ₹16.10L |

---

## 13. Important Disclosures

### Past performance disclaimer

The returns presented in this document are based on **backtested simulations** using actual mutual fund NAV data from March 2021 to March 2026. **Past performance is not indicative of future results.** Backtested returns are hypothetical and have never been achieved by any actual investor.

### Backtest limitations

1. **Hindsight bias**: Fund selection, allocation percentages, and rebalancing rules were designed with knowledge of the test period. Future market conditions may differ materially
2. **Survivorship bias**: Active funds in Accelerate (HDFC Midcap, Parag Parikh Flexi Cap) were selected based on historical performance. Funds that performed poorly during this period are not represented
3. **Transaction costs**: While exit loads are modeled, stamp duty (0.005%) and STT are not included. Impact on returns is minimal (<5 bps)
4. **Tax estimation**: Post-tax calculations use simplified 70/30 LTCG/STCG split. Actual tax liability depends on individual holding periods and redemption patterns
5. **No behavioral modeling**: Backtests assume perfect discipline — no panic selling, no missed months, no deviation from the system. Real investor behavior may differ

### Regulatory status

Neev is an **allocation framework and decision-support system**, not a registered Portfolio Management Service (PMS), Alternative Investment Fund (AIF), or Research Analyst under SEBI regulations. The products described are model portfolios that investors implement themselves through direct mutual fund platforms (e.g., MF Utilities, BSE StAR MF, Kuvera, Groww).

### Risk factors

- **Market risk**: Equity investments are subject to market volatility. Past drawdowns do not predict future drawdowns
- **Credit risk**: Liquid and arbitrage funds hold corporate debt and derivatives positions that carry counterparty risk
- **Regulatory risk**: Tax treatment of arbitrage funds, LTCG exemption limits, and mutual fund regulations may change
- **Liquidity risk**: Mid-cap and small-cap funds may face liquidity constraints during market stress
- **Currency risk**: S&P 500 allocation introduces USD/INR exchange rate risk
- **Model risk**: The PE-based pacing and momentum rebalancing systems may underperform in market regimes not represented in the backtest period

### Recommendation

Investors should consult a SEBI-registered investment advisor before implementing any allocation strategy. This document is for informational purposes only and does not constitute investment advice.

---

*Neev — Every rupee has an assignment.*
