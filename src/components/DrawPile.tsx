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
      {/* Card body - dark charcoal */}
      <rect x="2" y="2" width="76" height="108" rx="10" fill="#0A0808" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

      {/* Outer decorative border */}
      <rect x="5" y="5" width="70" height="102" rx="8" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

      {/* Inner ornate border */}
      <rect x="8" y="8" width="64" height="96" rx="6" fill="none" stroke="rgba(201,149,42,0.08)" strokeWidth="0.5" />

      {/* Corner diamond ornaments */}
      <g opacity="0.25">
        {/* Top-left */}
        <path d="M14 14L18 18L14 22L10 18Z" fill="#C9952A" />
        {/* Top-right */}
        <path d="M66 14L70 18L66 22L62 18Z" fill="#C9952A" />
        {/* Bottom-left */}
        <path d="M14 90L18 94L14 98L10 94Z" fill="#C9952A" />
        {/* Bottom-right */}
        <path d="M66 90L70 94L66 98L62 94Z" fill="#C9952A" />
      </g>

      {/* Center geometric compass/star pattern */}
      <g opacity="0.12">
        {/* Outer ring */}
        <circle cx="40" cy="56" r="28" stroke="#C9952A" strokeWidth="0.6" fill="none" />
        {/* Inner ring */}
        <circle cx="40" cy="56" r="22" stroke="#C9952A" strokeWidth="0.4" fill="none" />
        {/* Diamond star */}
        <path d="M40 34L46 48L40 56L34 48Z" fill="#C9952A" />
        <path d="M40 56L46 64L40 78L34 64Z" fill="#C9952A" />
        <path d="M28 48L40 42L52 48L40 56Z" fill="#C9952A" opacity="0.6" />
        <path d="M28 64L40 56L52 64L40 70Z" fill="#C9952A" opacity="0.6" />
        {/* Cross-lines */}
        <line x1="18" y1="56" x2="62" y2="56" stroke="#C9952A" strokeWidth="0.3" />
        <line x1="40" y1="36" x2="40" y2="76" stroke="#C9952A" strokeWidth="0.3" />
      </g>

      {/* "NO MERCY" chrome wordmark */}
      <text
        x="40" y="54"
        textAnchor="middle"
        fontSize="8"
        fontWeight="800"
        letterSpacing="3"
        fill="#FFFFFF"
        style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.8)) drop-shadow(0 0 8px rgba(192,187,168,0.2))' }}
      >
        NO
      </text>
      <text
        x="40" y="66"
        textAnchor="middle"
        fontSize="7"
        fontWeight="700"
        letterSpacing="3.5"
        fill="#C0BBA8"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }}
      >
        MERCY
      </text>

      {/* Horizontal chrome bar underneath */}
      <line x1="20" y1="72" x2="60" y2="72" stroke="url(#chromeBar)" strokeWidth="0.8" opacity="0.2" />
      <line x1="22" y1="74" x2="58" y2="74" stroke="#C9952A" strokeWidth="0.3" opacity="0.1" />

      {/* Red/blue glow dots flanking wordmark */}
      <circle cx="20" cy="60" r="2" fill="#FF003C" opacity="0.15" />
      <circle cx="60" cy="60" r="2" fill="#00D4FF" opacity="0.15" />
      <circle cx="20" cy="60" r="1" fill="#FF003C" opacity="0.3" />
      <circle cx="60" cy="60" r="1" fill="#00D4FF" opacity="0.3" />

      {/* Top decorative line */}
      <line x1="18" y1="18" x2="62" y2="18" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
      <line x1="18" y1="94" x2="62" y2="94" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="chromeBar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="20%" stopColor="#C0BBA8" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="80%" stopColor="#C0BBA8" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
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
        className="relative w-20 h-28 rounded-xl cursor-pointer flex items-center justify-center edge-glow-pulse"
        animate={!disabled ? {
          boxShadow: [
            'inset 0 0 8px rgba(255,0,60,0.12), 0 0 4px rgba(0,212,255,0.06)',
            'inset 0 0 14px rgba(255,0,60,0.25), 0 0 10px rgba(0,212,255,0.12)',
            'inset 0 0 8px rgba(255,0,60,0.12), 0 0 4px rgba(0,212,255,0.06)',
          ],
        } : {}}
        transition={!disabled ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        {/* Stack offset cards behind */}
        <div className="absolute w-20 h-28 rounded-xl bg-[#1A1512]/80 border border-white/5 -translate-y-0.5 translate-x-0.5" />
        <div className="absolute w-20 h-28 rounded-xl bg-[#1A1512]/60 border border-white/3 -translate-y-1 translate-x-1" />
        <div className="absolute w-20 h-28 rounded-xl bg-[#1A1512]/40 border border-white/2 -translate-y-1.5 translate-x-1.5" />

        {/* Main card back */}
        <div className="relative w-20 h-28">
          <CardBackSVG />
        </div>

        {/* Card count badge */}
        <motion.div
          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-gold to-goldGlow border-2 border-bgPrimary/80 flex items-center justify-center z-10 shadow-lg shadow-gold/30"
          key={cardCount}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <span className="text-[11px] font-mono font-bold text-bgWarm">
            {cardCount}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
