import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import Label from '../../components/shared/Label';
import FundLogo from '../../components/shared/FundLogo';
import GoldDonut from '../../components/viz/GoldDonut';
import { colors, typography, fonts, easing } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import { formatCompact, formatPercent, formatINR } from '../../utils/format';
import { productDefinitions } from '../../data/products';
import ActivationSheet from './ActivationSheet';

const productIcons = { reserve: '🛡️', marketEntry: '📈', accelerate: '🚀', navigate: '🧭' };

export default function ProgramPreview({ productKey }) {
  const { state, dispatch } = useApp();
  const def = productDefinitions[productKey];
  const product = state.products[productKey];
  const [showActivation, setShowActivation] = useState(false);

  const sweepAmount = state.onboarding.planData?.sweepAmount || 100000;
  const suggestedAmount = Math.round(sweepAmount * 0.1);
  const projectedAnnual = Math.round(suggestedAmount * (def.yield / 100));

  const handleBack = () => dispatch({ type: 'CLOSE_PROGRAM_PREVIEW' });

  const handleChat = () => {
    dispatch({ type: 'SET_CONVERSATION_CONTEXT', payload: { product: productKey } });
    dispatch({ type: 'OPEN_CONVERSATION' });
  };

  return (
    <div style={{ animation: `fadeUp 300ms ${easing.spring} both` }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0 16px' }}>
        <button onClick={handleBack} style={{
          width: '36px', height: '36px', borderRadius: '50%', background: colors.boneLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.dark} strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.25rem' }}>{productIcons[productKey]}</span>
          <span style={{ ...typography.displaySmall, color: colors.dark }}>{def.name}</span>
        </div>
      </div>

      {/* Product info */}
      <Card style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <Label>EXPECTED RETURN</Label>
            <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500, color: colors.success, marginTop: '4px' }}>
              {formatPercent(def.yield)} p.a.
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Label>MAX DRAWDOWN</Label>
            <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500, color: def.maxDrawdown === 0 ? colors.success : colors.error, marginTop: '4px' }}>
              {def.maxDrawdown === 0 ? 'Zero' : `${def.maxDrawdown}%`}
            </div>
          </div>
        </div>

        <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, lineHeight: 1.6 }}>
          {def.tagline}
        </div>
      </Card>

      {/* Personalised projection */}
      <Card style={{ marginBottom: '12px', borderLeft: `3px solid ${colors.gold}` }}>
        <Label>YOUR PROJECTION</Label>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, marginTop: '8px', lineHeight: 1.6 }}>
          If you invested <span style={{ fontWeight: 600 }}>{formatINR(suggestedAmount)}</span>, you'd earn approximately <span style={{ fontWeight: 600, color: colors.success }}>~{formatINR(projectedAnnual)}/year</span> at {formatPercent(def.yield)}.
        </div>
      </Card>

      {/* Risk profile */}
      <Card style={{ marginBottom: '12px' }}>
        <Label>RISK PROFILE</Label>
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            flex: 1, height: '8px', borderRadius: '4px', background: colors.boneLight, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: '4px',
              width: def.maxDrawdown === 0 ? '10%' : `${Math.min(Math.abs(def.maxDrawdown) * 10, 80)}%`,
              background: def.maxDrawdown === 0 ? colors.success : Math.abs(def.maxDrawdown) < 5 ? colors.gold : colors.error,
            }} />
          </div>
          <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600, color: colors.dark }}>
            {def.risk}
          </span>
        </div>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '8px' }}>
          {def.maxDrawdown === 0
            ? 'Zero drawdown in 5-year backtest. Capital preservation focus.'
            : `Max drawdown of ${def.maxDrawdown}% in backtesting. ${def.liquidity} redemption.`
          }
        </div>
      </Card>

      {/* Fund allocation / breakdown */}
      {productKey === 'reserve' && (
        <Card style={{ marginBottom: '12px' }}>
          <Label>FUND ALLOCATION</Label>
          <GoldDonut
            segments={[
              { name: 'Arbitrage (80%)', weight: 0.8 },
              { name: 'Liquid (20%)', weight: 0.2 },
            ]}
            style={{ marginTop: '12px' }}
          />
          <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '12px' }}>
            Liquid fund capped at ₹2L. Zero drawdown in 5-year backtest.
          </div>
        </Card>
      )}

      {(productKey === 'accelerate' || productKey === 'navigate') && def.funds && (
        <Card style={{ marginBottom: '12px' }}>
          <Label>FUND BREAKDOWN</Label>
          {def.funds.map((fund, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderTop: i > 0 ? `1px solid ${colors.boneLight}` : 'none' }}>
              <FundLogo fundName={fund.name} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark }}>{fund.name}</div>
                <span style={{ fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted }}>{fund.role} · {Math.round(fund.weight * 100)}%</span>
              </div>
            </div>
          ))}
        </Card>
      )}

      {productKey === 'marketEntry' && (
        <Card style={{ marginBottom: '12px' }}>
          <Label>DEPLOYMENT STRATEGY</Label>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, marginTop: '8px', lineHeight: 1.6 }}>
            PE-aware STP into {def.fund}. Deploys faster when markets are cheap, slower when expensive.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
            {Object.entries(def.peThresholds).map(([zone, data]) => (
              <div key={zone} style={{ padding: '8px', background: colors.boneLight, borderRadius: '6px' }}>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: colors.muted }}>{zone}</div>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.dark, marginTop: '2px' }}>PE {'<'} {data.pe} → {data.pace}x pace</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* About */}
      <Card style={{ marginBottom: '12px' }}>
        <Label>DETAILS</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
          {[
            { label: 'Risk', value: def.risk },
            { label: 'Liquidity', value: def.liquidity },
            { label: 'Min. Investment', value: formatCompact(def.minInvestment) },
            { label: 'Tax Treatment', value: def.taxTreatment },
          ].map(item => (
            <div key={item.label}>
              <Label small>{item.label}</Label>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 500, color: colors.dark, marginTop: '2px' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Bottom CTAs */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button
          onClick={() => setShowActivation(true)}
          style={{
            flex: 1, background: colors.dark, color: colors.gold,
            padding: '14px', borderRadius: '12px', fontFamily: fonts.sans,
            fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`,
            cursor: 'pointer',
          }}
        >
          Get started
        </button>
        <button
          onClick={handleChat}
          style={{
            flex: 1, background: colors.boneLight, color: colors.dark,
            padding: '14px', borderRadius: '12px', fontFamily: fonts.sans,
            fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', border: 'none', cursor: 'pointer',
          }}
        >
          Chat about this
        </button>
      </div>

      {showActivation && (
        <ActivationSheet
          productKey={productKey}
          onClose={() => setShowActivation(false)}
        />
      )}
    </div>
  );
}
