'use client';

import { GameState, Card as CardType, getPlayableCards } from '@/lib/game';
import DrawPile from './DrawPile';
import DiscardPile from './DiscardPile';
import ColorIndicator from './ColorIndicator';
import DirectionIndicator from './DirectionIndicator';
import StackMeter from './StackMeter';
import PlayerRing from './PlayerRing';
import PlayerSeat from './PlayerSeat';
import PlayerHandTray from './PlayerHandTray';

interface GameTableProps {
  gameState: GameState;
  playerId?: string | null;
  selectedCardId?: string | null;
  onCardClick: (cardId: string) => void;
  onDraw: () => void;
  drawDisabled?: boolean;
  handDisabled?: boolean;
}

export default function GameTable({
  gameState,
  playerId,
  selectedCardId,
  onCardClick,
  onDraw,
  drawDisabled,
  handDisabled,
}: GameTableProps) {
  const localPlayer = gameState.players.find((p) => p.id === playerId);
  const discardTop = gameState.discardPile[gameState.discardPile.length - 1];
  const isMyTurn = playerId === gameState.players[gameState.currentPlayerIndex]?.id;

  // After drawing, the active color stays the same — player must still match
  const playableCardIds = localPlayer && isMyTurn
    ? getPlayableCards(
        localPlayer.hand,
        gameState.activeColor,
        discardTop,
        gameState.pendingDraw,
        gameState.pendingType,
      )
    : [];

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="flex-1 flex flex-col bg-bgPrimary relative overflow-hidden">
      <PlayerRing gameState={gameState} currentPlayerId={playerId} />

      <div className="flex-1 flex items-center justify-center pt-16">
        <div className="flex items-center gap-12">
          <DrawPile
            cardCount={gameState.drawPile.length}
            onClick={isMyTurn ? onDraw : undefined}
            disabled={!isMyTurn || drawDisabled}
          />

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <ColorIndicator color={gameState.activeColor} />
              <DirectionIndicator direction={gameState.direction} />
            </div>
            <DiscardPile
              topCard={discardTop}
              cards={gameState.discardPile}
            />
            <StackMeter value={gameState.pendingDraw} />
            {gameState.status === 'finished' && (
              <div className="text-success font-bold text-lg">Game Over</div>
            )}
          </div>

          <div className="w-20" />
        </div>
      </div>

      <div className="flex items-end gap-3 px-4 pb-3">
        {localPlayer && (
          <PlayerSeat
            player={localPlayer}
            cardCount={localPlayer.hand.length}
            state={
              localPlayer.isEliminated
                ? 'eliminated'
                : localPlayer.hand.length === 1 && !localPlayer.isEliminated
                  ? 'uno'
                  : playerId === gameState.players[gameState.currentPlayerIndex]?.id
                    ? 'active'
                    : 'idle'
            }
            isCurrentPlayer={true}
            position="bottom"
          />
        )}
        <PlayerHandTray
          cards={localPlayer?.hand ?? []}
          playableCardIds={playableCardIds}
          selectedCardId={selectedCardId}
          onCardClick={onCardClick}
          disabled={handDisabled || !isMyTurn}
        />
      </div>
    </div>
  );
}