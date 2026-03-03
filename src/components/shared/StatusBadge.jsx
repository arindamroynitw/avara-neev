import React from 'react';
import { colors, fonts } from '../../styles/tokens';

const statusStyles = {
  completed: { color: colors.success, bg: 'rgba(76,175,80,0.1)' },
  pending: { color: colors.gold, bg: 'rgba(212,175,55,0.1)' },
  reinvested: { color: colors.gold, bg: 'rgba(212,175,55,0.1)' },
  failed: { color: colors.error, bg: 'rgba(229,115,115,0.1)' },
  archived: { color: colors.muted, bg: colors.boneLight },
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || statusStyles.pending;

  return (
    <span style={{
      fontFamily: fonts.sans, fontSize: '0.5625rem', fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: style.color, background: style.bg,
      padding: '3px 8px', borderRadius: '4px',
    }}>
      {status}
    </span>
  );
}
