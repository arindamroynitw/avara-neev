import React from 'react';
import { colors, fonts, easing } from '../styles/tokens';

export default function FlowShell({ title, onBack, onClose, children }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: colors.light,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '390px',
        margin: '0 auto',
        animation: `springIn 400ms ${easing.spring} both`,
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '52px 20px 12px', borderBottom: `1px solid ${colors.boneLight}`,
      }}>
        <button
          onClick={onBack || onClose}
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
        <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark }}>
          {title}
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {children}
      </div>
    </div>
  );
}
