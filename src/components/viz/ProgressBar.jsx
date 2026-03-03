import React from 'react';
import { colors, fonts, goldGradientBg } from '../../styles/tokens';

export default function ProgressBar({ value = 0, max = 100, label, showPercent = true, style }) {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div style={style}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted }}>{label}</span>
          {showPercent && (
            <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600, color: colors.dark }}>{Math.round(percent)}%</span>
          )}
        </div>
      )}
      <div style={{ height: '6px', borderRadius: '3px', background: colors.boneLight, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: '3px',
            background: goldGradientBg,
            width: `${percent}%`,
            transition: 'width 500ms ease-out',
          }}
        />
      </div>
    </div>
  );
}
