import React, { useState, useCallback } from 'react';
import { colors, fonts, typography, easing } from '../../styles/tokens';
import Card from '../shared/Card';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/format';
import { calculateDailyEarnings } from '../../utils/calculations';
import { getDeployDispatches } from '../../utils/deployActions';
import { delays } from '../../utils/mockDelays';

export default function DeployNowOverlay() {
  const { state, dispatch } = useApp();
  const { deployNow } = state;
  const [stages, setStages] = useState([]);

  const sweepAmount = state.onboarding.planData?.sweepAmount || 0;
  const dailyEarnings = calculateDailyEarnings(sweepAmount, 7.2);
  const weeklyRate = Math.round(sweepAmount * (7.2 - 3.5) / 100 / 52);
  const hdfcAccount = state.accounts.find(a => a.id === 'hdfc-1');
  const hdfcBalance = hdfcAccount?.balance || 524000;

  const handleDeploy = useCallback(async () => {
    dispatch({ type: 'SET_DEPLOY_NOW_STAGE', payload: 'processing' });

    const steps = [
      { icon: '🔗', label: 'Connecting to bank...' },
      { icon: '💸', label: 'Processing transfer...' },
      { icon: '📊', label: 'Allocating to funds...' },
      { icon: '✓', label: 'Deployed!' },
    ];
    const delayFns = [delays.deployConnect, delays.deployTransfer, delays.deployAllocate, delays.deployConfirm];

    for (let i = 0; i < steps.length; i++) {
      await delayFns[i]();
      setStages(prev => [...prev, steps[i]]);
    }

    // Execute deploy dispatches
    const dispatches = getDeployDispatches(sweepAmount, 'hdfc-1', hdfcBalance);
    dispatches.forEach(d => dispatch(d));

    // Dismiss deploy-reminder cards
    state.agentCards.forEach(c => {
      if (c.type === 'deploy-reminder' && !c.dismissed) {
        dispatch({ type: 'DISMISS_AGENT_CARD', payload: c.id });
      }
    });

    setTimeout(() => {
      dispatch({ type: 'SET_DEPLOY_NOW_STAGE', payload: 'confirmed' });
    }, 600);
  }, [dispatch, sweepAmount, hdfcBalance, state.agentCards]);

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLOSE_DEPLOY_NOW' });
    setStages([]);
  }, [dispatch]);

  if (!deployNow.active) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: colors.light, zIndex: 200,
      display: 'flex', flexDirection: 'column',
      maxWidth: '390px', margin: '0 auto',
      animation: `springIn 400ms ${easing.spring} both`,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '52px 20px 12px', borderBottom: `1px solid ${colors.boneLight}`,
      }}>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark }}>
          Deploy Your Plan
        </div>
        <button onClick={handleClose} style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: colors.boneLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.dark} strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Recap phase */}
        {deployNow.stage === 'recap' && (
          <div style={{ animation: `fadeUp 300ms ${easing.spring} both` }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.25rem' }}>🛡️</span>
                <div>
                  <div style={{ ...typography.displaySmall, color: colors.dark }}>Neev Reserve</div>
                  <div style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted }}>7.2% · Zero Drawdown</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.875rem', marginBottom: '8px' }}>
                <span style={{ color: colors.muted }}>Deploy amount</span>
                <span style={{ color: colors.dark, fontWeight: 600 }}>{formatINR(sweepAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.875rem', marginBottom: '8px' }}>
                <span style={{ color: colors.muted }}>Daily earnings</span>
                <span style={{ color: colors.success, fontWeight: 600 }}>{formatINR(dailyEarnings)}/day</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.875rem' }}>
                <span style={{ color: colors.muted }}>Weekly rate over savings</span>
                <span style={{ color: colors.gold, fontWeight: 600 }}>≈{formatINR(weeklyRate)}/week</span>
              </div>
            </Card>

            <button onClick={handleDeploy} style={{
              width: '100%', marginTop: '16px', background: colors.dark, color: colors.gold,
              padding: '14px', borderRadius: '12px', fontFamily: fonts.sans, fontSize: '0.625rem',
              fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer',
            }}>
              Deploy {formatINR(sweepAmount)} →
            </button>
          </div>
        )}

        {/* Processing phase */}
        {deployNow.stage === 'processing' && (
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stages.map((stage, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', animation: `fadeUp 300ms ${easing.spring} both` }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: i === stages.length - 1 && stages.length === 4 ? colors.success : colors.dark,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: stage.icon === '✓' ? '0.875rem' : '1rem',
                    color: colors.gold,
                  }}>
                    {stage.icon === '✓' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : stage.icon}
                  </div>
                  <span style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 500, color: colors.dark }}>
                    {stage.label}
                  </span>
                </div>
              ))}
              {stages.length < 4 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: colors.boneLight, animation: 'shimmerPulse 1s ease-in-out infinite' }} />
                  <div style={{ width: '60%', height: '14px', borderRadius: '4px', background: colors.boneLight, animation: 'shimmerPulse 1s ease-in-out infinite' }} />
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Confirmed phase */}
        {deployNow.stage === 'confirmed' && (
          <div style={{ textAlign: 'center', animation: `fadeUp 400ms ${easing.spring} both` }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: colors.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ ...typography.displaySmall, color: colors.dark, marginBottom: '8px' }}>
              Deployed to Neev Reserve
            </div>
            <div style={{ fontFamily: fonts.serif, fontSize: '1.75rem', fontWeight: 500, color: colors.dark, marginBottom: '8px' }}>
              {formatINR(sweepAmount)}
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.success, marginBottom: '32px' }}>
              Earning {formatINR(dailyEarnings)}/day at 7.2%
            </div>
            <button onClick={handleClose} style={{
              width: '100%', background: colors.dark, color: colors.gold,
              padding: '14px', borderRadius: '12px', fontFamily: fonts.sans, fontSize: '0.625rem',
              fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer',
            }}>
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
