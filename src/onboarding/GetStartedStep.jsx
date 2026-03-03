import React, { useState, useCallback } from 'react';
import { colors, fonts, typography, goldGradient, grainTexture, easing } from '../styles/tokens';
import AgentText from '../components/shared/AgentText';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import FundLogo from '../components/shared/FundLogo';
import GoldDonut from '../components/viz/GoldDonut';
import { useApp } from '../context/AppContext';
import { formatINR, formatCompact } from '../utils/format';
import { calculateDailyEarnings } from '../utils/calculations';
import { getDeployDispatches } from '../utils/deployActions';
import { delays } from '../utils/mockDelays';

export default function GetStartedStep() {
  const { state, dispatch } = useApp();
  const [substep, setSubstep] = useState('intro'); // intro | numbers | context | deploying | confirmed

  const { planData, hookData } = state.onboarding;
  const sweepAmount = planData.sweepAmount || 0;
  const bufferAmount = planData.bufferAmount || 0;
  const idleCash = hookData.idleCashAmount || 0;
  const dailyEarnings = calculateDailyEarnings(sweepAmount, 7.2);
  const weeklyRate = Math.round(sweepAmount * (7.2 - 3.5) / 100 / 52);
  const yearlyExtra = Math.round(sweepAmount * (7.2 - 3.5) / 100);

  // Fund allocation math
  const liquidAllocation = Math.min(sweepAmount * 0.2, 200000);
  const arbitrageAllocation = sweepAmount - liquidAllocation;

  const hdfcAccount = state.accounts.find(a => a.id === 'hdfc-1');
  const hdfcBalance = hdfcAccount?.balance || 524000;

  const ctaStyle = {
    width: '100%', marginTop: '16px', background: colors.dark, color: colors.gold,
    padding: '14px', borderRadius: '12px', fontFamily: fonts.sans, fontSize: '0.625rem',
    fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
    border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer',
  };

  const textLinkStyle = {
    fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted,
    background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0',
    textDecoration: 'underline', textUnderlineOffset: '3px',
  };

  const handleDeploy = useCallback(async () => {
    setSubstep('deploying');
  }, []);

  const handleDoLater = useCallback(() => {
    dispatch({
      type: 'ADD_AGENT_CARD',
      payload: {
        id: `deploy-reminder-${Date.now()}`,
        type: 'deploy-reminder',
        props: {
          sweepAmount,
          dailyEarnings,
        },
        dismissed: false,
        expired: false,
      },
    });
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  }, [dispatch, sweepAmount, dailyEarnings]);

  const handleOpenChat = useCallback(() => {
    dispatch({ type: 'COMPLETE_ONBOARDING', payload: { lifecycle: 'zero-state' } });
    setTimeout(() => dispatch({ type: 'OPEN_CONVERSATION' }), 300);
  }, [dispatch]);

  const handleGoHome = useCallback(() => {
    dispatch({ type: 'COMPLETE_ONBOARDING', payload: { lifecycle: 'active' } });
  }, [dispatch]);

  // Deploy animation
  const DeployingScreen = () => {
    const [stages, setStages] = useState([]);

    React.useEffect(() => {
      let cancelled = false;
      async function runAnimation() {
        const steps = [
          { icon: '🔗', label: 'Connecting to bank...' },
          { icon: '💸', label: 'Processing transfer...' },
          { icon: '📊', label: 'Allocating to funds...' },
          { icon: '✓', label: 'Deployed!' },
        ];
        const delayFns = [delays.deployConnect, delays.deployTransfer, delays.deployAllocate, delays.deployConfirm];
        for (let i = 0; i < steps.length; i++) {
          await delayFns[i]();
          if (cancelled) return;
          setStages(prev => [...prev, steps[i]]);
        }
        // Execute deploy dispatches
        if (!cancelled) {
          const dispatches = getDeployDispatches(sweepAmount, 'hdfc-1', hdfcBalance);
          dispatches.forEach(d => dispatch(d));
          setTimeout(() => { if (!cancelled) setSubstep('confirmed'); }, 600);
        }
      }
      runAnimation();
      return () => { cancelled = true; };
    }, []);

    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: colors.dark, padding: '52px 24px 24px', position: 'relative', ...grainTexture }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: colors.gold, opacity: 0.05, borderRadius: '50%', filter: 'blur(60px)', transform: 'translate(30%, -50%)', pointerEvents: 'none' }} />
          <div style={{ ...typography.brandMark, color: colors.light, marginBottom: '16px', position: 'relative', zIndex: 1 }}>neev</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <AgentText text="Deploying your idle cash..." animate={false} style={{ color: colors.light }} />
          </div>
        </div>
        <div style={{ flex: 1, background: colors.light, padding: '32px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', background: colors.boneLight,
                    animation: 'shimmerPulse 1s ease-in-out infinite',
                  }} />
                  <div style={{ width: '60%', height: '14px', borderRadius: '4px', background: colors.boneLight, animation: 'shimmerPulse 1s ease-in-out infinite' }} />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // Confirmed screen
  if (substep === 'confirmed') {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: colors.dark, padding: '52px 24px 24px', position: 'relative', ...grainTexture }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: colors.gold, opacity: 0.05, borderRadius: '50%', filter: 'blur(60px)', transform: 'translate(30%, -50%)', pointerEvents: 'none' }} />
          <div style={{ ...typography.brandMark, color: colors.light, marginBottom: '16px', position: 'relative', zIndex: 1 }}>neev</div>
        </div>
        <div style={{ flex: 1, background: colors.light, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ animation: `fadeUp 400ms ${easing.spring} both` }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: colors.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ ...typography.displaySmall, color: colors.dark, textAlign: 'center', marginBottom: '8px' }}>
              Deployed to Neev Reserve
            </div>
            <div style={{ fontFamily: fonts.serif, fontSize: '1.75rem', fontWeight: 500, color: colors.dark, textAlign: 'center', marginBottom: '8px' }}>
              {formatINR(sweepAmount)}
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.success, textAlign: 'center', marginBottom: '24px' }}>
              Earning {formatINR(dailyEarnings)}/day at 7.2%
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.muted, textAlign: 'center', marginBottom: '32px', fontStyle: 'italic' }}>
              I'll check in tomorrow morning.
            </div>
            <button onClick={handleGoHome} style={ctaStyle}>
              Go to Neev Home →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (substep === 'deploying') {
    return <DeployingScreen />;
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: colors.dark, padding: '52px 24px 24px', position: 'relative', ...grainTexture }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: colors.gold, opacity: 0.05, borderRadius: '50%', filter: 'blur(60px)', transform: 'translate(30%, -50%)', pointerEvents: 'none' }} />
        <div style={{ ...typography.brandMark, color: colors.light, marginBottom: '16px', position: 'relative', zIndex: 1 }}>neev</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AgentText
            text={
              substep === 'intro'
                ? "Your accounts are linked. Let's put your idle cash to work."
                : substep === 'numbers'
                ? "Here's exactly where your money goes."
                : "This isn't a one-time thing."
            }
            animate={false}
            style={{ color: colors.light }}
          />
        </div>
      </div>

      <div style={{ flex: 1, background: colors.light, padding: '20px', paddingBottom: '40px', overflowY: 'auto' }}>
        {/* Screen 1: Intro */}
        {substep === 'intro' && (
          <div style={{ animation: `fadeUp 400ms ${easing.spring} both` }}>
            <Card animate>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.25rem' }}>🛡️</span>
                <div>
                  <div style={{ ...typography.displaySmall, color: colors.dark }}>Neev Reserve</div>
                  <div style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted }}>7.2% · Zero Drawdown · T+1 Liquidity</div>
                </div>
              </div>

              <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginBottom: '4px' }}>
                80% Kotak Equity Arbitrage + 20% Parag Parikh Liquid
              </div>

              <div style={{ borderTop: `1px solid ${colors.boneLight}`, marginTop: '16px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.8125rem' }}>
                  <span style={{ color: colors.muted }}>Idle cash in bank</span>
                  <span style={{ color: colors.dark, fontWeight: 500 }}>{formatINR(idleCash)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.8125rem' }}>
                  <span style={{ color: colors.muted }}>− Safety buffer</span>
                  <span style={{ color: colors.dark, fontWeight: 500 }}>−{formatINR(bufferAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.875rem', borderTop: `1px solid ${colors.boneLight}`, paddingTop: '10px' }}>
                  <span style={{ color: colors.gold, fontWeight: 600 }}>Deploy to Reserve</span>
                  <span style={{ color: colors.gold, fontWeight: 700 }}>{formatINR(sweepAmount)}</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(212,175,55,0.06)', borderRadius: '8px', borderLeft: `3px solid ${colors.gold}` }}>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, fontWeight: 500 }}>
                  {formatINR(dailyEarnings)}/day · ≈{formatINR(weeklyRate)}/week
                </div>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '4px' }}>
                  That's ≈{formatINR(yearlyExtra)}/year more than a savings account
                </div>
              </div>
            </Card>

            <button onClick={() => setSubstep('numbers')} style={ctaStyle}>
              See full plan →
            </button>
          </div>
        )}

        {/* Screen 2: Numbers */}
        {substep === 'numbers' && (
          <div style={{ animation: `fadeUp 400ms ${easing.spring} both`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Card 1 — Fund Allocation */}
            <Card animate>
              <Label>FUND ALLOCATION</Label>
              <div style={{ ...typography.displayMedium, ...goldGradient, marginTop: '12px' }}>
                {formatINR(sweepAmount)}
              </div>

              <GoldDonut
                segments={[
                  { name: 'Arbitrage (80%)', weight: 0.8 },
                  { name: 'Liquid (20%)', weight: 0.2 },
                ]}
                style={{ marginTop: '16px' }}
              />

              <div style={{ marginTop: '16px' }}>
                {/* Arbitrage fund row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FundLogo fundName="Kotak Equity Arbitrage Fund" />
                    <div>
                      <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark }}>Kotak Equity Arbitrage</div>
                      <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted }}>Core · 80%</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: fonts.serif, fontSize: '1rem', fontWeight: 500, color: colors.dark }}>{formatINR(arbitrageAllocation)}</div>
                </div>

                {/* Liquid fund row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: `1px solid ${colors.boneLight}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FundLogo fundName="Parag Parikh Liquid Fund" />
                    <div>
                      <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark }}>Parag Parikh Liquid</div>
                      <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted }}>Instant Redeem · 20%</div>
                      <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted, fontStyle: 'italic' }}>capped at ₹2L</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: fonts.serif, fontSize: '1rem', fontWeight: 500, color: colors.dark }}>{formatINR(liquidAllocation)}</div>
                </div>
              </div>
            </Card>

            {/* Card 2 — Your Daily Earnings */}
            <Card animate delay={100}>
              <Label>YOUR DAILY EARNINGS</Label>
              <div style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(212,175,55,0.06)', borderRadius: '8px', borderLeft: `3px solid ${colors.gold}` }}>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark }}>
                  <span style={{ fontWeight: 600 }}>{formatINR(sweepAmount)}</span> × 7.2% ÷ 365 = <span style={{ fontWeight: 600, color: colors.gold }}>{formatINR(dailyEarnings)}/day</span>
                </div>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '6px' }}>
                  That's ≈{formatINR(weeklyRate)}/week more than savings
                </div>
              </div>
            </Card>

            {/* Card 3 — Why this program */}
            <Card animate delay={200} style={{ borderLeft: `3px solid ${colors.gold}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: colors.dark,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0,
                }}>
                  <span style={{ fontSize: '0.875rem' }}>🧠</span>
                </div>
                <div style={{ ...typography.displaySmall, color: colors.dark, fontSize: '1rem' }}>Why I designed this for you</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: colors.gold, flexShrink: 0 }}>•</span>
                  <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, lineHeight: 1.6 }}>
                    Your {formatINR(sweepAmount)} idle cash needs safety-first parking — zero drawdown arbitrage is ideal for surplus you might need within months
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: colors.gold, flexShrink: 0 }}>•</span>
                  <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, lineHeight: 1.6 }}>
                    80/20 split: Kotak Arbitrage gives equity tax treatment at 7%+ returns, Parag Parikh Liquid handles instant redemption needs (capped at ₹2L per SEBI norms)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: colors.gold, flexShrink: 0 }}>•</span>
                  <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, lineHeight: 1.6 }}>
                    At {formatINR(dailyEarnings)}/day, you'll earn more in a month than a savings account gives in 3
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  dispatch({ type: 'COMPLETE_ONBOARDING', payload: { lifecycle: 'zero-state' } });
                  setTimeout(() => dispatch({ type: 'OPEN_CONVERSATION' }), 300);
                }}
                style={{
                  fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.gold,
                  background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0 0',
                  fontWeight: 600, textAlign: 'left',
                }}
              >
                Want to know more? Chat with me →
              </button>
            </Card>

            <button onClick={() => setSubstep('context')} style={ctaStyle}>
              Next →
            </button>
          </div>
        )}

        {/* Screen 3: Context */}
        {substep === 'context' && (
          <div style={{ animation: `fadeUp 400ms ${easing.spring} both`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'THIS MONTH', text: `I'll deploy ${formatINR(sweepAmount)} from your HDFC account into Neev Reserve — ${formatINR(arbitrageAllocation)} to arbitrage, ${formatINR(liquidAllocation)} to liquid.` },
              { label: 'EVERY MONTH', text: "After salary lands and bills clear, I'll calculate your surplus, propose a sweep amount, and wait for your approval before moving anything." },
              { label: 'ALWAYS WATCHING', text: "I monitor fund health, market conditions, and your goal changes. I'll rebalance when needed and alert you to opportunities." },
            ].map((item, i) => (
              <Card key={i} animate delay={i * 100} style={{ borderLeft: `3px solid ${colors.gold}` }}>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.gold, marginBottom: '8px' }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, lineHeight: 1.6 }}>
                  {item.text}
                </div>
              </Card>
            ))}

            <button onClick={handleDeploy} style={ctaStyle}>
              Deploy {formatINR(sweepAmount)} →
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '8px' }}>
              <button onClick={handleDoLater} style={textLinkStyle}>
                I'll do this later
              </button>
              <button onClick={handleOpenChat} style={textLinkStyle}>
                Have questions? Chat with me
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
