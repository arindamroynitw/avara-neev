import React from 'react';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import ShowWorkToggle from '../components/shared/ShowWorkToggle';
import { colors, typography, goldGradient, goldGradientBg, fonts } from '../styles/tokens';
import { formatCompact } from '../utils/format';
import { calculateOpportunityCost } from '../utils/calculations';

export default function DeploymentPlanCard({ bufferBreakdown, sweepAmount, projectedExtra, idleCash, onContinue }) {
  const { rent = 0, sips = 0, emi = 0, other = 0, bankFloor = 30000, upcomingExpense = 0 } = bufferBreakdown || {};
  const totalBuffer = rent + sips + emi + other + bankFloor + upcomingExpense;
  const totalCash = idleCash || (totalBuffer + sweepAmount);
  const { savingsEarnings, neevEarnings } = calculateOpportunityCost(sweepAmount);

  return (
    <Card animate delay={200} style={{ marginTop: '16px' }}>
      <Label>YOUR PLAN</Label>

      <div style={{ fontFamily: fonts.sans, fontSize: '0.9375rem', color: colors.dark, marginTop: '12px', marginBottom: '16px' }}>
        Here's what I'd do:
      </div>

      {/* Buffer breakdown */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark }}>Keep in bank</span>
          <span style={{ fontFamily: fonts.serif, fontSize: '1rem', fontWeight: 500, color: colors.dark }}>{formatCompact(totalBuffer)}</span>
        </div>

        {[
          { label: 'Rent (next month)', value: rent },
          { label: 'SIPs', value: sips },
          { label: 'EMIs', value: emi },
          { label: 'Utilities & misc', value: other },
          { label: 'Upcoming expense', value: upcomingExpense },
          { label: 'Bank floor', value: bankFloor },
        ].filter(item => item.value > 0).map((item, i, arr) => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0 4px 16px', borderLeft: `2px solid ${colors.boneLight}` }}>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>
              {i < arr.length - 1 ? '├' : '└'} {item.label}
            </span>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>{formatCompact(item.value)}</span>
          </div>
        ))}
      </div>

      {/* Sweep amount */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 0', borderTop: `1px solid ${colors.boneLight}`, borderBottom: `1px solid ${colors.boneLight}`,
        marginBottom: '16px',
      }}>
        <span style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.gold }}>Sweep to Neev Reserve</span>
        <span style={{ fontFamily: fonts.serif, fontSize: '1.25rem', fontWeight: 600, color: colors.gold }}>{formatCompact(sweepAmount)}</span>
      </div>

      <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginBottom: '8px' }}>
        Earning ~7% vs 3.5%
      </div>

      {/* Projected extra */}
      <div style={{ borderTop: `1px solid ${colors.boneLight}`, paddingTop: '16px', marginBottom: '12px' }}>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginBottom: '4px' }}>
          Your extra earnings this year
        </div>
        <div style={{ ...typography.displayLarge, ...goldGradient }}>
          ~{formatCompact(projectedExtra)}
        </div>
      </div>

      <ShowWorkToggle>
        <div>
          {/* Arithmetic walkthrough */}
          <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, lineHeight: 1.8, marginBottom: '16px' }}>
            <div>{formatCompact(sweepAmount)} in savings account at 3.5% → {formatCompact(savingsEarnings)}/year</div>
            <div>{formatCompact(sweepAmount)} in Neev Reserve at 7.2% → {formatCompact(neevEarnings)}/year</div>
          </div>
          {/* Comparison bars */}
          <div style={{ marginBottom: '16px' }}>
            {/* Savings bar */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted }}>Savings account</span>
                <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted }}>{formatCompact(savingsEarnings)}/yr</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: colors.boneLight }}>
                <div style={{ height: '100%', borderRadius: '4px', background: colors.bone, width: `${Math.round((savingsEarnings / neevEarnings) * 100)}%`, transition: 'width 600ms ease' }} />
              </div>
            </div>
            {/* Neev bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600, color: colors.dark }}>Neev Reserve</span>
                <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600, color: colors.dark }}>{formatCompact(neevEarnings)}/yr</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: colors.boneLight }}>
                <div style={{ height: '100%', borderRadius: '4px', background: goldGradientBg, width: '100%' }} />
              </div>
            </div>
          </div>
          {/* Delta box */}
          <div style={{ background: 'rgba(212,175,55,0.08)', borderRadius: '10px', padding: '12px 16px', textAlign: 'center' }}>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginBottom: '4px' }}>
              Extra you'd earn each year
            </div>
            <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500, ...goldGradient }}>
              ~{formatCompact(projectedExtra)}
            </div>
          </div>
        </div>
      </ShowWorkToggle>

      {/* Teaser CTA */}
      <div style={{
        background: 'rgba(212,175,55,0.08)', borderRadius: '10px', padding: '14px 16px',
        marginTop: '16px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, lineHeight: 1.5 }}>
          Complete sign-up to unlock your full plan — we'll build it, monitor it, and proactively keep it updated.
        </div>
      </div>

      {onContinue && (
        <button
          onClick={onContinue}
          style={{
            width: '100%',
            marginTop: '16px',
            background: colors.dark,
            color: colors.gold,
            padding: '14px',
            borderRadius: '12px',
            fontFamily: fonts.sans,
            fontSize: '0.625rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            border: `1px solid rgba(212, 175, 55, 0.2)`,
            cursor: 'pointer',
          }}
        >
          Set this up →
        </button>
      )}
    </Card>
  );
}
