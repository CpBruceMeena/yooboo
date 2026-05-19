'use client';

import { motion } from 'motion/react';

interface DrawPileProps {
  cardCount: number;
  onClick?: () => void;
  disabled?: boolean;
}

function CardBackSVG() {
  return (
    <svg width={80} height={112} viewBox="0 0 80 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Card body */}
      <rect x="2" y="2" width="76" height="108" rx="10" fill="#1a1f2e" stroke="rgba(122,77,255,0.4)" strokeWidth="1.5" />
      {/* Inner border glow */}
      <rect x="6" y="6" width="68" height="100" rx="7" fill="none" stroke="rgba(122,77,255,0.15)" strokeWidth="1" />
      {/* Decorative diamond pattern */}
      <g opacity="0.25">
        <path d="M40 16L46 28L40 40L34 28Z" fill="#7A4DFF" />
        <path d="M40 72L46 84L40 96L34 84Z" fill="#7A4DFF" />
        <path d="M16 44L28 50L40 44L28 38Z" fill="#7A4DFF" />
        <path d="M40 44L52 50L40 56L28 50Z" fill="#7A4DFF" />
        <path d="M64 44L76 50L64 56L52 50Z" fill="#7A4DFF" opacity="0.6" />
      </g>
      {/* Center cross/star */}
      <g opacity="0.5">
        <circle cx="40" cy="50" r="26" stroke="#7A4DFF" strokeWidth="0.8" fill="none" opacity="0.3" />
        <circle cx="40" cy="50" r="18" stroke="#7A4DFF" strokeWidth="0.6" fill="none" opacity="0.2" />
      </g>
      {/* Corner ornament top-left */}
      <circle cx="14" cy="14" r="4" fill="#7A4DFF" opacity="0.2" />
      <circle cx="14" cy="14" r="1.5" fill="#7A4DFF" opacity="0.4" />
      {/* Corner ornament bottom-right */}
      <circle cx="66" cy="98" r="4" fill="#7A4DFF" opacity="0.2" />
      <circle cx="66" cy="98" r="1.5" fill="#7A4DFF" opacity="0.4" />
      {/* Text */}
      <text x="40" y="62" textAnchor="middle" fill="#7A4DFF" fontSize="6" fontWeight="700" letterSpacing="2.5" opacity="0.35">UNO</text>
      <text x="40" y="70" textAnchor="middle" fill="#7A4DFF" fontSize="3.5" fontWeight="500" letterSpacing="1.5" opacity="0.2">NO MERCY</text>
    </svg>
  );
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
        className="relative w-20 h-28 rounded-xl cursor-pointer flex items-center justify-center"
        animate={!disabled ? { boxShadow: ['0 0 0px rgba(122,77,255,0)', '0 0 20px rgba(122,77,255,0.3)', '0 0 0px rgba(122,77,255,0)'] } : {}}
        transition={!disabled ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        {/* Stack offset cards behind */}
        <div className="absolute w-20 h-28 rounded-xl bg-bgTertiary/60 border border-white/5 -translate-y-0.5 translate-x-0.5" />
        <div className="absolute w-20 h-28 rounded-xl bg-bgTertiary/40 border border-white/5 -translate-y-1 translate-x-1" />

        {/* Main card back */}
        <div className="relative w-20 h-28">
          <CardBackSVG />
        </div>

        {/* Card count badge */}
        <motion.div
          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent border-2 border-bgPrimary flex items-center justify-center z-10"
          key={cardCount}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <span className="text-[11px] font-mono font-bold text-white">
            {cardCount}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}