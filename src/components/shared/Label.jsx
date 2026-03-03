import React from 'react';
import { typography, colors } from '../../styles/tokens';

export default function Label({ children, color, small, style }) {
  return (
    <span
      style={{
        ...(small ? typography.labelSmall : typography.label),
        color: color || colors.muted,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
