import React from 'react';
import { colors, fonts } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';

export default function RMChatCTA({ text = 'Talk to your RM', context = null, style: customStyle }) {
  const { dispatch } = useApp();

  return (
    <button
      onClick={() => dispatch({ type: 'OPEN_RM_CHAT', payload: { context } })}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: fonts.sans,
        fontSize: '0.8125rem',
        fontWeight: 500,
        color: colors.gold,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 0',
        ...customStyle,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {text}
    </button>
  );
}
