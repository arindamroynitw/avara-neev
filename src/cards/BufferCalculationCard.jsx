import React from 'react';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import ShowWorkToggle from '../components/shared/ShowWorkToggle';
import { colors, fonts, goldGradient } from '../styles/tokens';
import { formatCompact } from '../utils/format';

export default function BufferCalculationCard({ outflows, bankFloor, upcomingExpense, totalBuffer, sweepable }) {
  const items = [
    { label: 'Monthly outflows', value: outflows },
    { label: 'Bank floor', value: bankFloor },
  ];
  if (upcomingExpense) items.push({ label: 'Upcoming expense', value: upcomingExpense });
  const total = items.reduce((sum, i) => sum + i.value, 0);

  return (
    <Card animate>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '1.125rem' }}>🧮</span>
        <Label>BUFFER CALCULATION</Label>
      </div>

      <div style={{ marginBottom: '16px' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', padding: '6px 0',
            borderBottom: `1px solid ${colors.boneLight}`,
          }}>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>{item.label}</span>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark }}>{formatCompact(item.value)}</span>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between', padding: '8px 0',
        }}>
          <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 700, color: colors.dark }}>Total buffer needed</span>
          <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 700, color: colors.dark }}>{formatCompact(totalBuffer || total)}</span>
        </div>
      </div>

      <div style={{
        padding: '12px', background: 'rgba(212,175,55,0.06)', borderRadius: '10px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.muted, marginBottom: '4px' }}>
          SWEEPABLE AMOUNT
        </div>
        <div style={{ ...goldGradient, fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500 }}>
          {formatCompact(sweepable)}
        </div>
      </div>
    </Card>
  );
}
