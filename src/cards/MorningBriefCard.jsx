import React from 'react';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import ShowWorkToggle from '../components/shared/ShowWorkToggle';
import { colors, fonts, goldGradient } from '../styles/tokens';
import { formatCompact } from '../utils/format';

export default function MorningBriefCard({ balance, dailyEarnings, message, showWork }) {
  return (
    <Card animate>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '1.125rem' }}>☀️</span>
        <Label>MORNING BRIEF</Label>
      </div>

      <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, lineHeight: 1.6, marginBottom: '16px' }}>
        {message}
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        <div>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.muted }}>
            NEEV BALANCE
          </div>
          <div style={{ ...goldGradient, fontFamily: fonts.serif, fontSize: '1.25rem', fontWeight: 500 }}>
            {formatCompact(balance)}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.muted }}>
            EARNING TODAY
          </div>
          <div style={{ fontFamily: fonts.serif, fontSize: '1.25rem', fontWeight: 500, color: colors.success }}>
            +{formatCompact(dailyEarnings)}
          </div>
        </div>
      </div>

      {showWork && <ShowWorkToggle><div>{showWork}</div></ShowWorkToggle>}
    </Card>
  );
}
