import { useState, useEffect, useRef } from 'react';

/**
 * Character-by-character text reveal with gold cursor.
 * @param {string} text - Text to reveal
 * @param {number} speed - ms per character (default 30)
 * @param {boolean} start - Whether to start
 * @param {number} delay - Initial delay in ms
 */
export function useTypewriter(text, speed = 30, start = true, delay = 0) {
  const [displayText, setDisplayText] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!start || !text) {
      setDisplayText('');
      setDone(false);
      indexRef.current = 0;
      return;
    }

    const startTimeout = setTimeout(() => {
      indexRef.current = 0;
      setDone(false);

      const type = () => {
        if (indexRef.current < text.length) {
          indexRef.current++;
          setDisplayText(text.slice(0, indexRef.current));
          timerRef.current = setTimeout(type, speed);
        } else {
          setDone(true);
        }
      };

      type();
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed, start, delay]);

  return { displayText, done };
}
