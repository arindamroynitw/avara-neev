import React from 'react';
import { colors, typography, goldGradient, fonts, grainTexture } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import { useCountUp } from '../../hooks/useCountUp';
import { formatCompact, formatPercent, formatINR } from '../../utils/format';

export default function HeroSection() {
  const { state } = useApp();
  const { metrics, products } = state;
  const totalBalance = metrics.totalNeevBalance;

  // Find weighted yield across active products
  const activeProducts = Object.entries(products)
    .filter(([k, v]) => v.active)
    .map(([k, v]) => v);
  const avgYield = activeProducts.length > 0
    ? activeProducts.reduce((sum, p) => sum + p.yield * p.balance, 0) / Math.max(totalBalance, 1)
    : 0;

  const weeklyRate = Math.round(totalBalance * (avgYield - 3.5) / 100 / 52);
  const dailyRate = Math.round(totalBalance * (avgYield - 3.5) / 100 / 365);
  const extraEarned = useCountUp(metrics.extraEarned, 800);

  // Three display modes
  const isZeroState = totalBalance === 0;
  const isDayZero = totalBalance > 0 && metrics.monthsActive === 0;
  const isEstablished = totalBalance > 0 && metrics.monthsActive >= 1;

  return (
    <div style={{
      background: colors.dark,
      padding: '16px 20px 32px',
      position: 'relative',
      ...grainTexture,
    }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: colors.gold, opacity: 0.05, borderRadius: '50%', filter: 'blur(60px)', transform: 'translate(30%, -50%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {isZeroState && (
          <>
            <div style={{ ...typography.label, color: colors.muted, marginBottom: '8px' }}>
              EXTRA EARNED OVER SAVINGS
            </div>
            <div style={{ ...typography.heroNumber, ...goldGradient }}>
              ₹0
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginTop: '8px' }}>
              Make your first sweep to start earning more
            </div>
          </>
        )}

        {isDayZero && (
          <>
            <div style={{ ...typography.label, color: colors.muted, marginBottom: '8px' }}>
              EARNING RATE
            </div>
            <div style={{ ...typography.heroNumber, ...goldGradient }}>
              ≈{formatINR(weeklyRate)}/week
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.gold, marginTop: '8px' }}>
              more than a savings account
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
              <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>
                {formatINR(dailyRate)}/day · earning {formatPercent(avgYield)} vs 3.5%
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontFamily: fonts.sans, fontSize: '0.9375rem', fontWeight: 500, color: colors.light }}>
                Total: {formatCompact(totalBalance)}
              </span>
            </div>
          </>
        )}

        {isEstablished && (
          <>
            <div style={{ ...typography.label, color: colors.muted, marginBottom: '8px' }}>
              EXTRA EARNED
            </div>
            <div style={{ ...typography.heroNumber, ...goldGradient }}>
              {formatCompact(extraEarned)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
              <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.gold }}>
                ≈{formatINR(weeklyRate)}/week · {formatINR(dailyRate)}/day
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontFamily: fonts.sans, fontSize: '0.9375rem', fontWeight: 500, color: colors.light }}>
                Total: {formatCompact(totalBalance)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
