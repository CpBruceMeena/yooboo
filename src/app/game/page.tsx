'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGame } from '@/hooks/useGame';
import TopBar from '@/components/TopBar';
import GameTable from '@/components/GameTable';
import RightPanel from '@/components/RightPanel';
import OverlayLayer from '@/components/OverlayLayer';
import Button from '@/components/Button';

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get('room') ?? '';
  const playerName = searchParams.get('name') ?? '';

  const {
    gameState, playerId, connected, error,
    joinRoom, startGame,
    selectedCardId, showChangeColor, showDiscardAll, toast,
    handleCardClick, handleDraw, handleSayUno,
    handleColorSelect, handleDiscardSelect,
    handleEmote, handleLeave, clearToast, cancelColor,
    isMyTurn, isLoading,
  } = useGame();

  const [hasJoined, setHasJoined] = useState(false);
  const [lobbyPlayers, setLobbyPlayers] = useState<string[]>([]);
  const hasRequestedJoin = useRef(false);

  useEffect(() => {
    if (!roomId || !playerName || hasRequestedJoin.current) return;
    hasRequestedJoin.current = true;
    joinRoom(roomId, playerName);
  }, [roomId, playerName, joinRoom]);

  useEffect(() => {
    if (gameState && gameState.status === 'in_game') {
      setHasJoined(true);
    }
  }, [gameState]);

  const currentPlayerName = gameState
    ? gameState.players[gameState.currentPlayerIndex]?.name ?? ''
    : '';

  const localPlayer = gameState?.players.find((p) => p.id === playerId);
  const unoEligible = localPlayer?.hand.length === 1 && !localPlayer.saidUno;

  if (!roomId || !playerName) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bgPrimary">
        <div className="text-center">
          <p className="text-textMuted mb-4">Missing room or player info.</p>
          <Button variant="primary" onClick={() => router.push('/')}>Back to Lobby</Button>
        </div>
      </div>
    );
  }

  if (!hasJoined || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bgPrimary">
        <div className="bg-bgSecondary rounded-2xl border border-textMuted/10 p-8 w-full max-w-sm text-center">
          <h2 className="text-xl font-bold text-textPrimary mb-2">Room: {roomId}</h2>
          <p className="text-textMuted text-sm mb-4">
            {connected ? 'Waiting for players...' : 'Connecting...'}
          </p>
          <p className="text-textMuted text-xs mb-6">
            Share this room code with friends
          </p>
          {error && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-danger/20 border border-danger/30 text-danger text-sm">
              {error}
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <Button
              variant="primary"
              onClick={() => startGame()}
              disabled={!connected}
            >
              Start Game
            </Button>
            <Button variant="secondary" onClick={() => router.push('/')}>
              Leave
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bgPrimary">
        <p className="text-textMuted">Loading game...</p>
      </div>
    );
  }

  const isGameFinished = gameState.status === 'finished';
  const winner = gameState.players.find((p) => p.id === gameState.winnerId);

  return (
    <div className="flex-1 flex flex-col h-screen">
      <TopBar
        roomId={roomId}
        currentPlayer={currentPlayerName}
        direction={gameState.direction === 1 ? 'clockwise' : 'counter'}
        stackValue={gameState.pendingDraw}
      />
      <div className="flex flex-1 overflow-hidden">
        <GameTable
          gameState={gameState}
          playerId={playerId}
          selectedCardId={selectedCardId}
          onCardClick={handleCardClick}
          onDraw={handleDraw}
          drawDisabled={gameState.pendingDraw <= 0 || !isMyTurn}
          handDisabled={isGameFinished}
        />
        <RightPanel
          onDraw={handleDraw}
          onSayUno={handleSayUno}
          onLeave={handleLeave}
          onEmote={handleEmote}
          disabled={!isMyTurn || isGameFinished}
          unoEligible={!!unoEligible}
        />
      </div>
      <OverlayLayer
        showChangeColor={showChangeColor}
        showDiscardAll={showDiscardAll}
        showGameResult={isGameFinished}
        gameResult={{
          winnerName: winner?.name,
          isWinner: winner?.id === playerId,
        }}
        onColorSelect={handleColorSelect}
        onDiscardSelect={handleDiscardSelect}
        onPlayAgain={() => window.location.reload()}
        onLeave={() => router.push('/')}
        onCancelColor={cancelColor}
        toast={toast}
        onToastDismiss={clearToast}
      />
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-bgPrimary">
        <p className="text-textMuted">Loading game...</p>
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}