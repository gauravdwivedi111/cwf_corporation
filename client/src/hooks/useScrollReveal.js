import { useEffect, useRef, useState } from 'react';

/**
 * Custom React hook that monitors viewport entry of a DOM node.
 * Automatically marks the node as revealed once, respecting prefers-reduced-motion.
 * 
 * @returns {[React.RefObject, boolean]} - Element ref and visibility state
 */
export function useScrollReveal() {
  const ref = useRef(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    // If user prefers reduced motion, bypass and reveal content immediately
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setHasRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasRevealed(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1, // trigger when 10% of the element is visible
    });

    const currentEl = ref.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, []);

  return [ref, hasRevealed];
}
