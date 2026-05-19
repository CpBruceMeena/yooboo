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
    gameState, playerId, connected, error, lobbyPlayers, roomId: rtcRoomId,
    joinRoom, startGame,
    selectedCardId, showChangeColor, showDiscardAll, toast,
    handleCardClick, handleDraw, handleSayUno,
    handleColorSelect, handleDiscardSelect,
    handleEmote, handleLeave, clearToast, cancelColor,
    isMyTurn, isLoading,
  } = useGame();

  const [hasJoined, setHasJoined] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastTurnRef = useRef<number>(-1);
  const hasRequestedJoin = useRef(false);

  const actualRoomId = rtcRoomId || roomId;

  useEffect(() => {
    if (!actualRoomId || !playerName || hasRequestedJoin.current) return;
    hasRequestedJoin.current = true;
    joinRoom(actualRoomId, playerName);
  }, [actualRoomId, playerName, joinRoom]);

  useEffect(() => {
    if (gameState && gameState.status === 'in_game') {
      setHasJoined(true);
      if (gameState.currentPlayerIndex !== lastTurnRef.current) {
        setHasDrawn(false);
        lastTurnRef.current = gameState.currentPlayerIndex;
      }
    }
  }, [gameState]);

  const handleDrawClick = () => {
    handleDraw();
    setHasDrawn(true);
  };

  const handleCardPlay = (cardId: string) => {
    handleCardClick(cardId);
  };

  const currentPlayerName = gameState
    ? gameState.players[gameState.currentPlayerIndex]?.name ?? ''
    : '';

  const localPlayer = gameState?.players.find((p) => p.id === playerId);
  const unoEligible = localPlayer?.hand.length === 1 && !localPlayer.saidUno;

  if (!actualRoomId || !playerName) {
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
          {/* Room header with animated pulse */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-success animate-uno-pulse' : 'bg-yellow animate-uno-pulse'}`} />
            <span className="text-xs font-medium text-textMuted tracking-wider uppercase">
              {connected ? 'Connected' : 'Connecting'}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-textPrimary mb-1">Room Lobby</h2>
          
          {/* Room code with copy */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="font-mono text-lg tracking-widest text-wild font-bold bg-bgTertiary/50 px-4 py-1.5 rounded-lg border border-wild/20">
              {actualRoomId}
            </span>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                navigator.clipboard.writeText(actualRoomId);
                const btn = e.currentTarget;
                btn.innerHTML = '<svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
                setTimeout(() => {
                  btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>';
                }, 1500);
              }}
              className="p-1.5 rounded-lg bg-bgTertiary hover:bg-bgTertiary/80 text-textMuted hover:text-textPrimary transition-colors cursor-pointer"
              title="Copy room code"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          <div className="text-xs text-textMuted mb-5">
            Share this code with friends to join
          </div>

          {/* Player list */}
          {lobbyPlayers.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">
                  Players ({lobbyPlayers.length})
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
                {lobbyPlayers.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-bgTertiary/40 border border-textMuted/5 animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: ['#E44747','#F3C742','#33B56B','#3478F6','#7A4DFF','#FF6B6B','#4CD97B','#AAB2C0'][i % 8] }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-textPrimary flex-1 text-left truncate">{p.name}</span>
                    {i === 0 && (
                      <span className="text-[10px] text-success font-semibold px-1.5 py-0.5 rounded-full bg-success/10">Host</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {lobbyPlayers.length === 0 && connected && (
            <div className="mb-5 py-6 text-center">
              <div className="text-3xl mb-2">👋</div>
              <p className="text-textMuted text-sm">Waiting for players to join...</p>
              <p className="text-textMuted/50 text-xs mt-1">Share the room code above</p>
            </div>
          )}

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-danger/15 border border-danger/25 text-danger text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="flex gap-3 justify-center">
            <Button
              variant="primary"
              onClick={() => startGame()}
              disabled={!connected || lobbyPlayers.length < 2}
              title={!connected ? 'Waiting for server connection...' : lobbyPlayers.length < 2 ? 'Need at least 2 players to start' : 'Ready to start'}
            >
              {!connected ? 'Connecting...' : lobbyPlayers.length < 2 ? `Waiting (${lobbyPlayers.length}/2)` : `Start Game (${lobbyPlayers.length})`}
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
        roomId={actualRoomId}
        currentPlayer={currentPlayerName}
        direction={gameState.direction === 1 ? 'clockwise' : 'counter'}
        stackValue={gameState.pendingDraw}
      />
      <div className="flex flex-1 overflow-hidden">
        <GameTable
          gameState={gameState}
          playerId={playerId}
          selectedCardId={selectedCardId}
          onCardClick={handleCardPlay}
          onDraw={handleDrawClick}
          drawDisabled={hasDrawn || gameState.pendingDraw <= 0 || !isMyTurn}
          handDisabled={isGameFinished}
          hasDrawn={hasDrawn}
        />
        <RightPanel
          onDraw={handleDrawClick}
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