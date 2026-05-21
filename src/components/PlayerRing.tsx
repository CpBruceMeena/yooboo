'use client';

import { GameState, Player } from '@/lib/game';
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

/**
 * Reorder players so the local player is always at the "bottom" position.
 * Other players are rotated around to maintain clockwise order.
 */
function reorderPlayersForDisplay(players: Player[], currentPlayerId: string | null | undefined, count: number): Player[] {
  const positions = getPositions(count);
  const bottomPosIndex = positions.indexOf('bottom');

  const localPlayerIndex = players.findIndex(p => p.id === currentPlayerId);
  if (localPlayerIndex === -1) return players;

  // Rotate array so local player ends up at bottom position
  const offset = (localPlayerIndex - bottomPosIndex + count) % count;
  return [...players.slice(offset), ...players.slice(0, offset)];
}

export default function PlayerRing({ gameState, currentPlayerId }: PlayerRingProps) {
  const activePlayers = gameState.players.filter(p => !p.isEliminated);
  const positions = getPositions(activePlayers.length);
  const currentPlayerIdForTurn = gameState.players[gameState.currentPlayerIndex]?.id;

  // Reorder players so local player is at bottom of the screen
  const displayPlayers = reorderPlayersForDisplay(
    activePlayers,
    currentPlayerId,
    activePlayers.length,
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {displayPlayers.map((player, idx) => {
        const isCurrent = player.id === currentPlayerId;
        const pos = positions[idx] ?? 'top';
        const state = player.hand.length === 1 && !player.isEliminated
            ? 'uno'
            : player.id === currentPlayerIdForTurn
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
            // Bottom player is rendered alongside PlayerHandTray in GameTable
            return null;
          default:
            posClass = 'top-4 left-1/2 -translate-x-1/2';
        }

        return (
          <div key={player.id} className={`absolute pointer-events-auto ${posClass}`}>
            <PlayerSeat
              player={player}
              cardCount={player.handSize ?? player.hand.length}
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