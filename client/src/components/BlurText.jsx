import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * BlurText splits text by spaces and staggers the entry of each word
 * using custom framer-motion blur/opacity/translate transformations.
 */
export default function BlurText({ text, className }) {
  const containerRef = useRef(null);
  // Triggers when 10% of the element is visible in the viewport
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const words = text ? text.split(/\s+/) : [];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const wordVariants = {
    hidden: {
      filter: 'blur(10px)',
      opacity: 0,
      y: 50
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        rowGap: '0.1em'
      }}
    >
      {words.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          variants={wordVariants}
          style={{
            display: 'inline-block',
            marginRight: '0.28em',
            whiteSpace: 'nowrap'
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
