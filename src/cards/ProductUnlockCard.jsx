import React from 'react';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import Button from '../components/shared/Button';
import { colors, typography, goldGradient, fonts } from '../styles/tokens';
import { formatCompact, formatPercent } from '../utils/format';

export default function ProductUnlockCard({ product, reason, metrics, onActivate }) {
  return (
    <Card animate style={{ border: `1px solid ${colors.gold}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '1.25rem' }}>🔓</span>
        <Label color={colors.gold}>NEW PRODUCT AVAILABLE</Label>
      </div>

      <div style={{ ...typography.displaySmall, color: colors.dark, marginBottom: '8px' }}>
        {product}
      </div>

      <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.muted, lineHeight: 1.6, marginBottom: '16px' }}>
        {reason}
      </div>

      {metrics && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ padding: '12px', background: colors.boneLight, borderRadius: '8px' }}>
              <Label small>{m.label}</Label>
              <div style={{ fontFamily: fonts.serif, fontSize: '1.125rem', fontWeight: 500, color: colors.dark, marginTop: '4px' }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <Button variant="primary" onClick={onActivate}>
        Activate {product}
      </Button>
    </Card>
  );
}
