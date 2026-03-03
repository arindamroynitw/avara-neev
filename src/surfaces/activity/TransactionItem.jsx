import React from 'react';
import { colors, fonts } from '../../styles/tokens';
import { formatINR } from '../../utils/format';
import StatusBadge from '../../components/shared/StatusBadge';

const typeConfig = {
  sweep: { label: 'Sweep', icon: '→', color: colors.gold },
  yield: { label: 'Yield Earned', icon: '+', color: colors.success },
  stp: { label: 'STP Transfer', icon: '⇄', color: colors.gold },
  rebalance: { label: 'Rebalance', icon: '↻', color: colors.muted },
  withdrawal: { label: 'Withdrawal', icon: '←', color: colors.error },
};

const productNames = {
  reserve: 'Neev Reserve',
  marketEntry: 'Market Entry',
  accelerate: 'Accelerate',
  navigate: 'Navigate',
};

export default function TransactionItem({ transaction }) {
  const { type, date, data } = transaction;
  const config = typeConfig[type] || typeConfig.sweep;

  const formatDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getDescription = () => {
    switch (type) {
      case 'sweep':
        return `to ${productNames[data.product] || data.product}`;
      case 'yield':
        return `from ${productNames[data.product] || data.product}`;
      case 'stp':
        return `${productNames[data.from]} → ${productNames[data.to]}`;
      case 'rebalance':
        return productNames[data.product] || 'Portfolio';
      case 'withdrawal':
        return `from ${productNames[data.product] || data.product}`;
      default:
        return '';
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 0',
    }}>
      {/* Icon */}
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: colors.boneLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: fonts.sans, fontSize: '1rem', color: config.color, flexShrink: 0,
      }}>
        {config.icon}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600,
          color: colors.dark, marginBottom: '2px',
        }}>
          {config.label}
        </div>
        <div style={{
          fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span>{getDescription()}</span>
          <span>·</span>
          <span>{formatDate(date)}</span>
        </div>
      </div>

      {/* Amount + Status */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {data.amount && (
          <div style={{
            fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600,
            color: type === 'yield' ? colors.success : colors.dark,
          }}>
            {type === 'yield' ? '+' : ''}{formatINR(data.amount)}
          </div>
        )}
        <div style={{ marginTop: '2px' }}>
          <StatusBadge status={data.status} />
        </div>
      </div>
    </div>
  );
}
