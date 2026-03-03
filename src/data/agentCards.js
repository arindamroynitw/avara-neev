// Pre-composed agent cards per lifecycle stage

export function getAgentCardsForStage(stage) {
  const now = Date.now();

  const cards = {
    fresh: [
      {
        id: 'welcome-1',
        type: 'welcome',
        props: { message: "I'm watching your bank account. When your salary lands and bills clear, I'll have a plan ready for you." },
        timestamp: now,
        dismissed: false,
        expired: false,
      },
    ],
    month1: [
      {
        id: 'mb-m1',
        type: 'morning-brief',
        props: {
          message: 'Your Reserve earned ₹84 overnight. That\'s ₹2,520 this month — already ahead of your savings account.',
          showWork: 'Neev Reserve balance: ₹4,22,520 × 7.2% ÷ 365 = ₹84/day. Savings account would earn ₹4,22,520 × 3.5% ÷ 365 = ₹40/day. Extra: ₹44/day.',
        },
        timestamp: now,
        dismissed: false,
        expired: false,
      },
      {
        id: 'sc-m1',
        type: 'sweep-confirmation',
        props: { message: 'Your first sweep is complete. ₹4,20,000 is now earning 7.2% in Neev Reserve.', amount: 420000 },
        timestamp: now - 86400000,
        dismissed: false,
        expired: false,
      },
    ],
    month3: [
      {
        id: 'mb-m3',
        type: 'morning-brief',
        props: {
          message: 'Your portfolio earned ₹540 overnight. Reserve at ₹5,46,000, Market Entry building at ₹52,000. All well.',
          showWork: 'Reserve: ₹5,46,000 × 7.2% ÷ 365 = ₹108/day. Market Entry: ₹52,000 × 10.53% ÷ 365 = ₹15/day (unrealised). Total daily accrual: ~₹123.',
        },
        timestamp: now,
        dismissed: false,
        expired: false,
      },
      {
        id: 'ms-m3',
        type: 'milestone',
        props: { message: 'You crossed ₹5,000 extra earned! That\'s a weekend getaway worth of free money.', goldMetric: '₹5,000 extra' },
        timestamp: now - 43200000,
        dismissed: false,
        expired: false,
      },
    ],
    month6: [
      {
        id: 'mb-m6',
        type: 'morning-brief',
        props: {
          message: 'Your portfolio earned ₹1,080 overnight across three products. Reserve steady, Market Entry at ₹1.6L, Accelerate gaining momentum.',
          showWork: 'Reserve: ₹4,80,000 × 7.2% ÷ 365 = ₹95/day. Market Entry: ₹1,60,000 × 10.53% ÷ 365 = ₹46/day. Accelerate: ₹85,000 × 14.2% ÷ 365 = ₹33/day. Total: ~₹174/day.',
        },
        timestamp: now,
        dismissed: false,
        expired: false,
      },
      {
        id: 'ya-m6',
        type: 'yield-accrual',
        props: { message: 'Yesterday\'s yield across all products', amount: 1080 },
        timestamp: now - 43200000,
        dismissed: false,
        expired: false,
      },
      {
        id: 'ms-m6',
        type: 'milestone',
        props: { message: 'You crossed ₹15,000 extra earned! That\'s a round-trip flight to Goa.', goldMetric: '₹15,000 extra' },
        timestamp: now - 86400000,
        dismissed: false,
        expired: false,
      },
    ],
    month9: [
      {
        id: 'mb-m9',
        type: 'morning-brief',
        props: {
          message: 'Portfolio at ₹15.2L across 3 products. Yesterday you earned ₹280 — that\'s ₹8,400/month in passive income. Well ahead of plan.',
          showWork: 'Reserve: ₹5,20,000 × 7.2% ÷ 365 = ₹103. Market Entry: ₹4,80,000 × 10.53% ÷ 365 = ₹138. Accelerate: ₹5,20,000 × 14.2% ÷ 365 = ₹202. Total: ~₹443/day (simplified to ₹280 accounting for actual NAV movements).',
        },
        timestamp: now,
        dismissed: false,
        expired: false,
      },
      {
        id: 'ya-m9',
        type: 'yield-accrual',
        props: { message: 'Yesterday\'s yield across all products', amount: 2800 },
        timestamp: now - 43200000,
        dismissed: false,
        expired: false,
      },
      {
        id: 'ms-m9',
        type: 'milestone',
        props: { message: 'You\'ve crossed ₹40,000 extra earned in 9 months! At this pace, you\'ll earn ₹60K+ extra this year.', goldMetric: '₹40,000 extra' },
        timestamp: now - 172800000,
        dismissed: false,
        expired: false,
      },
    ],
  };

  return cards[stage] || [];
}
