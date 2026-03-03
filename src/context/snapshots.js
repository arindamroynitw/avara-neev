import { getTransactionsForStage } from '../data/transactions';
import { getAgentCardsForStage } from '../data/agentCards';

const baseUser = {
  name: 'Arjun', email: 'arjun@email.com', phone: '+91 98765 43210',
  monthlySalary: 180000, salaryDate: 1, outflows: 72000,
  bankFloor: 30000, consentTier: 'approve-each', detailLevel: 'balanced',
};

const completedOnboarding = {
  completed: true, currentStep: 'done',
  hookData: { idleCashAmount: 600000 },
  pictureData: { monthlySalary: 180000, salaryDate: 1, outflows: 72000, upcomingExpense: 0 },
  planData: { bufferAmount: 102000, sweepAmount: 498000, projectedExtraYearly: 18426 },
  commitmentData: { phone: '+91 98765 43210', otpVerified: true, panVerified: true, aadhaarVerified: true, aaConnected: true, aaOtpVerified: true },
};

const accounts = [
  { id: 'hdfc-1', bank: 'HDFC Bank', maskedNumber: '****4523', status: 'active', balance: 524000 },
  { id: 'axis-1', bank: 'Axis Bank', maskedNumber: '****7891', status: 'active', balance: 300000 },
];

export const snapshots = {
  fresh: {
    lifecycle: 'zero-state',
    onboarding: completedOnboarding,
    user: baseUser,
    accounts,
    products: {
      reserve: { active: false, balance: 0, yield: 7.2, dailyEarnings: 0, allocation: { liquid: 0.2, arbitrage: 0.8 } },
      marketEntry: { active: false, unlocked: false, balance: 0, yield: 10.53, fund: 'UTI Nifty 50 Index Fund', currentPE: 19.5, peZone: 'fair', deploymentPace: 1.0, stpProgress: 0 },
      accelerate: { active: false, unlocked: false, balance: 0, yield: 14.2, funds: [], lastRebalance: null },
      navigate: { active: false, unlocked: false, balance: 0, yield: 13.66, funds: [], lastRebalance: null },
    },
    metrics: { totalNeevBalance: 0, extraEarned: 0, extraEarnedToday: 0, monthsActive: 0, sweepCount: 0, totalSwept: 0 },
    agentCards: getAgentCardsForStage('fresh'),
    activityFeed: getTransactionsForStage('fresh'),
    conversation: { open: false, thread: [], loading: false, error: null, context: null },
    activeTab: 'home',
    activeProductDetail: null,
    activeProgramPreview: null,
    currentSweep: { month: null, status: null, recommendation: null },
    deployNow: { active: false, stage: 'recap' },
    toast: { message: '', visible: false },
  },

  month1: {
    lifecycle: 'active',
    onboarding: completedOnboarding,
    user: baseUser,
    accounts: [{ ...accounts[0], balance: 257000 }, { ...accounts[1], balance: 147000 }],
    products: {
      reserve: { active: true, balance: 422520, yield: 7.2, dailyEarnings: 84, allocation: { liquid: 0.2, arbitrage: 0.8 } },
      marketEntry: { active: false, unlocked: false, balance: 0, yield: 10.53, fund: 'UTI Nifty 50 Index Fund', currentPE: 19.5, peZone: 'fair', deploymentPace: 1.0, stpProgress: 0 },
      accelerate: { active: false, unlocked: false, balance: 0, yield: 14.2, funds: [], lastRebalance: null },
      navigate: { active: false, unlocked: false, balance: 0, yield: 13.66, funds: [], lastRebalance: null },
    },
    metrics: { totalNeevBalance: 422520, extraEarned: 2520, extraEarnedToday: 44, monthsActive: 1, sweepCount: 1, totalSwept: 420000 },
    agentCards: getAgentCardsForStage('month1'),
    activityFeed: getTransactionsForStage('month1'),
    conversation: { open: false, thread: [], loading: false, error: null, context: null },
    activeTab: 'home',
    activeProductDetail: null,
    activeProgramPreview: null,
    currentSweep: { month: null, status: null, recommendation: null },
    deployNow: { active: false, stage: 'recap' },
    toast: { message: '', visible: false },
  },

  month3: {
    lifecycle: 'active',
    onboarding: completedOnboarding,
    user: baseUser,
    accounts: [{ ...accounts[0], balance: 197000 }, { ...accounts[1], balance: 113000 }],
    products: {
      reserve: { active: true, balance: 546000, yield: 7.2, dailyEarnings: 108, allocation: { liquid: 0.2, arbitrage: 0.8 } },
      marketEntry: { active: true, unlocked: true, balance: 52000, yield: 10.53, fund: 'UTI Nifty 50 Index Fund', currentPE: 19.5, peZone: 'fair', deploymentPace: 1.0, stpProgress: 0.15 },
      accelerate: { active: false, unlocked: false, balance: 0, yield: 14.2, funds: [], lastRebalance: null },
      navigate: { active: false, unlocked: false, balance: 0, yield: 13.66, funds: [], lastRebalance: null },
    },
    metrics: { totalNeevBalance: 598000, extraEarned: 7800, extraEarnedToday: 123, monthsActive: 3, sweepCount: 3, totalSwept: 680000 },
    agentCards: getAgentCardsForStage('month3'),
    activityFeed: getTransactionsForStage('month3'),
    conversation: { open: false, thread: [], loading: false, error: null, context: null },
    activeTab: 'home',
    activeProductDetail: null,
    activeProgramPreview: null,
    currentSweep: { month: null, status: null, recommendation: null },
    deployNow: { active: false, stage: 'recap' },
    toast: { message: '', visible: false },
  },

  month6: {
    lifecycle: 'active',
    onboarding: completedOnboarding,
    user: baseUser,
    accounts: [{ ...accounts[0], balance: 178000 }, { ...accounts[1], balance: 102000 }],
    products: {
      reserve: { active: true, balance: 480000, yield: 7.2, dailyEarnings: 95, allocation: { liquid: 0.2, arbitrage: 0.8 } },
      marketEntry: { active: true, unlocked: true, balance: 160000, yield: 10.53, fund: 'UTI Nifty 50 Index Fund', currentPE: 19.5, peZone: 'fair', deploymentPace: 1.0, stpProgress: 0.45 },
      accelerate: { active: true, unlocked: true, balance: 85000, yield: 14.2, funds: [
        { name: 'UTI Nifty 50 Index Fund', weight: 0.40, value: 34000 },
        { name: 'ICICI Nifty Next 50 Index Fund', weight: 0.15, value: 12750 },
        { name: 'HDFC Midcap Opportunities Fund', weight: 0.15, value: 12750 },
        { name: 'Parag Parikh Flexi Cap Fund', weight: 0.15, value: 12750 },
        { name: 'Motilal Oswal S&P 500 Index Fund', weight: 0.15, value: 12750 },
      ], lastRebalance: '2026-07-01' },
      navigate: { active: false, unlocked: false, balance: 0, yield: 13.66, funds: [], lastRebalance: null },
    },
    metrics: { totalNeevBalance: 725000, extraEarned: 18400, extraEarnedToday: 174, monthsActive: 6, sweepCount: 6, totalSwept: 1070000 },
    agentCards: getAgentCardsForStage('month6'),
    activityFeed: getTransactionsForStage('month6'),
    conversation: { open: false, thread: [], loading: false, error: null, context: null },
    activeTab: 'home',
    activeProductDetail: null,
    activeProgramPreview: null,
    currentSweep: { month: null, status: null, recommendation: null },
    deployNow: { active: false, stage: 'recap' },
    toast: { message: '', visible: false },
  },

  month9: {
    lifecycle: 'mature',
    onboarding: completedOnboarding,
    user: baseUser,
    accounts: [{ ...accounts[0], balance: 159000 }, { ...accounts[1], balance: 91000 }],
    products: {
      reserve: { active: true, balance: 520000, yield: 7.2, dailyEarnings: 103, allocation: { liquid: 0.2, arbitrage: 0.8 } },
      marketEntry: { active: true, unlocked: true, balance: 480000, yield: 10.53, fund: 'UTI Nifty 50 Index Fund', currentPE: 18.2, peZone: 'fair', deploymentPace: 1.0, stpProgress: 0.75 },
      accelerate: { active: true, unlocked: true, balance: 520000, yield: 14.2, funds: [
        { name: 'UTI Nifty 50 Index Fund', weight: 0.40, value: 208000 },
        { name: 'ICICI Nifty Next 50 Index Fund', weight: 0.15, value: 78000 },
        { name: 'HDFC Midcap Opportunities Fund', weight: 0.15, value: 78000 },
        { name: 'Parag Parikh Flexi Cap Fund', weight: 0.15, value: 78000 },
        { name: 'Motilal Oswal S&P 500 Index Fund', weight: 0.15, value: 78000 },
      ], lastRebalance: '2026-10-01' },
      navigate: { active: false, unlocked: false, balance: 0, yield: 13.66, funds: [], lastRebalance: null },
    },
    metrics: { totalNeevBalance: 1520000, extraEarned: 42000, extraEarnedToday: 280, monthsActive: 9, sweepCount: 9, totalSwept: 1610000 },
    agentCards: getAgentCardsForStage('month9'),
    activityFeed: getTransactionsForStage('month9'),
    conversation: { open: false, thread: [], loading: false, error: null, context: null },
    activeTab: 'home',
    activeProductDetail: null,
    activeProgramPreview: null,
    currentSweep: { month: null, status: null, recommendation: null },
    deployNow: { active: false, stage: 'recap' },
    toast: { message: '', visible: false },
  },
};
