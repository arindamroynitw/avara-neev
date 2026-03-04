import React, { useState } from 'react';
import { colors, fonts, easing } from '../styles/tokens';

export default function ToggleChoiceCard({ question, optionA, optionB, onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option.label);
    if (onSelect) {
      onSelect(option.label);
    }
  };

  const renderOption = (option, side) => {
    const isSelected = selected === option.label;
    return (
      <button
        onClick={() => handleSelect(option)}
        style={{
          flex: 1,
          padding: '16px 12px',
          borderRadius: '12px',
          border: `1px solid ${isSelected ? colors.gold : colors.bone}`,
          background: isSelected ? 'rgba(212,175,55,0.04)' : colors.white,
          cursor: 'pointer',
          transition: `all 200ms ${easing.standard}`,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {option.recommended && (
          <div style={{
            position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)',
            background: colors.gold, color: colors.white, fontFamily: fonts.sans,
            fontSize: '0.5rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
            letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            Recommended
          </div>
        )}
        {option.icon && <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{option.icon}</div>}
        <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark }}>
          {option.label}
        </div>
        {option.description && (
          <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '4px' }}>
            {option.description}
          </div>
        )}
      </button>
    );
  };

  return (
    <div>
      {question && (
        <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark, marginBottom: '12px' }}>
          {question}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {renderOption(optionA, 'a')}
        {renderOption(optionB, 'b')}
      </div>
    </div>
  );
}
