'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}

/**
 * Wraps any content in a scroll-triggered fade + slide-up animation.
 * Server Components can import and use this directly - only this small
 * wrapper needs to be a Client Component, not the whole section.
 */
export default function AnimateIn({ children, className, delay = 0, y = 24, duration = 0.6 }: AnimateInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
