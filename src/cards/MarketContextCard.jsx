import React from 'react';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import PEGauge from '../components/viz/PEGauge';
import { colors, fonts } from '../styles/tokens';

export default function MarketContextCard({ niftyPE = 19.5, peZone = 'fair', message }) {
  return (
    <Card animate>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '1.125rem' }}>📊</span>
        <Label>MARKET CONTEXT</Label>
      </div>

      <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, lineHeight: 1.6, marginBottom: '16px' }}>
        {message || `Nifty 50 PE is at ${niftyPE}, which is in the ${peZone} zone. Your deployment pace adjusts automatically based on market valuations.`}
      </div>

      <PEGauge currentPE={niftyPE} />

      <div style={{
        marginTop: '12px', padding: '10px', background: 'rgba(212,175,55,0.06)', borderRadius: '8px',
        fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, lineHeight: 1.5,
      }}>
        When PE is below 18, Neev accelerates equity deployment. Above 22, it slows down to protect your capital.
      </div>
    </Card>
  );
}
