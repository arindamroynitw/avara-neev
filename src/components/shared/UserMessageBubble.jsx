import React from 'react';
import { colors, fonts } from '../../styles/tokens';

export default function UserMessageBubble({ content }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{
        background: colors.dark,
        color: colors.bone,
        fontFamily: fonts.sans,
        fontSize: '0.875rem',
        padding: '10px 16px',
        borderRadius: '16px 16px 4px 16px',
        maxWidth: '80%',
        lineHeight: 1.5,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        {content}
      </div>
    </div>
  );
}
