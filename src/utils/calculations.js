/**
 * Calculate the safety buffer to keep in bank.
 * Buffer = major outflows + bank floor (₹30K)
 */
export function calculateBuffer(outflows, bankFloor = 30000) {
  return outflows + bankFloor;
}

/**
 * Calculate how much can be swept.
 * Sweep = idle cash - buffer - upcoming expense
 */
export function calculateSweepAmount(idleCash, outflows, bankFloor = 30000, upcomingExpense = 0) {
  const buffer = calculateBuffer(outflows, bankFloor);
  const sweep = idleCash - buffer - upcomingExpense;
  return Math.max(0, sweep);
}

/**
 * Calculate opportunity cost: what you earn at savings rate vs Neev Reserve rate.
 */
export function calculateOpportunityCost(amount, savingsRate = 3.5, neevRate = 7.2) {
  const savingsEarnings = Math.round(amount * (savingsRate / 100));
  const neevEarnings = Math.round(amount * (neevRate / 100));
  const delta = neevEarnings - savingsEarnings;
  return { savingsEarnings, neevEarnings, delta };
}

/**
 * Calculate projected extra yearly earnings for the plan card.
 */
export function calculateProjectedExtra(sweepAmount, savingsRate = 3.5, neevRate = 7.2) {
  const yearlyExtra = Math.round(sweepAmount * ((neevRate - savingsRate) / 100));
  return yearlyExtra;
}

/**
 * Calculate daily earnings for a given balance and rate.
 */
export function calculateDailyEarnings(balance, annualRate) {
  return Math.round((balance * (annualRate / 100)) / 365);
}
