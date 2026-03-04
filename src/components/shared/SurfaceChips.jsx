import React from 'react';
import { colors, fonts, easing } from '../../styles/tokens';

const tabLabels = { home: 'Home', invest: 'Invest', activity: 'Activity', you: 'You' };

export default function SurfaceChips({ chips = [], previousTab, onSend, dispatch, showBack = true }) {
  const backLabel = `\u2190 Back to ${tabLabels[previousTab] || 'Home'}`;

  const allChips = [
    ...chips,
    ...(showBack ? [{ label: backLabel, action: 'EXIT_SURFACE_RESPONSE' }] : []),
  ];

  if (allChips.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '8px 20px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {allChips.map((chip, i) => (
        <button
          key={i}
          onClick={() => {
            if (chip.action === 'EXIT_SURFACE_RESPONSE') {
              dispatch({ type: 'EXIT_SURFACE_RESPONSE' });
            } else if (chip.input && onSend) {
              onSend(chip.input);
            } else if (chip.label && onSend) {
              onSend(chip.label);
            }
          }}
          style={{
            flexShrink: 0,
            padding: '8px 16px',
            borderRadius: '20px',
            border: `1px solid ${colors.bone}`,
            background: colors.white,
            fontFamily: fonts.sans,
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: chip.action === 'EXIT_SURFACE_RESPONSE' ? colors.muted : colors.dark,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: `all 200ms ${easing.standard}`,
            animation: `chipIn 250ms ${i * 60}ms both`,
            animationTimingFunction: easing.spring,
          }}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
