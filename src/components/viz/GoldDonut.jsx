import React from 'react';
import { colors, fonts } from '../../styles/tokens';

export default function GoldDonut({ segments = [], size = 120, style }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;

  const segmentColors = ['#D4AF37', '#1C1915', '#8C7B65', '#E5E0D5', '#4CAF50'];
  let cumulativePercent = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', ...style }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg, i) => {
          const percent = seg.weight * 100;
          const dashLength = (percent / 100) * circumference;
          const dashOffset = circumference - (cumulativePercent / 100) * circumference;
          cumulativePercent += percent;

          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={segmentColors[i % segmentColors.length]}
              strokeWidth="12"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: segmentColors[i % segmentColors.length] }} />
            <span style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted }}>
              {seg.name || seg.role}: {Math.round(seg.weight * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
