import React, { useState, useCallback } from 'react';
import { colors, fonts, typography, easing } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import { formatINR, formatPercent } from '../../utils/format';
import { productDefinitions } from '../../data/products';
import { calculateDailyEarnings } from '../../utils/calculations';
import { delays } from '../../utils/mockDelays';

export default function ActivationSheet({ productKey, onClose }) {
  const { state, dispatch } = useApp();
  const def = productDefinitions[productKey];
  const [amount, setAmount] = useState(def.minInvestment);
  const [phase, setPhase] = useState('input'); // input | processing | done
  const [stages, setStages] = useState([]);

  const hdfcAccount = state.accounts.find(a => a.id === 'hdfc-1');
  const maxAmount = hdfcAccount?.balance || 0;

  const quickAmounts = [25000, 50000, 100000, 200000].filter(a => a <= maxAmount);

  const handleActivate = useCallback(async () => {
    setPhase('processing');
    const steps = [
      { icon: '🔗', label: 'Connecting to bank...' },
      { icon: '💸', label: 'Processing transfer...' },
      { icon: '✓', label: 'Activated!' },
    ];
    const delayFns = [delays.deployConnect, delays.deployTransfer, delays.deployAllocate];

    for (let i = 0; i < steps.length; i++) {
      await delayFns[i]();
      setStages(prev => [...prev, steps[i]]);
    }

    const dailyEarnings = calculateDailyEarnings(amount, def.yield);

    dispatch({
      type: 'ACTIVATE_PRODUCT',
      payload: { product: productKey, data: { balance: amount, dailyEarnings } },
    });
    dispatch({
      type: 'UPDATE_ACCOUNT',
      payload: { id: 'hdfc-1', data: { balance: (hdfcAccount?.balance || 0) - amount } },
    });
    dispatch({
      type: 'UPDATE_METRICS',
      payload: {
        totalNeevBalance: state.metrics.totalNeevBalance + amount,
        sweepCount: state.metrics.sweepCount + 1,
        totalSwept: state.metrics.totalSwept + amount,
      },
    });
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: `activate-${productKey}-${Date.now()}`,
        type: 'activation',
        date: new Date().toISOString(),
        title: `Activated ${def.name}`,
        amount,
        status: 'completed',
      },
    });

    if (state.lifecycle === 'zero-state') {
      dispatch({ type: 'SET_LIFECYCLE', payload: 'active' });
    }

    setTimeout(() => {
      setPhase('done');
    }, 500);
  }, [amount, def, productKey, dispatch, state, hdfcAccount]);

  const handleDone = useCallback(() => {
    onClose();
    dispatch({ type: 'SET_PRODUCT_DETAIL', payload: productKey });
  }, [dispatch, productKey, onClose]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 300, maxWidth: '390px', margin: '0 auto',
    }}>
      {/* Scrim */}
      <div
        onClick={phase === 'input' ? onClose : undefined}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          animation: `fadeIn 200ms ease both`,
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: colors.white, borderRadius: '20px 20px 0 0',
        padding: '24px 20px 36px',
        animation: `slideUp 300ms ${easing.spring} both`,
      }}>
        {phase === 'input' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ ...typography.displaySmall, color: colors.dark }}>{def.name}</div>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted }}>
                  {formatPercent(def.yield)} · {def.risk}
                </div>
              </div>
              <button onClick={onClose} style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: colors.boneLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.dark} strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Amount input */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', fontWeight: 600, color: colors.muted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Amount
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                border: `1px solid ${colors.bone}`, borderRadius: '10px', padding: '12px 14px',
              }}>
                <span style={{ fontFamily: fonts.sans, fontSize: '1rem', color: colors.muted }}>₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => {
                    const val = parseInt(e.target.value) || 0;
                    setAmount(Math.min(val, maxAmount));
                  }}
                  min={def.minInvestment}
                  max={maxAmount}
                  style={{
                    flex: 1, fontFamily: fonts.sans, fontSize: '1rem', fontWeight: 600,
                    color: colors.dark, border: 'none', outline: 'none', background: 'none',
                  }}
                />
              </div>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted, marginTop: '4px' }}>
                Min {formatINR(def.minInvestment)}
              </div>
            </div>

            {/* Quick amounts */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {quickAmounts.map(a => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  style={{
                    fontFamily: fonts.sans, fontSize: '0.6875rem', fontWeight: 600,
                    color: amount === a ? colors.gold : colors.dark,
                    background: amount === a ? colors.dark : colors.boneLight,
                    padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                  }}
                >
                  {a >= 100000 ? `₹${a / 100000}L` : `₹${a / 1000}K`}
                </button>
              ))}
            </div>

            {/* Source */}
            <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginBottom: '20px' }}>
              From {hdfcAccount?.bank || 'HDFC Bank'} {hdfcAccount?.maskedNumber || '****4523'}
            </div>

            <button
              onClick={handleActivate}
              disabled={amount < def.minInvestment || amount > maxAmount}
              style={{
                width: '100%', background: colors.dark, color: colors.gold,
                padding: '14px', borderRadius: '12px', fontFamily: fonts.sans,
                fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`,
                cursor: 'pointer',
                opacity: amount < def.minInvestment || amount > maxAmount ? 0.5 : 1,
              }}
            >
              Activate →
            </button>
          </>
        )}

        {phase === 'processing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px 0' }}>
            {stages.map((stage, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', animation: `fadeUp 300ms ${easing.spring} both` }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: i === stages.length - 1 && stages.length === 3 ? colors.success : colors.dark,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: stage.icon === '✓' ? '0.75rem' : '0.875rem',
                  color: colors.gold,
                }}>
                  {stage.icon === '✓' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : stage.icon}
                </div>
                <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 500, color: colors.dark }}>{stage.label}</span>
              </div>
            ))}
            {stages.length < 3 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: colors.boneLight, animation: 'shimmerPulse 1s ease-in-out infinite' }} />
                <div style={{ width: '50%', height: '12px', borderRadius: '4px', background: colors.boneLight, animation: 'shimmerPulse 1s ease-in-out infinite' }} />
              </div>
            )}
          </div>
        )}

        {phase === 'done' && (
          <div style={{ textAlign: 'center', padding: '12px 0', animation: `fadeUp 300ms ${easing.spring} both` }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: colors.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ ...typography.displaySmall, color: colors.dark, marginBottom: '4px' }}>
              {def.name} Activated
            </div>
            <div style={{ fontFamily: fonts.serif, fontSize: '1.25rem', fontWeight: 500, color: colors.dark, marginBottom: '4px' }}>
              {formatINR(amount)}
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.success, marginBottom: '16px' }}>
              Earning {formatPercent(def.yield)} p.a.
            </div>
            <button onClick={handleDone} style={{
              width: '100%', background: colors.dark, color: colors.gold,
              padding: '12px', borderRadius: '12px', fontFamily: fonts.sans,
              fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`,
              cursor: 'pointer',
            }}>
              View Details →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
