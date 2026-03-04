import React from 'react';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import { colors, fonts } from '../styles/tokens';

export default function SessionSummaryCard({ title = 'Session Summary', points = [], actionText, action, dispatch }) {
  return (
    <Card style={{ borderLeft: `3px solid ${colors.gold}` }}>
      <Label>{title}</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
        {points.map((point, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ color: colors.gold, fontWeight: 600, flexShrink: 0 }}>•</span>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, lineHeight: 1.5 }}>
              {point}
            </span>
          </div>
        ))}
      </div>
      {actionText && action && dispatch && (
        <button
          onClick={() => dispatch(action)}
          style={{
            marginTop: '12px', padding: '10px 16px', borderRadius: '10px',
            background: colors.dark, color: colors.gold, fontFamily: fonts.sans,
            fontSize: '0.8125rem', fontWeight: 600, border: `1px solid rgba(212,175,55,0.2)`,
            cursor: 'pointer', width: '100%',
          }}
        >
          {actionText}
        </button>
      )}
    </Card>
  );
}
