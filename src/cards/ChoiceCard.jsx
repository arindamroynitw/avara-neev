import React, { useState } from 'react';
import Card from '../components/shared/Card';
import { colors, fonts, easing } from '../styles/tokens';

export default function ChoiceCard({ title, subtitle, options = [], allowMultiple = false, onSelect }) {
  const [selected, setSelected] = useState(allowMultiple ? [] : null);

  const handleSelect = (option) => {
    if (allowMultiple) {
      const newSelected = selected.includes(option.value)
        ? selected.filter(v => v !== option.value)
        : [...selected, option.value];
      setSelected(newSelected);
    } else {
      setSelected(option.value);
      if (onSelect) {
        onSelect(option.label || option.value);
      }
    }
  };

  return (
    <Card>
      {title && (
        <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark, marginBottom: '4px' }}>
          {title}
        </div>
      )}
      {subtitle && (
        <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginBottom: '12px' }}>
          {subtitle}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((option, i) => {
          const isSelected = allowMultiple
            ? selected.includes(option.value)
            : selected === option.value;
          return (
            <button
              key={i}
              onClick={() => handleSelect(option)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '12px',
                border: `1px solid ${isSelected ? colors.gold : colors.bone}`,
                background: isSelected ? 'rgba(212,175,55,0.04)' : colors.white,
                cursor: 'pointer',
                transition: `all 200ms ${easing.standard}`,
                textAlign: 'left',
              }}
            >
              {option.icon && <span style={{ fontSize: '1.25rem' }}>{option.icon}</span>}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 500, color: colors.dark }}>
                  {option.label}
                </div>
                {option.description && (
                  <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '2px' }}>
                    {option.description}
                  </div>
                )}
              </div>
              {isSelected && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      {allowMultiple && selected.length > 0 && (
        <button
          onClick={() => onSelect?.(selected.join(', '))}
          style={{
            width: '100%', marginTop: '12px', padding: '10px',
            background: colors.dark, color: colors.gold, border: 'none',
            borderRadius: '10px', fontFamily: fonts.sans, fontSize: '0.8125rem',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Confirm selection
        </button>
      )}
    </Card>
  );
}
