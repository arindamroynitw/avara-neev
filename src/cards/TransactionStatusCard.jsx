import React from 'react';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import StatusBadge from '../components/shared/StatusBadge';
import { colors, fonts } from '../styles/tokens';
import { formatINR } from '../utils/format';

export default function TransactionStatusCard({ type, amount, product, status, via, timestamp }) {
  const typeLabels = {
    sweep: 'Sweep',
    withdrawal: 'Withdrawal',
    stp: 'STP Transfer',
    rebalance: 'Rebalance',
  };

  const productNames = {
    reserve: 'Neev Reserve',
    marketEntry: 'Market Entry',
    accelerate: 'Accelerate',
    navigate: 'Navigate',
  };

  return (
    <Card animate>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <Label>{typeLabels[type] || type}</Label>
        <StatusBadge status={status} />
      </div>

      <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500, color: colors.dark, marginBottom: '8px' }}>
        {formatINR(amount)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted }}>Product</span>
          <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600, color: colors.dark }}>{productNames[product] || product}</span>
        </div>
        {via && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted }}>Via</span>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600, color: colors.dark }}>{via}</span>
          </div>
        )}
        {timestamp && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted }}>Time</span>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600, color: colors.dark }}>{new Date(timestamp).toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
