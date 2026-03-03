import React from 'react';
import { colors, fonts } from '../../styles/tokens';
import TransactionItem from './TransactionItem';

function groupByMonth(transactions) {
  const groups = {};
  transactions.forEach(tx => {
    const d = new Date(tx.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = { label, transactions: [] };
    groups[key].transactions.push(tx);
  });
  // Sort groups descending
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, v]) => v);
}

export default function ActivityFeed({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.muted }}>
          No activity yet. Your transactions will appear here after your first sweep.
        </div>
      </div>
    );
  }

  const groups = groupByMonth(transactions);

  return (
    <div style={{ padding: '0 20px' }}>
      {groups.map((group, gi) => (
        <div key={gi} style={{ marginBottom: '8px' }}>
          {/* Month header */}
          <div style={{
            fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: colors.muted, padding: '12px 0 4px',
          }}>
            {group.label}
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Gold timeline line */}
            <div style={{
              position: 'absolute', left: '17px', top: '24px', bottom: '12px',
              width: '2px', background: `linear-gradient(to bottom, ${colors.goldLight}, ${colors.bone})`,
            }} />

            {group.transactions.map((tx, ti) => (
              <div key={tx.id} style={{
                position: 'relative',
                borderBottom: ti < group.transactions.length - 1 ? `1px solid ${colors.boneLight}` : 'none',
              }}>
                <TransactionItem transaction={tx} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
