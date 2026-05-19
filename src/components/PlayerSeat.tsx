'use client';

import { motion } from 'motion/react';
import { Player } from '@/lib/game';

interface PlayerSeatProps {
  player: Player;
  cardCount: number;
  state: 'idle' | 'active' | 'underAttack' | 'uno' | 'eliminated';
  isCurrentPlayer?: boolean;
  position?: 'top' | 'left' | 'right' | 'bottom';
  onAttack?: () => void;
}

const positionStyles: Record<string, string> = {
  top: 'flex-col items-center',
  left: 'flex-row items-center',
  right: 'flex-row-reverse items-center',
  bottom: 'flex-col items-center',
};

const avatarColors = ['#E44747', '#F3C742', '#33B56B', '#3478F6', '#7A4DFF', '#FF6B6B', '#4CD97B', '#AAB2C0'];
const avatarGradients = [
  'from-red to-red/60',
  'from-yellow to-yellow/60',
  'from-green to-green/60',
  'from-blue to-blue/60',
  'from-wild to-purple-600/60',
  'from-pink-500 to-pink-600/60',
  'from-emerald-400 to-emerald-500/60',
  'from-cyan-400 to-cyan-500/60',
];

export default function PlayerSeat({ player, cardCount, state, isCurrentPlayer, position = 'top' }: PlayerSeatProps) {
  const isEliminated = state === 'eliminated';
  const isUno = state === 'uno';
  const isActive = state === 'active';
  const gradIdx = player.name.length % avatarGradients.length;
  const avatarColor = avatarColors[player.name.length % avatarColors.length];
  const avatarGrad = avatarGradients[gradIdx];

  const isHorizontal = position === 'left' || position === 'right';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`
        flex gap-2.5 p-2.5 rounded-xl transition-colors duration-300
        ${isEliminated ? 'opacity-35' : ''}
        ${isActive ? 'bg-bgTertiary/40' : ''}
        ${positionStyles[position]}
      `}
    >
      <div className="relative">
        {/* Avatar glow ring for active/current player */}
        {(isActive || isCurrentPlayer) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 2,
              ease: 'easeInOut',
            }}
            className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue to-wild"
          />
        )}
        {/* UNO glow */}
        {isUno && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 1.5,
              ease: 'easeInOut',
            }}
            className="absolute -inset-1 rounded-full bg-gradient-to-br from-success to-green"
          />
        )}
        <div
          className={`
            relative w-11 h-11 rounded-full flex items-center justify-center text-base font-bold
            transition-all duration-300 bg-gradient-to-br ${avatarGrad}
            ${isActive || isCurrentPlayer ? 'ring-2 ring-white/80' : 'ring-1 ring-white/15'}
            ${isUno ? 'ring-2 ring-success' : ''}
            ${isEliminated ? 'grayscale' : ''}
          `}
        >
          {player.name.charAt(0).toUpperCase()}
        </div>
        {isEliminated && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            className="absolute -top-1 -right-1 bg-danger text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-lg z-10"
          >
            ✕
          </motion.div>
        )}
        {/* Bottom position - show card count badge */}
        {position === 'bottom' && !isEliminated && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={cardCount}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="absolute -bottom-1 -right-1 bg-bgSecondary text-textMuted text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-textMuted/20 shadow-lg z-10"
          >
            {cardCount}
          </motion.div>
        )}
      </div>
      <div className={`flex flex-col ${isHorizontal ? 'min-w-0' : ''}`}>
        <motion.span
          layout
          className={`text-sm font-semibold text-textPrimary truncate max-w-[72px] ${isEliminated ? 'line-through opacity-60' : ''}`}
        >
          {player.name}
        </motion.span>
        {!isHorizontal && (
          <span className="text-[11px] text-textMuted/70">{cardCount} cards</span>
        )}
        {isUno && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="text-[11px] text-success font-bold"
          >
            UNO!
          </motion.span>
        )}
        {isEliminated && (
          <span className="text-[11px] text-danger font-bold">✗ ELIMINATED</span>
        )}
      </div>
    </motion.div>
  );
}