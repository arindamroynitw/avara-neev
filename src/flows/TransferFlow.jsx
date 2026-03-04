import React, { useState } from 'react';
import FlowShell from './FlowShell';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import { colors, fonts, easing } from '../styles/tokens';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/format';

export default function TransferFlow() {
  const { state, dispatch, showToast } = useApp();
  const params = state.activeFlow?.params || {};
  const [step, setStep] = useState(0);
  const [from] = useState(params.from || 'reserve');
  const [to] = useState(params.to || 'marketEntry');
  const [amount, setAmount] = useState(params.amount || 50000);

  const sourceProduct = state.products[from];
  const maxAmount = sourceProduct?.balance || 0;

  const handleBack = () => {
    if (step === 0) dispatch({ type: 'CLOSE_FLOW' });
    else setStep(s => s - 1);
  };

  const handleConfirm = () => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: { product: from, data: { balance: sourceProduct.balance - amount } } });
    dispatch({ type: 'UPDATE_PRODUCT', payload: { product: to, data: { balance: (state.products[to]?.balance || 0) + amount, active: true } } });
    showToast(`Transferred ${formatINR(amount)} from ${from} to ${to}`);
    dispatch({ type: 'CLOSE_FLOW' });
  };

  return (
    <FlowShell title="Transfer Between Products" onBack={handleBack} onClose={() => dispatch({ type: 'CLOSE_FLOW' })}>
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: `fadeUp 300ms ${easing.spring} both` }}>
          <Card>
            <Label>TRANSFER DETAILS</Label>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginBottom: '4px' }}>Amount</div>
              <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500, color: colors.dark, textAlign: 'center', marginBottom: '8px' }}>
                {formatINR(amount)}
              </div>
              <input
                type="range" min={10000} max={Math.max(maxAmount, 10000)} step={10000}
                value={amount} onChange={e => setAmount(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: colors.gold }}
              />
            </div>
          </Card>

          <Card>
            {[
              { label: 'From', value: from },
              { label: 'To', value: to },
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
            Confirm Transfer →
          </button>
        </div>
      )}
    </FlowShell>
  );
}
