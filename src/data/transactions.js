// Pre-seeded transaction data per lifecycle stage

export function getTransactionsForStage(stage) {
  const base = {
    fresh: [],
    month1: [
      { id: 't1', type: 'sweep', date: '2026-02-08', data: { product: 'reserve', amount: 420000, status: 'completed', via: 'UPI AutoPay' } },
      { id: 't2', type: 'yield', date: '2026-02-09', data: { product: 'reserve', amount: 84, status: 'reinvested' } },
      { id: 't3', type: 'yield', date: '2026-02-10', data: { product: 'reserve', amount: 84, status: 'reinvested' } },
    ],
    month3: [
      { id: 't10', type: 'sweep', date: '2026-04-08', data: { product: 'reserve', amount: 130000, status: 'completed', via: 'UPI AutoPay' } },
      { id: 't9', type: 'stp', date: '2026-04-07', data: { from: 'reserve', to: 'marketEntry', amount: 28000, status: 'completed' } },
      { id: 't8', type: 'sweep', date: '2026-03-08', data: { product: 'reserve', amount: 130000, status: 'completed', via: 'UPI AutoPay' } },
      { id: 't7', type: 'stp', date: '2026-03-07', data: { from: 'reserve', to: 'marketEntry', amount: 24000, status: 'completed' } },
      { id: 't6', type: 'sweep', date: '2026-02-08', data: { product: 'reserve', amount: 420000, status: 'completed', via: 'UPI AutoPay' } },
      { id: 't5', type: 'yield', date: '2026-03-15', data: { product: 'reserve', amount: 3240, status: 'reinvested' } },
      { id: 't4', type: 'yield', date: '2026-02-28', data: { product: 'reserve', amount: 2100, status: 'reinvested' } },
    ],
    month6: [
      { id: 't20', type: 'sweep', date: '2026-07-08', data: { product: 'reserve', amount: 135000, status: 'completed', via: 'UPI AutoPay' } },
      { id: 't19', type: 'stp', date: '2026-07-07', data: { from: 'reserve', to: 'marketEntry', amount: 32000, status: 'completed' } },
      { id: 't18', type: 'rebalance', date: '2026-07-01', data: { product: 'accelerate', status: 'completed' } },
      { id: 't17', type: 'sweep', date: '2026-06-08', data: { product: 'reserve', amount: 130000, status: 'completed', via: 'UPI AutoPay' } },
      { id: 't16', type: 'stp', date: '2026-06-07', data: { from: 'reserve', to: 'marketEntry', amount: 30000, status: 'completed' } },
      { id: 't15', type: 'sweep', date: '2026-05-08', data: { product: 'reserve', amount: 130000, status: 'completed', via: 'UPI AutoPay' } },
    ],
    month9: [
      { id: 't30', type: 'sweep', date: '2026-10-08', data: { product: 'reserve', amount: 140000, status: 'completed', via: 'UPI AutoPay' } },
      { id: 't29', type: 'stp', date: '2026-10-07', data: { from: 'reserve', to: 'marketEntry', amount: 35000, status: 'completed' } },
      { id: 't28', type: 'rebalance', date: '2026-10-01', data: { product: 'accelerate', status: 'completed' } },
      { id: 't27', type: 'sweep', date: '2026-09-08', data: { product: 'reserve', amount: 135000, status: 'completed', via: 'UPI AutoPay' } },
      { id: 't26', type: 'sweep', date: '2026-08-08', data: { product: 'reserve', amount: 135000, status: 'completed', via: 'UPI AutoPay' } },
    ],
  };
  return base[stage] || [];
}
