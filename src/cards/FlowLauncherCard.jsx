import React from 'react';
import { colors, fonts, easing } from '../styles/tokens';

export default function FlowLauncherCard({ title, subtitle, buttonText = 'Get started', flow, params, dispatch }) {
  const handleClick = () => {
    if (dispatch && flow) {
      dispatch({ type: 'LAUNCH_FLOW', payload: { flow, params } });
    }
  };

  return (
    <div style={{
      background: colors.dark, borderRadius: '16px', padding: '20px',
      border: `1px solid rgba(212,175,55,0.15)`,
    }}>
      {title && (
        <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.light, marginBottom: '4px' }}>
          {title}
        </div>
      )}
      {subtitle && (
        <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginBottom: '16px', lineHeight: 1.5 }}>
          {subtitle}
        </div>
      )}
      <button
        onClick={handleClick}
        style={{
          width: '100%', padding: '12px', borderRadius: '10px',
          background: 'transparent', border: `1px solid ${colors.gold}`,
          fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600,
          color: colors.gold, cursor: 'pointer', transition: `all 200ms ${easing.standard}`,
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}
