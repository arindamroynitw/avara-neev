import React from 'react';
import Card from '../components/shared/Card';
import { colors, fonts } from '../styles/tokens';

export default function ScrollableFeedCard({ title, maxHeight = 240, items = [] }) {
  return (
    <Card>
      {title && (
        <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark, marginBottom: '12px' }}>
          {title}
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            maxHeight: `${maxHeight}px`,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '10px 0',
                borderTop: i > 0 ? `1px solid ${colors.boneLight}` : 'none',
              }}
            >
              {item.title && (
                <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 500, color: colors.dark }}>
                  {item.title}
                </div>
              )}
              {item.subtitle && (
                <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '2px' }}>
                  {item.subtitle}
                </div>
              )}
              {item.value && (
                <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.gold, marginTop: '2px' }}>
                  {item.value}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Fade gradient at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '32px',
            background: `linear-gradient(transparent, ${colors.white})`,
            pointerEvents: 'none',
          }}
        />
      </div>
    </Card>
  );
}
