import React from 'react';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import Button from '../components/shared/Button';
import { colors, fonts, goldGradient } from '../styles/tokens';
import { formatCompact } from '../utils/format';

export default function BonusSweepCard({ detectedAmount, bankBalance, normalSweep, bonusSweep, onApprove, onSkip }) {
  return (
    <Card animate>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '1.125rem' }}>🎉</span>
        <Label>BONUS DETECTED</Label>
      </div>

      <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, lineHeight: 1.6, marginBottom: '16px' }}>
        I noticed an unusual inflow of {formatCompact(detectedAmount)} — looks like a bonus or variable pay.
        Your bank balance is {formatCompact(bankBalance)}, well above your usual pattern.
      </div>

      <div style={{
        display: 'flex', gap: '12px', padding: '12px', background: colors.boneLight, borderRadius: '10px', marginBottom: '16px',
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.muted }}>
            NORMAL SWEEP
          </div>
          <div style={{ fontFamily: fonts.serif, fontSize: '1.125rem', fontWeight: 500, color: colors.dark }}>
            {formatCompact(normalSweep)}
          </div>
        </div>
        <div style={{ width: '1px', background: colors.bone }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.muted }}>
            SUGGESTED SWEEP
          </div>
          <div style={{ ...goldGradient, fontFamily: fonts.serif, fontSize: '1.125rem', fontWeight: 500 }}>
            {formatCompact(bonusSweep)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="gold" onClick={onApprove} style={{ flex: 1 }}>
          Sweep {formatCompact(bonusSweep)}
        </Button>
        <Button variant="outline" onClick={onSkip} style={{ flex: 0 }}>
          Regular
        </Button>
      </div>
    </Card>
  );
}
