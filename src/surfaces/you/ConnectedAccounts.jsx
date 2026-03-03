import React from 'react';
import { colors, fonts, card as cardStyle } from '../../styles/tokens';

const BANK_LOGOS = {
  'HDFC Bank': 'https://logo.clearbit.com/hdfcbank.com',
  'Axis Bank': 'https://logo.clearbit.com/axisbank.com',
};

export default function ConnectedAccounts({ accounts }) {
  return (
    <div style={{ padding: '0 20px', marginBottom: '16px' }}>
      <div style={{
        fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700,
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: colors.muted, marginBottom: '8px',
      }}>
        LINKED ACCOUNTS
      </div>
      <div style={{ ...cardStyle, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {accounts.map(acc => (
          <div key={acc.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {BANK_LOGOS[acc.bank] ? (
              <>
                <img
                  src={BANK_LOGOS[acc.bank]}
                  alt={acc.bank}
                  onError={e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
                  style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'contain' }}
                />
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', display: 'none',
                  background: colors.boneLight, alignItems: 'center', justifyContent: 'center',
                  fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700, color: colors.dark,
                }}>
                  {acc.bank.split(' ')[0]}
                </div>
              </>
            ) : (
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: colors.boneLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700, color: colors.dark,
              }}>
                {acc.bank.split(' ')[0]}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark }}>
                {acc.bank} Savings
              </div>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted }}>
                {acc.maskedNumber}
              </div>
            </div>
            <div style={{
              fontFamily: fonts.sans, fontSize: '0.5625rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: acc.status === 'active' ? colors.success : colors.muted,
              background: acc.status === 'active' ? 'rgba(76,175,80,0.1)' : colors.boneLight,
              padding: '3px 8px', borderRadius: '4px',
            }}>
              {acc.status}
            </div>
          </div>
        ))}

        {/* AA connection indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 12px', background: 'rgba(76,175,80,0.05)', borderRadius: '8px',
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%', background: colors.success,
          }} />
          <div style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted }}>
            Account Aggregator connected via Sahamati
          </div>
        </div>
      </div>
    </div>
  );
}
