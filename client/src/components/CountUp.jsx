import React, { useEffect, useState } from 'react';

/**
 * Animated numeral count-up component using requestAnimationFrame.
 * 
 * @param {number} end - Final value to count to
 * @param {number} duration - Animation length in milliseconds
 * @param {boolean} isStart - Triggers start of count
 */
export default function CountUp({ end, duration = 1200, isStart = false }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isStart) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCount(end);
      return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Quadratic ease-out formula
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration, isStart]);

  return <span className="data-num">{count.toLocaleString()}</span>;
}
