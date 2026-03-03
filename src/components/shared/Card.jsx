import React from 'react';
import { card as cardStyle } from '../../styles/tokens';

export default function Card({ children, style, onClick, animate, delay = 0, ...props }) {
  const animationStyle = animate
    ? {
        animation: `cardStagger 350ms ${delay}ms both`,
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    : {};

  return (
    <div
      style={{
        ...cardStyle,
        padding: '20px',
        ...animationStyle,
        ...(onClick ? { cursor: 'pointer' } : {}),
        ...style,
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
