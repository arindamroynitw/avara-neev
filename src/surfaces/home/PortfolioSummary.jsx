import React from 'react';
import Card from '../../components/shared/Card';
import Label from '../../components/shared/Label';
import { colors, typography, fonts } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import { formatCompact, formatPercent } from '../../utils/format';

const productMeta = {
  reserve: { name: 'Neev Reserve', tag: 'Arbitrage/Liquid', icon: '🛡️' },
  marketEntry: { name: 'Neev Market Entry', tag: 'PE-Aware Equity', icon: '📈' },
  accelerate: { name: 'Neev Accelerate', tag: 'Active Growth', icon: '🚀' },
  navigate: { name: 'Neev Navigate', tag: 'Index Growth', icon: '🧭' },
};

export default function PortfolioSummary() {
  const { state, dispatch } = useApp();
  const { products } = state;

  const activeProducts = Object.entries(products)
    .filter(([key, val]) => val.active)
    .map(([key, val]) => ({ key, ...val, ...productMeta[key] }));

  if (activeProducts.length === 0) {
    return (
      <div style={{ padding: '0 20px', marginTop: '-16px', position: 'relative', zIndex: 2 }}>
        <Card>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, textAlign: 'center', padding: '12px 0' }}>
            Your first sweep will appear here
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 20px', marginTop: '-16px', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {activeProducts.map((product, i) => (
        <Card
          key={product.key}
          animate
          delay={i * 80}
          onClick={() => {
            dispatch({ type: 'SET_TAB', payload: 'invest' });
            dispatch({ type: 'SET_PRODUCT_DETAIL', payload: product.key });
          }}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.25rem' }}>{product.icon}</span>
              <div>
                <div style={{ ...typography.displaySmall, color: colors.dark }}>{product.name}</div>
                <Label small>{product.tag}</Label>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: fonts.serif, fontSize: '1.125rem', fontWeight: 500, color: colors.dark }}>
                {formatCompact(product.balance)}
              </div>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.success, fontWeight: 600 }}>
                +{formatPercent(product.yield)}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
