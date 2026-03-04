import { calculateSweepAmount, calculateProjectedExtra, calculateOpportunityCost } from '../utils/calculations';
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

