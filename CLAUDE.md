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

`src/context/AppContext.jsx` provides `useApp()` → `{ state, dispatch, showToast }`. State persists to localStorage automatically via `useLocalStorage` hook. The reducer in `src/context/reducer.js` has 50+ action types covering navigation, onboarding, products, lifecycle, conversation, and demo controls.

### Routing: Tab-based, not URL-based

Navigation is driven by `state.activeTab` (`home | invest | activity | you`), dispatched via `SET_TAB`. The only URL route is `/onboarding`. Product details and program previews are modal overlays controlled by `SET_PRODUCT_DETAIL` and `SET_PROGRAM_PREVIEW` actions.

### Styling: Inline styles via design tokens

No CSS modules. Every component imports from `src/styles/tokens.js` and applies styles inline. The token file exports `colors`, `fonts`, `typography`, `goldGradient`, `glass`, `easing`, and `shadows`. Fonts are Cormorant Garamond (serif/display) and Manrope (sans/body). Keyframe animations live in `src/styles/animations.css`.

### AI Chat System

- `src/agent/aiService.js` — Calls OpenAI GPT-4o via Vercel AI SDK, parses response into card array
- `src/agent/systemPrompt.js` — Builds context-aware system prompt with user data and product details
- `src/agent/renderCards.jsx` — Maps 22 card types to React components
- `src/agent/schema.js` — Card type definitions and validation

The AI returns `{ "cards": [...] }` JSON. Each card has `type` and `props`. The parser (`parseCardsFromText`) handles bare arrays, wrapped objects, and text with preamble. Requires `VITE_OPENAI_API_KEY` in `.env`.

### Demo/Snapshot System

`src/context/snapshots.js` provides 5 pre-built lifecycle stages (fresh, month1, month3, month6, month9+). `DemoControls.jsx` dispatches `LOAD_SNAPSHOT` for time-travel testing. Mock data per stage comes from `src/data/agentCards.js` and `src/data/transactions.js`.

## Directory Conventions

- `src/surfaces/` — Tab pages (`*Surface.jsx`): HomeSurface, InvestSurface, ActivitySurface, YouSurface
- `src/cards/` — Domain-specific agent cards (SweepRecommendation, ProductUnlock, etc.)
- `src/components/shell/` — App chrome: AppShell, Header, TabBar, InputBar, ConversationOverlay
- `src/components/shared/` — Reusable primitives: Card, Button, Label, FundLogo, Shimmer
- `src/components/viz/` — Visualizations: MiniDonut, Sparkline, HealthScoreCircle
- `src/onboarding/` — 5-step flow: Hook → Picture → Plan → Commitment → GetStarted
- `src/data/` — Mock data: products, persona, transactions, agentCards
- `src/hooks/` — useLocalStorage, useCountUp, useTypewriter, useDelayedReveal

## Key Patterns

**Adding a new AI card type:** Define in `schema.js` → add render case in `renderCards.jsx` → document in `systemPrompt.js` card catalog → create component in `src/cards/` or inline.

**Onboarding steps** dispatch `SET_ONBOARDING_STEP` to advance, storing data via `SET_HOOK_DATA`, `SET_PICTURE_DATA`, etc. `COMPLETE_ONBOARDING` transitions lifecycle to `zero-state`.

**Fund logos** are resolved via `getFundLogo(fundName)` in `src/data/products.js`, which matches fund name substrings to a `FUND_LOGOS` map. Kotak and PPFAS logos are served locally from `public/logos/`; others use Clearbit CDN.

**Lifecycle progression:** `onboarding` → `zero-state` → `active` → `mature`. Each stage has different agent cards, activity feeds, and available products.
