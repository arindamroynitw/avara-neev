import React, { useState } from 'react';
import FlowShell from './FlowShell';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import { colors, fonts, easing } from '../styles/tokens';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/format';

export default function WithdrawFlow() {
  const { state, dispatch, showToast } = useApp();
  const params = state.activeFlow?.params || {};
  const [step, setStep] = useState(0);
  const [product] = useState(params.product || 'reserve');
  const [amount, setAmount] = useState(params.amount || 50000);

  const productData = state.products[product];
  const maxAmount = productData?.balance || 0;

  const handleBack = () => {
    if (step === 0) dispatch({ type: 'CLOSE_FLOW' });
    else setStep(s => s - 1);
  };

  const handleConfirm = () => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: { product, data: { balance: productData.balance - amount } } });
    dispatch({ type: 'UPDATE_METRICS', payload: { totalNeevBalance: state.metrics.totalNeevBalance - amount } });
    const hdfc = state.accounts.find(a => a.id === 'hdfc-1');
    if (hdfc) {
      dispatch({ type: 'UPDATE_ACCOUNT', payload: { id: 'hdfc-1', data: { balance: hdfc.balance + amount } } });
    }
    showToast(`Withdrawn ${formatINR(amount)} to bank account`);
    dispatch({ type: 'CLOSE_FLOW' });
  };

  return (
    <FlowShell title="Withdraw" onBack={handleBack} onClose={() => dispatch({ type: 'CLOSE_FLOW' })}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: `fadeUp 300ms ${easing.spring} both` }}>
        <Card>
          <Label>WITHDRAWAL</Label>
          <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500, color: colors.dark, textAlign: 'center', margin: '12px 0 8px' }}>
            {formatINR(amount)}
          </div>
          <input
            type="range" min={10000} max={Math.max(maxAmount, 10000)} step={10000}
            value={amount} onChange={e => setAmount(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: colors.gold }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted, marginTop: '4px' }}>
            <span>₹10K</span><span>{formatINR(maxAmount)}</span>
          </div>
        </Card>

        <Card>
          {[
            { label: 'From', value: product },
            { label: 'To', value: 'HDFC Bank ****4523' },
            { label: 'Available', value: formatINR(maxAmount) },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: i > 0 ? `1px solid ${colors.boneLight}` : 'none' }}>
              <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>{item.label}</span>
              <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark }}>{item.value}</span>
            </div>
          ))}
        </Card>

        <button onClick={handleConfirm} style={{
          width: '100%', padding: '14px', background: colors.dark, color: colors.gold,
          borderRadius: '12px', fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer',
        }}>
          Confirm Withdrawal →
        </button>
      </div>
    </FlowShell>
  );
}
