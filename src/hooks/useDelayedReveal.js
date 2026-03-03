import { useState, useEffect } from 'react';

/**
 * Reveal items one at a time with staggered delay.
 * @param {number} totalItems - Total number of items
 * @param {number} delayPerItem - Ms between reveals (default 80)
 * @param {boolean} start - Whether to start revealing
 */
export function useDelayedReveal(totalItems, delayPerItem = 80, start = true) {
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (!start || totalItems === 0) {
      setRevealedCount(0);
      return;
    }

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealedCount(count);
      if (count >= totalItems) clearInterval(interval);
    }, delayPerItem);

    return () => clearInterval(interval);
  }, [totalItems, delayPerItem, start]);

  return revealedCount;
}
