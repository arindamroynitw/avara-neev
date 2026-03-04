import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import Label from '../../components/shared/Label';
import { colors, typography, fonts } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import { formatCompact, formatPercent } from '../../utils/format';
import { productDefinitions, PROGRAM_ORDER } from '../../data/products';
import ActivationSheet from './ActivationSheet';

const productIcons = {
  reserve: '🛡️',
  marketEntry: '📈',
  accelerate: '🚀',
  navigate: '🧭',
};

export default function ProductList() {
  const { state, dispatch } = useApp();
  const { products } = state;
  const [activationProduct, setActivationProduct] = useState(null);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {PROGRAM_ORDER.map((key, i) => {
          const product = products[key];
          const def = productDefinitions[key];
          if (!product || !def) return null;
          const isActive = product.active;

          return (
            <Card key={key} animate delay={i * 80}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: colors.boneLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem',
                  }}>
                    {productIcons[key]}
                  </div>
                  <div>
                    <div style={{ ...typography.displaySmall, color: colors.dark }}>{def.name}</div>
                    <Label small>{def.tagline}</Label>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.success }}>
                    {formatPercent(def.yield)}
                  </div>
                  <span style={{
                    fontFamily: fonts.sans, fontSize: '0.5rem', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: isActive ? colors.success : colors.muted,
                    background: isActive ? 'rgba(76,175,80,0.1)' : colors.boneLight,
                    padding: '3px 8px', borderRadius: '4px',
                  }}>
                    {isActive ? 'ACTIVE' : ''}
                  </span>
                </div>
              </div>

              {/* Risk + Liquidity tags */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <span style={{
                  fontFamily: fonts.sans, fontSize: '0.5625rem', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: colors.muted, background: colors.boneLight,
                  padding: '4px 8px', borderRadius: '4px',
                }}>
                  {def.risk}
                </span>
                <span style={{
                  fontFamily: fonts.sans, fontSize: '0.5625rem', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: colors.muted, background: colors.boneLight,
                  padding: '4px 8px', borderRadius: '4px',
                }}>
                  {def.liquidity}
                </span>
              </div>

              {/* Active: balance + View */}
              {isActive && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${colors.boneLight}` }}>
                  <div style={{ fontFamily: fonts.serif, fontSize: '1.125rem', fontWeight: 500, color: colors.dark }}>
                    {formatCompact(product.balance)}
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'SET_PRODUCT_DETAIL', payload: key })}
                    style={{
                      fontFamily: fonts.sans, fontSize: '0.6875rem', fontWeight: 600,
                      color: colors.gold, background: 'rgba(212,175,55,0.1)',
                      padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    }}
                  >
                    View →
                  </button>
                </div>
              )}

              {/* Available: dual CTAs */}
              {!isActive && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${colors.boneLight}` }}>
                  <button
                    onClick={() => dispatch({ type: 'SET_PROGRAM_PREVIEW', payload: key })}
                    style={{
                      flex: 1, fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: colors.dark, background: colors.boneLight,
                      padding: '10px 8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    }}
                  >
                    Get Personalised Plan
                  </button>
                  <button
                    onClick={() => setActivationProduct(key)}
                    style={{
                      flex: 1, fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: colors.gold, background: colors.dark,
                      padding: '10px 8px', borderRadius: '8px',
                      border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer',
                    }}
                  >
                    Skip & activate now
                  </button>
                </div>
              )}

              {/* Soft recommendation when Reserve not yet active */}
              {!isActive && key !== 'reserve' && !products.reserve.active && (
                <div style={{ marginTop: '8px' }}>
                  <span style={{ fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted, fontStyle: 'italic' }}>
                    We recommend starting with Neev Reserve
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {activationProduct && (
        <ActivationSheet
          productKey={activationProduct}
          onClose={() => setActivationProduct(null)}
        />
      )}
    </>
  );
}
