import React, { useState, useCallback } from 'react';
import { colors, typography, goldGradient, fonts, grainTexture } from '../styles/tokens';
import AgentText from '../components/shared/AgentText';
import OpportunityCostCard from '../cards/OpportunityCostCard';
import { calculateOpportunityCost } from '../utils/calculations';
import { useApp } from '../context/AppContext';

export default function HookStep() {
  const { dispatch } = useApp();
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [textDone, setTextDone] = useState(false);

  const handleSubmit = useCallback(() => {
    const parsed = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!parsed || parsed < 10000) return;
    dispatch({ type: 'SET_HOOK_DATA', payload: { idleCashAmount: parsed } });
    setSubmitted(true);
  }, [amount, dispatch]);

  const handleContinue = useCallback(() => {
    dispatch({ type: 'SET_ONBOARDING_STEP', payload: 'picture' });
  }, [dispatch]);

  const parsed = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;
  const cost = calculateOpportunityCost(parsed);

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Dark header area */}
      <div
        style={{
          background: colors.dark,
          padding: '60px 24px 40px',
          position: 'relative',
          ...grainTexture,
        }}
      >
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '200px', height: '200px',
          background: colors.gold, opacity: 0.05, borderRadius: '50%', filter: 'blur(60px)',
          transform: 'translate(30%, -50%)', pointerEvents: 'none',
        }} />

        <div style={{ ...typography.brandMark, color: colors.light, marginBottom: '32px', position: 'relative', zIndex: 1 }}>
          neev
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <AgentText
            text="Hey — how much cash is sitting in your bank account right now?"
            delay={500}
            onDone={() => setTextDone(true)}
            style={{ color: colors.light, fontSize: '1.125rem' }}
          />
        </div>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, background: colors.light, padding: '24px 20px', paddingBottom: '40px' }}>
        {textDone && !submitted && (
          <div style={{ animation: 'fadeUp 350ms cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            <div style={{
              background: colors.white,
              border: `1px solid ${colors.bone}`,
              borderRadius: '16px',
              padding: '20px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                border: `1px solid ${colors.bone}`,
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '16px',
              }}>
                <span style={{ fontFamily: fonts.serif, fontSize: '1.25rem', color: colors.muted }}>₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    if (raw.length <= 8) setAmount(raw);
                  }}
                  placeholder="6,00,000"
                  autoFocus
                  style={{
                    flex: 1,
                    fontFamily: fonts.serif,
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    color: colors.dark,
                    border: 'none',
                    outline: 'none',
                    background: 'none',
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!amount || parseInt(amount) < 10000}
                style={{
                  width: '100%',
                  background: amount && parseInt(amount) >= 10000 ? colors.dark : colors.boneLight,
                  color: amount && parseInt(amount) >= 10000 ? colors.gold : colors.muted,
                  padding: '14px',
                  borderRadius: '12px',
                  fontFamily: fonts.sans,
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  border: amount && parseInt(amount) >= 10000 ? `1px solid rgba(212, 175, 55, 0.2)` : `1px solid ${colors.bone}`,
                  cursor: amount && parseInt(amount) >= 10000 ? 'pointer' : 'default',
                  transition: 'all 200ms ease',
                }}
              >
                Show me what I'm missing →
              </button>
            </div>
          </div>
        )}

        {submitted && (
          <OpportunityCostCard
            amount={parsed}
            savingsEarnings={cost.savingsEarnings}
            neevEarnings={cost.neevEarnings}
            delta={cost.delta}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
}
