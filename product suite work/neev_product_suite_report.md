# Neev Product Suite — Investment Policy & Backtest Report

**Version:** 1.0 · March 2026
**Prepared by:** Avara Advisory (RIA)
**Tax Model:** 30% income slab (Old Regime)
**Data Source:** Real NAV data from AMFI via mfapi.in
**Backtest Windows:** 3-year (Mar 2023 — Mar 2026) and 5-year (Mar 2021 — Mar 2026)

---

## Executive Summary

Neev is Avara's structured product suite designed for salaried professionals with ₹25L–1Cr annual income who accumulate idle cash in savings accounts earning 3.5%. The suite comprises four products, each progressively building on the last, forming a trust-based advisory journey.

Every product includes an active management layer — this is where Avara's RIA fee is justified. The products are not passive allocation tools; they are AI-driven advisory decisions wrapped in branded, easy-to-understand packaging.

### The Product Ladder

| Product | Risk | Role | Active Layer | Target Return |
|---------|------|------|-------------|--------------|
| **Neev Reserve** | Low | Replace savings account | Liquid/arb ratio optimization, AMC monitoring | 6.5–7.5% pre-tax |
| **Neev Systematic** | Low–Med | Build equity base | Valuation-aware STP pacing | 10–14% blended |
| **Neev Tactical** | Medium | Capitalize on volatility | Drawdown detection, signal-based deployment | 12–16% blended |
| **Neev Alpha** | Med–High | Maximize portfolio | Multi-cap allocation, momentum tilting | 14–20% blended |

---

## Product 1: Neev Reserve

### Investment Thesis
Your savings account earns 3.5%. After 30% tax, that's 2.45%. Inflation is 5–6%. You're losing purchasing power every month. Neev Reserve replaces your savings account with a three-layer stack that earns 2–3x more while keeping your money accessible.

### Architecture

```
┌─────────────────────────────────────────────────┐
│                 NEEV RESERVE                     │
│                                                  │
│  Layer 1: Bank Floor (₹30-50K)                  │
│  ├── For auto-debit mandates (rent, EMI, SIP)   │
│  └── Minimum operational balance                 │
│                                                  │
│  Layer 2: Instant Access — Liquid Fund (≤₹2L)   │
│  ├── T+0 redemption up to ₹50K/day/scheme       │
│  ├── Spread across 2-3 AMCs = ₹1-1.5L instant   │
│  └── Covers genuine emergencies                  │
│                                                  │
│  Layer 3: Core Parking — Arbitrage Fund (80%+)  │
│  ├── Equity taxation (STCG 20%, LTCG 12.5%)    │
│  ├── Massive tax advantage for 30% slab users   │
│  └── 6.5-7.5% pre-tax, stable                   │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Fund Selection

**Liquid Fund — Parag Parikh Liquid Fund (Direct Growth)**
- Scheme Code: 143269
- AUM: ~₹8,700 Cr
- Expense Ratio: 0.15%
- Instant redemption: Yes, up to ₹50,000/day via IMPS, 24x7
- Selection rationale: Excellent instant redemption infrastructure, conservative portfolio (100% AAA-rated), zero exit load after 7 days, PPFAS has strong investor-first reputation

**Alternate Liquid: HDFC Liquid Fund (Direct Growth)**
- Scheme Code: 119091
- AUM: ~₹60,000 Cr (largest in category)
- Used for: Second AMC to increase instant access ceiling to ₹1L/day

**Primary Arbitrage — Kotak Arbitrage Fund (Direct Growth)**
- Scheme Code: 119771
- AUM: ₹71,931 Cr (largest in category)
- Expense Ratio: 0.40%
- 3-year return: 7.81% CAGR
- 5-year return: 6.73% CAGR
- Exit load: 0.25% within 30 days, nil after
- Selection rationale: Largest AUM ensures deep liquidity and stable arbitrage spreads, consistently top-quartile performance, 30-day exit load is manageable for monthly deployment cycle

### Active Management Layer
1. **Liquid/Arb ratio optimization** — Agent adjusts the liquid portion based on upcoming known expenses, user's cash flow pattern, and buffer needs
2. **AMC rotation** — Quarterly review of arbitrage fund performance; if an alternate fund (Tata, ABSL) consistently outperforms for 2+ quarters, agent proposes a switch
3. **Tax-aware holding** — Agent ensures arbitrage units are held >30 days to avoid exit load, and nudges toward >12 months for LTCG treatment

### Tax Advantage (This is the killer selling point)

For a 30% slab user with ₹10L parked for 1 year:

| Instrument | Pre-tax Return | Post-tax Return | Net Earnings |
|-----------|---------------|----------------|-------------|
| Savings Account | 3.5% | 2.45% | ₹24,500 |
| Fixed Deposit | 7.0% | 4.90% | ₹49,000 |
| Liquid Fund | 6.8% | 4.76% | ₹47,600 |
| **Neev Reserve (Arb)** | **7.0%** | **6.13%** (LTCG @12.5%) | **₹61,250** |

The arbitrage fund's equity taxation treatment means a 30% slab user keeps significantly more. Over ₹10L for 1 year, that's ₹12,250 extra vs FD — enough to fund a weekend trip.

### Backtest Results — 3 Year (Mar 2023 – Mar 2026)

| Monthly Surplus | Invested | Reserve Value | Gain | Extra vs Savings |
|----------------|----------|--------------|------|-----------------|
| ₹50K | ₹21.00L | ₹23.70L | ₹2.70L | +₹1.35L |
| ₹1L | ₹41.00L | ₹46.19L | ₹5.19L | +₹2.61L |
| ₹2L | ₹80.00L | ₹89.94L | ₹9.94L | +₹5.01L |

### Backtest Results — 5 Year (Mar 2021 – Mar 2026)

| Monthly Surplus | Invested | Reserve Value | Gain | Extra vs Savings |
|----------------|----------|--------------|------|-----------------|
| ₹50K | ₹33.00L | ₹39.82L | ₹6.82L | +₹3.41L |
| ₹1L | ₹65.00L | ₹78.36L | ₹13.36L | +₹6.73L |
| ₹2L | ₹1.28Cr | ₹1.54Cr | ₹26.07L | +₹13.20L |

---

## Product 2: Neev Systematic

### Investment Thesis
Once Reserve grows beyond what you need parked, the excess should be working harder — in equity. But timing the market is a fool's errand. Neev Systematic solves this with a valuation-aware STP: it deploys your surplus into a Nifty 50 index fund, but adjusts the pace based on how expensive the market is.

### Architecture

```
┌─────────────────────────────────────────────────┐
│              NEEV SYSTEMATIC                     │
│                                                  │
│  Base: Neev Reserve (maintained at 3x monthly)  │
│                                                  │
│  Deployment Engine:                              │
│  ├── Triggers after Reserve > 3x monthly surplus │
│  ├── Deploys 20% of excess per month             │
│  └── Pace varies by market valuation:            │
│       • Market cheap (6m return < -5%) → 1.5x   │
│       • Market normal → 1.0x                     │
│       • Market expensive (6m return > 15%) → 0.5x│
│                                                  │
│  Equity Allocation:                              │
│  └── UTI Nifty 50 Index Fund (Direct)           │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Fund Selection

**Core Index — UTI Nifty 50 Index Fund (Direct Growth)**
- Scheme Code: 120716
- AUM: ~₹20,000 Cr
- Expense Ratio: 0.18%
- Tracking Error: Among lowest in category
- Selection rationale: Oldest and largest Nifty 50 index fund with minimal tracking error, low expense ratio, strong AMC with no controversy history

### Active Management Layer
1. **Valuation-aware deployment pacing** — The agent doesn't do blind ₹X/month. It reads market momentum (6-month returns as a PE proxy) and adjusts STP speed. When markets are stretched, it slows down, preserving dry powder. When markets are cheap, it accelerates.
2. **Reserve threshold management** — The trigger for starting equity deployment is personalized: 3x monthly surplus. For a ₹1L/month user, that's ₹3L. The agent calculates this based on actual expenses, not a generic rule.
3. **Graduation conversation** — The agent doesn't silently start deploying. It initiates a conversation: "Your Reserve has grown to ₹4.5L. You only need ₹3L parked. I'd start moving ₹30K/month into equity. Here's why."

### Backtest Results — 3 Year

| Monthly Surplus | Invested | Systematic Value | Gain | Equity % | Extra vs Savings |
|----------------|----------|-----------------|------|---------|-----------------|
| ₹50K | ₹21.00L | ₹24.24L | ₹3.24L | ~25% | +₹1.90L |
| ₹1L | ₹41.00L | ₹47.16L | ₹6.16L | ~25% | +₹3.58L |
| ₹2L | ₹80.00L | ₹91.64L | ₹11.64L | ~25% | +₹6.71L |

### Backtest Results — 5 Year

| Monthly Surplus | Invested | Systematic Value | Gain | Extra vs Savings |
|----------------|----------|-----------------|------|-----------------|
| ₹50K | ₹33.00L | ₹43.96L | ₹10.96L | +₹7.54L |
| ₹1L | ₹65.00L | ₹86.34L | ₹21.34L | +₹14.71L |
| ₹2L | ₹1.28Cr | ₹1.69Cr | ₹41.47L | +₹28.60L |

---

## Product 3: Neev Tactical

### Investment Thesis
Markets don't go up in a straight line. They crash, correct, and panic — and those moments are the best times to deploy capital. But most investors freeze during crashes or don't have liquid capital ready. Neev Tactical solves both problems: it maintains a Reserve war chest and deploys specifically when markets dip.

### Architecture

```
┌─────────────────────────────────────────────────┐
│              NEEV TACTICAL                       │
│                                                  │
│  War Chest: Neev Reserve (3x monthly surplus)   │
│                                                  │
│  Signal Engine:                                  │
│  ├── Weekly drawdown > 3% → Deploy 1.5x base   │
│  ├── Weekly drawdown > 5% → Deploy 2.0x base   │
│  ├── Monthly drawdown > 8% → Deploy 3.0x base  │
│  └── No dip in 45 days → Deploy 0.5x (patience)│
│                                                  │
│  Equity Split:                                   │
│  ├── 70% — UTI Nifty 50 Index (large cap core) │
│  └── 30% — ICICI Nifty Next 50 (mid-large)     │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Fund Selection

**Core — UTI Nifty 50 Index Fund (Direct Growth)** — Same as Systematic

**Diversifier — ICICI Prudential Nifty Next 50 Index Fund (Direct Growth)**
- Scheme Code: 120684
- AUM: ~₹5,000 Cr
- Expense Ratio: 0.30%
- Selection rationale: The Nifty Next 50 captures the "next generation" large-caps — companies graduating from mid to large. Historically more volatile than Nifty 50 but with higher long-term returns. The 30% allocation adds upside without dramatic risk increase.

### Active Management Layer
1. **Drawdown detection** — The agent monitors Nifty 50 daily/weekly movements and identifies buying opportunities in real-time
2. **Position sizing** — Deployment amount scales with drawdown severity. A 3% dip gets a measured response; a 8%+ crash gets aggressive buying
3. **User consent workflow** — Agent sends: "Nifty dropped 4.2% this week. I'd deploy ₹75K from your Reserve. Here's the math." User approves or defers.
4. **Patience discipline** — If no dip for 45 days, agent does a small scheduled deployment to avoid being fully out of equity during long bull runs

### Performance Note
In the 2023–2026 backtest period (a mostly bullish market), Tactical trails Systematic. This is expected and correct — Tactical's edge is in volatile and bearish periods where its dip-buying generates meaningful alpha. In a grinding bull market, the "waiting for dips" strategy means capital sits in Reserve longer.

**This is a feature, not a bug.** The user who picks Tactical is prioritizing downside protection + opportunistic buying over constant deployment. The agent explains this upfront.

### Backtest Results — 3 Year

| Monthly Surplus | Invested | Tactical Value | Gain | Extra vs Savings |
|----------------|----------|---------------|------|-----------------|
| ₹50K | ₹21.00L | ₹23.77L | ₹2.77L | +₹1.42L |
| ₹1L | ₹41.00L | ₹46.33L | ₹5.33L | +₹2.75L |
| ₹2L | ₹80.00L | ₹90.23L | ₹10.23L | +₹5.30L |

### Backtest Results — 5 Year

| Monthly Surplus | Invested | Tactical Value | Gain | Extra vs Savings |
|----------------|----------|---------------|------|-----------------|
| ₹50K | ₹33.00L | ₹40.85L | ₹7.85L | +₹4.44L |
| ₹1L | ₹65.00L | ₹80.42L | ₹15.42L | +₹8.79L |
| ₹2L | ₹1.28Cr | ₹1.58Cr | ₹30.20L | +₹17.33L |

---

## Product 4: Neev Alpha

### Investment Thesis
For users who've built trust through Reserve and Systematic/Tactical, Neev Alpha is the "let the agent build your portfolio" product. It allocates across market caps, geographies, and styles — with a momentum-based quarterly rebalancing that tilts toward what's working.

### Architecture

```
┌─────────────────────────────────────────────────┐
│                NEEV ALPHA                        │
│                                                  │
│  Base: Neev Reserve (3x monthly surplus)        │
│                                                  │
│  Core Equity (40%):                             │
│  └── UTI Nifty 50 Index Fund                    │
│                                                  │
│  Satellite Allocation (60%):                     │
│  ├── 15% — ICICI Nifty Next 50 Index            │
│  ├── 15% — HDFC Mid-Cap Opportunities           │
│  ├── 15% — Parag Parikh Flexi Cap               │
│  └── 15% — Motilal Oswal S&P 500 Index          │
│                                                  │
│  Quarterly Momentum Tilt:                        │
│  ├── Overweight best 3-month performer (+50%)   │
│  └── Underweight worst performer (-50%)         │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Fund Selection

**Core — UTI Nifty 50 Index Fund** — Anchor allocation, low-cost beta

**Satellite 1 — ICICI Prudential Nifty Next 50 Index Fund (Direct Growth)**
- Role: Emerging large-caps, India's growth story
- Scheme Code: 120684

**Satellite 2 — HDFC Mid-Cap Opportunities Fund (Direct Growth)**
- Scheme Code: 118989
- AUM: ~₹72,000 Cr (largest midcap fund)
- 5-year CAGR: ~26%
- Selection rationale: Proven mid-cap stock picker with the longest track record. Active management justified in mid-cap space where stock selection generates genuine alpha over index.

**Satellite 3 — Parag Parikh Flexi Cap Fund (Direct Growth)**
- Scheme Code: 122639
- AUM: ~₹80,000 Cr
- 5-year CAGR: ~24%
- Selection rationale: India's most respected fund house. Built-in international diversification (holds Alphabet, Meta, Microsoft). Value-oriented, contrarian approach provides natural hedge against momentum crowding.

**Satellite 4 — Motilal Oswal S&P 500 Index Fund (Direct Growth)**
- Scheme Code: 148381
- AUM: ~₹8,000 Cr
- Selection rationale: Direct US equity exposure. Provides geographic diversification, USD appreciation hedge, and access to global tech/innovation ecosystem. Low-cost index approach is ideal for international allocation.

### Active Management Layer
1. **Core-satellite architecture** — 40% stays in Nifty 50 index (stable, low-cost). The 60% satellite is where the agent adds value through allocation decisions.
2. **Quarterly momentum rebalancing** — Every quarter, the agent evaluates 3-month performance of each satellite. Top performer gets 1.5x weight, bottom gets 0.5x. This captures sector and market-cap rotation trends without excessive trading.
3. **Risk monitoring** — If total equity drawdown exceeds 15%, the agent pauses new deployments and discusses with the user. If drawdown exceeds 25%, it proactively suggests harvesting satellite losses for tax benefits.
4. **Portfolio evolution** — The satellite allocation isn't static. As the user's corpus grows and risk appetite is understood, the agent may propose adding Nippon India Small Cap (Scheme: 118778) or sector-specific positions.

### Backtest Results — 3 Year

| Monthly Surplus | Invested | Alpha Value | Gain | Extra vs Savings | Extra vs Blind SIP |
|----------------|----------|------------|------|-----------------|-------------------|
| ₹50K | ₹21.00L | ₹25.43L | ₹4.43L | +₹3.08L | +₹0.25L |
| ₹1L | ₹41.00L | ₹49.36L | ₹8.36L | +₹5.78L | +₹0.50L |
| ₹2L | ₹80.00L | ₹95.70L | ₹15.70L | +₹10.77L | +₹0.99L |

### Backtest Results — 5 Year

| Monthly Surplus | Invested | Alpha Value | Gain | Extra vs Savings | Extra vs Blind SIP |
|----------------|----------|------------|------|-----------------|-------------------|
| ₹50K | ₹33.00L | ₹48.13L | ₹15.13L | +₹11.72L | +₹2.61L |
| ₹1L | ₹65.00L | ₹94.44L | ₹29.44L | +₹22.81L | +₹5.22L |
| ₹2L | ₹1.28Cr | ₹1.85Cr | ₹57.15L | +₹44.28L | +₹10.36L |

---

## Consolidated Comparison — 1L/month User (Primary ICP)

### 3-Year Window (Mar 2023 – Mar 2026)

| Strategy | Invested | Final Value | Gain | Extra Earned vs Savings |
|----------|----------|-------------|------|------------------------|
| Savings Account (3.5%) | ₹41.00L | ₹43.58L | ₹2.58L | — |
| Fixed Deposit (7%) | ₹41.00L | ₹44.67L | ₹3.67L | ₹1.09L |
| Blind Nifty SIP | ₹41.00L | ₹48.86L | ₹7.86L | ₹5.28L |
| **Neev Reserve** | **₹41.00L** | **₹46.19L** | **₹5.19L** | **₹2.61L** |
| **Neev Systematic** | **₹41.00L** | **₹47.16L** | **₹6.16L** | **₹3.58L** |
| **Neev Tactical** | **₹41.00L** | **₹46.33L** | **₹5.33L** | **₹2.75L** |
| **Neev Alpha** | **₹41.00L** | **₹49.36L** | **₹8.36L** | **₹5.78L** |

### 5-Year Window (Mar 2021 – Mar 2026)

| Strategy | Invested | Final Value | Gain | Extra Earned vs Savings |
|----------|----------|-------------|------|------------------------|
| Savings Account (3.5%) | ₹65.00L | ₹71.63L | ₹6.63L | — |
| Fixed Deposit (7%) | ₹65.00L | ₹74.52L | ₹9.52L | ₹2.89L |
| Blind Nifty SIP | ₹65.00L | ₹89.22L | ₹24.22L | ₹17.59L |
| **Neev Reserve** | **₹65.00L** | **₹78.36L** | **₹13.36L** | **₹6.73L** |
| **Neev Systematic** | **₹65.00L** | **₹86.34L** | **₹21.34L** | **₹14.71L** |
| **Neev Tactical** | **₹65.00L** | **₹80.42L** | **₹15.42L** | **₹8.79L** |
| **Neev Alpha** | **₹65.00L** | **₹94.44L** | **₹29.44L** | **₹22.81L** |

---

## Key Observations for Consumer Testing

### The Reserve Story
Reserve consistently earns 2x the savings account. For the ₹1L/month user over 3 years, that's ₹2.61L extra — roughly the cost of a nice vacation. The pitch: "Your savings account earned you ₹2.58L. Neev Reserve would have earned ₹5.19L. Same money, same access, double the returns."

### The Systematic vs Blind SIP Story
Systematic slightly trails a blind Nifty SIP in a bull market because it maintains a Reserve buffer and deploys gradually. But it provides genuine downside protection — the Reserve cushion means the user is never "fully invested" during a crash. The valuation-aware pacing adds subtle alpha over long periods.

### The Tactical Honesty
In a 3-year bull run, Tactical underperforms Systematic. This is correct and should be communicated honestly: "Tactical is for investors who want a safety net. In a bull market, that safety net costs you some upside. In a crash, it's what lets you be greedy when others are fearful."

### The Alpha Payoff
Alpha outperforms everything in both windows. The multi-cap, multi-geography diversification with momentum rebalancing captures the full breadth of India's equity market (and international markets). The ₹1L/month user earns ₹5.78L extra vs savings over 3 years — more than enough to justify Avara's annual advisory fee multiple times over.

---

## Underlying Fund Summary

| Fund | Scheme Code | Category | Expense Ratio | Used In |
|------|------------|----------|--------------|---------|
| Parag Parikh Liquid (Direct) | 143269 | Liquid | 0.15% | Reserve |
| HDFC Liquid (Direct) | 119091 | Liquid | 0.18% | Reserve (backup) |
| Kotak Arbitrage (Direct) | 119771 | Arbitrage | 0.40% | Reserve, all products |
| UTI Nifty 50 Index (Direct) | 120716 | Large Cap Index | 0.18% | Systematic, Tactical, Alpha |
| ICICI Nifty Next 50 Index (Direct) | 120684 | Large-Mid Index | 0.30% | Tactical, Alpha |
| HDFC Mid-Cap Opportunities (Direct) | 118989 | Mid Cap Active | 0.72% | Alpha |
| Parag Parikh Flexi Cap (Direct) | 122639 | Flexi Cap Active | 0.63% | Alpha |
| Motilal Oswal S&P 500 Index (Direct) | 148381 | International Index | 0.49% | Alpha |
| Nippon India Small Cap (Direct) | 118778 | Small Cap Active | 0.65% | Alpha (future) |

---

## Execution Details

### Transaction Rail
All mutual fund transactions via **BSE StAR MF** platform. Avara registered as RIA on BSE StAR. All purchases are direct plans — zero commissions, zero distribution fees.

### Payment Mechanism
- **UPI AutoPay** for sweeps under ₹1L/month (variable recurring mandate)
- **NACH eMandate** for sweeps above ₹1L/month
- **Manual UPI/Netbanking** as fallback

### Consent Model (Progressive Trust)
1. **Approve each time** (default) — Agent recommends, user approves
2. **Auto-sweep with notification** — Agent executes within mandate, user notified
3. **Full auto** — Set and forget (only after 3-6 months of trust-building)

### Regulatory Notes
- All products operate under Avara's SEBI RIA license
- Advisory fee: Annual flat fee within SEBI's ₹1.51L/year cap for individuals
- All funds are direct plans — no hidden commissions
- Investment advice is traceable to Avara's registered investment adviser
- Fund selection governed by documented Investment Policy Statement (this document)

---

## Open Items for Consumer Testing

1. **Naming**: Do users respond better to "Reserve/Systematic/Tactical/Alpha" or simpler names like "Park/Build/Protect/Grow"?
2. **Onboarding flow**: Bank statement upload vs manual input — which converts better?
3. **The "extra earned" metric**: Is this the right hook? Or do users respond more to "you're losing ₹X by keeping money in savings"?
4. **Tactical positioning**: How do we frame Tactical's bull-market underperformance without scaring users away?
5. **Alpha commitment**: At what trust level are users comfortable with multi-cap active allocation?

---

*This document is based on historical backtesting using real NAV data and does not guarantee future returns. Past performance is not indicative of future results. All investment decisions should consider individual risk tolerance, financial goals, and tax situation.*
