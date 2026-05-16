'use client';

import { GameState } from '@/lib/game';
import PlayerSeat from './PlayerSeat';

interface PlayerRingProps {
  gameState: GameState;
  currentPlayerId?: string | null;
}

function getPositions(count: number) {
  if (count <= 2) return ['bottom', 'top'];
  if (count <= 4) return ['left', 'top', 'right', 'bottom'];
  return ['left', 'top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left'];
}

export default function PlayerRing({ gameState, currentPlayerId }: PlayerRingProps) {
  const activePlayers = gameState.players.filter((p) => !p.isEliminated);
  const positions = getPositions(gameState.players.length);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {gameState.players.map((player, idx) => {
        const isCurrent = player.id === currentPlayerId;
        const pos = positions[idx] ?? 'top';
        const state = player.isEliminated
          ? 'eliminated'
          : player.hand.length === 1 && !player.isEliminated
            ? 'uno'
            : gameState.currentPlayerIndex === idx
              ? 'active'
              : 'idle';

        let posClass = '';
        let seatPos: 'top' | 'left' | 'right' | 'bottom' = 'top';

        switch (pos) {
          case 'top':
          case 'top-left':
          case 'top-right':
            posClass = pos === 'top-left' ? 'top-4 left-12' : pos === 'top-right' ? 'top-4 right-12' : 'top-4 left-1/2 -translate-x-1/2';
            seatPos = 'top';
            break;
          case 'left':
            posClass = 'top-1/2 -translate-y-1/2 left-4';
            seatPos = 'left';
            break;
          case 'right':
            posClass = 'top-1/2 -translate-y-1/2 right-4';
            seatPos = 'right';
            break;
          case 'bottom':
            posClass = 'bottom-4 left-1/2 -translate-x-1/2';
            seatPos = 'bottom';
            break;
          default:
            posClass = 'top-4 left-1/2 -translate-x-1/2';
        }

        return (
          <div key={player.id} className={`absolute pointer-events-auto ${posClass}`}>
            <PlayerSeat
              player={player}
              cardCount={player.hand.length}
              state={state as any}
              isCurrentPlayer={isCurrent}
              position={seatPos}
            />
          </div>
        );
      })}
    </div>
  );
}