import React from 'react';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import ShowWorkToggle from '../components/shared/ShowWorkToggle';
import { colors, typography, goldGradient, goldGradientBg, fonts } from '../styles/tokens';
import { formatCompact } from '../utils/format';

export default function OpportunityCostCard({ amount, savingsEarnings, neevEarnings, delta, onContinue }) {
  return (
    <Card animate delay={200} style={{ marginTop: '16px' }}>
      <Label>OPPORTUNITY COST</Label>

      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ ...typography.bodySmall, color: colors.muted }}>Your {formatCompact(amount)} at 3.5%</div>
            <div style={{ ...typography.displaySmall, color: colors.dark }}>{formatCompact(savingsEarnings)}/year</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ ...typography.bodySmall, color: colors.muted }}>In Neev Reserve at ~7%</div>
            <div style={{ ...typography.displaySmall, color: colors.success }}>{formatCompact(neevEarnings)}/year</div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${colors.boneLight}`, paddingTop: '16px', marginBottom: '12px' }}>
          <div style={{ ...typography.bodySmall, color: colors.muted, marginBottom: '4px' }}>
            You're leaving on the table every year
          </div>
          <div style={{ ...typography.displayLarge, ...goldGradient }}>
            {formatCompact(delta)}
          </div>
        </div>
      </div>

      <ShowWorkToggle>
        <div>
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
          {/* Delta reinforcement */}
          <div style={{ background: 'rgba(212,175,55,0.08)', borderRadius: '10px', padding: '12px 16px', textAlign: 'center' }}>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginBottom: '4px' }}>
              Extra you'd earn each year
            </div>
            <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500, ...goldGradient }}>
              {formatCompact(delta)}
            </div>
          </div>
        </div>
      </ShowWorkToggle>

      <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, fontStyle: 'italic', marginTop: '16px', lineHeight: 1.5 }}>
        "{formatCompact(amount).replace('₹', '')} just sitting there — you're not alone, almost everyone does this."
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
          Let's fix this →
        </button>
      )}
    </Card>
  );
}
