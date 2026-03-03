// Neev product definitions with fund details and allocations

export const PROGRAM_ORDER = ['reserve', 'marketEntry', 'navigate', 'accelerate'];

export const productDefinitions = {
  reserve: {
    name: 'Neev Reserve',
    tagline: 'Park surplus cash safely',
    yield: 7.2,
    maxDrawdown: 0,
    risk: 'Zero Drawdown',
    liquidity: 'T+1 to T+3',
    minInvestment: 5000,
    taxTreatment: 'Equity',
    rebalancing: 'Monthly',
    allocation: {
      liquid: { weight: 0.2, fund: 'Parag Parikh Liquid Fund', cap: 200000 },
      arbitrage: { weight: 0.8, fund: 'Kotak Equity Arbitrage Fund' },
    },
  },
  marketEntry: {
    name: 'Neev Market Entry',
    tagline: 'PE-aware equity deployment',
    yield: 10.53,
    maxDrawdown: -2.47,
    risk: 'Low-Moderate',
    liquidity: 'T+5',
    minInvestment: 10000,
    taxTreatment: 'Equity',
    fund: 'UTI Nifty 50 Index Fund',
    deploymentRate: 0.2, // 20% of excess per month
    peThresholds: {
      cheap: { pe: 16, pace: 2.0 },
      fair: { pe: 20, pace: 1.0 },
      expensive: { pe: 22, pace: 0.5 },
      veryExpensive: { pe: 24, pace: 0.25 },
    },
  },
  accelerate: {
    name: 'Neev Accelerate',
    tagline: 'Curated active funds + momentum',
    yield: 14.2,
    maxDrawdown: -6.25,
    risk: 'Moderate',
    liquidity: 'T+5',
    minInvestment: 25000,
    taxTreatment: 'Equity',
    deploymentRate: 0.25,
    rebalancing: 'Quarterly momentum',
    funds: [
      { name: 'UTI Nifty 50 Index Fund', weight: 0.40, role: 'Core' },
      { name: 'ICICI Nifty Next 50 Index Fund', weight: 0.15, role: 'Satellite' },
      { name: 'HDFC Midcap Opportunities Fund', weight: 0.15, role: 'Satellite' },
      { name: 'Parag Parikh Flexi Cap Fund', weight: 0.15, role: 'Satellite' },
      { name: 'Motilal Oswal S&P 500 Index Fund', weight: 0.15, role: 'Satellite' },
    ],
  },
  navigate: {
    name: 'Neev Navigate',
    tagline: 'Pure index funds + momentum',
    yield: 13.66,
    maxDrawdown: -6.39,
    risk: 'Moderate',
    liquidity: 'T+5',
    minInvestment: 25000,
    taxTreatment: 'Equity',
    deploymentRate: 0.25,
    rebalancing: 'Quarterly momentum',
    isDefault: true,
    funds: [
      { name: 'UTI Nifty 50 Index Fund', weight: 0.40, role: 'Core' },
      { name: 'ICICI Nifty Next 50 Index Fund', weight: 0.15, role: 'Satellite' },
      { name: 'Motilal Oswal Nifty Midcap 150 Index Fund', weight: 0.15, role: 'Satellite' },
      { name: 'Motilal Oswal Nifty Midcap 150 Index Fund', weight: 0.15, role: 'Satellite' },
      { name: 'Motilal Oswal S&P 500 Index Fund', weight: 0.15, role: 'Satellite' },
    ],
  },
};

export const FUND_LOGOS = {
  'Kotak': '/logos/kotak.png',
  'Parag Parikh': '/logos/ppfas.png',
  'UTI': 'https://logo.clearbit.com/utimf.com',
  'ICICI': 'https://logo.clearbit.com/icicipruamc.com',
  'HDFC': 'https://logo.clearbit.com/hdfcfund.com',
  'Motilal Oswal': 'https://logo.clearbit.com/motilaloswalmf.com',
};

export function getFundLogo(fundName) {
  const match = Object.keys(FUND_LOGOS).find(key => fundName.includes(key));
  return match ? FUND_LOGOS[match] : null;
}
