# Neev v1 — Product Specification

**Status:** v1 Draft · March 2026
**Depends on:** Neev Product Thesis, Product Principles (Agent-First Financial OS), Design Explorations
**Platform:** React Web (PWA) · Mobile-first
**Pricing:** Free (top-of-funnel for Avara advisory conversion)

---

## 1. Product Overview

Neev is Avara's first standalone product — a conversational idle cash deployment tool for salaried professionals earning ₹25L–1Cr annually. It identifies idle cash in the user's bank account each month and moves it to work through a brief, personalised conversation with an AI agent.

Neev is free. Revenue comes from building the trust relationship that converts users into Avara's paid advisory clients over 6–12 months.

### 1.1 Core Loop

Every month, after salary lands and bills clear:

1. **Detect** — Agent detects salary credit via Account Aggregator
2. **Wait** — Major outflows clear (rent, EMIs, SIPs, utilities)
3. **Calculate** — Agent determines settled balance, deducts safety buffer, identifies idle amount
4. **Converse** — Agent initiates a personalised sweep conversation
5. **Execute** — User approves, money moves to Neev Reserve via BSE StAR

### 1.2 Branded Products

Users interact with branded products, not mutual fund names. The underlying instruments are implementation details managed by the AI agent.

**The Neev Framework: Park → Deploy → Diversify**

```
Income → Expenses → Bank Floor (₹30K) → NEEV RESERVE (park)
                                              |
                                     NEEV MARKET ENTRY (deploy)
                                              |
                                  NEEV ACCELERATE or NAVIGATE (diversify)
```

| Layer | Product | Role | Underlying | Target Return | Risk | When Available |
|---|---|---|---|---|---|---|
| 1 | **Neev Reserve** | Park surplus cash safely. Might need it in 1–12 months. | 20% liquid (Parag Parikh Liquid, capped ₹2L) + 80% arbitrage (Kotak Equity Arbitrage). Monthly rebalancing. Direct plans. | 7.20% XIRR | Zero drawdown | From first sweep |
| 2 | **Neev Market Entry** | Deploy into large-cap equity. PE-aware, systematic. | PE-aware STP from Reserve into UTI Nifty 50 Index Fund. 20% of excess deployed monthly. PE-based pace modulation (2x at PE<16, 0.5x at PE>22). Direct plan. | 10.53% XIRR | -2.47% max DD | Agent-initiated when Reserve exceeds 3x monthly surplus |
| 3a | **Neev Accelerate** | Diversified growth with curated active funds. | 5-fund portfolio: 40% core Nifty 50 + 4×15% satellites (ICICI Nifty Next 50, HDFC Midcap Opportunities, Parag Parikh Flexi Cap, Motilal Oswal S&P 500). Quarterly momentum rebalancing. 25% monthly deployment. Direct plans. | 14.20% XIRR | -6.25% max DD | Agent-initiated choice alongside Navigate, after Market Entry is established |
| 3b | **Neev Navigate** | Diversified growth with pure index funds. Default recommendation. | Same system as Accelerate but all index funds: 40% Nifty 50 + 4×15% satellites (ICICI Nifty Next 50, 2× Motilal Oswal Nifty Midcap 150, Motilal Oswal S&P 500). Quarterly momentum rebalancing. Direct plans. | 13.66% XIRR | -6.39% max DD | Agent-initiated choice alongside Accelerate, after Market Entry is established |

```
+---------------------------------------------------------+
|               NEEV ACCELERATE (14.20%)                  |
|     Curated active funds + momentum rebalancing         |
|    - - - - - - - - - OR - - - - - - - - - -            |
|               NEEV NAVIGATE (13.66%)                    |
|       Pure index funds + same momentum system           |
+---------------------------------------------------------+
|             NEEV MARKET ENTRY (10.53%)                  |
|       PE-aware STP into Nifty 50 from Reserve           |
+---------------------------------------------------------+
|               NEEV RESERVE (7.20%)                      |
|          20% Liquid + 80% Arbitrage                     |
+---------------------------------------------------------+
|              BANK FLOOR (30,000)                        |
|            Daily expenses buffer                        |
+---------------------------------------------------------+
```

Products are revealed progressively through agent conversations only. The user cannot browse locked products. When the agent determines readiness, it initiates the conversation; the user agrees; the product appears on the Invest tab. Accelerate and Navigate are presented as a **choice** — the agent presents an honest comparison and the user picks their preference. Navigate is the default recommendation for most investors.

### 1.3 Performance Summary (Backtested)

*5-Year backtest (Mar 2021 – Mar 2026) · 1L/month moderate profile · DIY (no advisory fees)*

| Product | XIRR | Post-Tax Gain | Extra vs Savings | Max Drawdown | Sharpe | Volatility |
|---|---|---|---|---|---|---|
| Savings Account | 3.66% | 4.48L | — | 0.00% | N/A | 0.04% |
| Fixed Deposit | 7.44% | 9.49L | 5.00L | 0.00% | N/A | 0.08% |
| Blind SIP (Nifty) | 11.95% | 19.79L | 15.30L | -4.40% | 0.47 | 12.73% |
| **Neev Reserve** | **7.20%** | **11.59L** | **7.11L** | **0.00%** | **2.08** | **0.58%** |
| **Neev Market Entry** | **10.53%** | **17.15L** | **12.67L** | **-2.47%** | **0.56** | **8.03%** |
| **Neev Accelerate** | **14.20%** | **24.16L** | **19.67L** | **-6.25%** | **0.89** | **9.23%** |
| **Neev Navigate** | **13.66%** | **23.08L** | **18.60L** | **-6.39%** | **0.81** | **9.44%** |

**With advisory fees** (5-year, 1L/month, extra vs savings):

| Product | DIY (₹0) | Starter (₹25K/yr) | Typical (₹50K/yr) |
|---|---|---|---|
| Reserve | 7.11L | 5.86L | 4.61L |
| Market Entry | 12.67L | 11.42L | 10.17L |
| Accelerate | 19.67L | 18.42L | 17.17L |
| Navigate | 18.60L | 17.35L | 16.10L |

**Key insight — where does outperformance come from?** Both Accelerate and Navigate beat Blind SIP by a wide margin. Of Accelerate's +225 bps over Blind SIP: 171 bps (76%) comes from the shared system (allocation + momentum + Reserve cushion), and only 54 bps (24%) comes from active fund selection. Navigate captures 96% of Accelerate's returns with zero fund-picking risk.

**Methodology:** All backtests use real mutual fund NAV data from AMFI via mfapi.in. Calendar-month stepping on the 7th. Returns calculated as XIRR. Post-tax using FY 2024-25 rates (equity LTCG 12.5% above ₹1.25L shared exemption, STCG 20%, debt 30% slab). See strategy note for full methodology and stress test results.

---

## 2. Visual Design Language

### 2.1 Aesthetic Direction

Aspirational luxury. The design borrows from private banking and wealth management — making middle-class salaried professionals feel they're receiving a service usually reserved for the wealthy. The agent is a private concierge, not a chatbot.

### 2.2 Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-dark` | `#1C1915` | Primary backgrounds, headers |
| `--color-dark-mid` | `#2C2824` | Card backgrounds on dark surfaces |
| `--color-muted` | `#8C7B65` | Secondary text, icons |
| `--color-light` | `#F9F7F2` | Primary backgrounds (light surfaces) |
| `--color-bone` | `#E5E0D5` | Borders, dividers |
| `--color-gold-light` | `#F0D588` | Gold gradient start |
| `--color-gold` | `#D4AF37` | Gold gradient midpoint, accents |
| `--color-gold-dark` | `#B8860B` | Gold gradient end |
| `--color-success` | `#4CAF50` | Positive returns, confirmations |
| `--color-error` | `#E57373` | Errors, negative values |

### 2.3 Gold Gradient

The signature visual element. Used for hero metrics, CTAs, and accent elements.

```css
background: linear-gradient(135deg, #F0D588, #D4AF37, #B8860B);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### 2.4 Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display | Cormorant Garamond | 300, 500, 600 | Hero numbers, product names, headings |
| Body | Manrope | 400, 500, 600 | Body text, labels, inputs, agent messages |

### 2.5 Surface Treatment

- **Dark header** with textured grain overlay (SVG noise filter, 5% opacity)
- **Glass effects** via `backdrop-filter: blur(12px)` on navigation bar, overlays
- **Card shadows** — `0 8px 30px rgba(0,0,0,0.04)` for light surface cards
- **Rounded corners** — 40px radius on dark header bottom edge, 16px on cards, 12px on buttons
- **Content layering** — Light content cards overlap the dark header by negative margin, creating depth

### 2.6 Motion Design

Rich motion is a core part of the premium experience. All animations specified below are required for v1.

| Element | Animation | Specification |
|---|---|---|
| Agent message text | Typewriter reveal | Character-by-character, 30ms per character, gold blinking cursor (`|`), cursor blinks at 530ms interval |
| Conversational overlay | Spring transition | `cubic-bezier(0.16, 1, 0.3, 1)`, 400ms duration, slides up from input bar |
| Overlay dismiss | Ease out | `cubic-bezier(0.33, 0, 0.67, 0)`, 300ms, slides down |
| Card entry | Fade + slide up | `opacity: 0 → 1`, `translateY(20px → 0)`, 350ms, staggered by 80ms per card |
| Loading states | Shimmer | Animated gradient sweep left-to-right, `--color-bone` to `--color-light`, 1.5s loop |
| Alert/milestone pulse | Gold pulse | Scale 1 → 1.05, opacity gold gradient, 2s ease-in-out infinite |
| Number updates | Count-up | Animated number interpolation over 800ms, `ease-out` |
| Tab bar transitions | Crossfade | 200ms opacity crossfade between tab content |
| Chat overlay → tabs recede | Tabs shrink | Tab bar height reduces by 40%, labels fade to 0 opacity, icons shrink to 80%, 300ms spring |

---

## 3. Navigation Architecture

### 3.1 Tab Bar

Four tabs in a frosted-glass floating pill at the bottom of the screen:

```
[ Home ]  [ Invest ]  [ Activity ]  [ You ]
```

- Active tab indicated by a gold dot below the icon
- Tab bar uses `backdrop-filter: blur(12px)` with semi-transparent background
- Tab bar is always visible unless the conversational overlay is expanded (then it recedes)

### 3.2 Persistent Input Bar

A text input field sits between the content area and the tab bar on every tab. It is always visible.

```
┌─────────────────────────────────────┐
│  [Content area for active tab]      │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  💬 Ask Neev anything...        [→] │  ← Persistent input bar
├─────────────────────────────────────┤
│  🏠 Home  📊 Invest  ⏱ Activity  👤 You  │  ← Tab bar
└─────────────────────────────────────┘
```

- Tapping the input bar or typing expands the conversational overlay upward
- The input bar transforms into the conversation's input field (no duplication)

### 3.3 Conversational Overlay

When triggered by tapping the input bar, typing, or an agent-initiated notification:

1. Content area transitions to the conversation thread (spring animation, slides up)
2. Tab bar recedes — height shrinks 40%, labels fade out, icons shrink to 80%
3. Conversation thread shows the current exchange + recent history
4. Agent responses render as structured UI cards within the thread (see §8 Component Registry)
5. User types in the input bar at the bottom

**Escape hatches:**
- Tapping a receded tab icon switches to that tab and collapses the overlay
- Swiping down on the conversation thread collapses the overlay
- A subtle `✕` button in the top-right of the overlay
- If the agent conversation reaches a natural conclusion, the overlay auto-collapses after 3 seconds of inactivity with a "Done" indicator

**State preservation:** When the user switches tabs during a conversation, the conversation state is preserved. Returning to the conversation (via input bar or notification) restores the thread.

---

## 4. Home Tab

The primary surface. Composed of a stable portfolio section and a dynamic agent card stack.

### 4.1 Layout (top to bottom)

```
┌─────────────────────────────────────┐
│  [Dark header with grain texture]   │
│                                     │
│  ₹18,400                           │  ← Hero: Extra Earned (gold gradient, Cormorant 36px)
│  extra earned over savings account  │  ← Subtitle (Manrope 14px, muted)
│                                     │
│  Total Neev Balance: ₹12,40,000    │  ← Secondary metric (Manrope 16px, white)
│  ↑ 7.2% · ₹540 today              │  ← Yield + daily accrual (Manrope 13px, gold)
│                                     │
│  ┌─────────────────────────────┐    │
│  │ [Portfolio summary cards]   │    │  ← Overlaps dark header
│  │ Neev Reserve    ₹12.4L     │    │
│  │ +7.2% · Arbitrage/Liquid   │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ☀️ Morning Brief            │    │  ← Agent card stack (3–5 cards)
│  │ Your Reserve earned ₹540    │    │
│  │ overnight. All is well.     │    │
│  │ [Show work ▾]               │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🎯 Milestone                │    │
│  │ You crossed ₹15K extra      │    │
│  │ earned! That's a round trip │    │
│  │ to Goa.                     │    │
│  └─────────────────────────────┘    │
│                                     │
│  💬 Ask Neev anything...        [→] │
│  🏠  📊  ⏱  👤                      │
└─────────────────────────────────────┘
```

### 4.2 Hero: Extra Earned Delta

The single most prominent metric on the home screen. Displayed in Cormorant Garamond with the gold gradient.

- **Calculation:** `(Actual returns from Neev products) − (What the same amount would have earned at 3.5% in a savings account over the same period)`
- **Updates:** Recalculated daily
- **First-time user (no sweep yet):** Shows `₹0 extra earned` with a subtitle: "Make your first sweep to start earning more"
- **Count-up animation** on each app open

### 4.3 Portfolio Summary

Below the hero metric. Shows each active Neev product as a compact card.

- Only active products appear (Reserve from day 1; Market Entry and Accelerate/Navigate only after agent-initiated activation)
- Each card shows: product name, balance (₹), yield (%), product type tag
- Tapping a product card navigates to its detail page on the Invest tab

### 4.4 Agent Card Stack

Below the portfolio summary. A scrollable stack of 3–5 agent-composed cards. These are the proactive communications.

**Card types that appear here:**

| Card Type | Trigger | Lifespan |
|---|---|---|
| Morning Brief | Daily, on first app open | 24 hours, then archived to Activity |
| Yield Accrual | Daily | 24 hours |
| Sweep Recommendation | Monthly, when settled state reached | Until acted on or dismissed |
| Milestone Celebration | When threshold crossed | 48 hours |
| Market Context | On significant market movement affecting holdings | 24 hours |
| Sweep Confirmation | After successful sweep | 72 hours |

Cards have a dismiss action (swipe right). Dismissed and expired cards move to the Activity tab.

Every card has an expandable "Show work" section (see §4.5).

### 4.5 Show Work

Every recommendation or insight card rendered by the agent includes a collapsible "Show work" toggle at the bottom.

**Collapsed state:** A single line — `Show work ▾` — in muted text.

**Expanded state reveals:**
- **Data sources used** — "Bank balance from SBI via Account Aggregator, refreshed 2h ago"
- **Calculation breakdown** — Step-by-step math (e.g., "Balance ₹8.2L − Buffer ₹2.0L − Upcoming ₹0.5L = Sweep ₹5.7L")
- **Assumptions** — "Assumed no major expenses beyond what you've told me"
- **Instrument rationale** — "Recommending arbitrage over liquid because your 30% tax slab makes equity taxation more efficient"
- **Accountability marker** — "Advice by [Advisor Name], SEBI RIA Reg. No. INAxxxxxx"

---

## 5. Invest Tab

Dedicated to exploring the user's active Neev products in detail.

### 5.1 Progressive Product Reveal

The Invest tab only shows products the user has activated through an agent conversation. This is not a product marketplace — the agent decides when to suggest progression.

**Day 1 (no sweep yet):** Empty state with a message — "Your investments will appear here after your first sweep."

**After first sweep:** Neev Reserve card only.

**After agent suggests Market Entry:** Neev Reserve + Neev Market Entry cards.

**After agent suggests diversification:** Neev Reserve + Neev Market Entry + (Neev Accelerate OR Neev Navigate). The agent presents the Accelerate vs Navigate choice as a conversation with an honest comparison card — the user picks their preference. Navigate is the default recommendation.

### 5.2 Product Detail Page

Tapping any product card opens a full-screen detail page:

```
┌─────────────────────────────────────┐
│  ← Back          Neev Reserve       │
│                                     │
│  ₹12,40,000                        │  ← Balance (Cormorant, gold gradient)
│  +7.2% p.a. · +₹540 today          │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ [Performance Chart - SVG]   │    │  ← Gold gradient line chart
│  │ 1M  3M  6M  1Y  ALL        │    │  ← Time period selector
│  └─────────────────────────────┘    │
│                                     │
│  Earnings Projector                 │
│  ┌─────────────────────────────┐    │
│  │ ₹5L ━━━━━●━━━━━━━ ₹20L     │    │  ← Range slider
│  │ If you add ₹8L more:       │    │
│  │ Est. annual return: ₹57,600 │    │
│  └─────────────────────────────┘    │
│                                     │
│  About This Product                 │
│  ┌─────────────────────────────┐    │
│  │ Risk: Moderate  [██░░░]     │    │
│  │ Liquidity: T+1 to T+3      │    │
│  │ Min. Investment: ₹5,000     │    │
│  │ Tax treatment: Equity       │    │
│  └─────────────────────────────┘    │
│                                     │
│  Transaction History                │
│  [List of recent transactions]      │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ [Withdraw]    [Add More]    │    │  ← Sticky bottom CTA bar
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Product-specific detail page content:**

- **Reserve:** Fund allocation chart (20% liquid / 80% arbitrage split), liquid cap indicator (current vs ₹2L cap), monthly rebalancing schedule, zero drawdown badge, tax treatment comparison (equity LTCG vs FD slab taxation)
- **Market Entry:** PE-based pacing table (current pace indicator: 0.5x/1.0x/1.5x/2.0x based on Nifty PE), current Nifty PE indicator with historical context, deployment progress (% of Reserve deployed into equity over time), Reserve→Equity flow visualization
- **Accelerate:** 5-fund portfolio breakdown with core/satellite visualization, last momentum rebalancing date, current satellite tilt weights (0.5x–1.5x per fund), fund-level performance attribution
- **Navigate:** Same layout as Accelerate but with index fund names, "Default Recommendation" badge, lower expense ratio highlight vs Accelerate

### 5.3 Withdraw Flow (Self-Serve Path)

Accessible via the "Withdraw" button on any product detail page.

1. **Amount entry** — Keypad with current balance shown. "How much do you need?"
2. **Bank selection** — If multiple banks have mandates, select destination
3. **Impact card** — Agent renders: reduced balance, effect on projected extra earnings, tax implications (if any for Market Entry / Accelerate / Navigate redemptions), estimated credit timeline (T+1 for liquid, T+3 for arbitrage, T+5 for equity)
4. **Confirm** — Single tap. "Withdraw ₹2,00,000 to SBI ****1234"
5. **Success** — Confirmation with expected credit date

The agent also monitors withdrawals and adjusts future sweep recommendations: "Noted — I'll factor this in next month."

### 5.4 Withdraw Flow (Conversational Path)

User types "I need ₹2L back" or similar in the input bar. The agent renders a RedemptionCard in the conversation with the same information as the self-serve flow — amount, source product, impact analysis, tax implications, credit timeline — plus a confirm button inline.

---

## 6. Activity Tab

A combined chronological feed of transactions and archived agent cards.

### 6.1 Layout

```
┌─────────────────────────────────────┐
│  Activity                           │
│                                     │
│  This Month: +₹3,240               │  ← Monthly performance summary
│  ┌─────────────────────────────┐    │
│  │ [Sparkline chart - gold]    │    │  ← Mini performance chart
│  └─────────────────────────────┘    │
│                                     │
│  Today                              │
│  ┌─────────────────────────────┐    │
│  │ ⬆ Sweep to Reserve  ₹1.3L  │    │
│  │ Via UPI AutoPay · 10:30 AM  │    │
│  │ Status: COMPLETED ✓         │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ ☀ Morning Brief (archived) │    │
│  │ Reserve earned ₹540...      │    │
│  └─────────────────────────────┘    │
│                                     │
│  Yesterday                          │
│  ┌─────────────────────────────┐    │
│  │ 💰 Yield Accrual    +₹540  │    │
│  │ Neev Reserve · Auto         │    │
│  │ Status: REINVESTED          │    │
│  └─────────────────────────────┘    │
│                                     │
│  Last Week                          │
│  ...                                │
└─────────────────────────────────────┘
```

### 6.2 Timeline Design

- Vertical gold gradient line (`--color-gold-light` to `--color-bone`) connecting items within a date group
- Date group headers in Manrope 13px, uppercase, muted
- Each item has an icon (color-coded by type), title, amount, timestamp, and status badge
- Transaction items: sweep, withdrawal, STP transfer, yield reinvestment
- Archived agent cards: morning briefs, milestones, market context (shown in a slightly muted style with an "archived" indicator)

### 6.3 Status Badges

| Status | Color | Usage |
|---|---|---|
| COMPLETED | `--color-success` | Successful transactions |
| PENDING | `--color-gold` | In-progress transactions |
| REINVESTED | `--color-gold` | Yield auto-reinvested |
| FAILED | `--color-error` | Failed transactions |
| ARCHIVED | `--color-muted` | Expired agent cards |

---

## 7. You Tab

The stable layer. The user's financial identity, control center, and trust anchor.

### 7.1 Layout

```
┌─────────────────────────────────────┐
│  [Dark header]                      │
│                                     │
│  Arjun Kapoor                       │
│  arjun@email.com · +91 98xxx xxxxx │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Connected Accounts           │    │
│  │ SBI ****1234  ✓ Active       │    │
│  │ HDFC ****5678  ✓ Active      │    │
│  │ [+ Connect Account]          │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ About Me                     │    │
│  │ Salaried · MNC Tech          │    │
│  │ Monthly take-home: ~₹1.8L    │    │
│  │ Salary credits: 1st of month │    │
│  │ Major outflows: ₹45K rent,   │    │
│  │   ₹15K SIPs, ₹12K EMI       │    │
│  │ [Edit]                       │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Preferences                  │    │
│  │ Sweep consent: Approve each  │    │
│  │ Notifications: Enabled       │    │
│  │ [Edit]                       │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🔒 Vault                    │    │  ← Biometric-gated
│  │ Advisory docs · 3 items      │    │
│  │ [Tap to unlock]              │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Advisory Relationship        │    │
│  │ Advisor: [Name]              │    │
│  │ SEBI RIA: INAxxxxxx          │    │
│  │ Plan: Neev Free              │    │
│  └─────────────────────────────┘    │
│                                     │
│  [Log out]                          │
└─────────────────────────────────────┘
```

### 7.2 Connected Accounts

- Lists all bank accounts connected via Account Aggregator
- Each shows: bank name, masked account number, connection status, last refresh time
- "Connect Account" triggers the AA consent flow
- Disconnect option per account (with agent confirmation: "If I lose access to SBI, I won't be able to track your salary credit automatically")

### 7.3 About Me

What the agent knows about the user. Populated during onboarding and refined over time.

- Occupation type, employer category
- Monthly take-home (approximate)
- Salary credit date
- Major monthly outflows (rent, SIPs, EMIs, utilities)
- Upcoming large expenses (if any flagged)
- All fields are user-editable

### 7.4 Preferences

- **Sweep consent tier:**
  - `Approve each time` (default) — Agent recommends, user taps to approve
  - `Auto-sweep with notification` — Agent sweeps within mandate limit, user gets notification, can undo within 24 hours
  - `Full auto` — Agent manages without intervention (unlocked after 3+ months of consistent sweeping)
- **Notification preferences** — Morning briefs on/off, milestone celebrations on/off, market context on/off
- **Detail level** — Concise (one-line agent messages) / Standard / Detailed (always expanded show-work)

### 7.5 Vault (Biometric-Gated)

Tapping the Vault section triggers device biometric authentication (fingerprint / face ID via WebAuthn API).

**Contents once unlocked:**
- **Advisory agreement** — The signed RIA agreement with Avara
- **SEBI RIA credentials** — Advisor's name, registration number, validity
- **Consent records** — AA consent details, mandate details, consent history
- **Show-work audit trail** — Complete history of all recommendations with full reasoning chains, data sources, and calculations. Each entry timestamped and linked to the original card.
- **Tax documents** — Capital gains statements, yearly summary (generated by Neev)

---

## 8. Onboarding Flow

Value before authentication. The user sees personalised financial insight before signing up.

### 8.1 Step 1: The Hook (0–30 seconds)

**Screen: No auth required.**

The agent is already present with a warm greeting:

```
┌─────────────────────────────────────┐
│                                     │
│  [Neev logo - minimal]             │
│                                     │
│  Hey — how much cash is sitting     │  ← Typewriter animation
│  in your bank account right now?    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ₹ [____________]            │    │  ← Amount input field
│  │                              │    │
│  │ [Show me what I'm missing →] │    │  ← Gold CTA
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

User enters an approximate number. Instantly, the agent renders:

```
┌─────────────────────────────────────┐
│  OpportunityCostCard                │
│                                     │
│  Your ₹6.2L at 3.5%                │
│  earns ₹21,700/year                │
│                                     │
│  In Neev Reserve at ~7%             │
│  earns ₹43,400/year                │
│                                     │
│  You're leaving ₹21,700            │  ← Gold gradient, large
│  on the table every year.          │
│                                     │
│  [Show work ▾]                      │
│                                     │
│  "₹6L just sitting there —         │  ← Agent warmth line
│   you're not alone, almost          │
│   everyone does this."              │
│                                     │
│  [Let's fix this →]                 │  ← Gold CTA to Step 2
└─────────────────────────────────────┘
```

### 8.2 Step 2: The Picture (30–120 seconds)

**Screen: Still no auth required.**

Short conversational sequence. Each question is a tappable card in the conversation thread.

**Question 1: Monthly salary**
```
Agent: "What's your approximate monthly take-home?"
[Slider: ₹50K ——————●—— ₹5L]
```

**Question 2: Salary credit date**
```
Agent: "When does salary typically land?"
[ Last day ]  [ 1st ]  [ 2nd ]  [ Other ]
```

**Question 3: Major outflows**
```
Agent: "What are your big monthly outflows?"
┌──────────────────────┐
│ Rent     ₹[_______]  │
│ SIPs     ₹[_______]  │
│ EMIs     ₹[_______]  │
│ Other    ₹[_______]  │
│ [+ Add another]       │
└──────────────────────┘
```

**Question 4: Upcoming expenses (optional)**
```
Agent: "Anything big coming up in the next 3 months?"
[ Travel ]  [ Purchase ]  [ Wedding ]  [ Nothing ]
```

### 8.3 Step 3: The Plan (120–180 seconds)

Agent renders the DeploymentPlanCard — a structured, personalised plan:

```
┌─────────────────────────────────────┐
│  DeploymentPlanCard                 │
│                                     │
│  Here's what I'd do:               │
│                                     │
│  Keep in bank          ₹1,30,000   │  ← Safety buffer
│  ├ Rent (next month)   ₹45,000     │
│  ├ SIPs                ₹15,000     │
│  ├ EMI                 ₹12,000     │
│  ├ Utilities & misc    ₹28,000     │
│  └ Bank floor          ₹30,000     │  ← Daily expenses buffer
│                                     │
│  Sweep to Neev Reserve ₹4,20,000   │  ← Gold accent
│  Earning ~7% vs 3.5%               │
│                                     │
│  ─────────────────────────────────  │
│  Your extra earnings                │
│  this year: ~₹14,700               │  ← Gold gradient, large
│                                     │
│  [Show work ▾]                      │
│                                     │
│  [Set this up →]                    │  ← Gold CTA to Step 4
└─────────────────────────────────────┘
```

This is the conversion moment. The user sees exactly what will happen with their money.

### 8.4 Step 4: The Commitment

**Authentication + compliance setup. This is where auth happens.**

The agent guides the user conversationally through each step:

```
Agent: "Let's get you set up. This takes about 3 minutes."
```

**Sub-step 4a: Phone + OTP**
```
Agent: "First, your phone number."
┌─────────────────────────────┐
│ +91 [__________]   [Send →] │
└─────────────────────────────┘

Agent: "Got it. Enter the OTP I just sent."
┌─────────────────────────────┐
│ [_] [_] [_] [_] [_] [_]     │
└─────────────────────────────┘
```

**Sub-step 4b: KYC (BSE StAR registration)**

Agent walks through each field as a conversational card:

```
Agent: "Now, your PAN — I need this for investment registration."
┌─────────────────────────────┐
│ PAN: [__________]            │
│ [Verify →]                   │
└─────────────────────────────┘

Agent: "PAN verified ✓ — [User's Name]. Quick Aadhaar eKYC next."
┌─────────────────────────────┐
│ Aadhaar: [____________]      │
│ [Verify via DigiLocker →]    │
└─────────────────────────────┘

Agent: "KYC complete ✓. Now your bank account for sweeps."
┌─────────────────────────────┐
│ Bank: [Select bank ▾]        │
│ Account: [______________]    │
│ IFSC: [___________]          │
│ [Verify →]                   │
└─────────────────────────────┘
```

**Sub-step 4c: Account Aggregator Connection**

Positioned as enabling the agent's core capability:

```
Agent: "Let me see your bank transactions so I can calculate
your idle cash automatically every month — instead of asking you."

┌─────────────────────────────────────┐
│  AAConnectionCard                   │
│                                     │
│  Connect via Account Aggregator     │
│                                     │
│  What I'll see:                     │
│  ✓ Bank balance                     │
│  ✓ Salary credits                   │
│  ✓ Major outflows (rent, EMIs)      │
│                                     │
│  What I won't see:                  │
│  ✗ Individual purchases             │
│  ✗ UPI transaction details          │
│                                     │
│  You can disconnect anytime from    │
│  the You tab.                       │
│                                     │
│  [Connect Banks →]                  │
│  [Skip for now]                     │
└─────────────────────────────────────┘
```

Tapping "Connect Banks" opens the AA FIP selection flow (redirects to AA app/SDK).

**Sub-step 4d: Payment Mandate Setup**

The agent determines the appropriate mandate type based on the user's planned sweep amount:

```
Agent: "Last step — I need permission to move money from your bank
when you approve a sweep."
```

**If estimated monthly sweep < ₹1L:**
```
┌─────────────────────────────────────┐
│  MandateSetupCard                   │
│                                     │
│  UPI AutoPay Mandate                │
│                                     │
│  Maximum per month: ₹1,00,000      │
│  I'll only debit what you approve.  │
│  Each sweep shows as a notification │
│  before it happens.                 │
│                                     │
│  Bank: SBI ****1234                 │
│  UPI ID: [________@upi]            │
│                                     │
│  [Set up UPI AutoPay →]            │
└─────────────────────────────────────┘
```

**If estimated monthly sweep ≥ ₹1L:**
```
┌─────────────────────────────────────┐
│  MandateSetupCard                   │
│                                     │
│  NACH eMandate                      │
│                                     │
│  Your sweeps might exceed ₹1L/month │
│  — NACH handles larger amounts.     │
│                                     │
│  Maximum per month: ₹5,00,000      │
│  Takes 2-3 days to activate.        │
│  I'll only debit what you approve.  │
│                                     │
│  Bank: SBI ****1234                 │
│                                     │
│  [Set up NACH Mandate →]           │
│  [Use UPI AutoPay instead (₹1L cap)]│
└─────────────────────────────────────┘
```

**Multi-bank mandate:** If the user has connected multiple bank accounts via AA, the agent asks:

```
Agent: "You have accounts at SBI and HDFC. Want to set up
sweep mandates on both? I'll recommend which one to sweep
from each month based on where your idle cash sits."

[ Set up both ]  [ Just SBI ]  [ Just HDFC ]
```

**Sub-step 4e: Completion**

```
Agent: "All set ✓. Your first sweep recommendation will come
around the 7th-10th — after your salary lands and bills clear."

"For now, here's your Neev home."

[transition to Home tab with the portfolio in zero-state,
 Extra Earned showing ₹0, and a welcome agent card]
```

### 8.5 Post-Onboarding Zero State

The Home tab after onboarding but before the first sweep:

- Extra Earned hero: `₹0 extra earned` with subtitle "Make your first sweep to start earning more"
- Portfolio summary: Empty, with a note "Your first sweep will appear here"
- Agent card stack: Single welcome card — "I'm watching your bank account. When your salary lands and bills clear, I'll have a plan ready for you."

---

## 9. Monthly Sweep Loop

The core product rhythm. Happens every month for every active user.

### 9.1 Trigger Sequence

The agent monitors AA data for a sequence:

1. **Salary credit detected** — Amount matching the user's known salary (±10%) credited to any connected account
2. **Major outflows observed** — Rent, SIPs, EMIs clear (matched against user's declared outflows + AA transaction patterns)
3. **Settled state reached** — No major debits for 48 hours. Account balance is stable.

Typical timing: 7th–10th of the month.

### 9.2 Agent Initiates Conversation

The agent sends a push notification and renders a card on the Home agent stack:

**Push notification:** "Your account has settled for the month. I have a sweep plan ready."

**On Home (agent card stack):**

```
┌─────────────────────────────────────┐
│  SweepRecommendationCard            │
│                                     │
│  March Sweep                        │
│                                     │
│  Bank balance       ₹3,85,000      │
│  − Known outflows   ₹1,20,000      │
│  − Upcoming:                        │
│    Car service      ₹15,000        │
│  − Bank floor       ₹30,000        │  ← Daily expenses
│  ─────────────────────────────────  │
│  Sweep to Reserve   ₹2,20,000      │  ← Gold accent
│                                     │
│  Projected extra    ₹1,320/month   │
│  earnings vs bank                   │
│                                     │
│  [Show work ▾]                      │
│                                     │
│  [Sweep it →]        [Not now]      │
│                                     │
│  "Consistent month. Sweep when      │  ← Agent voice line
│   you're ready."                    │
└─────────────────────────────────────┘
```

### 9.3 Standard Month Flow

**If user taps "Sweep it":**
1. Agent confirms: "Sweeping ₹2,20,000 to Neev Reserve via UPI AutoPay."
2. Transaction initiates via BSE StAR — lumpsum purchase order placed
3. UPI AutoPay debits the user's bank (or NACH for larger amounts)
4. Money goes directly to AMC (Avara never touches client money)
5. Success card rendered: "Done ✓ ₹2,20,000 swept to Reserve. Expected NAV allocation: tomorrow."
6. Activity tab updates with the transaction

**If user taps "Not now":**
Agent responds conversationally: "No problem. I'll check in again in a few days — or whenever you're ready, just tell me."

**If user asks questions first:**
- "What about my car service next week?" → Agent adjusts buffer
- "Why not more into equity?" → Agent explains Reserve vs Market Entry progression
- "Markets seem high, should I wait?" → Agent provides context without pushing

### 9.4 Non-Standard Month Variants

**Bonus month:**
```
Agent: "Your account got a ₹4L credit beyond your usual salary.
Looks like a bonus. Here's what I'd suggest:"

┌─────────────────────────────────────┐
│  BonusSweepCard                     │
│                                     │
│  Bonus detected:    ₹4,00,000      │
│  Regular surplus:   ₹1,80,000      │
│  Total available:   ₹5,80,000      │
│                                     │
│  Recommendation:                    │
│  → ₹3,00,000 to Reserve (parking)  │
│  → ₹2,80,000 to Reserve (equity    │
│    deployment when you're ready)    │
│                                     │
│  [Show work ▾]                      │
│  [Sweep as recommended →]           │
│  [Let's discuss]                    │
└─────────────────────────────────────┘
```

**Large expense flagged:**
```
Agent: "I see you mentioned a ₹3L purchase coming up. I've
adjusted this month's plan:"

┌─────────────────────────────────────┐
│  AdjustedSweepCard                  │
│                                     │
│  Bank balance       ₹4,20,000      │
│  − Safety buffer    ₹1,50,000      │
│  − Large purchase   ₹3,00,000      │
│  ─────────────────────────────────  │
│  Sweep to Reserve   ₹0             │
│                                     │
│  "Skipping this month makes sense.  │
│   Let's catch up next month."       │
│                                     │
│  [Sounds good]    [Actually, sweep  │
│                    a smaller amount] │
└─────────────────────────────────────┘
```

**Reserve has grown large — agent suggests Market Entry:**

Trigger: Reserve corpus exceeds 3x monthly surplus.

```
Agent: "You've got ₹8.5L in Reserve now. That's more than you
need parked. I think it's time to put some to work in equity."

┌─────────────────────────────────────┐
│  ProductUnlockCard                  │
│                                     │
│  Introducing: Neev Market Entry     │
│                                     │
│  What it is:                        │
│  A systematic deployment into a     │
│  large-cap index fund (Nifty 50)    │
│  — the simplest way to start        │
│  building equity wealth.            │
│                                     │
│  My recommendation:                 │
│  Move ₹4L from Reserve to Market    │
│  Entry, deploying ₹80K/month over   │
│  5 months.                          │
│                                     │
│  Keep ₹4.5L in Reserve as your      │
│  parking corpus.                    │
│                                     │
│  [Show work ▾]                      │
│  [Tell me more]                     │
│  [Let's do it →]                    │
│  [Not yet]                          │
└─────────────────────────────────────┘
```

**Market Entry established — agent suggests Accelerate or Navigate:**

Trigger: Market Entry is actively deploying and Reserve continues to grow beyond parking needs.

```
Agent: "Your Market Entry is running smoothly. Time to diversify
beyond just Nifty 50. I have two paths for you — let me show you."

┌─────────────────────────────────────┐
│  AccelerateVsNavigateCard           │
│                                     │
│  Two ways to diversify:             │
│                                     │
│  ┌───────────────┬───────────────┐  │
│  │  ACCELERATE   │  NAVIGATE     │  │
│  │               │  ★ Default    │  │
│  ├───────────────┼───────────────┤  │
│  │  14.20% XIRR  │  13.66% XIRR │  │
│  │  0.89 Sharpe  │  0.81 Sharpe  │  │
│  │  -6.25% max DD│  -6.39% max DD│  │
│  │               │               │  │
│  │  Curated      │  Pure index   │  │
│  │  active funds │  funds        │  │
│  │               │               │  │
│  │  Fund-picking │  Zero fund-   │  │
│  │  risk: Yes    │  picking risk │  │
│  │               │               │  │
│  │  Expense:     │  Expense:     │  │
│  │  ~0.5-1%      │  ~0.1%        │  │
│  │               │               │  │
│  │  +₹19.67L     │  +₹18.60L    │  │
│  │  extra vs SA  │  extra vs SA  │  │
│  │  (5yr, 1L/mo) │  (5yr, 1L/mo)│  │
│  └───────────────┴───────────────┘  │
│                                     │
│  The active premium is slim — 54    │
│  bps, or ~₹18K/year on 1L/month.   │
│  76% of the outperformance comes    │
│  from the system, not fund picking. │
│                                     │
│  [Show work ▾]                      │
│  [I'll go with Navigate →]          │
│  [I'll go with Accelerate →]        │
│  [Tell me more]                     │
└─────────────────────────────────────┘
```

### 9.5 Payment Execution Details

**For sweeps under ₹1L (UPI AutoPay mandate):**

1. Agent places lumpsum purchase order on BSE StAR for the target fund (e.g., arbitrage fund for Reserve)
2. BSE StAR triggers UPI AutoPay pull for the exact sweep amount
3. User receives a UPI notification (bank-level) — no OTP required if within mandate limit
4. Money debits from user's bank → BSE clearing → AMC
5. NAV allotment typically next business day (T+1)
6. Neev shows pending status, then confirms with allocated NAV

**For sweeps ≥ ₹1L (NACH eMandate):**

1. Same BSE StAR order flow
2. NACH mandate pull initiated — debits typically within 2-3 business days
3. NAV allotment at T+1 from debit date
4. Neev shows pending status with expected timeline

**Manual fallback (no mandate or user preference):**

1. Agent provides payment details: "Transfer ₹2.2L to this account" with BSE StAR payment details
2. User completes via UPI one-time or netbanking
3. Agent confirms receipt and NAV allotment

**Multi-bank sweep:**
When user has mandates on multiple banks, the agent recommends which bank to sweep from based on idle cash distribution across accounts:

```
Agent: "Your idle cash this month:
SBI ****1234: ₹3.2L idle
HDFC ****5678: ₹1.8L idle

I'd sweep ₹2.2L from SBI (leaves a healthy buffer in both).
Sound good?"
```

### 9.6 STP Execution (for Market Entry)

When the user activates Market Entry, the deployment happens via Systematic Transfer Plan:

1. Lumpsum from Reserve's arbitrage/liquid fund holding
2. STP registered on BSE StAR: from arbitrage fund → to target index fund
3. Fixed monthly transfer amount over the specified period (e.g., ₹80K/month × 5 months)
4. Agent tracks STP progress and provides monthly updates
5. Once Market Entry is established and Reserve continues to grow, the agent initiates the Accelerate vs Navigate choice conversation

### 9.7 Deployment Mechanics

All deployment is one-way (Reserve → Equity). There are no sell triggers — once money moves from Reserve to equity products, it stays invested.

**Market Entry deployment:**
- 20% of excess Reserve deployed monthly into UTI Nifty 50 Index Fund
- PE-based pace modulation adjusts deployment speed:

| Nifty PE | Market Condition | Deployment Pace |
|---|---|---|
| < 16 | Deep value | 2.0x bonus |
| < 18 | Cheap | 1.5x |
| 18–22 | Normal | 1.0x |
| > 22 | Expensive | 0.5x |

- Undeployed surplus stays in Reserve earning 7%+

**Accelerate / Navigate deployment:**
- 25% of excess Reserve deployed monthly
- Capital deploys into the 5-fund portfolio (40% core + 4×15% satellites)
- Quarterly momentum rebalancing adjusts satellite weights (see §9.8)

### 9.8 Quarterly Momentum Rebalancing (Accelerate / Navigate)

Every quarter (Mar, Jun, Sep, Dec), satellite fund weights are adjusted based on recent momentum:

- Funds with **positive momentum** get tilted up — max **1.5x** base weight (i.e., 15% → 22.5%)
- Funds with **negative momentum** get tilted down — min **0.5x** base weight (i.e., 15% → 7.5%)
- **Core (UTI Nifty 50, 40%) is never tilted** — it stays fixed as the stable anchor
- Momentum tilt factor: Moderate (2x, clamped to 0.5x–1.5x range)

The agent renders a `QuarterlyRebalanceCard` showing old vs new weights:

```
┌─────────────────────────────────────┐
│  QuarterlyRebalanceCard             │
│                                     │
│  Q1 2026 Rebalancing                │
│                                     │
│  Core (no change):                  │
│  UTI Nifty 50         40% → 40%    │
│                                     │
│  Satellites (momentum-adjusted):    │
│  ICICI Nifty Next 50  15% → 18%  ↑ │
│  HDFC Midcap Opps     15% → 22%  ↑ │
│  Parag Parikh Flexi   15% → 8%   ↓ │
│  Motilal S&P 500      15% → 12%  ↓ │
│                                     │
│  Rationale: Indian mid-caps showed  │
│  strong momentum this quarter.      │
│  International markets are cooling. │
│                                     │
│  [Show work ▾]                      │
│  [Apply rebalance →]  [Skip]        │
└─────────────────────────────────────┘
```

For Navigate, the same card is rendered with index fund names (Motilal Oswal Nifty Midcap 150 replaces HDFC Midcap and Parag Parikh Flexi).

---

## 10. Proactive Communications

The agent's ambient communication layer — how it stays present without being annoying.

### 10.1 Morning Brief

**Trigger:** First app open of the day (not a push notification — only shows when the user opens the app).

```
┌─────────────────────────────────────┐
│  MorningBriefCard                   │
│                                     │
│  ☀ Good morning, Arjun              │
│                                     │
│  Your Reserve earned ₹540           │
│  overnight. Total extra earned:     │
│  ₹18,940.                          │
│                                     │
│  [Show work ▾]                      │
│  ─────────────────────────────────  │
│  All is quiet. Your money is        │  ← Agent voice
│  working while you slept.           │
└─────────────────────────────────────┘
```

**Content adapts to context:**
- **Normal day:** Yield accrual + "all is well"
- **Sweep week (7th–10th):** "Your salary landed yesterday. I'll have a sweep plan once your bills clear."
- **STP in progress:** "₹80K deployed into Market Entry today. Month 3 of 5."
- **Market volatility:** "Markets fell 2.3% yesterday. Your Reserve is unaffected — it doesn't track the market. Your Market Entry is down ₹4,200 but your deployment pace is unchanged."
- **Market Entry deployment (PE context):** "Nifty PE is at 19.5 (normal range). Deploying ₹60K at standard pace today. Your equity allocation is now 45% of total Neev portfolio."
- **Quarterly rebalance (Accelerate/Navigate):** "Q1 rebalancing done. Mid-caps had strong momentum — tilted HDFC Midcap to 1.3x weight. S&P 500 cooled — tilted down to 0.8x. Core Nifty 50 stays at 40%."

### 10.2 Yield Accrual

**Trigger:** Daily, after NAV update. Appears in agent card stack.

```
┌─────────────────────────────────────┐
│  YieldAccrualCard                   │
│                                     │
│  💰 +₹540 earned today             │
│  Neev Reserve · Auto-reinvested     │
│                                     │
│  Cumulative this month: ₹4,320     │
└─────────────────────────────────────┘
```

### 10.3 Milestone Celebrations

**Trigger:** When the user crosses a meaningful threshold. These are celebration moments that reinforce the value of Neev.

Defined milestones:
- ₹1,000 extra earned
- ₹5,000 extra earned
- ₹10,000 extra earned ("That's a weekend trip")
- ₹25,000 extra earned ("That's a month's rent for some people")
- ₹50,000 extra earned ("That's more than most people's monthly salary")
- ₹1,00,000 extra earned
- ₹5L in Reserve
- ₹10L in Reserve
- First Market Entry deployment
- Market Entry completion
- 6 months of consistent sweeping
- 12 months of consistent sweeping

```
┌─────────────────────────────────────┐
│  MilestoneCard                      │
│  [Gold gradient border animation]   │
│                                     │
│  🎯 ₹10,000 Extra Earned           │  ← Gold gradient, Cormorant
│                                     │
│  That's a round trip to Goa.        │  ← Relatable comparison
│  All from money that was earning    │
│  3.5% in your savings account.      │
│                                     │
│  [Pulse animation on the number]    │
└─────────────────────────────────────┘
```

### 10.4 Market Context

**Trigger:** Significant market movement (Nifty 50 moves >2% in a day) affecting the user's holdings.

Only rendered if the user has Market Entry, Accelerate, or Navigate positions. Not triggered for Reserve-only users (arbitrage funds don't track the market).

```
┌─────────────────────────────────────┐
│  MarketContextCard                  │
│                                     │
│  📊 Markets today                   │
│                                     │
│  Nifty 50: -2.8%                    │
│  Your Market Entry: -₹12,400       │
│                                     │
│  This is normal. Your STP is        │
│  actually buying at lower prices    │
│  today — that's a good thing        │
│  when you're deploying over         │
│  months.                            │
│                                     │
│  Your 3-month return: still +4.2%   │
│                                     │
│  [Show work ▾]                      │
└─────────────────────────────────────┘
```

---

## 11. Component Registry (json-render)

Neev uses a hybrid architecture: pre-built screens for stable flows (onboarding wizard, product detail pages, You tab) and json-render for agent-composed cards in the conversational surface and Home agent stack.

The following component registry defines every UI primitive the agent can render via JSON spec at runtime.

### 11.1 Registry Overview

| Component | Category | Where Rendered | Agent Can Generate |
|---|---|---|---|
| OpportunityCostCard | Recommendation | Conversation, Home | Yes |
| SweepRecommendationCard | Recommendation | Conversation, Home | Yes |
| BonusSweepCard | Recommendation | Conversation, Home | Yes |
| AdjustedSweepCard | Recommendation | Conversation, Home | Yes |
| DeploymentPlanCard | Recommendation | Conversation, Home | Yes |
| ProductUnlockCard | Recommendation | Conversation | Yes |
| AccelerateVsNavigateCard | Recommendation | Conversation | Yes |
| RedemptionCard | Action | Conversation | Yes |
| BufferCalculationCard | Explanation | Conversation | Yes |
| ShowWorkCard | Explanation | Inline (expandable) | Yes |
| MorningBriefCard | Proactive | Home | Yes |
| YieldAccrualCard | Proactive | Home | Yes |
| MilestoneCard | Proactive | Home | Yes |
| MarketContextCard | Proactive | Home | Yes |
| PEContextCard | Proactive | Home | Yes |
| QuarterlyRebalanceCard | Proactive | Conversation, Home | Yes |
| DeploymentProgressCard | Status | Home, Invest | Yes |
| SweepConfirmationCard | Status | Conversation, Home | Yes |
| TransactionStatusCard | Status | Conversation | Yes |
| EarningsProjectorCard | Interactive | Conversation, Invest | Yes |
| OnboardingQuestionCard | Input | Conversation | Yes |
| AAConnectionCard | Setup | Conversation | Yes |
| MandateSetupCard | Setup | Conversation | Yes |
| KYCStepCard | Setup | Conversation | Yes |
| ConsentTierCard | Settings | Conversation | Yes |
| AgentTextBubble | Message | Conversation | Yes |
| QuickReplyChips | Input | Conversation | Yes |

### 11.2 Component Specifications

#### OpportunityCostCard

**Purpose:** Shows the user what their idle cash is costing them vs. what it could earn in Neev Reserve.

**Props:**
```typescript
{
  idleCashAmount: number;          // e.g., 620000
  currentRate: number;             // e.g., 0.035 (3.5%)
  neevRate: number;                // e.g., 0.07 (7%)
  currentEarnings: number;         // Calculated: idleCash × currentRate
  neevEarnings: number;            // Calculated: idleCash × neevRate
  delta: number;                   // neevEarnings - currentEarnings
  period: 'yearly' | 'monthly';   // Display period
  showWork: boolean;               // Expandable state
}
```

**Visual:** Two rows comparing earnings (current vs. Neev), delta highlighted in gold gradient. "Show work" expandable at bottom.

#### SweepRecommendationCard

**Purpose:** The monthly sweep recommendation. The core interaction card.

**Props:**
```typescript
{
  month: string;                   // e.g., "March"
  bankBalance: number;             // Current settled balance
  safetyBuffer: number;            // Calculated buffer amount
  upcomingExpenses: Array<{        // Known upcoming expenses
    label: string;
    amount: number;
  }>;
  sweepAmount: number;             // Recommended sweep
  targetProduct: 'reserve' | 'market_entry' | 'accelerate' | 'navigate';
  projectedExtraEarnings: number;  // Monthly delta vs savings
  agentNote: string;               // One-line contextual note
  showWork: boolean;
  actions: {
    primary: { label: string; action: 'sweep' };
    secondary: { label: string; action: 'defer' };
  };
}
```

**Visual:** Line-item breakdown (balance → buffer → upcoming → sweep amount). Sweep amount in gold. Primary CTA button, secondary as text link. Agent note in italic below.

#### BonusSweepCard

**Purpose:** Special recommendation when a bonus or windfall is detected.

**Props:**
```typescript
{
  bonusAmount: number;             // Detected bonus
  regularSurplus: number;          // Normal monthly surplus
  totalAvailable: number;          // Total sweepable
  recommendations: Array<{
    product: 'reserve' | 'market_entry' | 'accelerate' | 'navigate';
    amount: number;
    rationale: string;
  }>;
  showWork: boolean;
  actions: {
    primary: { label: string; action: 'sweep_recommended' };
    secondary: { label: string; action: 'discuss' };
  };
}
```

#### AdjustedSweepCard

**Purpose:** Sweep recommendation adjusted for a known large expense.

**Props:**
```typescript
{
  bankBalance: number;
  safetyBuffer: number;
  largeExpense: { label: string; amount: number };
  sweepAmount: number;             // May be ₹0
  agentNote: string;               // Contextual explanation
  showWork: boolean;
  actions: {
    primary: { label: string; action: 'confirm' };
    secondary: { label: string; action: 'adjust' };
  };
}
```

#### DeploymentPlanCard

**Purpose:** The personalised plan shown during onboarding (Step 3) and for first-time sweep.

**Props:**
```typescript
{
  bufferBreakdown: Array<{
    label: string;                 // e.g., "Rent (next month)"
    amount: number;
  }>;
  totalBuffer: number;
  sweepAmount: number;
  targetProduct: string;
  projectedExtraEarningsYearly: number;
  showWork: boolean;
  actions: {
    primary: { label: string; action: 'setup' | 'sweep' };
  };
}
```

**Visual:** Indented tree structure for buffer items. Sweep amount in gold. Extra earnings in large gold gradient text. Single primary CTA.

#### ProductUnlockCard

**Purpose:** Agent-initiated suggestion to progress to Market Entry.

**Props:**
```typescript
{
  product: 'market_entry';
  productName: string;             // "Neev Market Entry"
  description: string;             // What the product is
  recommendation: {
    sourceProduct: string;         // Where money comes from
    amount: number;                // Total deployment amount
    pace: string;                  // e.g., "₹80K/month over 5 months"
    retainInSource: number;        // Amount to keep in Reserve
  };
  showWork: boolean;
  actions: {
    primary: { label: string; action: 'activate' };
    secondary: { label: string; action: 'learn_more' };
    tertiary: { label: string; action: 'not_yet' };
  };
}
```

**Visual:** Product name in Cormorant Garamond. Description, then structured recommendation. Three action buttons (primary gold, secondary outlined, tertiary text).

#### AccelerateVsNavigateCard

**Purpose:** Honest side-by-side comparison for the tier-3 product choice. Presented when the agent suggests diversification beyond Market Entry.

**Props:**
```typescript
{
  comparison: {
    accelerate: {
      xirr: number;                // 14.20
      sharpe: number;              // 0.89
      maxDrawdown: number;         // -6.25
      fundPickingRisk: boolean;    // true
      expenseRatios: string;       // "~0.5-1%"
      extraVsSavings5yr: number;   // 1967000
      funds: Array<{
        name: string;
        allocation: number;
        type: 'index' | 'active';
        role: 'core' | 'satellite';
      }>;
    };
    navigate: {
      xirr: number;                // 13.66
      sharpe: number;              // 0.81
      maxDrawdown: number;         // -6.39
      fundPickingRisk: boolean;    // false
      expenseRatios: string;       // "~0.1%"
      extraVsSavings5yr: number;   // 1860000
      funds: Array<{
        name: string;
        allocation: number;
        type: 'index';
        role: 'core' | 'satellite';
      }>;
    };
  };
  defaultRecommendation: 'navigate';
  activePremiumBps: number;        // 54
  activePremiumAnnual: number;     // ~18000 (on 1L/month)
  systemContributionPct: number;   // 76 (% of outperformance from system)
  agentNote: string;
  showWork: boolean;
  actions: {
    primary: { label: string; action: 'choose_navigate' };
    secondary: { label: string; action: 'choose_accelerate' };
    tertiary: { label: string; action: 'learn_more' };
  };
}
```

**Visual:** Two-column comparison layout. Navigate column has a "★ Default" badge. Key metrics stacked vertically. Delta callout at the bottom explaining the 54 bps difference.

#### QuarterlyRebalanceCard

**Purpose:** Shows old vs new satellite weights after quarterly momentum rebalancing (Accelerate/Navigate).

**Props:**
```typescript
{
  quarter: string;                 // "Q1 2026"
  product: 'accelerate' | 'navigate';
  core: {
    fund: string;                  // "UTI Nifty 50"
    weight: number;                // 40 (always fixed)
  };
  satellites: Array<{
    fund: string;
    oldWeight: number;             // Previous weight %
    newWeight: number;             // New weight %
    momentumDirection: 'up' | 'down' | 'neutral';
    tiltFactor: number;            // 0.5 to 1.5
  }>;
  rationale: string;               // Why the tilt changed
  showWork: boolean;
  actions: {
    primary: { label: string; action: 'apply_rebalance' };
    secondary: { label: string; action: 'skip' };
  };
}
```

**Visual:** Table layout with old → new weight arrows. Green up arrows for positive momentum tilts, red down arrows for negative. Core row is greyed out (never changes).

#### PEContextCard

**Purpose:** Shows current Nifty PE and what it means for Market Entry deployment pace.

**Props:**
```typescript
{
  currentPE: number;               // e.g., 19.5
  peZone: 'deep_value' | 'cheap' | 'normal' | 'expensive';
  deploymentPace: string;          // "1.0x (standard)"
  deploymentAmount: number;        // Amount being deployed this month
  historicalContext: string;        // "10-year avg: 21.3"
  agentNote: string;
}
```

**Visual:** Horizontal PE gauge with color zones (green for value, yellow for normal, red for expensive). Current PE marked with a gold indicator. Deployment pace shown below.

#### DeploymentProgressCard

**Purpose:** Shows % of Reserve deployed into equity products over time.

**Props:**
```typescript
{
  reserveBalance: number;
  equityDeployed: number;          // Total deployed into Market Entry + Accelerate/Navigate
  deploymentPct: number;           // % of total Neev corpus in equity
  timeline: Array<{
    month: string;
    reservePct: number;
    equityPct: number;
  }>;
  currentProduct: 'market_entry' | 'accelerate' | 'navigate';
  monthlyDeploymentRate: string;   // "₹60K/month"
}
```

**Visual:** Stacked area chart showing Reserve vs Equity split over time. Current split shown as a donut chart. Monthly deployment rate below.

#### RedemptionCard

**Purpose:** Withdrawal/redemption flow rendered in conversation.

**Props:**
```typescript
{
  sourceProduct: string;
  amount: number;
  destinationBank: string;
  impact: {
    newBalance: number;
    reducedExtraEarnings: number;  // Monthly delta reduction
    taxImplication: string | null; // e.g., "₹2,400 STCG tax" or null
    creditTimeline: string;        // e.g., "T+1 (tomorrow)"
  };
  showWork: boolean;
  actions: {
    primary: { label: string; action: 'confirm_withdraw' };
    secondary: { label: string; action: 'cancel' };
  };
}
```

#### BufferCalculationCard

**Purpose:** Detailed breakdown of how the safety buffer was calculated.

**Props:**
```typescript
{
  items: Array<{
    category: string;              // "Fixed outflows", "Variable estimate", "Safety cushion"
    lineItems: Array<{
      label: string;
      amount: number;
      source: 'user_declared' | 'aa_detected' | 'estimated';
    }>;
    subtotal: number;
  }>;
  totalBuffer: number;
  dataFreshness: string;           // "Bank data refreshed 2h ago"
  advisorMarker: {
    name: string;
    sebiReg: string;
  };
}
```

#### ShowWorkCard

**Purpose:** Expandable reasoning chain. Rendered inline as the expanded state of "Show work" on any card.

**Props:**
```typescript
{
  dataSources: Array<{
    label: string;                 // "Bank balance from SBI"
    source: string;                // "Account Aggregator"
    freshness: string;             // "Refreshed 2h ago"
  }>;
  calculations: Array<{
    step: string;                  // "Balance ₹8.2L − Buffer ₹2.0L = Available ₹6.2L"
  }>;
  assumptions: string[];           // List of assumptions made
  instrumentRationale: string;     // Why this fund/product
  advisorMarker: {
    name: string;
    sebiReg: string;
  };
}
```

**Visual:** Muted background. Small text (12px Manrope). Each section has a subtle label. Advisor marker at the bottom with a seal-like treatment.

#### MorningBriefCard

**Props:**
```typescript
{
  greeting: string;                // "Good morning, Arjun"
  yieldEarned: number;            // Overnight yield
  totalExtraEarned: number;       // Cumulative delta
  contextNote: string;            // Varies by day/situation
  agentVoice: string;             // One-line warmth
  showWork: boolean;
  variant: 'normal' | 'sweep_week' | 'stp_update' | 'market_volatile' | 'pe_context' | 'quarterly_rebalance';
}
```

#### YieldAccrualCard

**Props:**
```typescript
{
  amount: number;                  // Daily yield
  product: string;                 // Which product earned
  reinvested: boolean;             // Auto-reinvested flag
  monthTotal: number;              // Cumulative this month
}
```

**Visual:** Compact card. Gold `+₹` amount. Product name in muted text.

#### MilestoneCard

**Props:**
```typescript
{
  type: 'extra_earned' | 'aum_threshold' | 'product_activation' | 'streak';
  value: number | string;          // ₹10,000 or "6 months"
  headline: string;                // "₹10,000 Extra Earned"
  comparison: string;              // "That's a round trip to Goa"
  subtext: string;                 // Context
}
```

**Visual:** Gold gradient border with pulse animation. Headline in Cormorant Garamond gold gradient. Comparison text is the emotional hook — relatable to the user's life.

#### MarketContextCard

**Props:**
```typescript
{
  marketIndex: string;             // "Nifty 50"
  marketChange: number;            // -2.8 (percentage)
  userImpact: number;              // ₹ impact on holdings
  affectedProduct: string;         // Which Neev product
  reassurance: string;             // Contextual reassurance
  longerTermReturn: {
    period: string;                // "3-month"
    value: number;                 // +4.2%
  };
  showWork: boolean;
}
```

#### SweepConfirmationCard

**Props:**
```typescript
{
  amount: number;
  product: string;
  paymentMethod: 'upi_autopay' | 'nach' | 'manual';
  navAllocationDate: string;       // "Tomorrow"
  status: 'initiated' | 'debited' | 'allocated' | 'completed';
}
```

**Visual:** Success state with green checkmark animation. Amount in gold. Status timeline showing progress.

#### TransactionStatusCard

**Props:**
```typescript
{
  type: 'sweep' | 'withdrawal' | 'stp_transfer' | 'yield';
  amount: number;
  product: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  details: string;                 // Context-specific detail
}
```

#### EarningsProjectorCard

**Purpose:** Interactive slider that shows projected returns based on investment amount.

**Props:**
```typescript
{
  product: string;
  currentBalance: number;
  minAddition: number;             // Minimum additional investment
  maxAddition: number;             // Maximum slider value
  rate: number;                    // Expected annual return
  interactive: true;               // Always interactive
}
```

**Visual:** Range slider with gold thumb. Live-updating projected return calculation below the slider. Manrope numbers with count-up animation.

#### OnboardingQuestionCard

**Purpose:** Individual question card during guided deepening (onboarding Step 2).

**Props:**
```typescript
{
  question: string;
  type: 'slider' | 'options' | 'amount_inputs' | 'multi_select';
  // For slider:
  sliderConfig?: { min: number; max: number; step: number; prefix: string; };
  // For options:
  options?: Array<{ label: string; value: string; }>;
  // For amount_inputs:
  inputFields?: Array<{ label: string; placeholder: string; optional: boolean; }>;
  // For multi_select:
  multiSelectOptions?: Array<{ label: string; value: string; icon: string; }>;
}
```

#### AAConnectionCard

**Props:**
```typescript
{
  whatWeCanSee: string[];          // List of data types
  whatWeCantSee: string[];         // Privacy assurance
  disconnectNote: string;          // "You can disconnect anytime"
  actions: {
    primary: { label: string; action: 'connect_aa' };
    secondary: { label: string; action: 'skip' };
  };
}
```

#### MandateSetupCard

**Props:**
```typescript
{
  type: 'upi_autopay' | 'nach';
  maxAmount: number;
  bank: string;
  accountMasked: string;
  explanation: string;             // Why this mandate type
  actions: {
    primary: { label: string; action: 'setup_mandate' };
    secondary?: { label: string; action: 'alternative' }; // Optional alternative
  };
}
```

#### KYCStepCard

**Props:**
```typescript
{
  step: 'pan' | 'aadhaar' | 'bank_details';
  title: string;
  description: string;            // Why this is needed
  inputFields: Array<{
    label: string;
    type: 'text' | 'select' | 'redirect'; // redirect = DigiLocker etc.
    placeholder?: string;
    validation?: string;           // Regex or format hint
  }>;
  status: 'pending' | 'verifying' | 'verified' | 'failed';
  actions: {
    primary: { label: string; action: 'verify' };
  };
}
```

#### ConsentTierCard

**Purpose:** Lets the user choose or change their sweep consent preference.

**Props:**
```typescript
{
  currentTier: 'approve_each' | 'auto_notify' | 'full_auto';
  tiers: Array<{
    id: string;
    name: string;
    description: string;
    available: boolean;            // full_auto locked until 3+ months
    lockReason?: string;           // "Available after 3 months of sweeping"
  }>;
}
```

#### AgentTextBubble

**Purpose:** Plain text message from the agent (not a structured card). Used for warmth lines, transitions, and conversational replies.

**Props:**
```typescript
{
  text: string;
  typewriter: boolean;             // Whether to animate
  tone: 'warm' | 'neutral' | 'reassuring' | 'celebratory';
}
```

**Visual:** Left-aligned, Manrope 15px, `--color-dark` text on light background. No card border. Subtle avatar indicator (gold ring, small).

#### QuickReplyChips

**Purpose:** Tappable suggestion chips below an agent message.

**Props:**
```typescript
{
  chips: Array<{
    label: string;                 // Display text
    value: string;                 // Sent as user input
  }>;
  maxSelect: 1 | 'multiple';
}
```

**Visual:** Horizontal scroll of pill-shaped chips. `--color-bone` background, `--color-dark` text. Selected state: `--color-gold` border. Manrope 14px.

---

## 12. Agent Tone & Personality

### 12.1 Voice Characteristics

- **Sharp, warm, zero-bullshit.** A friend who knows finance deeply.
- **Concise.** One line of warmth, never two. Cards do the work, the agent's voice does the feeling.
- **Non-judgmental.** Never guilts, never condescends, never says "you should have..."
- **Dry humor where appropriate.** "Okay so you're actually richer than you thought."
- **Confident but not arrogant.** Recommends clearly, shows work when asked.
- **Calm during crises.** Doesn't amplify anxiety. Provides structure.

### 12.2 What the Agent Never Sounds Like

- Banking app copy: "Welcome to your financial wellness journey!"
- Chatbot: "I'd be happy to help you with that! :)"
- Lecturer: "Let me explain how compound interest works..." (unless asked)
- Salesperson: "Upgrade now to unlock premium features!"

### 12.3 Tone Calibration by Context

| Context | Tone | Example |
|---|---|---|
| Normal sweep | Concise, rewarding | "Consistent month. Sweep when you're ready." |
| Bonus / windfall | Warm, structured | "Nice surprise. Here's how I'd split it." |
| Market drop | Calm, reassuring | "Markets fell. Your Reserve doesn't care. Your Market Entry actually bought cheaper today." |
| Skip month (large expense) | Understanding, patient | "Skipping this month makes sense. Let's catch up next month." |
| Milestone | Celebratory, grounded | "₹10K extra earned. That's a weekend trip to Goa — from money that was earning 3.5%." |
| User asks basic question | Patient, educational | Direct answer, no condescension, show work available |
| First interaction | Warm, confident | "Hey — what brought you here today?" |

---

## 13. Technical Architecture

### 13.1 Platform

React web application, mobile-first responsive design, installable as PWA.

**Why PWA over native for v1:**
- Fastest to build and iterate
- No app store approval delays
- json-render has first-class React support
- Can share URL for top-of-funnel (value-before-auth)
- Limitation: Push notification support via service worker (improving but not universal)
- Limitation: Biometric for vault via WebAuthn API (supported on modern mobile browsers)

### 13.2 Hybrid Rendering Architecture

```
┌────────────────────────────────────────────┐
│                Frontend                     │
│                                            │
│  ┌──────────────┐    ┌──────────────────┐  │
│  │ Pre-built     │    │ json-render      │  │
│  │ Screens       │    │ Renderer         │  │
│  │               │    │                  │  │
│  │ • Onboarding  │    │ • Agent cards    │  │
│  │ • Product     │    │ • Sweep recs     │  │
│  │   detail      │    │ • Insights       │  │
│  │ • You tab     │    │ • Milestones     │  │
│  │ • Activity    │    │ • All proactive  │  │
│  │   feed        │    │   communications │  │
│  └──────────────┘    └──────────────────┘  │
│           ↑                   ↑             │
│           │                   │             │
│     Static routes      JSON specs from      │
│                        AI agent             │
└────────────────────────────────────────────┘
```

**Pre-built screens** (traditional React components):
- Onboarding flow (Steps 1–4)
- Product detail pages (Invest tab)
- You tab (profile, accounts, vault)
- Activity tab (transaction feed)
- Tab bar, input bar, conversation thread container

**json-render composed** (AI generates JSON at runtime):
- All cards in the agent card stack (Home)
- All cards in the conversational overlay
- Sweep recommendations, insights, milestones
- Onboarding question cards (within the conversational flow)
- KYC step cards, AA connection card, mandate setup card

### 13.3 Component Registry (json-render)

The component registry maps JSON types to React components:

```typescript
import { createRegistry } from '@json-render/react';

const registry = createRegistry({
  OpportunityCostCard,
  SweepRecommendationCard,
  BonusSweepCard,
  AdjustedSweepCard,
  DeploymentPlanCard,
  ProductUnlockCard,
  AccelerateVsNavigateCard,
  RedemptionCard,
  BufferCalculationCard,
  ShowWorkCard,
  MorningBriefCard,
  YieldAccrualCard,
  MilestoneCard,
  MarketContextCard,
  PEContextCard,
  QuarterlyRebalanceCard,
  DeploymentProgressCard,
  SweepConfirmationCard,
  TransactionStatusCard,
  EarningsProjectorCard,
  OnboardingQuestionCard,
  AAConnectionCard,
  MandateSetupCard,
  KYCStepCard,
  ConsentTierCard,
  AgentTextBubble,
  QuickReplyChips,
});
```

The AI agent backend generates JSON specs conforming to these component schemas. The frontend renderer maps specs to components and renders them in the conversation thread or Home card stack.

### 13.4 External Integrations

| Integration | Purpose | Protocol |
|---|---|---|
| **BSE StAR MF** | Mutual fund transactions (lumpsum purchases, STP registration, redemptions) | API (RIA registration required) |
| **Account Aggregator** | Bank balance, transaction data, salary detection, outflow tracking | AA framework (FIP/FIU via AA) |
| **UPI AutoPay** | Variable recurring mandate for sweep debits < ₹1L | NPCI UPI 2.0 mandate |
| **NACH eMandate** | Recurring mandate for sweep debits ≥ ₹1L | NPCI NACH |
| **DigiLocker** | Aadhaar eKYC during onboarding | DigiLocker API |
| **PAN Verification** | KYC step — PAN → name verification | NSDL/UTIITSL API |

### 13.5 Data Flow

```
User's Bank ──AA──→ Neev Agent ──analysis──→ Sweep Recommendation
                                                     │
                                              User approves
                                                     │
                                                     ▼
                              BSE StAR ←── Purchase Order
                                  │
                              UPI/NACH ←── Debit from bank
                                  │
                                  ▼
                              AMC (fund house) ←── Money
                                  │
                              NAV allotment
                                  │
                                  ▼
                              Holdings updated in Neev
```

---

## 14. Key Metrics

| Metric | Definition | Target |
|---|---|---|
| **Activation** | % users who complete first sweep within 7 days of signup | > 60% |
| **Monthly sweep rate** | % of eligible months a user sweeps | > 80% |
| **Reserve AUM** | Total and per-user AUM in Neev Reserve | Growing MoM |
| **Equity conversion** | % of Reserve users who start Market Entry OR Accelerate/Navigate within 6 months | > 30% |
| **Accelerate vs Navigate split** | Ratio of users choosing Accelerate vs Navigate when presented the choice | Track — expect Navigate-heavy given default recommendation |
| **Quarterly rebalance engagement** | % of Accelerate/Navigate users who view the QuarterlyRebalanceCard | Track |
| **Extra earned delta** | Cumulative ₹ earned above savings account, per user | Visible, growing |
| **Conversation engagement** | Average messages per monthly sweep conversation | Track (no target — both 1-tap and deep engagement are fine) |
| **Onboarding completion** | % of users who enter a number (Step 1) and complete KYC (Step 4) | > 40% |
| **Hook-to-signup** | % of anonymous users (Step 1) who begin signup (Step 4) | > 50% |
| **DAU/MAU** | Daily active / monthly active ratio | Track — driven by proactive comms |
| **Avara advisory conversion** | % of Neev users who convert to full Avara advisory within 12 months | > 15% |

---

## 15. Open Questions for Engineering

1. **Push notification strategy:** PWA push notifications require service worker setup and user permission. What's the fallback for browsers/devices that don't support it? SMS? WhatsApp Business API?

2. **AA data refresh cadence:** How frequently should we poll AA for bank balance updates? Real-time is not available — typical AA refresh is on-demand or periodic (daily). What's the right balance between freshness and AA rate limits?

3. **Offline behavior:** When the user opens Neev without network, what cached state should be available? Portfolio balances (last known), agent cards (last rendered), or just a "reconnect" state?

4. **json-render streaming:** Should agent cards render progressively (streaming JSON) or wait for complete spec? Streaming creates a more responsive feel but requires partial rendering support.

5. **Biometric fallback for vault:** WebAuthn support varies. If the device doesn't support biometrics, should the vault fall back to PIN entry (as in design exploration file 14)?

6. **Multi-device state:** If a user accesses Neev from phone and desktop browser, how is conversation state synced? Is the conversation thread server-rendered or client-cached?

---

*v1 · March 2026 · Derived from Neev Product Thesis, Avara Product Principles, Design Explorations, and product design session.*
