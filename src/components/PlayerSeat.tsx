'use client';

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

export default function PlayerSeat({ player, cardCount, state, isCurrentPlayer, position = 'top' }: PlayerSeatProps) {
  const isEliminated = state === 'eliminated';
  const isUno = state === 'uno';
  const isActive = state === 'active';
  const avatarColor = avatarColors[player.name.length % avatarColors.length];

  return (
    <div
      className={`
        flex gap-2 p-3 rounded-xl transition-all duration-300 min-w-[120px]
        ${isEliminated ? 'opacity-40' : ''}
        ${positionStyles[position]}
      `}
    >
      <div className="relative">
        <div
          className={`
            w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
            transition-all duration-300
            ${isActive || isCurrentPlayer ? 'ring-2 ring-white/60 animate-pulse-glow' : ''}
            ${isUno ? 'ring-2 ring-success' : ''}
          `}
          style={{ backgroundColor: avatarColor }}
        >
          {player.name.charAt(0).toUpperCase()}
        </div>
        {isEliminated && (
          <div className="absolute -top-1 -right-1 bg-danger text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
            ✕
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-textPrimary truncate max-w-[80px]">
          {player.name}
        </span>
        <span className="text-xs text-textMuted">{cardCount} cards</span>
        {isUno && (
          <span className="text-xs text-success font-bold animate-uno-pulse">UNO!</span>
        )}
        {isEliminated && (
          <span className="text-xs text-danger font-bold">ELIMINATED</span>
        )}
      </div>
    </div>
  );
}