import React, { useEffect, useRef, useCallback } from 'react';
import { colors, easing } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import { callAI } from '../../agent/aiService';
import RMChatHeader from './RMChatHeader';
import RMChatThread from './RMChatThread';
import RMChatInput from './RMChatInput';


export default function RMChatView() {
  const { state, dispatch } = useApp();
  const { rmChat } = state;
  const lastProcessedRef = useRef(rmChat.thread.length);

  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({
      type: 'ADD_RM_MESSAGE',
      payload: { role: 'user', content: trimmed, timestamp: Date.now() },
    });
  }, [dispatch]);

  // Process new user messages
  useEffect(() => {
    const thread = rmChat.thread;
    if (thread.length === 0 || thread.length <= lastProcessedRef.current) return;

    const lastMsg = thread[thread.length - 1];
    if (lastMsg.role !== 'user') {
      lastProcessedRef.current = thread.length;
      return;
    }
    if (thread.length === lastProcessedRef.current) return;
    lastProcessedRef.current = thread.length;

    handleAICall(lastMsg.content);
  }, [rmChat.thread.length]);

  const handleAICall = useCallback(async (userMessage) => {
    dispatch({ type: 'SET_RM_LOADING', payload: true });

    try {
      const history = rmChat.thread
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
        }));

      const result = await callAI(userMessage, history, state, 'rm-chat');
      const cards = result.cards || [];

      dispatch({
        type: 'ADD_RM_MESSAGE',
        payload: { role: 'assistant', content: cards, timestamp: Date.now() },
      });
    } catch (error) {
      dispatch({
        type: 'ADD_RM_MESSAGE',
        payload: {
          role: 'assistant',
          content: [{ type: 'agent-text', props: { text: error.message || 'Something went wrong. Please try again.' } }],
          timestamp: Date.now(),
        },
      });
    } finally {
      dispatch({ type: 'SET_RM_LOADING', payload: false });
    }
  }, [state, rmChat.thread, dispatch]);

  // Extract quick replies from last assistant message
  const lastAssistantMsg = [...rmChat.thread].reverse().find(m => m.role === 'assistant');
  const quickReplies = lastAssistantMsg && Array.isArray(lastAssistantMsg.content)
    ? lastAssistantMsg.content.find(c => c.type === 'quick-replies')?.props?.chips || []
    : [];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: colors.light,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '390px',
        margin: '0 auto',
        animation: `springIn 400ms ${easing.spring} both`,
      }}
    >
      <RMChatHeader dispatch={dispatch} />
      <RMChatThread
        thread={rmChat.thread}
        loading={rmChat.loading}
        dispatch={dispatch}
        sendMessage={sendMessage}
        quickReplies={quickReplies}
      />
      <RMChatInput dispatch={dispatch} isOpen={rmChat.open} />
    </div>
  );
}
