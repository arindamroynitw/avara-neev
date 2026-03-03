import React from 'react';
import { colors, fonts, goldGradient } from '../../styles/tokens';

export default function ProfileSection({ user }) {
  const initials = (user.name || 'A').charAt(0).toUpperCase();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
      {/* Avatar */}
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #F0D588 0%, #D4AF37 50%, #B8860B 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 700, color: colors.white,
        flexShrink: 0,
      }}>
        {initials}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: fonts.serif, fontSize: '1.25rem', fontWeight: 600,
          color: colors.dark, marginBottom: '2px',
        }}>
          {user.name || 'Arjun'}
        </div>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted }}>
          {user.email || 'arjun@email.com'}
        </div>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted }}>
          {user.phone || '+91 98765 43210'}
        </div>
      </div>
    </div>
  );
}
