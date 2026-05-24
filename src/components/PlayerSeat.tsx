'use client';

import { motion } from 'motion/react';
import { useMemo } from 'react';
import { Player } from '@/lib/game';

interface PlayerSeatProps {
  player: Player;
  cardCount: number;
  state: 'idle' | 'active' | 'underAttack' | 'yooboo' | 'eliminated';
  isCurrentPlayer?: boolean;
  position?: 'top' | 'left' | 'right' | 'bottom';
  onAttack?: () => void;
}

const positionStyles: Record<string, string> = {
  top: 'flex-col items-center',
  left: 'flex-row items-center',
  right: 'flex-row-reverse items-center',
  bottom: 'flex-row items-center',
};

const diceBearStyles = ['notionists-neutral', 'avataaars', 'bottts-neutral', 'lorelei-neutral', 'thumbs'] as const;

function getAvatarUrl(name: string): string {
  const styleIdx = name.length % diceBearStyles.length;
  const style = diceBearStyles[styleIdx];
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(name)}`;
}

export default function PlayerSeat({ player, cardCount, state, isCurrentPlayer, position = 'top' }: PlayerSeatProps) {
  const isEliminated = state === 'eliminated';
  const isYooboo = state === 'yooboo';
  const isActive = state === 'active';

  const isHorizontal = position === 'left' || position === 'right' || position === 'bottom';

  const avatarUrl = useMemo(() => getAvatarUrl(player.name), [player.name]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`
        flex gap-2.5 p-2 rounded-xl transition-colors duration-300
        ${isEliminated ? 'opacity-35' : ''}
        ${isActive ? 'bg-bgTertiary/40' : ''}
        ${positionStyles[position]}
      `}
    >
      <div className="relative shrink-0">
        {/* Turn glow ring — pulsing gold aura for the active player */}
        {isActive && (
          <>
            {/* Outer aura ring */}
            <motion.div
              animate={{
                opacity: [0.5, 0.9, 0.5],
                scale: [1, 1.08, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'easeInOut',
              }}
              className="absolute -inset-2 rounded-full bg-gradient-to-br from-gold/60 via-goldGlow/40 to-gold/20 blur-sm"
            />
            {/* Inner glow ring */}
            <motion.div
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.04, 1],
                boxShadow: [
                  '0 0 8px rgba(232,184,75,0.3)',
                  '0 0 16px rgba(232,184,75,0.6)',
                  '0 0 8px rgba(232,184,75,0.3)',
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'easeInOut',
              }}
              className="absolute -inset-1 rounded-full bg-gradient-to-br from-gold to-goldGlow"
            />
          </>
        )}
        {/* Local player indicator — softer static glow */}
        {!isActive && isCurrentPlayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 2.5,
              ease: 'easeInOut',
            }}
            className="absolute -inset-1 rounded-full bg-gradient-to-br from-gold/60 to-goldGlow/40"
          />
        )}
        {/* YOOBOO glow */}
        {isYooboo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 1.5,
              ease: 'easeInOut',
            }}
            className="absolute -inset-1 rounded-full bg-gradient-to-br from-goldGlow to-gold/60"
          />
        )}
        <div
          className={`
            relative w-11 h-11 rounded-full overflow-hidden
            transition-all duration-300 bg-bgTertiary
            ${isActive ? 'ring-2 ring-goldGlow shadow-[0_0_10px_rgba(232,184,75,0.4)]' : ''}
            ${!isActive && isYooboo ? 'ring-2 ring-success' : ''}
            ${!isActive && isCurrentPlayer && !isYooboo ? 'ring-2 ring-white/50' : ''}
            ${!isActive && !isYooboo && !isCurrentPlayer ? 'ring-1 ring-white/15' : ''}
            ${isEliminated ? 'grayscale' : ''}
          `}
        >
          <img
            src={avatarUrl}
            alt={`${player.name}'s avatar`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
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
          className={`text-sm font-semibold truncate max-w-[72px] ${isEliminated ? 'line-through opacity-60' : ''} ${isActive ? 'text-goldGlow drop-shadow-[0_0_6px_rgba(232,184,75,0.5)]' : 'text-textPrimary'}`}
        >
          {player.name}
        </motion.span>
        {isActive && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[9px] font-mono text-goldGlow/70 tracking-[0.15em] uppercase"
          >
            ● Turn
          </motion.span>
        )}
        <span className="text-[11px] text-textMuted/70">{cardCount} cards</span>
        {isYooboo && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="text-[11px] text-success font-bold"
          >
            YOOBOO!
          </motion.span>
        )}
        {isEliminated && (
          <span className="text-[11px] text-danger font-bold">✗ ELIMINATED</span>
        )}
      </div>
    </motion.div>
  );
}