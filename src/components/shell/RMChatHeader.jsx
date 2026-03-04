import React from 'react';
import { colors, fonts } from '../../styles/tokens';

export default function RMChatHeader({ dispatch }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '52px 20px 12px', borderBottom: `1px solid ${colors.boneLight}`,
      background: colors.light,
    }}>
      <button
        onClick={() => dispatch({ type: 'CLOSE_RM_CHAT' })}
        style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: colors.boneLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer', flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.dark} strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark }}>
          RM Chat
        </div>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted }}>
          Your Neev Relationship Manager
        </div>
      </div>
    </div>
  );
}
