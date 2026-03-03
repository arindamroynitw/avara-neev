import React from 'react';
import { colors, fonts, easing } from '../../styles/tokens';

export default function QuickReplyChips({ options, onSelect, selected }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(option => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            style={{
              fontFamily: fonts.sans,
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '10px 16px',
              borderRadius: '20px',
              border: `1px solid ${isSelected ? colors.dark : colors.bone}`,
              background: isSelected ? colors.dark : colors.white,
              color: isSelected ? colors.light : colors.dark,
              cursor: 'pointer',
              transition: `all 200ms ${easing.standard}`,
              whiteSpace: 'nowrap',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
