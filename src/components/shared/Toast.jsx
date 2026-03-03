import React from 'react';
import { colors, fonts, easing } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';

export default function Toast() {
  const { state } = useApp();
  const { message, visible } = state.toast;

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '150px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: colors.dark,
        color: colors.light,
        fontFamily: fonts.sans,
        fontSize: '0.8125rem',
        fontWeight: 500,
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        zIndex: 1000,
        maxWidth: '340px',
        textAlign: 'center',
        animation: `slideUp 300ms ${easing.spring} both`,
        lineHeight: 1.4,
      }}
    >
      {message}
    </div>
  );
}
