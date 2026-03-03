import React from 'react';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import ShowWorkToggle from '../components/shared/ShowWorkToggle';
import Button from '../components/shared/Button';
import { colors, typography, goldGradient, fonts } from '../styles/tokens';
import { formatCompact } from '../utils/format';

export default function SweepRecommendationCard({ sweepAmount, bankBalance, bufferAmount, month, onApprove, onAdjust }) {
  return (
    <Card animate>
      <Label>MONTHLY SWEEP RECOMMENDATION</Label>

      <div style={{ fontFamily: fonts.sans, fontSize: '0.9375rem', color: colors.dark, marginTop: '12px', lineHeight: 1.6 }}>
        Your salary landed, bills have cleared, and your balance has settled. Here's what I'd do this month:
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '16px 0',
        borderBottom: `1px solid ${colors.boneLight}`, marginTop: '8px',
      }}>
        <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>Current balance</span>
        <span style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark }}>{formatCompact(bankBalance)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${colors.boneLight}` }}>
        <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>Keep as buffer</span>
        <span style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark }}>−{formatCompact(bufferAmount)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0' }}>
        <span style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.gold }}>Sweep to Neev</span>
        <span style={{ ...typography.displaySmall, ...goldGradient }}>{formatCompact(sweepAmount)}</span>
      </div>

      <ShowWorkToggle>
        <div>
          Bank balance: {formatCompact(bankBalance)}<br />
          Buffer: {formatCompact(bufferAmount)} (outflows + ₹30K floor)<br />
          Sweep amount: {formatCompact(bankBalance)} − {formatCompact(bufferAmount)} = {formatCompact(sweepAmount)}<br /><br />
          Source: Bank balance from SBI via Account Aggregator, refreshed 2h ago.
        </div>
      </ShowWorkToggle>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button variant="primary" onClick={onApprove} style={{ flex: 2 }}>
          Approve Sweep
        </Button>
        {onAdjust && (
          <Button variant="outline" onClick={onAdjust} style={{ flex: 1 }}>
            Adjust
          </Button>
        )}
      </div>
    </Card>
  );
}
