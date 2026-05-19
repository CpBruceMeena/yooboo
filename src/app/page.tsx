'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    if (!playerName.trim()) {
      setError('Enter your name first');
      return;
    }
    if (!roomId.trim()) {
      setError('Enter a room code');
      return;
    }
    router.push(`/game?room=${encodeURIComponent(roomId)}&name=${encodeURIComponent(playerName)}`);
  };

  const handleCreate = () => {
    if (!playerName.trim()) {
      setError('Enter your name first');
      return;
    }
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/game?room=${newRoomId}&name=${encodeURIComponent(playerName)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (roomId.trim()) handleJoin();
      else handleCreate();
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-bgPrimary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-wild/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red/3 blur-3xl" />
      </div>

      <div className="bg-bgSecondary/80 backdrop-blur-sm rounded-2xl border border-textMuted/10 p-8 w-full max-w-sm relative animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3 animate-float">🎴</div>
          <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Uno-No-Mercy</h1>
          <p className="text-textMuted text-sm mt-1.5">No mercy. Last one standing wins.</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-danger/15 border border-danger/25 text-danger text-sm font-medium text-center animate-fade-in">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div className="space-y-1">
            <label className="text-xs text-textMuted/60 uppercase tracking-wider font-semibold">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => { setPlayerName(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              maxLength={16}
              className="w-full px-4 py-2.5 rounded-lg bg-bgTertiary border border-textMuted/20 text-textPrimary placeholder-textMuted/40 text-sm outline-none focus:border-blue focus:ring-1 focus:ring-blue/30 transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-textMuted/60 uppercase tracking-wider font-semibold">Room Code</label>
            <input
              type="text"
              placeholder="Enter room code"
              value={roomId}
              onChange={(e) => { setRoomId(e.target.value.toUpperCase()); setError(''); }}
              onKeyDown={handleKeyDown}
              maxLength={8}
              className="w-full px-4 py-2.5 rounded-lg bg-bgTertiary border border-textMuted/20 text-textPrimary placeholder-textMuted/40 text-sm outline-none focus:border-blue focus:ring-1 focus:ring-blue/30 transition-all duration-200 font-mono tracking-wider"
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={!playerName.trim() || !roomId.trim()}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer
              ${playerName.trim() && roomId.trim()
                ? 'bg-gradient-to-r from-blue to-blue/80 hover:from-blue/90 hover:to-blue/70 text-white shadow-lg shadow-blue/20'
                : 'bg-bgTertiary/50 text-textMuted/40 cursor-not-allowed'
              }`}
          >
            Join Room
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-textMuted/10" />
            <span className="text-textMuted/40 text-xs">or</span>
            <div className="flex-1 h-px bg-textMuted/10" />
          </div>

          <button
            onClick={handleCreate}
            disabled={!playerName.trim()}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer
              ${playerName.trim()
                ? 'bg-bgTertiary hover:bg-bgTertiary/80 text-textPrimary border border-textMuted/20 hover:border-textMuted/30'
                : 'bg-bgTertiary/30 text-textMuted/40 cursor-not-allowed'
              }`}
          >
            Create New Room
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-textMuted/5 text-center">
          <p className="text-[11px] text-textMuted/30">Press Enter to join or create a room</p>
        </div>
      </div>

      {/* Rule Book */}
      <div className="mt-6 w-full max-w-sm">
        <details className="group">
          <summary className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-bgSecondary/60 border border-textMuted/10 cursor-pointer hover:bg-bgSecondary/80 transition-colors text-sm text-textMuted hover:text-textPrimary">
            <span className="flex items-center gap-2">
              <span className="text-base">📖</span>
              <span className="font-semibold">Rules &amp; How to Play</span>
            </span>
            <svg className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="mt-3 px-4 py-4 rounded-xl bg-bgSecondary/40 border border-textMuted/5 text-sm text-textMuted space-y-5 max-h-[50vh] overflow-y-auto scrollbar-thin animate-slide-up">
            
            {/* Goal */}
            <section>
              <h3 className="text-textPrimary font-bold text-sm mb-2 flex items-center gap-2">
                <span>🎯</span> Goal
              </h3>
              <p className="text-textMuted/80 text-xs leading-relaxed">
                Be the first to reach <strong className="text-textPrimary">0 cards</strong> or be the <strong className="text-textPrimary">last player standing</strong>.
                Eliminated when you reach <strong className="text-danger">≥ 25 cards</strong>.
              </p>
            </section>

            {/* How to Play */}
            <section>
              <h3 className="text-textPrimary font-bold text-sm mb-2 flex items-center gap-2">
                <span>🎮</span> How to Play
              </h3>
              <ol className="text-xs text-textMuted/80 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Match the top card on the discard pile by <strong className="text-textPrimary">color</strong> or <strong className="text-textPrimary">type</strong></li>
                <li>If you can't play, draw a card — then you may play any card</li>
                <li>Play all your cards to win!</li>
              </ol>
            </section>

            {/* Card Types */}
            <section>
              <h3 className="text-textPrimary font-bold text-sm mb-2 flex items-center gap-2">
                <span>🃏</span> Card Types
              </h3>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-bgTertiary/30">
                  <span className="shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-red to-red/70 flex items-center justify-center text-white text-xs font-bold shadow">⟳</span>
                  <div>
                    <span className="text-textPrimary text-xs font-semibold">Reverse</span>
                    <p className="text-textMuted/60 text-[11px]">Flips the direction of play</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-bgTertiary/30">
                  <span className="shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-green to-green/70 flex items-center justify-center text-white text-xs font-bold shadow">+2</span>
                  <div>
                    <span className="text-textPrimary text-xs font-semibold">+2</span>
                    <p className="text-textMuted/60 text-[11px]">Next player draws 2 cards <span className="text-textMuted/40">(can stack)</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-bgTertiary/30">
                  <span className="shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-wild to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">+4</span>
                  <div>
                    <span className="text-textPrimary text-xs font-semibold">+4 (Wild)</span>
                    <p className="text-textMuted/60 text-[11px]">Next player draws 4 + choose any color <span className="text-textMuted/40">(can stack)</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-bgTertiary/30">
                  <span className="shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-wild via-purple-500 to-red-500 flex items-center justify-center text-white text-xs font-bold shadow">+6</span>
                  <div>
                    <span className="text-textPrimary text-xs font-semibold">+6 (Wild)</span>
                    <p className="text-textMuted/60 text-[11px]">Next player draws 6 + choose any color <span className="text-textMuted/40">(can stack)</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-bgTertiary/30">
                  <span className="shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-wild via-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow">+10</span>
                  <div>
                    <span className="text-textPrimary text-xs font-semibold">+10 (Wild)</span>
                    <p className="text-textMuted/60 text-[11px]">Next player draws 10 + choose any color <span className="text-textMuted/40">(can stack)</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-bgTertiary/30">
                  <span className="shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-wild to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">⟳+4</span>
                  <div>
                    <span className="text-textPrimary text-xs font-semibold">Reverse +4 (Wild)</span>
                    <p className="text-textMuted/60 text-[11px]">Flips direction + next player draws 4 <span className="text-textMuted/40">(can stack)</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-bgTertiary/30">
                  <span className="shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-blue to-blue/70 flex items-center justify-center text-white text-xs font-bold shadow">⊘</span>
                  <div>
                    <span className="text-textPrimary text-xs font-semibold">Skip Everyone</span>
                    <p className="text-textMuted/60 text-[11px]">You play again (all opponents skipped)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-bgTertiary/30">
                  <span className="shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-yellow to-yellow/70 flex items-center justify-center text-black text-xs font-bold shadow">🗑</span>
                  <div>
                    <span className="text-textPrimary text-xs font-semibold">Discard All</span>
                    <p className="text-textMuted/60 text-[11px]">Choose a color — discard ALL cards of that color</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-bgTertiary/30">
                  <span className="shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-pink-400 via-wild to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow">😊</span>
                  <div>
                    <span className="text-textPrimary text-xs font-semibold">Smiley (Wild)</span>
                    <p className="text-textMuted/60 text-[11px]">Choose a color — next player draws until they hit that color! <span className="text-textMuted/40">(cannot stack)</span></p>
                  </div>
                </div>
              </div>
            </section>

            {/* Stacking Rules */}
            <section>
              <h3 className="text-textPrimary font-bold text-sm mb-2 flex items-center gap-2">
                <span>📐</span> Stacking Rules
              </h3>
              <p className="text-xs text-textMuted/80 mb-2 leading-relaxed">
                When a <strong className="text-textPrimary">+2, +4, +6, +10, or Reverse+4</strong> is played, the next player can
                <strong className="text-textPrimary"> counter-stack</strong> with the <strong className="text-textPrimary">same card type</strong>.
              </p>
              <div className="text-xs bg-bgTertiary/40 p-2.5 rounded-lg text-textMuted/70 leading-relaxed">
                <p className="font-medium text-textPrimary mb-1">Example:</p>
                <p>Player A plays +4 → B plays +4 → C draws <strong className="text-textPrimary">8 cards!</strong></p>
              </div>
              <ul className="text-xs text-textMuted/80 mt-2 space-y-1 list-disc list-inside leading-relaxed">
                <li><span className="text-success">✓</span> <strong className="text-textPrimary">Skip Everyone</strong> cannot be played during a stack</li>
                <li><span className="text-success">✓</span> <strong className="text-textPrimary">Discard All</strong> cannot be played during a stack</li>
                <li><span className="text-success">✓</span> <strong className="text-textPrimary">Smiley</strong> can be played during a stack (passes it forward)</li>
              </ul>
            </section>

            {/* Turns */}
            <section>
              <h3 className="text-textPrimary font-bold text-sm mb-2 flex items-center gap-2">
                <span>🔄</span> Turn Structure
              </h3>
              <ol className="text-xs text-textMuted/80 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Play a matching card (same color, type, or value)</li>
                <li>Or <strong className="text-textPrimary">draw 1 card</strong> — then you may play any card from your hand</li>
                <li>If you're under a stack, you can counter-stack or draw the full penalty</li>
              </ol>
            </section>

          </div>
        </details>
      </div>

    </div>
  );
}