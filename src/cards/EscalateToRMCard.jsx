import React from 'react';
import Card from '../components/shared/Card';
import { colors, fonts } from '../styles/tokens';

export default function EscalateToRMCard({ message, topic, dispatch }) {
  const handleClick = () => {
    if (dispatch) {
      dispatch({ type: 'OPEN_RM_CHAT', payload: { context: { topic, source: 'escalation' }, priorContext: true } });
    }
  };

  return (
    <Card style={{ borderLeft: `3px solid ${colors.gold}` }}>
      {message && (
        <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, lineHeight: 1.6, marginBottom: '12px' }}>
          {message}
        </div>
      )}
      <button
        onClick={handleClick}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600,
          color: colors.gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Talk to your RM about this
      </button>
    </Card>
  );
}
