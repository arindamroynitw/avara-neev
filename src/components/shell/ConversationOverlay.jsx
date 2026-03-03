import React, { useState, useEffect, useRef, useCallback } from 'react';
import { colors, fonts, easing } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import { callAI } from '../../agent/aiService';
import { renderCards } from '../../agent/renderCards';
import { productDefinitions } from '../../data/products';
import Shimmer from '../shared/Shimmer';

export default function ConversationOverlay() {
  const { state, dispatch } = useApp();
  const { conversation } = state;
  const [input, setInput] = useState('');
  const threadRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [conversation.thread]);

  // Focus input when overlay opens
  useEffect(() => {
    if (conversation.open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversation.open]);

  // Process new user messages
  useEffect(() => {
    const lastMsg = conversation.thread[conversation.thread.length - 1];
    if (lastMsg?.role === 'user' && !conversation.loading) {
      handleAIResponse(lastMsg.content);
    }
  }, [conversation.thread.length]);

  const handleAIResponse = useCallback(async (userMessage) => {
    dispatch({ type: 'SET_CONVERSATION_LOADING', payload: true });

    try {
      const history = conversation.thread
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }));

      const result = await callAI(userMessage, history, state);

      dispatch({
        type: 'ADD_MESSAGE',
        payload: { role: 'assistant', content: result.cards, timestamp: Date.now() },
      });
    } catch (error) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { role: 'assistant', content: [{ type: 'agent-text', props: { text: error.message || 'Something went wrong. Please try again.' } }], timestamp: Date.now() },
      });
    } finally {
      dispatch({ type: 'SET_CONVERSATION_LOADING', payload: false });
    }
  }, [state, conversation.thread, dispatch]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', content: trimmed, timestamp: Date.now() } });
    setInput('');
  }, [input, dispatch]);

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLOSE_CONVERSATION' });
  }, [dispatch]);

  if (!conversation.open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: colors.light,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '390px',
        margin: '0 auto',
        animation: `springIn 400ms ${easing.spring} both`,
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '52px 20px 12px', borderBottom: `1px solid ${colors.boneLight}`,
      }}>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark }}>
          {conversation.context?.product && productDefinitions[conversation.context.product]
            ? `Chat about ${productDefinitions[conversation.context.product].name}`
            : 'Chat with Neev'}
        </div>
        <button
          onClick={handleClose}
          style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: colors.boneLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.dark} strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Thread */}
      <div
        ref={threadRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {conversation.thread.map((msg, i) => (
          <div key={i}>
            {msg.role === 'user' ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  background: colors.dark, color: colors.light,
                  fontFamily: fonts.sans, fontSize: '0.875rem',
                  padding: '10px 16px', borderRadius: '16px 16px 4px 16px',
                  maxWidth: '80%', lineHeight: 1.5,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                  {msg.content}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '100%' }}>
                {Array.isArray(msg.content) ? renderCards(msg.content, dispatch) : (
                  <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, lineHeight: 1.6 }}>
                    {String(msg.content)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {conversation.loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '100%' }}>
            <Shimmer height="16px" width="60%" />
            <Shimmer height="80px" width="100%" borderRadius="12px" />
            <Shimmer height="16px" width="40%" />
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 20px', paddingBottom: 'max(28px, env(safe-area-inset-bottom, 28px))',
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
            placeholder="Ask Neev anything..."
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
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? colors.gold : colors.muted} strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
