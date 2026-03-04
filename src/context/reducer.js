export const initialState = {
  lifecycle: 'onboarding', // 'onboarding' | 'zero-state' | 'active' | 'mature'

  onboarding: {
    completed: false,
    currentStep: 'hook', // 'hook' | 'picture' | 'plan' | 'commitment' | 'getStarted' | 'done'
    hookData: { idleCashAmount: null },
    pictureData: { monthlySalary: null, salaryDate: null, outflows: null, upcomingExpense: null },
    planData: { bufferAmount: null, sweepAmount: null, projectedExtraYearly: null },
    commitmentData: { phone: null, otpVerified: false, panVerified: false, aadhaarVerified: false, aaConnected: false, aaOtpVerified: false },
  },

  user: {
    name: 'Arjun',
    email: 'arjun@email.com',
    phone: '+91 98765 43210',
    monthlySalary: 180000,
    salaryDate: 1,
    outflows: 72000,
    bankFloor: 30000,
    consentTier: 'approve-each',
    detailLevel: 'balanced',
  },

  accounts: [
    { id: 'hdfc-1', bank: 'HDFC Bank', maskedNumber: '****4523', status: 'active', balance: 524000 },
    { id: 'axis-1', bank: 'Axis Bank', maskedNumber: '****7891', status: 'active', balance: 300000 },
  ],

  products: {
    reserve: { active: false, balance: 0, yield: 7.2, dailyEarnings: 0, allocation: { liquid: 0.2, arbitrage: 0.8 } },
    marketEntry: { active: false, unlocked: false, balance: 0, yield: 10.53, fund: 'UTI Nifty 50 Index Fund', currentPE: 19.5, peZone: 'fair', deploymentPace: 1.0, stpProgress: 0 },
    accelerate: { active: false, unlocked: false, balance: 0, yield: 14.2, funds: [], lastRebalance: null },
    navigate: { active: false, unlocked: false, balance: 0, yield: 13.66, funds: [], lastRebalance: null },
  },

  metrics: {
    totalNeevBalance: 0,
    extraEarned: 0,
    extraEarnedToday: 0,
    monthsActive: 0,
    sweepCount: 0,
    totalSwept: 0,
  },

  agentCards: [],
  activityFeed: [],

  conversation: { open: false, thread: [], loading: false, error: null, context: null },
  activeTab: 'home',
  activeProductDetail: null,
  activeProgramPreview: null,
  currentSweep: { month: null, status: null, recommendation: null },
  deployNow: { active: false, stage: 'recap' },
  demo: { panelOpen: false, currentStage: 'fresh' },
  toast: { message: '', visible: false },
};

export function reducer(state, action) {
  switch (action.type) {
    // --- Navigation ---
    case 'SET_TAB':
      return { ...state, activeTab: action.payload, activeProductDetail: null, activeProgramPreview: null };

    case 'SET_PRODUCT_DETAIL':
      return { ...state, activeProductDetail: action.payload };

    case 'CLOSE_PRODUCT_DETAIL':
      return { ...state, activeProductDetail: null };

    case 'SET_PROGRAM_PREVIEW':
      return { ...state, activeProgramPreview: action.payload, activeProductDetail: null };

    case 'CLOSE_PROGRAM_PREVIEW':
      return { ...state, activeProgramPreview: null };

    // --- Deploy Now (re-engagement) ---
    case 'START_DEPLOY_NOW':
      return { ...state, deployNow: { active: true, stage: 'recap' } };

    case 'SET_DEPLOY_NOW_STAGE':
      return { ...state, deployNow: { ...state.deployNow, stage: action.payload } };

    case 'CLOSE_DEPLOY_NOW':
      return { ...state, deployNow: { active: false, stage: 'recap' } };

    // --- Onboarding ---
    case 'SET_ONBOARDING_STEP':
      return {
        ...state,
        onboarding: { ...state.onboarding, currentStep: action.payload },
      };

    case 'SET_HOOK_DATA':
      return {
        ...state,
        onboarding: { ...state.onboarding, hookData: { ...state.onboarding.hookData, ...action.payload } },
      };

    case 'SET_PICTURE_DATA':
      return {
        ...state,
        onboarding: { ...state.onboarding, pictureData: { ...state.onboarding.pictureData, ...action.payload } },
      };

    case 'SET_PLAN_DATA':
      return {
        ...state,
        onboarding: { ...state.onboarding, planData: { ...state.onboarding.planData, ...action.payload } },
      };

    case 'SET_COMMITMENT_DATA':
      return {
        ...state,
        onboarding: { ...state.onboarding, commitmentData: { ...state.onboarding.commitmentData, ...action.payload } },
      };

    case 'COMPLETE_ONBOARDING': {
      const pd = state.onboarding.pictureData || {};
      const breakdown = pd.outflowBreakdown || {};
      const computedOutflows = (breakdown.rent || 0) + (breakdown.sips || 0) + (breakdown.emi || 0) + (breakdown.other || 0);
      // Use outflowBreakdown sum if available, else fall back to pictureData.outflows total
      const derivedOutflows = computedOutflows || pd.outflows || state.user.outflows;
      return {
        ...state,
        lifecycle: action.payload?.lifecycle ?? 'zero-state',
        onboarding: { ...state.onboarding, completed: true, currentStep: 'done' },
        user: { ...state.user, outflows: derivedOutflows || state.user.outflows },
      };
    }

    // --- Lifecycle ---
    case 'SET_LIFECYCLE':
      return { ...state, lifecycle: action.payload };

    // --- Products ---
    case 'ACTIVATE_PRODUCT': {
      const key = action.payload.product;
      return {
        ...state,
        products: {
          ...state.products,
          [key]: { ...state.products[key], active: true, ...action.payload.data },
        },
      };
    }

    case 'UPDATE_PRODUCT': {
      const key = action.payload.product;
      return {
        ...state,
        products: {
          ...state.products,
          [key]: { ...state.products[key], ...action.payload.data },
        },
      };
    }

    // --- Metrics ---
    case 'UPDATE_METRICS':
      return {
        ...state,
        metrics: { ...state.metrics, ...action.payload },
      };

    // --- Agent Cards ---
    case 'ADD_AGENT_CARD':
      return {
        ...state,
        agentCards: [action.payload, ...state.agentCards],
      };

    case 'DISMISS_AGENT_CARD':
      return {
        ...state,
        agentCards: state.agentCards.map(c =>
          c.id === action.payload ? { ...c, dismissed: true } : c
        ),
      };

    case 'SET_AGENT_CARDS':
      return { ...state, agentCards: action.payload };

    // --- Activity ---
    case 'ADD_ACTIVITY':
      return {
        ...state,
        activityFeed: [action.payload, ...state.activityFeed],
      };

    case 'SET_ACTIVITY_FEED':
      return { ...state, activityFeed: action.payload };

    // --- Conversation ---
    case 'OPEN_CONVERSATION':
      return {
        ...state,
        conversation: { ...state.conversation, open: true },
      };

    case 'CLOSE_CONVERSATION':
      return {
        ...state,
        conversation: { ...state.conversation, open: false, context: null },
      };

    case 'SET_CONVERSATION_CONTEXT':
      return {
        ...state,
        conversation: { ...state.conversation, context: action.payload },
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        conversation: {
          ...state.conversation,
          thread: [...state.conversation.thread, action.payload],
        },
      };

    case 'SET_CONVERSATION_LOADING':
      return {
        ...state,
        conversation: { ...state.conversation, loading: action.payload },
      };

    case 'SET_CONVERSATION_ERROR':
      return {
        ...state,
        conversation: { ...state.conversation, error: action.payload, loading: false },
      };

    // --- Sweep ---
    case 'SET_CURRENT_SWEEP':
      return { ...state, currentSweep: { ...state.currentSweep, ...action.payload } };

    // --- Demo ---
    case 'TOGGLE_DEMO_PANEL':
      return {
        ...state,
        demo: { ...state.demo, panelOpen: !state.demo.panelOpen },
      };

    case 'SET_DEMO_STAGE':
      return {
        ...state,
        demo: { ...state.demo, currentStage: action.payload },
      };

    // --- Load full snapshot (for demo time-travel) ---
    case 'LOAD_SNAPSHOT':
      return { ...action.payload, demo: state.demo };

    // --- Toast ---
    case 'SHOW_TOAST':
      return { ...state, toast: { message: action.payload, visible: true } };

    case 'HIDE_TOAST':
      return { ...state, toast: { message: '', visible: false } };

    // --- Accounts ---
    case 'UPDATE_ACCOUNT': {
      return {
        ...state,
        accounts: state.accounts.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.data } : a
        ),
      };
    }

    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };

    // --- User ---
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };

    // --- Simulate time advance ---
    case 'SIMULATE_TIME_ADVANCE': {
      const newProducts = { ...state.products };
      let totalExtra = 0;
      let newTotalBalance = 0;
      Object.keys(newProducts).forEach(key => {
        const p = newProducts[key];
        if (p.active && p.balance > 0) {
          const growth = p.balance * (p.yield / 365 / 100) * 30;
          const newBalance = Math.round(p.balance + growth);
          const newDaily = Math.round(newBalance * p.yield / 100 / 365);
          totalExtra += Math.round(growth);
          newProducts[key] = { ...p, balance: newBalance, dailyEarnings: newDaily };
          newTotalBalance += newBalance;
        } else if (p.active) {
          newTotalBalance += p.balance;
        }
      });
      // Calculate weighted average yield for relative earnings formula
      let weightedYieldSum = 0;
      Object.keys(newProducts).forEach(key => {
        const p = newProducts[key];
        if (p.active && p.balance > 0) weightedYieldSum += p.yield * p.balance;
      });
      const avgYield = newTotalBalance > 0 ? weightedYieldSum / newTotalBalance : 7.2;
      const newMonthsActive = state.metrics.monthsActive + 1;

      return {
        ...state,
        products: newProducts,
        metrics: {
          ...state.metrics,
          totalNeevBalance: newTotalBalance,
          extraEarned: state.metrics.extraEarned + totalExtra,
          extraEarnedToday: Math.round(newTotalBalance * (avgYield - 3.5) / 100 / 365),
          monthsActive: newMonthsActive,
        },
        agentCards: [
          {
            id: `sim-milestone-${Date.now()}`,
            type: 'milestone',
            props: {
              message: `After ${newMonthsActive} month${newMonthsActive > 1 ? 's' : ''}, your investments have grown. You've earned ₹${totalExtra.toLocaleString('en-IN')} extra over what a savings account would give.`,
              goldMetric: `+₹${totalExtra.toLocaleString('en-IN')} extra`,
            },
            dismissed: false,
            expired: false,
          },
          ...state.agentCards,
        ],
        activityFeed: [
          {
            id: `sim-yield-${Date.now()}`,
            type: 'yield',
            date: new Date().toISOString(),
            data: { product: 'reserve', amount: totalExtra, status: 'completed' },
          },
          ...state.activityFeed,
        ],
      };
    }

    // --- Reset ---
    case 'RESET_ALL':
      return { ...initialState };

    default:
      return state;
  }
}
