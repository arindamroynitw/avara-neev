import React from 'react';
import { colors, typography, fonts, grainTexture } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import { formatCompact } from '../../utils/format';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import ProgramPreview from './ProgramPreview';

export default function InvestSurface() {
  const { state } = useApp();
  const { activeProductDetail, activeProgramPreview, metrics } = state;

  if (activeProductDetail) {
    return (
      <div style={{ padding: '8px 20px 20px' }}>
        <ProductDetail productKey={activeProductDetail} />
      </div>
    );
  }

  if (activeProgramPreview) {
    return (
      <div style={{ padding: '8px 20px 20px' }}>
        <ProgramPreview productKey={activeProgramPreview} />
      </div>
    );
  }

  return (
    <div>
      {/* Summary header */}
      {metrics.totalNeevBalance > 0 && (
        <div style={{ padding: '4px 20px 20px', borderBottom: `1px solid ${colors.boneLight}`, marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.muted, marginBottom: '4px' }}>
                TOTAL INVESTED
              </div>
              <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500, color: colors.dark }}>
                {formatCompact(metrics.totalNeevBalance)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.muted, marginBottom: '4px' }}>
                EXTRA EARNED
              </div>
              <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500, color: colors.success }}>
                +{formatCompact(metrics.extraEarned)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '0 20px' }}>
        <ProductList />
      </div>
    </div>
  );
}
