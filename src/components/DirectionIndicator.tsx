'use client';

import { motion, AnimatePresence } from 'motion/react';

interface DirectionIndicatorProps {
  direction: 1 | -1;
}

export default function DirectionIndicator({ direction }: DirectionIndicatorProps) {
  return (
    <motion.div 
      className="flex items-center gap-1.5 text-textMuted text-sm"
      animate={{
        scale: [1, 1.15, 1],
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      key={direction}
    >
      <motion.span 
        className="text-lg inline-block"
        key={direction}
        initial={{ rotate: direction === 1 ? -180 : 180, opacity: 0.3 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {direction === 1 ? '→' : '←'}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, x: direction === 1 ? -8 : 8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.15 }}
      >
        {direction === 1 ? 'Clockwise' : 'Counter'}
      </motion.span>
    </motion.div>
  );
}