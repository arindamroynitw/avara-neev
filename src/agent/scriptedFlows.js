import { calculateSweepAmount, calculateProjectedExtra, calculateOpportunityCost } from '../utils/calculations';

/**
 * Generate sweep recommendation cards for a given month.
 */
export function generateSweepRecommendation(state) {
  const { user, accounts } = state;
  const bankBalance = accounts[0]?.balance || 0;
  const bufferAmount = user.outflows + user.bankFloor;
  const sweepAmount = Math.max(0, bankBalance - bufferAmount);

  return {
    type: 'sweep-recommendation',
    props: {
      sweepAmount,
      bankBalance,
      bufferAmount,
      month: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
    },
  };
}

/**
 * Generate product unlock card for Market Entry.
 */
export function generateMarketEntryUnlock(reserveBalance, monthlySurplus) {
  return {
    type: 'product-unlock',
    props: {
      product: 'Neev Market Entry',
      reason: `Your Reserve has grown to ₹${(reserveBalance / 100000).toFixed(1)}L — that's ${Math.round(reserveBalance / monthlySurplus)}x your monthly surplus. Time to start deploying into equity through PE-aware STP.`,
      metrics: [
        { label: 'XIRR (Backtested)', value: '10.53%' },
        { label: 'Max Drawdown', value: '-2.47%' },
        { label: 'Underlying', value: 'UTI Nifty 50' },
        { label: 'Deployment', value: '20%/month' },
      ],
    },
  };
}

/**
 * Generate Accelerate vs Navigate choice card.
 */
export function generateTier3Choice() {
  return {
    type: 'accelerate-vs-navigate',
    props: {},
  };
}
