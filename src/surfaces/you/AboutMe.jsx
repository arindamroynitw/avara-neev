import React from 'react';
import { colors, fonts, card as cardStyle } from '../../styles/tokens';
import { formatINR } from '../../utils/format';

export default function AboutMe({ user }) {
  const items = [
    { label: 'Monthly Salary', value: formatINR(user.monthlySalary) },
    { label: 'Salary Date', value: `${user.salaryDate}${user.salaryDate === 1 ? 'st' : 'th'} of each month` },
    { label: 'Monthly Outflows', value: formatINR(user.outflows) },
    { label: 'Bank Floor', value: formatINR(user.bankFloor) },
  ];

  return (
    <div style={{ padding: '0 20px', marginBottom: '16px' }}>
      <div style={{
        fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700,
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: colors.muted, marginBottom: '8px',
      }}>
        ABOUT ME
      </div>
      <div style={{ ...cardStyle, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>
              {item.label}
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
