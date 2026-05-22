'use client';

import { GameState, Card as CardType, getPlayableCards } from '@/lib/game';
import { motion, AnimatePresence } from 'motion/react';
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

const colorFlashGradients: Record<string, string> = {
  red: 'from-red/8 via-transparent to-transparent',
  yellow: 'from-yellow/8 via-transparent to-transparent',
  green: 'from-green/8 via-transparent to-transparent',
  blue: 'from-blue/8 via-transparent to-transparent',
};

const colorAmbientGlows: Record<string, string> = {
  red: 'rgba(228,71,71,0.12)',
  yellow: 'rgba(243,199,66,0.10)',
  green: 'rgba(51,181,107,0.10)',
  blue: 'rgba(52,120,246,0.10)',
};

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
        gameState.smileyActive,
      )
    : [];

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="flex-1 flex flex-col bg-bgPrimary relative overflow-hidden">
      {/* Active color ambient glow background */}
      {gameState.activeColor && (
        <motion.div
          key={gameState.activeColor}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          {/* Main radial glow */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
            style={{
              background: `radial-gradient(ellipse, ${colorAmbientGlows[gameState.activeColor] ?? 'transparent'} 0%, transparent 70%)`,
            }}
          />
          {/* Top-left accent */}
          <div
            className="absolute top-0 left-0 w-[300px] h-[300px]"
            style={{
              background: `radial-gradient(circle at top left, ${colorAmbientGlows[gameState.activeColor] ?? 'transparent'} 0%, transparent 60%)`,
            }}
          />
          {/* Bottom-right accent */}
          <div
            className="absolute bottom-0 right-0 w-[300px] h-[300px]"
            style={{
              background: `radial-gradient(circle at bottom right, ${colorAmbientGlows[gameState.activeColor] ?? 'transparent'} 0%, transparent 60%)`,
            }}
          />
        </motion.div>
      )}

      {/* Color flash animation on color change */}
      <AnimatePresence>
        {gameState.activeColor && (
          <motion.div
            key={`flash-${gameState.activeColor}`}
            className={`absolute inset-0 pointer-events-none bg-gradient-to-b ${colorFlashGradients[gameState.activeColor] ?? ''}`}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

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