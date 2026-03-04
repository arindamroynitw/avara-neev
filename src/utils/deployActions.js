import { calculateDailyEarnings } from './calculations';

/**
 * Returns an array of dispatch action objects for deploying to Neev Reserve.
 */
export function getDeployDispatches(sweepAmount, primaryAccountId, primaryAccountBalance) {
  const dailyEarnings = calculateDailyEarnings(sweepAmount, 7.2);

  return [
    {
      type: 'ACTIVATE_PRODUCT',
      payload: { product: 'reserve', data: { balance: sweepAmount, dailyEarnings } },
    },
    {
      type: 'UPDATE_METRICS',
      payload: {
        totalNeevBalance: sweepAmount,
        sweepCount: 1,
        totalSwept: sweepAmount,
        extraEarned: 0,
        extraEarnedToday: 0,
        monthsActive: 0,
      },
    },
    {
      type: 'UPDATE_ACCOUNT',
      payload: { id: primaryAccountId, data: { balance: primaryAccountBalance - sweepAmount } },
    },
    {
      type: 'ADD_ACTIVITY',
      payload: {
        id: `sweep-${Date.now()}`,
        type: 'sweep',
        date: new Date().toISOString(),
        data: { product: 'reserve', amount: sweepAmount, status: 'completed' },
      },
    },
    {
      type: 'ADD_AGENT_CARD',
      payload: {
        id: `sweep-confirm-${Date.now()}`,
        type: 'sweep-confirmation',
        props: {
          message: `Deployed to Neev Reserve. Earning 7.2% from day one.`,
          amount: sweepAmount,
        },
        dismissed: false,
        expired: false,
      },
    },
    {
      type: 'COMPLETE_ONBOARDING',
      payload: { lifecycle: 'active' },
    },
  ];
}
