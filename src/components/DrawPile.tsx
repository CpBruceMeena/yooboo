'use client';

import { motion } from 'motion/react';

interface DrawPileProps {
  cardCount: number;
  onClick?: () => void;
  disabled?: boolean;
}

export default function DrawPile({ cardCount, onClick, disabled }: DrawPileProps) {
  return (
    <motion.div 
      className="relative" 
      onClick={disabled ? undefined : onClick}
      whileHover={!disabled ? { scale: 1.05, y: -4 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
    >
      <motion.div 
        className="w-20 h-28 bg-bgTertiary rounded-xl border-2 border-textMuted/30 flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 transition-colors"
        animate={!disabled ? { boxShadow: ['0 0 0px rgba(122,77,255,0)', '0 0 20px rgba(122,77,255,0.2)', '0 0 0px rgba(122,77,255,0)'] } : {}}
        transition={!disabled ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        <motion.span 
          className="text-2xl text-textMuted"
          animate={!disabled ? { rotate: [0, -5, 5, 0] } : {}}
          transition={!disabled ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
        >
          🃏
        </motion.span>
        <motion.span 
          className="text-xs text-textMuted mt-1"
          key={cardCount}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          {cardCount}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}