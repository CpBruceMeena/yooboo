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
  sm: 'w-14 h-20 text-xs',
  md: 'w-20 h-28',
  lg: 'w-24 h-32 text-lg',
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
      whileHover={canInteract ? { y: -16, scale: 1.06 } : undefined}
      whileTap={canInteract ? { scale: 0.95 } : undefined}
      animate={{
        y: isSelected ? -24 : 0,
        scale: isSelected ? 1.06 : 1,
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
      <span className={`absolute top-1 left-1.5 text-[10px] ${size === 'sm' ? 'hidden' : ''} leading-none opacity-80`}>
        {isNumber ? value : ''}
      </span>

      {/* === Number Card === */}
      {isNumber && (
        <span className={`relative z-10 ${size === 'sm' ? 'text-lg' : 'text-3xl'} drop-shadow-lg`}>
          {value}
        </span>
      )}

      {/* === Reverse Card === */}
      {isReverse && !isWild && (
        <div className="relative z-10 flex flex-col items-center">
          <svg className={`${size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'} drop-shadow-lg`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M17 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 11v-1a4 4 0 014-4h14M7 22l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 13v1a4 4 0 01-4 4H3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`${size === 'sm' ? 'text-[8px]' : 'text-xs'} mt-0.5 font-semibold opacity-80`}>REVERSE</span>
        </div>
      )}

      {/* === Reverse4 Card (wild) === */}
      {type === 'reverse4' && isWild && (
        <div className="relative z-10 flex flex-col items-center">
          <svg className={`${size === 'sm' ? 'w-5 h-5' : 'w-7 h-7'} drop-shadow-lg absolute -top-3`} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 11v-1a4 4 0 014-4h12M7 22l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 13v1a4 4 0 01-4 4H3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} font-black drop-shadow-lg mt-2`}>+4</span>
        </div>
      )}

      {/* === +2 Card === */}
      {type === 'plus2' && !isWild && (
        <div className="relative z-10 flex flex-col items-center">
          <span className={`${size === 'sm' ? 'text-xl' : 'text-2xl'} font-black drop-shadow-lg`}>+2</span>
          <span className={`${size === 'sm' ? 'text-[8px]' : 'text-xs'} mt-0.5 font-semibold opacity-80`}>DRAW</span>
        </div>
      )}

      {/* === +4 / +6 / +10 Cards (wild) === */}
      {(type === 'plus4' || type === 'plus6' || type === 'plus10') && isWild && (
        <div className="relative z-10 flex flex-col items-center">
          <span className={`${size === 'sm' ? 'text-xl' : 'text-3xl'} font-black drop-shadow-lg`}>
            {type === 'plus4' ? '+4' : type === 'plus6' ? '+6' : '+10'}
          </span>
          <span className={`${size === 'sm' ? 'text-[8px]' : 'text-xs'} mt-0.5 font-semibold opacity-80`}>
            {type === 'plus10' ? 'MAX DRAW' : 'DRAW'}
          </span>
        </div>
      )}

      {/* === Skip Everyone Card === */}
      {isSkip && (
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <span className={`${size === 'sm' ? 'text-xl' : 'text-3xl'} drop-shadow-lg`}>⊘</span>
          </div>
          <span className={`${size === 'sm' ? 'text-[7px]' : 'text-[10px]'} mt-0.5 font-semibold opacity-80 tracking-tight`}>SKIP ALL</span>
        </div>
      )}

      {/* === Discard All Card === */}
      {isDiscard && (
        <div className="relative z-10 flex flex-col items-center">
          <svg className={`${size === 'sm' ? 'w-5 h-5' : 'w-7 h-7'} drop-shadow-lg`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`${size === 'sm' ? 'text-[7px]' : 'text-[10px]'} mt-0.5 font-semibold opacity-80 tracking-tight`}>DISCARD</span>
        </div>
      )}

      {/* === Smiley Card === */}
      {isSmiley && (
        <div className="relative z-10 flex flex-col items-center">
          <span className={`${size === 'sm' ? 'text-xl' : 'text-3xl'} drop-shadow-lg`}>😊</span>
          <span className={`text-[9px] mt-0.5 font-semibold opacity-80`}>SMILEY</span>
        </div>
      )}

      {/* Wild diamond pattern overlay for non-special wild cards */}
      {isWild && !isSmiley && type !== 'plus4' && type !== 'plus6' && type !== 'plus10' && type !== 'reverse4' && (
        <div className="absolute inset-1 rounded-[10px] border border-white/20 pointer-events-none" />
      )}

      {/* Corner badge bottom-right (rotated) */}
      <span className={`absolute bottom-1 right-1.5 text-[10px] ${size === 'sm' ? 'hidden' : ''} rotate-180 leading-none opacity-80`}>
        {isNumber ? value : ''}
      </span>
    </motion.div>
  );
}
