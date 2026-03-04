import React from 'react';
import { colors, fonts } from '../../styles/tokens';

function getDateLabel(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (msgDate.getTime() === today.getTime()) return 'Today';
  if (msgDate.getTime() === yesterday.getTime()) return 'Yesterday';

  const sameYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

export default function DateSeparator({ timestamp }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 0',
    }}>
      <div style={{ flex: 1, height: '1px', background: colors.bone }} />
      <span style={{
        fontFamily: fonts.sans,
        fontSize: '0.6875rem',
        fontWeight: 600,
        color: colors.muted,
        letterSpacing: '0.05em',
      }}>
        {getDateLabel(timestamp)}
      </span>
      <div style={{ flex: 1, height: '1px', background: colors.bone }} />
    </div>
  );
}
