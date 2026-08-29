import React from 'react';
import './staggered-entrance.css';

/**
 * Reusable wrapper component to easily apply fade-slide-up transitions.
 * @param {React.ReactNode} children - The element to animate.
 * @param {number} delay - Animation delay in milliseconds (e.g. 200, 400, 700).
 * @param {string} className - Optional extra class names.
 */
export default function StaggeredEntrance({ children, delay = 0, className = '' }) {
  // Map millisecond delays to helper CSS classes
  const delayClassMap = {
    0: '',
    100: 'delay-100',
    200: 'delay-200',
    300: 'delay-300',
    400: 'delay-400',
    500: 'delay-500',
    600: 'delay-600',
    700: 'delay-700',
    800: 'delay-800',
    900: 'delay-900',
    1000: 'delay-1000',
  };
  
  const delayClass = delayClassMap[delay] || '';
  
  return (
    <div className={`animate-fade-slide-up ${delayClass} ${className}`}>
      {children}
    </div>
  );
}
