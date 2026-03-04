import React, { useEffect, useRef } from 'react';
import { renderCards } from '../../agent/renderCards';
import UserMessageBubble from '../shared/UserMessageBubble';
import DateSeparator from '../shared/DateSeparator';
import TypingIndicator from '../shared/TypingIndicator';
import SurfaceChips from '../shared/SurfaceChips';

function isSameDay(ts1, ts2) {
  const d1 = new Date(ts1);
  const d2 = new Date(ts2);
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export default function RMChatThread({ thread, loading, dispatch, sendMessage, quickReplies = [] }) {
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [thread.length, loading]);

  return (
    <div
      ref={threadRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {thread.map((msg, i) => {
        const showDateSep = i === 0 || !isSameDay(thread[i - 1].timestamp, msg.timestamp);
        return (
          <React.Fragment key={msg.id || i}>
            {showDateSep && <DateSeparator timestamp={msg.timestamp} />}
            {msg.role === 'user' ? (
              <UserMessageBubble content={msg.content} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '100%' }}>
                {Array.isArray(msg.content)
                  ? renderCards(msg.content, dispatch, { extractQuickReplies: true, sendMessage })
                  : renderCards(
                      [{ type: 'agent-text', props: { text: String(msg.content) } }],
                      dispatch,
                      { sendMessage }
                    )
                }
              </div>
            )}
          </React.Fragment>
        );
      })}
      {loading && <TypingIndicator />}
      {quickReplies.length > 0 && !loading && (
        <SurfaceChips
          chips={quickReplies}
          onSend={sendMessage}
          dispatch={dispatch}
          showBack={false}
        />
      )}
    </div>
  );
}
