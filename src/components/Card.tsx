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
  red: 'bg-gradient-to-br from-[#D63A3A] via-[#C62828] to-[#8E1E1E]',
  yellow: 'bg-gradient-to-br from-[#E8C84A] via-[#D4A825] to-[#B8921A]',
  green: 'bg-gradient-to-br from-[#2D9B5E] via-[#238551] to-[#1A6B3F]',
  blue: 'bg-gradient-to-br from-[#2D6BC4] via-[#2458A8] to-[#1B4888]',
  wild: 'bg-gradient-to-br from-[#6B3FA0] via-[#7A4DFF] to-[#5A2DCC]',
};

const colorGlows: Record<string, string> = {
  red: 'shadow-[0_0_10px_rgba(198,40,40,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]',
  yellow: 'shadow-[0_0_10px_rgba(212,168,37,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]',
  green: 'shadow-[0_0_10px_rgba(35,133,81,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]',
  blue: 'shadow-[0_0_10px_rgba(36,88,168,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]',
  wild: 'shadow-[0_0_14px_rgba(122,77,255,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]',
};

/** Unique visual styling per special card type */
const typeDecorations: Record<string, string> = {
  reverse: 'before:absolute before:inset-2 before:rounded-full before:border-2 before:border-white/25 before:pointer-events-none',
  plus2: '',
  reverse4: 'before:absolute before:inset-1.5 before:rounded-[10px] before:border-2 before:border-white/25 before:animate-pulse before:pointer-events-none',
  plus4: '',
  plus6: '',
  plus10: '',
  skipEveryone: '',
  discardAll: '',
  smiley: '',
};

export default function Card({ type, color, value, state = 'default', onClick, size = 'md' }: CardProps) {
  const isPlayable = state === 'playable';
  const isSelected = state === 'selected';
  const isDisabled = state === 'disabled';
  const isWild = color === 'wild';
  const isNumber = type === 'number';

  const textColor = color === 'yellow' ? 'text-[#1A1512]' : 'text-white';
  const canInteract = isPlayable || isSelected;
  const isSmiley = type === 'smiley';
  const isReverse = type === 'reverse' || type === 'reverse4';
  const isSkip = type === 'skipEveryone';
  const isDiscard = type === 'discardAll';

  return (
    <motion.div
      onClick={canInteract ? onClick : undefined}
      layout
      whileHover={canInteract ? { y: -10, scale: 1.08 } : undefined}
      whileTap={canInteract ? { scale: 0.95 } : undefined}
      animate={{
        y: isSelected ? -14 : 0,
        scale: isSelected ? 1.08 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 20,
        mass: 0.8,
      }}
      className={`
        relative rounded-xl border flex flex-col items-center justify-center
        font-bold cursor-pointer shrink-0 select-none
        ${sizeMap[size]}
        ${colorGradients[color] ?? 'bg-bgTertiary'}
        ${textColor}
        border-white/20
        ${colorGlows[color] ?? ''}
        ${isPlayable ? 'cursor-pointer ring-2 ring-white/40 ring-offset-1 ring-offset-transparent' : ''}
        ${isDisabled ? 'opacity-35 cursor-not-allowed grayscale-[30%] saturate-50' : ''}
        ${isSelected ? 'ring-2 ring-goldGlow ring-offset-2 ring-offset-[#0A0705]' : ''}
      `}
      style={{
        boxShadow: isPlayable
          ? `0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 20px rgba(255,255,255,0.08)`
          : undefined,
      }}
    >
      {/* Inner card shine effect - glass reflection */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/12 to-transparent pointer-events-none" />
      
      {/* Bottom vignette for depth */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      {/* Corner badge top-left */}
      <span className={`absolute top-0.5 left-1 text-[8px] ${size === 'sm' ? 'hidden' : ''} leading-none opacity-80 drop-shadow-sm`}>
        {isNumber ? value : ''}
      </span>

      {/* === Number Card === */}
      {isNumber && (
        <span className={`relative z-10 ${size === 'sm' ? 'text-base' : 'text-2xl'} font-black drop-shadow-lg tracking-tight`}>
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
          {size !== 'sm' && <span className={`text-[8px] mt-0.5 font-bold opacity-75 tracking-wider`}>REVERSE</span>}
        </div>
      )}

      {/* === Reverse4 Card (wild) — gold-accented explosive reverse */}

      {type === 'reverse4' && isWild && (
        <div className="relative z-10 flex flex-col items-center">
          {/* Gold explosion ring */}
          <div className="absolute inset-0 rounded-xl border-2 border-goldGlow/40 scale-110 animate-pulse pointer-events-none shadow-[inset_0_0_10px_rgba(232,184,75,0.2)]" />
          <svg className={`${size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} drop-shadow-lg`} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M13 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 11v-1a4 4 0 014-4h10M9 19l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 13v1a4 4 0 01-4 4H2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`${size === 'sm' ? 'text-sm' : 'text-lg'} font-black drop-shadow-lg mt-0.5 leading-none`}>+4</span>
          {size !== 'sm' && <span className={`text-[7px] font-bold opacity-75 tracking-tight leading-none`}>REV</span>}
        </div>
      )}

      {/* === +2 Card === */}
      {type === 'plus2' && !isWild && (
        <div className="relative z-10 flex flex-col items-center">
          <span className={`${size === 'sm' ? 'text-base' : 'text-xl'} font-black drop-shadow-lg`}>+2</span>
          {size !== 'sm' && <span className={`text-[8px] mt-0.5 font-bold opacity-75 tracking-wider`}>DRAW</span>}
        </div>
      )}

      {/* === +4 Card (color-specific) — like +2 but draws 4 */}
      {type === 'plus4' && !isWild && (
        <div className="relative z-10 flex flex-col items-center">
          <span className={`${size === 'sm' ? 'text-base' : 'text-xl'} font-black drop-shadow-lg`}>+4</span>
          {size !== 'sm' && <span className={`text-[8px] mt-0.5 font-bold opacity-75 tracking-wider`}>DRAW 4</span>}
        </div>
      )}

      {/* === Wild +4 (legacy) — gold-accented diamond */}
      {type === 'plus4' && isWild && (
        <div className="relative z-10 flex flex-col items-center">
          <div className={`absolute border-2 border-goldGlow/40 rotate-45 rounded-sm opacity-50 pointer-events-none ${size === 'sm' ? 'w-7 h-7' : 'w-9 h-9'} shadow-[inset_0_0_8px_rgba(232,184,75,0.15)]`} />
          <span className={`${size === 'sm' ? 'text-base' : 'text-2xl'} font-black drop-shadow-lg`}>+4</span>
          {size !== 'sm' && <span className={`text-[8px] mt-0.5 font-bold opacity-75 tracking-wider`}>WILD</span>}
        </div>
      )}

      {/* === +6 Card (wild) — gold-accented with stacked rings */}
      {type === 'plus6' && isWild && (
        <div className="relative z-10 flex flex-col items-center">
          {/* Double ring burst with gold */}
          <div className={`absolute rounded-full border-2 border-goldGlow/30 pointer-events-none ${size === 'sm' ? 'w-7 h-7' : 'w-8 h-8'}`} />
          <div className={`absolute rounded-full border border-goldGlow/20 pointer-events-none ${size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'}`} />
          <span className={`${size === 'sm' ? 'text-lg' : 'text-3xl'} font-black drop-shadow-lg leading-none`}>6</span>
          {size !== 'sm' && <span className={`text-[8px] font-bold opacity-70 leading-none -mt-0.5`}>⚡+6</span>}
        </div>
      )}

      {/* === +10 Card (wild) — MAX DRAW with ominous gold ring */}
      {type === 'plus10' && isWild && (
        <div className="relative z-10 flex flex-col items-center">
          {/* Triple ominous ring */}
          <div className={`absolute rounded-full border-[3px] border-crimson/40 pointer-events-none ${size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'}`} />
          <div className={`absolute rounded-full border-2 border-goldGlow/30 pointer-events-none ${size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'}`} />
          <span className={`${size === 'sm' ? 'text-sm' : 'text-xl'} font-black drop-shadow-lg leading-none`}>+10</span>
          {size !== 'sm' && <span className={`text-[7px] font-bold opacity-60 leading-none mt-0.5 tracking-wider`}>☠ MAX</span>}
        </div>
      )}

      {/* === Skip Everyone Card === */}
      {isSkip && (
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <span className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} drop-shadow-lg`}>⊘</span>
          </div>
          {size !== 'sm' && <span className={`text-[8px] mt-0.5 font-bold opacity-75 tracking-tight`}>SKIP ALL</span>}
        </div>
      )}

      {/* === Discard All Card === */}
      {isDiscard && (
        <div className="relative z-10 flex flex-col items-center">
          <svg className={`${size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} drop-shadow-lg`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {size !== 'sm' && <span className={`text-[8px] mt-0.5 font-bold opacity-75 tracking-tight`}>DISCARD</span>}
        </div>
      )}

      {/* === Smiley Card === */}
      {isSmiley && (
        <div className="relative z-10 flex flex-col items-center">
          <span className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} drop-shadow-lg`}>😊</span>
          {size !== 'sm' && <span className={`text-[8px] mt-0.5 font-bold opacity-75`}>SMILEY</span>}
        </div>
      )}

      {/* Wild diamond pattern overlay for non-special wild cards */}
      {isWild && !isSmiley && type !== 'plus4' && type !== 'plus6' && type !== 'plus10' && type !== 'reverse4' && (
        <div className="absolute inset-1 rounded-[10px] border border-goldGlow/20 pointer-events-none" />
      )}

      {/* Corner badge bottom-right (rotated) */}
      <span className={`absolute bottom-0.5 right-1 text-[8px] ${size === 'sm' ? 'hidden' : ''} rotate-180 leading-none opacity-80 drop-shadow-sm`}>
        {isNumber ? value : ''}
      </span>
    </motion.div>
  );
}
