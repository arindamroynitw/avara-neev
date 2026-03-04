import React from 'react';
import Card from '../components/shared/Card';
import { colors, fonts, easing } from '../styles/tokens';

export default function NavigateCard({ title, subtitle, metric, destination, dispatch }) {
  const handleClick = () => {
    if (!dispatch || !destination) return;
    // Exit current mode
    dispatch({ type: 'EXIT_SURFACE_RESPONSE' });
    // Navigate
    setTimeout(() => {
      if (destination.type) {
        dispatch(destination);
      }
    }, 50);
  };

  return (
    <Card>
      <button
        onClick={handleClick}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
        }}
      >
        <div style={{ flex: 1 }}>
          {title && (
            <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '2px' }}>
              {subtitle}
            </div>
          )}
          {metric && (
            <div style={{ fontFamily: fonts.serif, fontSize: '1.125rem', fontWeight: 500, color: colors.gold, marginTop: '4px' }}>
              {metric}
            </div>
          )}
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth="2" style={{ flexShrink: 0 }}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </Card>
  );
}
