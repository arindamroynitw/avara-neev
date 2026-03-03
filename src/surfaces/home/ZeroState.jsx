import React from 'react';
import Card from '../../components/shared/Card';
import { colors, fonts } from '../../styles/tokens';

export default function ZeroState() {
  return (
    <div style={{ padding: '16px 20px 0' }}>
      <Card animate>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '1.125rem' }}>👋</span>
          <span style={{ fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.muted }}>WELCOME</span>
        </div>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, lineHeight: 1.6 }}>
          I'm watching your bank account. When your salary lands and bills clear, I'll have a plan ready for you.
        </div>
      </Card>
    </div>
  );
}
