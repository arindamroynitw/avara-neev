import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import Label from '../../components/shared/Label';
import Button from '../../components/shared/Button';
import FundLogo from '../../components/shared/FundLogo';
import GoldSparkline from '../../components/viz/GoldSparkline';
import GoldDonut from '../../components/viz/GoldDonut';
import PEGauge from '../../components/viz/PEGauge';
import ProgressBar from '../../components/viz/ProgressBar';
import { colors, typography, goldGradient, fonts, easing } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import { formatCompact, formatPercent } from '../../utils/format';
import { productDefinitions } from '../../data/products';

const productIcons = { reserve: '🛡️', marketEntry: '📈', accelerate: '🚀', navigate: '🧭' };

export default function ProductDetail({ productKey }) {
  const { state, dispatch, showToast } = useApp();
  const product = state.products[productKey];
  const def = productDefinitions[productKey];
  const [projectorValue, setProjectorValue] = useState(product.balance);

  const handleBack = () => dispatch({ type: 'CLOSE_PRODUCT_DETAIL' });

  const projectedAnnual = Math.round(projectorValue * (def.yield / 100));

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

      {/* Balance */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ ...typography.displayLarge, ...goldGradient }}>{formatCompact(product.balance)}</div>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.success, marginTop: '4px' }}>
          +{formatPercent(def.yield)} p.a. · +{formatCompact(product.dailyEarnings || Math.round(product.balance * def.yield / 100 / 365))} today
        </div>
      </div>

      {/* Chart */}
      <Card style={{ marginBottom: '12px' }}>
        <GoldSparkline style={{ width: '100%' }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
          {['1M', '3M', '6M', '1Y', 'ALL'].map(period => (
            <button key={period} style={{
              fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 600,
              letterSpacing: '0.1em', color: period === '1Y' ? colors.gold : colors.muted,
              background: period === '1Y' ? 'rgba(212,175,55,0.1)' : 'transparent',
              padding: '4px 10px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            }}>
              {period}
            </button>
          ))}
        </div>
      </Card>

      {/* Product-specific content */}
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

      {productKey === 'marketEntry' && (
        <>
          <Card style={{ marginBottom: '12px' }}>
            <Label>PE-BASED PACING</Label>
            <PEGauge currentPE={product.currentPE} style={{ marginTop: '12px' }} />
            <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '8px' }}>
              Current pace: {product.deploymentPace}x · Deploying 20% of Reserve excess monthly
            </div>
          </Card>
          <Card style={{ marginBottom: '12px' }}>
            <Label>DEPLOYMENT PROGRESS</Label>
            <ProgressBar value={product.stpProgress * 100} max={100} label="STP Progress" style={{ marginTop: '12px' }} />
          </Card>
        </>
      )}

      {(productKey === 'accelerate' || productKey === 'navigate') && product.funds?.length > 0 && (
        <Card style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <Label>PORTFOLIO BREAKDOWN</Label>
            {productKey === 'navigate' && (
              <span style={{ fontFamily: fonts.sans, fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold, background: 'rgba(212,175,55,0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                DEFAULT RECOMMENDATION
              </span>
            )}
          </div>
          {product.funds.map((fund, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderTop: i > 0 ? `1px solid ${colors.boneLight}` : 'none' }}>
              <FundLogo fundName={fund.name} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark }}>{fund.name}</div>
                <span style={{ fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted }}>{fund.role} · {Math.round(fund.weight * 100)}%</span>
              </div>
              {fund.value && (
                <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark }}>{formatCompact(fund.value)}</span>
              )}
            </div>
          ))}
          {product.lastRebalance && (
            <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '8px' }}>
              Last rebalanced: {product.lastRebalance}
            </div>
          )}
        </Card>
      )}

      {/* Earnings Projector */}
      <Card style={{ marginBottom: '12px' }}>
        <Label>EARNINGS PROJECTOR</Label>
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontFamily: fonts.serif, fontSize: '1.25rem', color: colors.dark, textAlign: 'center', marginBottom: '8px' }}>
            {formatCompact(projectorValue)}
          </div>
          <input
            type="range"
            min={50000} max={2000000} step={10000}
            value={projectorValue}
            onChange={e => setProjectorValue(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: colors.gold }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted }}>
            <span>₹50K</span><span>₹20L</span>
          </div>
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>
              Estimated annual return
            </div>
            <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500, color: colors.success }}>
              {formatCompact(projectedAnnual)}
            </div>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card style={{ marginBottom: '12px' }}>
        <Label>ABOUT THIS PRODUCT</Label>
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

      {/* Chat about this fund */}
      <Card style={{ marginBottom: '12px', background: colors.boneLight }}>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginBottom: '8px' }}>
          Questions about this fund?
        </div>
        <button
          onClick={() => {
            dispatch({ type: 'SET_CONVERSATION_CONTEXT', payload: { product: productKey } });
            dispatch({ type: 'OPEN_CONVERSATION' });
          }}
          style={{
            fontFamily: fonts.sans, fontSize: '0.6875rem', fontWeight: 600,
            color: colors.gold, background: colors.dark,
            padding: '8px 16px', borderRadius: '8px',
            border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer',
          }}
        >
          Chat about {def.name} →
        </button>
      </Card>

      {/* Action bar */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <Button variant="outline" onClick={() => showToast('Withdrawal flow coming soon')} style={{ flex: 1 }}>
          Withdraw
        </Button>
        <Button variant="primary" onClick={() => showToast('Additional investment coming soon')} style={{ flex: 1 }}>
          Add More
        </Button>
      </div>
    </div>
  );
}
