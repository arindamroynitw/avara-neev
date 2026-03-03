/**
 * Format amount in Indian notation: ₹X,XX,XXX
 */
export function formatINR(amount, showDecimal = false) {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (showDecimal) {
    const [intPart, decPart] = absAmount.toFixed(2).split('.');
    return `${sign}₹${addIndianCommas(intPart)}.${decPart}`;
  }

  return `${sign}₹${addIndianCommas(Math.round(absAmount).toString())}`;
}

function addIndianCommas(numStr) {
  const len = numStr.length;
  if (len <= 3) return numStr;

  let result = numStr.slice(-3);
  let remaining = numStr.slice(0, -3);

  while (remaining.length > 2) {
    result = remaining.slice(-2) + ',' + result;
    remaining = remaining.slice(0, -2);
  }

  if (remaining.length > 0) {
    result = remaining + ',' + result;
  }

  return result;
}

/**
 * Format amount in lakhs: ₹55.6L
 */
export function formatLakhs(amount) {
  const lakhs = amount / 100000;
  if (lakhs >= 100) {
    const crores = lakhs / 100;
    return `₹${crores.toFixed(1)} Cr`;
  }
  if (lakhs >= 10) {
    return `₹${lakhs.toFixed(1)}L`;
  }
  return `₹${lakhs.toFixed(1)}L`;
}

/**
 * Format amount in compact Indian notation: ₹45K, ₹6L, ₹1.2Cr
 * < ₹1,000 → exact (₹500)
 * ₹1K–₹99.9K → ₹45K, ₹1.5K
 * ₹1L–₹99.9L → ₹6L, ₹1.8L
 * ₹1Cr+ → ₹1.2Cr
 */
export function formatCompact(amount) {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs < 1000) {
    return `${sign}₹${Math.round(abs)}`;
  }

  if (abs < 99950) {
    const k = abs / 1000;
    const formatted = k < 10 ? k.toFixed(1).replace(/\.0$/, '') : Math.round(k).toString();
    return `${sign}₹${formatted}K`;
  }

  if (abs < 9995000) {
    const l = abs / 100000;
    const formatted = l < 10 ? l.toFixed(1).replace(/\.0$/, '') : Math.round(l).toString();
    return `${sign}₹${formatted}L`;
  }

  const cr = abs / 10000000;
  const formatted = cr.toFixed(1).replace(/\.0$/, '');
  return `${sign}₹${formatted}Cr`;
}

/**
 * Format percentage
 */
export function formatPercent(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}
