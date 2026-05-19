'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '@/hooks/useGame';
import { useSound } from '@/hooks/useSound';
import TopBar from '@/components/TopBar';
import GameTable from '@/components/GameTable';
import RightPanel from '@/components/RightPanel';
import OverlayLayer from '@/components/OverlayLayer';
import SmileyReveal from '@/components/SmileyReveal';

const playerColors = ['#E44747','#F3C742','#33B56B','#3478F6','#7A4DFF','#FF6B6B','#4CD97B','#AAB2C0'];

const lobbyVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 } as const,
  },
};

const playerItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, type: 'spring', stiffness: 200, damping: 18 } as const,
  }),
};

function LobbyRoom({ roomId, connected, lobbyPlayers, error, onStart, onLeave }: {
  roomId: string;
  connected: boolean;
  lobbyPlayers: { id: string; name: string }[];
  error: string | null;
  onStart: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      variants={lobbyVariants}
      initial="hidden"
      animate="visible"
      className="bg-bgSecondary/90 backdrop-blur-md rounded-2xl border border-white/10 p-8 w-full max-w-sm text-center"
    >
      {/* Glitch top line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-accent to-transparent mb-6 animate-border-glitch rounded-full" />

      {/* Connection status */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <motion.div
          className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-success' : 'bg-yellow'}`}
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-[10px] font-mono text-textMuted/60 tracking-wider uppercase">
          {connected ? '// CONNECTION ESTABLISHED' : '// ESTABLISHING LINK...'}
        </span>
      </div>

      <h2 className="font-display text-3xl tracking-widest text-white mb-1">LOBBY</h2>

      {/* Room code */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <span className="font-mono text-base tracking-[0.4em] text-accent font-bold bg-bgTertiary/60 px-5 py-2 rounded-lg border border-accent/20">
          {roomId}
        </span>
        <motion.button
          onClick={(e) => {
            navigator.clipboard.writeText(roomId);
            const btn = e.currentTarget;
            const original = btn.innerHTML;
            btn.innerHTML = '<svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
            setTimeout(() => { btn.innerHTML = original; }, 1500);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg bg-bgTertiary hover:bg-bgTertiary/80 text-textMuted hover:text-accent transition-colors cursor-pointer"
          title="Copy room code"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </motion.button>
      </div>

      <p className="text-[10px] text-textMuted/40 font-mono tracking-wider mb-6">
        SHARE THIS KEY WITH ALLIES
      </p>

      {/* Player list */}
      <AnimatePresence mode="wait">
        {lobbyPlayers.length > 0 ? (
          <motion.div
            key="players"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-textMuted/50 tracking-wider uppercase">
                // SQUAD [{lobbyPlayers.length}]
              </span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
              {lobbyPlayers.map((p, i) => (
                <motion.div
                  key={p.id}
                  custom={i}
                  variants={playerItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-bgTertiary/40 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: playerColors[i % playerColors.length] }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-textPrimary flex-1 text-left truncate font-mono tracking-wide">
                    {p.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-success"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {i === 0 && (
                      <span className="text-[9px] font-mono text-accent/70 tracking-wider px-1.5 py-0.5 rounded-full bg-accent/5 ml-1">
                        HOST
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : connected ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-5 py-6 text-center"
          >
            <motion.div
              className="text-4xl mb-2"
              animate={{ y: [0, -8, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              👋
            </motion.div>
            <p className="text-textMuted text-sm font-mono">Awaiting recruits...</p>
            <p className="text-textMuted/40 text-[10px] font-mono mt-1 tracking-wider">SHARE THE ROOM KEY ABOVE</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 px-4 py-2.5 rounded-lg bg-danger/15 border border-danger/30 text-danger text-xs font-mono"
        >
          <span className="text-danger/50">[!] </span>{error}
        </motion.div>
      )}

      <div className="flex gap-3 justify-center">
        <motion.button
          onClick={onStart}
          disabled={!connected || lobbyPlayers.length < 2}
          whileHover={connected && lobbyPlayers.length >= 2 ? { scale: 1.03 } : {}}
          whileTap={connected && lobbyPlayers.length >= 2 ? { scale: 0.97 } : {}}
          className={`
            px-6 py-3 rounded-lg font-display text-xl tracking-wider transition-all duration-200 cursor-pointer
            ${connected && lobbyPlayers.length >= 2
              ? 'bg-gradient-to-r from-neonPink to-neonOrange text-white shadow-lg shadow-neonPink/30 hover:shadow-neonPink/50'
              : 'bg-bgTertiary/50 text-textMuted/30 cursor-not-allowed'
            }
          `}
        >
          {!connected ? 'CONNECTING' : lobbyPlayers.length < 2 ? `WAITING (${lobbyPlayers.length}/2)` : `DEPLOY (${lobbyPlayers.length})`}
        </motion.button>
        <motion.button
          onClick={onLeave}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-4 py-3 rounded-lg bg-bgTertiary/80 hover:bg-bgTertiary text-textPrimary border border-white/10 hover:border-white/20 font-display text-lg tracking-wider transition-all cursor-pointer"
        >
          ABORT
        </motion.button>
      </div>

      {/* Bottom glitch line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-neonCyan to-transparent mt-6 animate-border-glitch rounded-full" />
    </motion.div>
  );
}

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get('room') ?? '';
  const playerName = searchParams.get('name') ?? '';

  const {
    gameState, playerId, connected, error, lobbyPlayers, roomId: rtcRoomId,
    joinRoom, startGame,
    selectedCardId, showChangeColor, showDiscardAll, toast,
    handleCardClick, handleDraw, handleSkipTurn, handleSayUno,
    handleColorSelect, handleDiscardSelect,
    handleEmote, handleLeave, clearToast, cancelColor,
    isMyTurn, isLoading,
    smileyReveal, clearSmileyReveal,
    discardHandCards,
    unoCall, clearUnoCall,
  } = useGame();

  const { play: playSound } = useSound();

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

  const isSmileyAnimating = smileyReveal !== null;
  const smileyDrawPlayerName = smileyReveal
    ? gameState?.players.find((p) => p.id === smileyReveal.playerId)?.name ?? 'Unknown'
    : '';

  const handleSmileyComplete = useCallback(() => {
    clearSmileyReveal();
  }, [clearSmileyReveal]);

  // Track direction change for reverse animation + sound
  const prevDirectionRef = useRef(gameState?.direction);
  useEffect(() => {
    if (gameState && prevDirectionRef.current !== undefined && prevDirectionRef.current !== gameState.direction) {
      playSound('reverse');
    }
    prevDirectionRef.current = gameState?.direction;
  }, [gameState?.direction, playSound]);

  // Sound on my turn
  const prevTurnIdxRef = useRef(gameState?.currentPlayerIndex);
  useEffect(() => {
    if (gameState && prevTurnIdxRef.current !== undefined && prevTurnIdxRef.current !== gameState.currentPlayerIndex) {
      const isNowMyTurn = gameState.players[gameState.currentPlayerIndex]?.id === playerId;
      if (isNowMyTurn) playSound('turn');
    }
    prevTurnIdxRef.current = gameState?.currentPlayerIndex;
  }, [gameState?.currentPlayerIndex, playerId, playSound]);

  // Sound on discarding a card
  const handLenRef = useRef(localPlayer?.hand.length);
  useEffect(() => {
    if (localPlayer && handLenRef.current !== undefined && handLenRef.current > localPlayer.hand.length) {
      playSound('card_play');
    }
    handLenRef.current = localPlayer?.hand.length;
  }, [localPlayer?.hand.length, playSound]);

  // Special card animation trigger + sound
  const [specialEffect, setSpecialEffect] = useState<{ type: string; cardType: string } | null>(null);
  const prevTopCardRef = useRef(gameState?.discardPile[gameState?.discardPile.length - 1]?.id);
  useEffect(() => {
    if (!gameState) return;
    const top = gameState.discardPile[gameState.discardPile.length - 1];
    if (!top) return;
    const topId = top.id;
    if (prevTopCardRef.current !== topId) {
      const specialTypes = ['reverse4', 'plus6', 'plus10', 'smiley', 'discardAll', 'plus4', 'skipEveryone'];
      if (specialTypes.includes(top.type)) {
        playSound('special');
        setSpecialEffect({ type: 'flash', cardType: top.type });
        setTimeout(() => setSpecialEffect(null), 800);
      }
    }
    prevTopCardRef.current = topId;
  }, [gameState?.discardPile, playSound]);

  if (!actualRoomId || !playerName) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bgPrimary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-textMuted font-mono text-sm mb-4 tracking-wider">
            <span className="text-danger/50">[!] </span>MISSING ROOM OR PLAYER INFO
          </p>
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-neonPink to-neonOrange text-white font-display text-xl tracking-wider cursor-pointer"
          >
            RETURN TO BASE
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!hasJoined || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bgPrimary px-4">
        <LobbyRoom
          roomId={actualRoomId}
          connected={connected}
          lobbyPlayers={lobbyPlayers}
          error={error}
          onStart={startGame}
          onLeave={() => { handleLeave(); router.push('/'); }}
        />
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bgPrimary">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-textMuted font-mono text-sm tracking-wider"
        >
          LOADING...
        </motion.div>
      </div>
    );
  }

  const isGameFinished = gameState.status === 'finished';
  const winner = gameState.players.find((p) => p.id === gameState.winnerId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col h-screen"
    >
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
          drawDisabled={hasDrawn || gameState.pendingDraw <= 0 || !isMyTurn || isSmileyAnimating}
          handDisabled={isGameFinished || isSmileyAnimating}
        />
        <RightPanel
          onDraw={handleDrawClick}
          onSkipTurn={handleSkipTurn}
          onSayUno={handleSayUno}
          onLeave={handleLeave}
          onEmote={handleEmote}
          disabled={!isMyTurn || isGameFinished || isSmileyAnimating}
          hasDrawn={hasDrawn}
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
        onLeave={() => { handleLeave(); router.push('/'); }}
        onCancelColor={cancelColor}
        toast={toast}
        onToastDismiss={clearToast}
        discardHandCards={discardHandCards}
      />

      {/* Smiley animated reveal overlay */}
      <AnimatePresence>
        {smileyReveal && (
          <SmileyReveal
            cards={smileyReveal.cards}
            playerName={smileyDrawPlayerName}
            matched={smileyReveal.matched}
            eliminated={smileyReveal.eliminated}
            onComplete={handleSmileyComplete}
          />
        )}
      </AnimatePresence>

      {/* Special card flash effect */}
      <AnimatePresence>
        {specialEffect && (
          <motion.div
            key="special-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed inset-0 z-40 pointer-events-none bg-gradient-to-br from-wild/20 via-purple-500/10 to-red-500/20"
          />
        )}
      </AnimatePresence>

      {/* UNO call notification */}
      <AnimatePresence>
        {unoCall && (
          <motion.div
            key="uno-call"
            initial={{ opacity: 0, y: -60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
          >
            <motion.div
              className="bg-gradient-to-r from-wild via-purple-600 to-red-500 py-3 px-8 rounded-2xl border-2 border-white/30 shadow-2xl flex items-center gap-4"
              animate={{ boxShadow: ['0 0 20px rgba(255,0,100,0.3)', '0 0 40px rgba(255,0,100,0.6)', '0 0 20px rgba(255,0,100,0.3)'] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.span
                className="text-3xl"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4, repeat: Infinity }}
              >
                🗣️
              </motion.span>
              <div className="text-center">
                <motion.span
                  className="text-white font-black text-xl tracking-widest block drop-shadow-lg"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  UNO! 🃏
                </motion.span>
                <span className="text-white/80 text-sm font-semibold">
                  {unoCall.playerName}
                </span>
              </div>
              <motion.span
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.4, repeat: Infinity }}
              >
                🗣️
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-bgPrimary">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-textMuted font-mono text-sm tracking-wider"
        >
          INITIALIZING...
        </motion.div>
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}
