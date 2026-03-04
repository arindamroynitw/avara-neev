import React, { useState, useCallback } from 'react';
import FlowShell from './FlowShell';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import { colors, fonts, easing, typography } from '../styles/tokens';
import { useApp } from '../context/AppContext';
import { formatINR, formatCompact } from '../utils/format';
import { calculateDailyEarnings } from '../utils/calculations';
import { getDeployDispatches } from '../utils/deployActions';

const STEPS = ['amount', 'review', 'deploying', 'success'];

export default function DeployFlow() {
  const { state, dispatch } = useApp();
  const params = state.activeFlow?.params || {};
  const [step, setStep] = useState(0);

  const maxAvailable = state.accounts.reduce((sum, a) => sum + a.balance, 0) - (state.user.bankFloor || 30000);
  const defaultAmount = Math.min(params.amount || 100000, maxAvailable);
  const [amount, setAmount] = useState(defaultAmount);
  const [product] = useState(params.product || 'reserve');

  const dailyEarnings = calculateDailyEarnings(amount, state.products[product]?.yield || 7.2);
  const hdfcAccount = state.accounts.find(a => a.id === 'hdfc-1');

  const handleBack = () => {
    if (step === 0) dispatch({ type: 'CLOSE_FLOW' });
    else setStep(s => s - 1);
  };

  const handleDeploy = useCallback(() => {
    setStep(2); // deploying
    setTimeout(() => {
      const dispatches = getDeployDispatches(amount, 'hdfc-1', hdfcAccount?.balance || 0);
      dispatches.forEach(d => dispatch(d));
      setStep(3); // success
    }, 2000);
  }, [amount, dispatch, hdfcAccount]);

  const currentStep = STEPS[step];

  return (
    <FlowShell title="Deploy to Neev" onBack={handleBack} onClose={() => dispatch({ type: 'CLOSE_FLOW' })}>
      {currentStep === 'amount' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: `fadeUp 300ms ${easing.spring} both` }}>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, marginBottom: '8px' }}>
            How much would you like to deploy?
          </div>

          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div style={{ fontFamily: fonts.serif, fontSize: '2rem', fontWeight: 500, color: colors.dark }}>
              {formatINR(amount)}
            </div>
          </div>

          <input
            type="range"
            min={10000} max={Math.max(maxAvailable, 10000)} step={10000}
            value={amount}
            onChange={e => setAmount(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: colors.gold }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted }}>
            <span>₹10K</span><span>{formatCompact(maxAvailable)}</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[50000, 100000, 200000, 500000].filter(v => v <= maxAvailable).map(val => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                style={{
                  padding: '6px 14px', borderRadius: '16px',
                  border: `1px solid ${amount === val ? colors.gold : colors.bone}`,
                  background: amount === val ? 'rgba(212,175,55,0.08)' : colors.white,
                  fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600,
                  color: amount === val ? colors.gold : colors.dark, cursor: 'pointer',
                }}
              >
                {formatINR(val)}
              </button>
            ))}
          </div>

          <Card style={{ marginTop: '8px', borderLeft: `3px solid ${colors.gold}` }}>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark }}>
              At {state.products[product]?.yield || 7.2}%, you'd earn <span style={{ fontWeight: 600, color: colors.gold }}>{formatINR(dailyEarnings)}/day</span>
            </div>
          </Card>

          <button
            onClick={() => setStep(1)}
            style={{
              width: '100%', marginTop: '8px', padding: '14px', background: colors.dark,
              color: colors.gold, borderRadius: '12px', fontFamily: fonts.sans,
              fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer',
            }}
          >
            Review →
          </button>
        </div>
      )}

      {currentStep === 'review' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: `fadeUp 300ms ${easing.spring} both` }}>
          <Card>
            <Label>DEPLOYMENT SUMMARY</Label>
            {[
              { label: 'Amount', value: formatINR(amount) },
              { label: 'From', value: hdfcAccount ? `${hdfcAccount.bank} ${hdfcAccount.maskedNumber}` : 'Bank account' },
              { label: 'To', value: 'Neev Reserve' },
              { label: 'Daily earnings', value: `${formatINR(dailyEarnings)}/day` },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                borderTop: i > 0 ? `1px solid ${colors.boneLight}` : 'none',
              }}>
                <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>{item.label}</span>
                <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark }}>{item.value}</span>
              </div>
            ))}
          </Card>

          <button
            onClick={handleDeploy}
            style={{
              width: '100%', padding: '14px', background: colors.dark,
              color: colors.gold, borderRadius: '12px', fontFamily: fonts.sans,
              fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer',
            }}
          >
            Deploy {formatINR(amount)} →
          </button>
        </div>
      )}

      {currentStep === 'deploying' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%', border: `3px solid ${colors.boneLight}`,
            borderTopColor: colors.gold, animation: 'spin 1s linear infinite',
          }} />
          <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.muted }}>
            Deploying your cash...
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {currentStep === 'success' && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '300px', gap: '16px', animation: `fadeUp 400ms ${easing.spring} both`,
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', background: colors.success,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ ...typography.displaySmall, color: colors.dark, textAlign: 'center' }}>
            Deployed to Neev Reserve
          </div>
          <div style={{ fontFamily: fonts.serif, fontSize: '1.75rem', fontWeight: 500, color: colors.dark }}>
            {formatINR(amount)}
          </div>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.success }}>
            Earning {formatINR(dailyEarnings)}/day
          </div>
          <button
            onClick={() => dispatch({ type: 'CLOSE_FLOW' })}
            style={{
              width: '100%', marginTop: '16px', padding: '14px', background: colors.dark,
              color: colors.gold, borderRadius: '12px', fontFamily: fonts.sans,
              fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer',
            }}
          >
            Go to Home →
          </button>
        </div>
      )}
    </FlowShell>
  );
}
