import React from 'react';
import { colors } from '../../styles/tokens';

export default function ModeIndicator() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '2px',
        background: colors.gold,
        borderRadius: '0 0 2px 2px',
      }}
    />
  );
}
