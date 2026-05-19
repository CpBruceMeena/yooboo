'use client';

import { motion } from 'motion/react';
import { Card as CardType } from '@/lib/game';

interface CardProps {
  type: CardType['type'];
  color: CardType['color'];
  value?: number;
  state?: 'default' | 'playable' | 'selected' | 'disabled';
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap: Record<string, string> = {
  sm: 'w-11 h-16 text-[10px]',
  md: 'w-16 h-22 text-xs',
  lg: 'w-20 h-26 text-base',
};

const colorGradients: Record<string, string> = {
  red: 'bg-gradient-to-br from-red to-red/70',
  yellow: 'bg-gradient-to-br from-yellow to-yellow/70',
  green: 'bg-gradient-to-br from-green to-green/70',
  blue: 'bg-gradient-to-br from-blue to-blue/70',
  wild: 'bg-gradient-to-br from-wild to-purple-600',
};

const colorGlows: Record<string, string> = {
  red: 'shadow-[0_0_12px_rgba(228,71,71,0.4)]',
  yellow: 'shadow-[0_0_12px_rgba(243,199,66,0.4)]',
  green: 'shadow-[0_0_12px_rgba(51,181,107,0.4)]',
  blue: 'shadow-[0_0_12px_rgba(52,120,246,0.4)]',
  wild: 'shadow-[0_0_14px_rgba(122,77,255,0.5)]',
};

/** Unique visual styling per special card type */
const typeDecorations: Record<string, string> = {
  reverse: 'before:absolute before:inset-2 before:rounded-full before:border-2 before:border-white/30 before:pointer-events-none',
  plus2: '',
  reverse4: 'before:absolute before:inset-2 before:rounded-full before:border-2 before:border-white/30 before:pointer-events-none',
  plus4: 'bg-gradient-to-br from-wild via-purple-500 to-purple-700',
  plus6: 'bg-gradient-to-br from-wild via-purple-500 to-red-500',
  plus10: 'bg-gradient-to-br from-wild via-red-500 to-orange-500',
  skipEveryone: '',
  discardAll: '',
  smiley: 'bg-gradient-to-br from-pink-400 via-wild to-blue-400',
};

export default function Card({ type, color, value, state = 'default', onClick, size = 'md' }: CardProps) {
  const isPlayable = state === 'playable';
  const isSelected = state === 'selected';
  const isDisabled = state === 'disabled';
  const isWild = color === 'wild';
  const isNumber = type === 'number';

  const textColor = color === 'yellow' ? 'text-black' : 'text-white';
  const canInteract = isPlayable || isSelected;
  const isSmiley = type === 'smiley';
  const isReverse = type === 'reverse' || type === 'reverse4';
  const isSkip = type === 'skipEveryone';
  const isDiscard = type === 'discardAll';

  return (
    <motion.div
      onClick={canInteract ? onClick : undefined}
      layout
      whileHover={canInteract ? { y: -10, scale: 1.05 } : undefined}
      whileTap={canInteract ? { scale: 0.95 } : undefined}
      animate={{
        y: isSelected ? -14 : 0,
        scale: isSelected ? 1.05 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 20,
        mass: 0.8,
      }}
      className={`
        relative rounded-xl border-2 flex flex-col items-center justify-center
        font-bold cursor-pointer shrink-0 select-none
        ${sizeMap[size]}
        ${colorGradients[color] ?? 'bg-bgTertiary'}
        ${isWild && !isSmiley && type !== 'plus4' && type !== 'plus6' && type !== 'plus10' ? typeDecorations[type] ?? '' : ''}
        ${(type === 'plus4' || type === 'plus6' || type === 'plus10') && isWild ? typeDecorations[type] : ''}
        ${isSmiley ? typeDecorations.smiley : ''}
        ${textColor}
        border-white/15
        ${colorGlows[color] ?? ''}
        ${isPlayable ? 'cursor-pointer' : ''}
        ${isDisabled ? 'opacity-35 cursor-not-allowed grayscale-[30%]' : ''}
      `}
    >
      {/* Inner card shine effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none"
        animate={{ opacity: isPlayable ? 0.15 : 0.1 }}
      />

      {/* Corner badge top-left */}
      <span className={`absolute top-0.5 left-1 text-[8px] ${size === 'sm' ? 'hidden' : ''} leading-none opacity-80`}>
        {isNumber ? value : ''}
      </span>

      {/* === Number Card === */}
      {isNumber && (
        <span className={`relative z-10 ${size === 'sm' ? 'text-base' : 'text-2xl'} drop-shadow-lg`}>
          {value}
        </span>
      )}

      {/* === Reverse Card === */}
      {isReverse && !isWild && (
        <div className="relative z-10 flex flex-col items-center">
          <svg className={`${size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} drop-shadow-lg`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M17 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 11v-1a4 4 0 014-4h14M7 22l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 13v1a4 4 0 01-4 4H3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {size !== 'sm' && <span className={`text-[9px] mt-0.5 font-semibold opacity-80`}>REVERSE</span>}
        </div>
      )}

      {/* === Reverse4 Card (wild) — distinctive double-arrow +4 with explosion ring */}
      {type === 'reverse4' && isWild && (
        <div className="relative z-10 flex flex-col items-center">
          {/* Explosion ring */}
          <div className="absolute inset-0 rounded-xl border-2 border-white/30 scale-110 animate-pulse pointer-events-none" />
          <svg className={`${size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} drop-shadow-lg`} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M13 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 11v-1a4 4 0 014-4h10M9 19l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 13v1a4 4 0 01-4 4H2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`${size === 'sm' ? 'text-sm' : 'text-lg'} font-black drop-shadow-lg mt-0.5 leading-none`}>+4</span>
          {size !== 'sm' && <span className={`text-[8px] font-semibold opacity-80 tracking-tight leading-none`}>REV</span>}
        </div>
      )}

      {/* === +2 Card === */}
      {type === 'plus2' && !isWild && (
        <div className="relative z-10 flex flex-col items-center">
          <span className={`${size === 'sm' ? 'text-base' : 'text-xl'} font-black drop-shadow-lg`}>+2</span>
          {size !== 'sm' && <span className={`text-[9px] mt-0.5 font-semibold opacity-80`}>DRAW</span>}
        </div>
      )}

      {/* === +4 Card (color-specific) — like +2 but draws 4 */}
      {type === 'plus4' && !isWild && (
        <div className="relative z-10 flex flex-col items-center">
          <span className={`${size === 'sm' ? 'text-base' : 'text-xl'} font-black drop-shadow-lg`}>+4</span>
          {size !== 'sm' && <span className={`text-[9px] mt-0.5 font-semibold opacity-80`}>DRAW 4</span>}
        </div>
      )}

      {/* === Wild +4 (legacy) — kept for backward compat */}
      {type === 'plus4' && isWild && (
        <div className="relative z-10 flex flex-col items-center">
          <div className={`absolute border-2 border-white/30 rotate-45 rounded-sm opacity-60 pointer-events-none ${size === 'sm' ? 'w-7 h-7' : 'w-9 h-9'}`} />
          <span className={`${size === 'sm' ? 'text-base' : 'text-2xl'} font-black drop-shadow-lg`}>+4</span>
          {size !== 'sm' && <span className={`text-[9px] mt-0.5 font-semibold opacity-80`}>WILD</span>}
        </div>
      )}

      {/* === +6 Card (wild) — lightning bolt with stacked rings */}
      {type === 'plus6' && isWild && (
        <div className="relative z-10 flex flex-col items-center">
          {/* Double ring burst */}
          <div className={`absolute rounded-full border-2 border-white/25 pointer-events-none ${size === 'sm' ? 'w-7 h-7' : 'w-8 h-8'}`} />
          <div className={`absolute rounded-full border border-white/15 pointer-events-none ${size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'}`} />
          <span className={`${size === 'sm' ? 'text-lg' : 'text-3xl'} font-black drop-shadow-lg leading-none`}>6</span>
          {size !== 'sm' && <span className={`text-[8px] font-black opacity-70 leading-none -mt-0.5`}>+6 ⚡</span>}
        </div>
      )}

      {/* === +10 Card (wild) — MAX DRAW with skull/ominous ring */}
      {type === 'plus10' && isWild && (
        <div className="relative z-10 flex flex-col items-center">
          {/* Triple ominous ring */}
          <div className={`absolute rounded-full border-[3px] border-red-400/40 pointer-events-none ${size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'}`} />
          <div className={`absolute rounded-full border-2 border-red-500/30 pointer-events-none ${size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'}`} />
          <span className={`${size === 'sm' ? 'text-sm' : 'text-xl'} font-black drop-shadow-lg leading-none`}>+10</span>
          {size !== 'sm' && <span className={`text-[8px] font-black opacity-60 leading-none mt-0.5 tracking-wider`}>☠ MAX</span>}
        </div>
      )}

      {/* === Skip Everyone Card === */}
      {isSkip && (
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <span className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} drop-shadow-lg`}>⊘</span>
          </div>
          {size !== 'sm' && <span className={`text-[9px] mt-0.5 font-semibold opacity-80 tracking-tight`}>SKIP ALL</span>}
        </div>
      )}

      {/* === Discard All Card === */}
      {isDiscard && (
        <div className="relative z-10 flex flex-col items-center">
          <svg className={`${size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} drop-shadow-lg`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {size !== 'sm' && <span className={`text-[9px] mt-0.5 font-semibold opacity-80 tracking-tight`}>DISCARD</span>}
        </div>
      )}

      {/* === Smiley Card === */}
      {isSmiley && (
        <div className="relative z-10 flex flex-col items-center">
          <span className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} drop-shadow-lg`}>😊</span>
          {size !== 'sm' && <span className={`text-[8px] mt-0.5 font-semibold opacity-80`}>SMILEY</span>}
        </div>
      )}

      {/* Wild diamond pattern overlay for non-special wild cards */}
      {isWild && !isSmiley && type !== 'plus4' && type !== 'plus6' && type !== 'plus10' && type !== 'reverse4' && (
        <div className="absolute inset-1 rounded-[10px] border border-white/20 pointer-events-none" />
      )}

      {/* Corner badge bottom-right (rotated) */}
      <span className={`absolute bottom-0.5 right-1 text-[8px] ${size === 'sm' ? 'hidden' : ''} rotate-180 leading-none opacity-80`}>
        {isNumber ? value : ''}
      </span>
    </motion.div>
  );
}
