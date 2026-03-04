import React, { useState, useRef, useEffect } from 'react';
import { colors, fonts, easing } from '../../styles/tokens';

export default function RMChatInput({ dispatch, isOpen }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    dispatch({
      type: 'ADD_RM_MESSAGE',
      payload: { role: 'user', content: trimmed, timestamp: Date.now() },
    });
    setInput('');
  };

  return (
    <div style={{
      padding: '12px 20px',
      paddingBottom: 'max(28px, env(safe-area-inset-bottom, 28px))',
      borderTop: `1px solid ${colors.boneLight}`,
      background: colors.white,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        border: `1px solid ${colors.bone}`, borderRadius: '14px',
        padding: '6px 6px 6px 18px',
      }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); } }}
          placeholder="Message your RM..."
          style={{
            flex: 1, fontFamily: fonts.sans, fontSize: '0.875rem',
            color: colors.dark, border: 'none', outline: 'none', background: 'none',
            padding: '8px 0',
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: input.trim() ? colors.dark : colors.boneLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
            flexShrink: 0, transition: `all 200ms ${easing.standard}`,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? colors.gold : colors.muted} strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
