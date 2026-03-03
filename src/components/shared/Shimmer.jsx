import React from 'react';
import { colors } from '../../styles/tokens';

export default function Shimmer({ width = '100%', height = '20px', borderRadius = '8px', style }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: `linear-gradient(90deg, ${colors.boneLight} 25%, ${colors.light} 50%, ${colors.boneLight} 75%)`,
        backgroundSize: '400% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
}
