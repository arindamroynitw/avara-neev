import React, { useCallback, useMemo } from 'react';
import { colors, typography, grainTexture } from '../styles/tokens';
import AgentText from '../components/shared/AgentText';
import DeploymentPlanCard from '../cards/DeploymentPlanCard';
import { calculateSweepAmount, calculateProjectedExtra } from '../utils/calculations';
import { useApp } from '../context/AppContext';

export default function PlanStep() {
  const { state, dispatch } = useApp();
  const { hookData, pictureData } = state.onboarding;

  const plan = useMemo(() => {
    const idleCash = hookData.idleCashAmount || 600000;
    const totalOutflows = pictureData.outflows || 72000;
    const bankFloor = 30000;

    // Use actual user-entered values when available, fall back to ratio-based derivation
    const breakdown = pictureData.outflowBreakdown;
    const rent = breakdown?.rent ?? Math.round(totalOutflows * 0.5);
    const sips = breakdown?.sips ?? Math.round(totalOutflows * 0.2);
    const emi = breakdown?.emi ?? Math.round(totalOutflows * 0.15);
    const other = breakdown?.other ?? (totalOutflows - rent - sips - emi);

    const upcomingExpense = pictureData.upcomingExpense || 0;
    const sweepAmount = calculateSweepAmount(idleCash, totalOutflows, bankFloor, upcomingExpense);
    const projectedExtra = calculateProjectedExtra(sweepAmount);

    return {
      bufferBreakdown: { rent, sips, emi, other, bankFloor, upcomingExpense },
      sweepAmount,
      projectedExtra,
    };
  }, [hookData, pictureData]);

  const handleContinue = useCallback(() => {
    dispatch({ type: 'SET_PLAN_DATA', payload: {
      bufferAmount: Object.values(plan.bufferBreakdown).reduce((s, v) => s + v, 0),
      sweepAmount: plan.sweepAmount,
      projectedExtraYearly: plan.projectedExtra,
    }});
    dispatch({ type: 'SET_ONBOARDING_STEP', payload: 'commitment' });
  }, [plan, dispatch]);

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: colors.dark, padding: '52px 24px 24px', position: 'relative', ...grainTexture }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: colors.gold, opacity: 0.05, borderRadius: '50%', filter: 'blur(60px)', transform: 'translate(30%, -50%)', pointerEvents: 'none' }} />
        <div style={{ ...typography.brandMark, color: colors.light, marginBottom: '16px', position: 'relative', zIndex: 1 }}>neev</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AgentText text="Here's your personalised plan." animate style={{ color: colors.light }} />
        </div>
      </div>

      <div style={{ flex: 1, background: colors.light, padding: '20px', paddingBottom: '40px', overflowY: 'auto' }}>
        <DeploymentPlanCard
          bufferBreakdown={plan.bufferBreakdown}
          sweepAmount={plan.sweepAmount}
          projectedExtra={plan.projectedExtra}
          idleCash={hookData.idleCashAmount || 600000}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
}
