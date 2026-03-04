import React, { useState } from 'react';
import FlowShell from './FlowShell';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import { colors, fonts, easing, typography } from '../styles/tokens';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/format';
import { productDefinitions } from '../data/products';
import { calculateDailyEarnings } from '../utils/calculations';

export default function ProductActivateFlow() {
  const { state, dispatch, showToast } = useApp();
  const params = state.activeFlow?.params || {};
  const [step, setStep] = useState(0);
  const productKey = params.product || 'reserve';
  const def = productDefinitions[productKey];
  const [amount, setAmount] = useState(params.amount || def?.minInvestment || 50000);

  const dailyEarnings = calculateDailyEarnings(amount, def?.yield || 7.2);

  const handleBack = () => {
    if (step === 0) dispatch({ type: 'CLOSE_FLOW' });
    else setStep(s => s - 1);
  };

  const handleConfirm = () => {
    dispatch({ type: 'ACTIVATE_PRODUCT', payload: { product: productKey, data: { balance: amount, dailyEarnings } } });
    dispatch({ type: 'UPDATE_METRICS', payload: {
      totalNeevBalance: state.metrics.totalNeevBalance + amount,
      sweepCount: state.metrics.sweepCount + 1,
      totalSwept: state.metrics.totalSwept + amount,
    }});
    if (state.lifecycle === 'zero-state') {
      dispatch({ type: 'SET_LIFECYCLE', payload: 'active' });
    }
    showToast(`${def?.name || productKey} activated with ${formatINR(amount)}`);
    dispatch({ type: 'CLOSE_FLOW' });
  };

  return (
    <FlowShell title={`Activate ${def?.name || productKey}`} onBack={handleBack} onClose={() => dispatch({ type: 'CLOSE_FLOW' })}>
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: `fadeUp 300ms ${easing.spring} both` }}>
          <Card>
            <Label>{def?.name}</Label>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginTop: '8px' }}>
              {def?.yield}% XIRR · {def?.risk} risk · {def?.liquidity}
            </div>
          </Card>

          <Card>
            <Label>INVESTMENT AMOUNT</Label>
            <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500, color: colors.dark, textAlign: 'center', margin: '12px 0 8px' }}>
              {formatINR(amount)}
            </div>
            <input
              type="range" min={def?.minInvestment || 10000} max={500000} step={10000}
              value={amount} onChange={e => setAmount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: colors.gold }}
            />
            <div style={{ marginTop: '8px', fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.gold, textAlign: 'center' }}>
              Earning {formatINR(dailyEarnings)}/day at {def?.yield}%
            </div>
          </Card>

          <button onClick={() => setStep(1)} style={{
            width: '100%', padding: '14px', background: colors.dark, color: colors.gold,
            borderRadius: '12px', fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer',
          }}>
            Review →
          </button>
        </div>
      )}

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: `fadeUp 300ms ${easing.spring} both` }}>
          <Card style={{ borderLeft: `3px solid ${colors.gold}` }}>
            <Label>CONFIRM ACTIVATION</Label>
            {[
              { label: 'Product', value: def?.name },
              { label: 'Amount', value: formatINR(amount) },
              { label: 'Expected return', value: `${def?.yield}% p.a.` },
              { label: 'Daily earnings', value: `${formatINR(dailyEarnings)}/day` },
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
            Activate {def?.name} →
          </button>
        </div>
      )}
    </FlowShell>
  );
}
