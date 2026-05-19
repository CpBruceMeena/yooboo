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

const symbolMap: Record<string, string> = {
  reverse: '⟳',
  plus2: '+2',
  reverse4: '⟳+4',
  plus4: '+4',
  plus6: '+6',
  plus10: '+10',
  skipEveryone: '⊘',
  discardAll: '🗑',
  smiley: '😊',
};

export default function Card({ type, color, value, state = 'default', onClick, size = 'md' }: CardProps) {
  const isPlayable = state === 'playable';
  const isSelected = state === 'selected';
  const isDisabled = state === 'disabled';
  const isWild = color === 'wild';

  const symbol = type === 'number' ? value : symbolMap[type] ?? '?';
  const textColor = color === 'yellow' ? 'text-black' : 'text-white';

  const canInteract = isPlayable || isSelected;

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
      <span className={`absolute top-1 left-1.5 text-[10px] ${size === 'sm' ? 'hidden' : ''} leading-none`}>
        {symbol}
      </span>

      {/* Center symbol */}
      <span className={`relative z-10 ${size === 'sm' ? 'text-lg' : 'text-3xl'} drop-shadow-lg`}>
        {symbol}
      </span>

      {/* Wild diamond pattern overlay */}
      {isWild && (
        <div className="absolute inset-1 rounded-[10px] border border-white/20 pointer-events-none" />
      )}

      {/* Corner badge bottom-right (rotated) */}
      <span className={`absolute bottom-1 right-1.5 text-[10px] ${size === 'sm' ? 'hidden' : ''} rotate-180 leading-none`}>
        {symbol}
      </span>
    </motion.div>
  );
}
