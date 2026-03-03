import React, { useState } from 'react';
import { colors, fonts, easing } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';

export default function InputBar() {
  const { dispatch } = useApp();
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    dispatch({ type: 'OPEN_CONVERSATION' });
    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', content: trimmed, timestamp: Date.now() } });
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '76px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: '350px',
        zIndex: 99,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: colors.white,
          borderRadius: '14px',
          border: focused ? `2px solid ${colors.gold}` : `1px solid ${colors.bone}`,
          padding: focused ? '3px 3px 3px 17px' : '4px 4px 4px 18px',
          minHeight: '48px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          transition: `all 200ms ${easing.standard}`,
        }}
      >
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Neev anything..."
          style={{
            flex: 1,
            fontFamily: fonts.sans,
            fontSize: '0.875rem',
            color: colors.dark,
            border: 'none',
            outline: 'none',
            background: 'none',
            padding: '8px 0',
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: value.trim() ? colors.dark : colors.boneLight,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: value.trim() ? 'pointer' : 'default',
            transition: `all 200ms ${easing.standard}`,
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={value.trim() ? colors.gold : colors.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
