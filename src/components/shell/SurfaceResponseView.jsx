import React, { useEffect, useRef, useCallback } from 'react';
import { colors, fonts, easing } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import { callAI } from '../../agent/aiService';
import { renderCards } from '../../agent/renderCards';
import Shimmer from '../shared/Shimmer';
import SurfaceChips from '../shared/SurfaceChips';

export default function SurfaceResponseView() {
  const { state, dispatch } = useApp();
  const { surfaceResponse } = state;
  const lastProcessedRef = useRef(0);
  const retryCountRef = useRef(0);

  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({
      type: 'ADD_SURFACE_MESSAGE',
      payload: { role: 'user', content: trimmed, timestamp: Date.now() },
    });
  }, [dispatch]);

  // Process new user messages in hiddenThread
  useEffect(() => {
    const thread = surfaceResponse.hiddenThread;
    if (thread.length === 0 || thread.length <= lastProcessedRef.current) return;

    const lastMsg = thread[thread.length - 1];
    if (lastMsg.role !== 'user') {
      lastProcessedRef.current = thread.length;
      return;
    }

    // Prevent double-processing
    if (thread.length === lastProcessedRef.current) return;
    lastProcessedRef.current = thread.length;

    handleAICall(lastMsg.content);
  }, [surfaceResponse.hiddenThread.length]);

  const handleAICall = useCallback(async (userMessage) => {
    dispatch({ type: 'SET_SURFACE_LOADING', payload: true });
    retryCountRef.current = 0;

    try {
      const history = surfaceResponse.hiddenThread
        .map(m => ({ role: m.role, content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }));

      const result = await callAI(userMessage, history, state, 'surface');
      const cards = result.cards || [];

      // Extract quick-replies card
      const quickRepliesCard = cards.find(c => c.type === 'quick-replies');
      const quickReplies = quickRepliesCard?.props?.chips || [];
      const displayCards = cards.filter(c => c.type !== 'quick-replies');

      // Add assistant message to hidden thread
      dispatch({
        type: 'ADD_SURFACE_MESSAGE',
        payload: { role: 'assistant', content: JSON.stringify(cards), timestamp: Date.now() },
      });

      dispatch({
        type: 'SET_SURFACE_CARDS',
        payload: { cards: displayCards, quickReplies },
      });
    } catch (error) {
      // Silent retry once
      if (retryCountRef.current === 0) {
        retryCountRef.current = 1;
        try {
          const history = surfaceResponse.hiddenThread
            .map(m => ({ role: m.role, content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }));
          const result = await callAI(userMessage, history, state, 'surface');
          const cards = result.cards || [];
          const quickRepliesCard = cards.find(c => c.type === 'quick-replies');
          const quickReplies = quickRepliesCard?.props?.chips || [];
          const displayCards = cards.filter(c => c.type !== 'quick-replies');

          dispatch({
            type: 'ADD_SURFACE_MESSAGE',
            payload: { role: 'assistant', content: JSON.stringify(cards), timestamp: Date.now() },
          });
          dispatch({
            type: 'SET_SURFACE_CARDS',
            payload: { cards: displayCards, quickReplies },
          });
          return;
        } catch {
          // Fall through to error
        }
      }
      dispatch({ type: 'SET_SURFACE_ERROR', payload: error.message || 'Something went wrong.' });
    }
  }, [state, surfaceResponse.hiddenThread, dispatch]);

  // Loading state
  if (surfaceResponse.loading) {
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Shimmer height="20px" width="70%" />
        <Shimmer height="100px" width="100%" borderRadius="12px" />
        <Shimmer height="80px" width="100%" borderRadius="12px" />
        <Shimmer height="20px" width="50%" />
      </div>
    );
  }

  // Error state
  if (surfaceResponse.error) {
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(229,115,115,0.08)',
          borderLeft: `3px solid ${colors.error}`,
        }}>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, lineHeight: 1.5 }}>
            {surfaceResponse.error}
          </div>
        </div>
        <SurfaceChips
          chips={[{ label: 'Try again', input: surfaceResponse.hiddenThread[surfaceResponse.hiddenThread.length - 1]?.content || 'Hello' }]}
          previousTab={surfaceResponse.previousTab}
          onSend={sendMessage}
          dispatch={dispatch}
        />
      </div>
    );
  }

  // Cards
  const { currentCards, quickReplies, previousTab } = surfaceResponse;

  if (currentCards.length === 0) return null;

  const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        overscrollBehavior: 'none',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {renderCards(currentCards, dispatch, { extractQuickReplies: true, sendMessage, reducedMotion })}
      </div>
      <SurfaceChips
        chips={quickReplies.length > 0 ? quickReplies : [{ label: 'Tell me more', input: 'Tell me more' }]}
        previousTab={previousTab}
        onSend={sendMessage}
        dispatch={dispatch}
      />
    </div>
  );
}
