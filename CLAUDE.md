# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
```

No test framework or linter is configured. No CI/CD pipeline — deploy via `npx vercel --prod`.

## What This Is

Neev is Avara's conversational idle cash deployment tool for salaried Indian professionals (₹25L–1Cr income). It's a React PWA, mobile-first at 390px max-width, with a gold/cream luxury aesthetic.

**Product model:** Park (Neev Reserve 7.2%) → Deploy (Market Entry 10.53%) → Diversify (Accelerate 14.2% or Navigate 13.66%). All backed by real mutual fund compositions defined in `src/data/products.js`.

The comprehensive product spec lives at `NEEV-PRODUCT-SPEC.md` (~90KB).

## Architecture

### State: Context + useReducer (not Redux)

`src/context/AppContext.jsx` provides `useApp()` → `{ state, dispatch, showToast }`. State persists to localStorage automatically via `useLocalStorage` hook. The reducer in `src/context/reducer.js` has 50+ action types covering navigation, onboarding, products, lifecycle, chat modes, flows, and demo controls.

### Routing: Tab-based, not URL-based

Navigation is driven by `state.activeTab` (`home | invest | activity | you`), dispatched via `SET_TAB`. The only URL route is `/onboarding`. Product details and program previews are modal overlays controlled by `SET_PRODUCT_DETAIL` and `SET_PROGRAM_PREVIEW` actions.

### Styling: Inline styles via design tokens

No CSS modules. Every component imports from `src/styles/tokens.js` and applies styles inline. The token file exports `colors`, `fonts`, `typography`, `goldGradient`, `glass`, `easing`, and `shadows`. Fonts are Cormorant Garamond (serif/display) and Manrope (sans/body). Keyframe animations live in `src/styles/animations.css`.

### Dual-Mode Conversational UI

Two mutually exclusive chat modes — only one can be active at a time:

**Mode 1 — Surface Response** (`state.surfaceResponse`): User types in InputBar → tab content is replaced with AI-generated cards inline (no overlay). Quick-reply chips appear after each response. Tapping any tab exits. State: `active`, `previousTab`, `hiddenThread` (invisible context), `currentCards`, `quickReplies`.

**Mode 2 — RM Chat** (`state.rmChat`): Persistent advisory conversation with visible message thread. Full-screen overlay with header, scrollable thread, and dedicated input. Thread persists across sessions via localStorage. Accessible from 7 CTA entry points across the app via `RMChatCTA` component.

Key components:
- `src/components/shell/SurfaceResponseView.jsx` — Mode 1 view, manages AI call lifecycle
- `src/components/shell/RMChatView.jsx` — Mode 2 container
- `src/components/shared/SurfaceChips.jsx` — Quick-reply chip bar
- `src/components/shell/InputBar.jsx` — Dispatches `ENTER_SURFACE_RESPONSE` + `ADD_SURFACE_MESSAGE`

### AI Chat System

- `src/agent/aiService.js` — Calls OpenAI GPT-4o via Vercel AI SDK, parses response into card array. `callAI(userMessage, history, state, mode)` accepts `'surface'` or `'rm-chat'` mode.
- `src/agent/systemPrompt.js` — Builds context-aware system prompt with user data, product details, and mode-specific rules. `buildSystemPrompt(state, mode)`.
- `src/agent/renderCards.jsx` — Maps 32 card types to React components. `renderCards(cards, dispatch, options)` where options includes `{ extractQuickReplies, sendMessage, reducedMotion }`.
- `src/agent/schema.js` — Card type definitions and validation.

The AI returns `{ "cards": [...] }` JSON. Each card has `type` and `props`. The parser (`parseCardsFromText`) handles bare arrays, wrapped objects, markdown fences, and text with preamble/trailing content. Requires `VITE_OPENAI_API_KEY` in `.env`.

### Transactional Flows

`src/flows/` contains 5 multi-step flows launched via `LAUNCH_FLOW` action, lazy-loaded with `React.lazy`:
- `DeployFlow` — Amount → Review → Deploying → Success
- `TransferFlow` — Transfer between products
- `WithdrawFlow` — Withdraw to bank
- `ProductActivateFlow` — Activate a new product
- `RebalanceFlow` — Portfolio rebalance

All flows use `FlowShell.jsx` for shared chrome (header, back navigation, step transitions). `FlowOverlay.jsx` routes to the correct flow component.

### Demo/Snapshot System

`src/context/snapshots.js` provides 5 pre-built lifecycle stages (fresh, month1, month3, month6, month9+). `DemoControls.jsx` dispatches `LOAD_SNAPSHOT` for time-travel testing. Mock data per stage comes from `src/data/agentCards.js` and `src/data/transactions.js`.

## Directory Conventions

- `src/surfaces/` — Tab pages (`*Surface.jsx`): HomeSurface, InvestSurface, ActivitySurface, YouSurface
- `src/cards/` — AI card components: interactive (ChoiceCard, AmountInputCard, ConfirmationCard, etc.) and action cards (FlowLauncherCard, NavigateCard, EscalateToRMCard)
- `src/components/shell/` — App chrome: AppShell, Header, TabBar, InputBar, SurfaceResponseView, RMChatView, DeployNowOverlay, ModeIndicator
- `src/components/shared/` — Reusable primitives: Card, Button, Label, FundLogo, Shimmer, SurfaceChips, RMChatCTA, UserMessageBubble, DateSeparator, TypingIndicator
- `src/components/viz/` — Visualizations: MiniDonut, Sparkline, HealthScoreCircle
- `src/flows/` — Transactional flows: FlowOverlay, FlowShell, DeployFlow, TransferFlow, WithdrawFlow, ProductActivateFlow, RebalanceFlow
- `src/onboarding/` — 5-step flow: Hook → Picture → Plan → Commitment → GetStarted
- `src/data/` — Mock data: products, persona, transactions, agentCards
- `src/hooks/` — useLocalStorage, useCountUp, useTypewriter, useDelayedReveal
- `src/agent/` — AI service, system prompt, card rendering, schema

## Key Patterns

**Adding a new AI card type:** Define in `schema.js` → add render case in `renderCards.jsx` → document in `systemPrompt.js` card catalog → create component in `src/cards/` or inline.

**Interactive cards** (choice-card, amount-input, toggle-choice, confirmation-card) receive an `onSelect`/`onSubmit`/`onConfirm` callback wired to `sendMessage` via `renderCards` options. The callback sends the user's selection as a text message that triggers a new AI call.

**Onboarding steps** dispatch `SET_ONBOARDING_STEP` to advance, storing data via `SET_HOOK_DATA`, `SET_PICTURE_DATA`, etc. `COMPLETE_ONBOARDING` transitions lifecycle to `zero-state`.

**Fund logos** are resolved via `getFundLogo(fundName)` in `src/data/products.js`, which matches fund name substrings to a `FUND_LOGOS` map. Kotak and PPFAS logos are served locally from `public/logos/`; others use Clearbit CDN.

**Lifecycle progression:** `onboarding` → `zero-state` → `active` → `mature`. Each stage has different agent cards, activity feeds, and available products.

**Mode exclusivity:** Opening RM Chat auto-exits Surface Response (and vice versa). `SET_TAB` exits both. `LAUNCH_FLOW` exits both. This is enforced in the reducer.
