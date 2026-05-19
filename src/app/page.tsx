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
    </div>
  );
}