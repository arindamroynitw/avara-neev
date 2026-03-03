import { useState, useEffect, useRef } from 'react';

/**
 * Animate a number from 0 to target value using requestAnimationFrame.
 */
export function useCountUp(target, duration = 800, start = true, delay = 0) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!start) {
      setValue(0);
      return;
    }

    const timeout = setTimeout(() => {
      startTimeRef.current = null;

      const animate = (timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setValue(target);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, start, delay]);

  return value;
}
