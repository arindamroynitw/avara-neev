import React from 'react';
import { colors, typography, grainTexture } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { dispatch } = useApp();

  return (
    <div
      style={{
        background: colors.dark,
        padding: '52px 20px 0',
        position: 'relative',
        overflow: 'hidden',
        ...grainTexture,
      }}
    >
      {/* Gold glow accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: colors.gold,
          opacity: 0.05,
          borderRadius: '50%',
          filter: 'blur(60px)',
          transform: 'translate(30%, -50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          paddingBottom: '16px',
        }}
      >
        <div
          style={{
            ...typography.brandMark,
            color: colors.light,
            userSelect: 'none',
          }}
        >
          neev
        </div>

        <div
          onClick={() => dispatch({ type: 'TOGGLE_DEMO_PANEL' })}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: colors.darkMid,
            border: `1px solid rgba(212, 175, 55, 0.3)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
      </div>
    </div>
  );
}
