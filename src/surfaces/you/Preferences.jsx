import React from 'react';
import { colors, fonts, card as cardStyle } from '../../styles/tokens';

const consentLabels = {
  'approve-each': 'Approve each sweep',
  'auto-sweep': 'Auto-sweep (recommended)',
  'manual': 'Manual only',
};

const detailLabels = {
  'minimal': 'Just tell me what to do',
  'balanced': 'Show key reasoning',
  'detailed': 'Show me everything',
};

export default function Preferences({ user }) {
  return (
    <div style={{ padding: '0 20px', marginBottom: '16px' }}>
      <div style={{
        fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700,
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: colors.muted, marginBottom: '8px',
      }}>
        PREFERENCES
      </div>
      <div style={{ ...cardStyle, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Consent Tier */}
        <div>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark, marginBottom: '4px' }}>
            Sweep Authorization
          </div>
          <div style={{
            fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted,
            padding: '8px 12px', background: colors.boneLight, borderRadius: '8px',
          }}>
            {consentLabels[user.consentTier] || user.consentTier}
          </div>
        </div>

        {/* Detail Level */}
        <div>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark, marginBottom: '4px' }}>
            Explanation Detail
          </div>
          <div style={{
            fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted,
            padding: '8px 12px', background: colors.boneLight, borderRadius: '8px',
          }}>
            {detailLabels[user.detailLevel] || user.detailLevel}
          </div>
        </div>

        {/* Mandate */}
        <div>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark, marginBottom: '4px' }}>
            UPI AutoPay Mandate
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.success,
            padding: '8px 12px', background: 'rgba(76,175,80,0.05)', borderRadius: '8px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.success }} />
            Active — up to ₹2,00,000/month
          </div>
        </div>
      </div>
    </div>
  );
}
