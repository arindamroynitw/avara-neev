import React from 'react';
import { colors, goldGradientBg } from '../../styles/tokens';

export default function GoldSparkline({ data = [], width = 300, height = 80, style }) {
  if (data.length < 2) {
    // Generate sample data
    const sampleData = Array.from({ length: 30 }, (_, i) => {
      const base = 100;
      const trend = i * 0.5;
      const noise = Math.sin(i * 0.5) * 3 + Math.random() * 2;
      return base + trend + noise;
    });
    data = sampleData;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const gradientId = `gold-gradient-${Math.random().toString(36).slice(2)}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={style}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F0D588" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id={`${gradientId}-fill`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId}-fill)`} />
      <polyline
        points={points}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
