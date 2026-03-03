import React, { useState } from 'react';
import { colors, fonts, card as cardStyle } from '../../styles/tokens';

export default function VaultSection() {
  const [revealed, setRevealed] = useState(false);

  const vaultItems = [
    { label: 'PAN', value: 'ABCPK1234A' },
    { label: 'Aadhaar', value: '●●●● ●●●● 5678' },
    { label: 'NACH Reference', value: 'NACH-2026-00431' },
  ];

  return (
    <div style={{ padding: '0 20px', marginBottom: '16px' }}>
      <div style={{
        fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700,
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: colors.muted, marginBottom: '8px',
      }}>
        VAULT
      </div>
      <div style={{ ...cardStyle, padding: '16px' }}>
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            style={{
              width: '100%', padding: '12px', border: `1px solid ${colors.bone}`,
              borderRadius: '8px', background: colors.boneLight, cursor: 'pointer',
              fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Tap to reveal sensitive info
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {vaultItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {item.value}
                </div>
              </div>
            ))}
            <button
              onClick={() => setRevealed(false)}
              style={{
                marginTop: '4px', padding: '6px', border: 'none', background: 'none',
                fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted,
                cursor: 'pointer', textAlign: 'center',
              }}
            >
              Hide
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
