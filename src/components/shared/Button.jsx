import React from 'react';
import { colors, fonts, easing } from '../../styles/tokens';

const baseStyle = {
  fontFamily: fonts.sans,
  fontSize: '0.625rem',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  border: 'none',
  cursor: 'pointer',
  transition: `all 0.3s ${easing.standard}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

const variants = {
  primary: {
    ...baseStyle,
    background: colors.dark,
    color: colors.gold,
    padding: '14px 24px',
    borderRadius: '12px',
    border: `1px solid rgba(212, 175, 55, 0.2)`,
    width: '100%',
  },
  outline: {
    ...baseStyle,
    background: 'transparent',
    color: colors.dark,
    padding: '12px 20px',
    borderRadius: '12px',
    border: `1px solid ${colors.bone}`,
  },
  text: {
    ...baseStyle,
    background: 'transparent',
    color: colors.muted,
    padding: '8px 12px',
    borderRadius: '8px',
  },
  gold: {
    ...baseStyle,
    background: 'linear-gradient(135deg, #F0D588 0%, #D4AF37 50%, #B8860B 100%)',
    color: colors.dark,
    padding: '14px 24px',
    borderRadius: '12px',
    width: '100%',
  },
};

export default function Button({ variant = 'primary', children, style, ...props }) {
  return (
    <button
      style={{ ...variants[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
