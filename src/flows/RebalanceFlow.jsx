import React, { useState } from 'react';
import FlowShell from './FlowShell';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import { colors, fonts, easing } from '../styles/tokens';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/format';

export default function RebalanceFlow() {
  const { state, dispatch, showToast } = useApp();
  const params = state.activeFlow?.params || {};
  const [confirmed, setConfirmed] = useState(false);
  const product = params.product || 'accelerate';
  const productData = state.products[product];

  const handleConfirm = () => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: { product, data: { lastRebalance: new Date().toISOString().split('T')[0] } } });
    showToast('Portfolio rebalanced successfully');
    setConfirmed(true);
    setTimeout(() => dispatch({ type: 'CLOSE_FLOW' }), 1500);
  };

  return (
    <FlowShell title="Rebalance Portfolio" onBack={() => dispatch({ type: 'CLOSE_FLOW' })} onClose={() => dispatch({ type: 'CLOSE_FLOW' })}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: `fadeUp 300ms ${easing.spring} both` }}>
        {!confirmed ? (
          <>
            <Card>
              <Label>CURRENT ALLOCATION</Label>
              {productData?.funds?.map((fund, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: i > 0 ? `1px solid ${colors.boneLight}` : 'none' }}>
                  <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark }}>{fund.name}</span>
                  <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark }}>{Math.round(fund.weight * 100)}%</span>
                </div>
              ))}
            </Card>

            <Card style={{ borderLeft: `3px solid ${colors.gold}` }}>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, lineHeight: 1.6 }}>
                Rebalancing will adjust fund weights back to target allocation based on current momentum signals.
              </div>
            </Card>

            <button onClick={handleConfirm} style={{
              width: '100%', padding: '14px', background: colors.dark, color: colors.gold,
              borderRadius: '12px', fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer',
            }}>
              Confirm Rebalance →
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: colors.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark }}>Rebalanced successfully</div>
          </div>
        )}
      </div>
    </FlowShell>
  );
}
