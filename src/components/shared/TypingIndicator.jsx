import React from 'react';
import { colors } from '../../styles/tokens';

export default function TypingIndicator() {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: colors.boneLight,
      borderRadius: '16px',
      padding: '12px 16px',
      width: '56px',
    }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: colors.gold,
            animation: `typingPulse 1.2s ${i * 0.2}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
