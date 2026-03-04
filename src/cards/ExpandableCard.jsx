import React, { useState } from 'react';
import Card from '../components/shared/Card';
import { colors, fonts, easing } from '../styles/tokens';
import { renderCards } from '../agent/renderCards';

export default function ExpandableCard({ title, summary, detail, dispatch }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark }}>
            {title}
          </div>
          {!expanded && summary && (
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginTop: '4px' }}>
              {summary}
            </div>
          )}
        </div>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={colors.muted} strokeWidth="2" strokeLinecap="round"
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform 300ms ${easing.spring}`,
            flexShrink: 0, marginLeft: '8px',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        style={{
          maxHeight: expanded ? '2000px' : '0',
          overflow: 'hidden',
          transition: `max-height 300ms ${easing.standard}`,
          marginTop: expanded ? '12px' : '0',
        }}
      >
        {expanded && detail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Array.isArray(detail)
              ? renderCards(detail, dispatch)
              : (
                <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, lineHeight: 1.6 }}>
                  {detail}
                </div>
              )
            }
          </div>
        )}
      </div>
    </Card>
  );
}
