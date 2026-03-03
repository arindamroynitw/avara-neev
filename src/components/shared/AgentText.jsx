import React from 'react';
import { colors, fonts } from '../../styles/tokens';
import { useTypewriter } from '../../hooks/useTypewriter';

export default function AgentText({ text, animate = true, delay = 0, onDone, style }) {
  const { displayText, done } = useTypewriter(text, 30, animate, delay);

  React.useEffect(() => {
    if (done && onDone) onDone();
  }, [done, onDone]);

  const displayValue = animate ? displayText : text;

  return (
    <div
      style={{
        fontFamily: fonts.sans,
        fontSize: '0.9375rem',
        fontWeight: 400,
        lineHeight: 1.6,
        color: colors.dark,
        opacity: 0.9,
        ...style,
      }}
    >
      {displayValue}
      {animate && !done && (
        <span
          style={{
            color: colors.gold,
            animation: 'typewriterCursor 530ms step-end infinite',
            marginLeft: '1px',
            fontWeight: 300,
          }}
        >
          |
        </span>
      )}
    </div>
  );
}
