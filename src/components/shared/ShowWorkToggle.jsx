import React, { useState } from 'react';
import { colors, fonts, easing } from '../../styles/tokens';

export default function ShowWorkToggle({ children }) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50);
    }
  };

  return (
    <div style={{ marginTop: '12px' }}>
      <button
        onClick={handleToggle}
        style={{
          fontFamily: fonts.sans,
          fontSize: '0.75rem',
          fontWeight: 500,
          color: colors.muted,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        Show work {open ? '▴' : '▾'}
      </button>
      {open && (
        <div
          style={{
            marginTop: '8px',
            padding: '12px',
            background: colors.boneLight,
            borderRadius: '8px',
            fontFamily: fonts.sans,
            fontSize: '0.75rem',
            color: colors.muted,
            lineHeight: 1.6,
            animation: `fadeUp 250ms ${easing.spring} both`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
