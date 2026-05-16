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
      setError('Enter a name');
      return;
    }
    if (!roomId.trim()) {
      setError('Enter a room ID');
      return;
    }
    router.push(`/game?room=${encodeURIComponent(roomId)}&name=${encodeURIComponent(playerName)}`);
  };

  const handleCreate = () => {
    if (!playerName.trim()) {
      setError('Enter a name');
      return;
    }
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/game?room=${newRoomId}&name=${encodeURIComponent(playerName)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleJoin();
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-bgPrimary">
      <div className="bg-bgSecondary rounded-2xl border border-textMuted/10 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-textPrimary">Uno-No-Mercy</h1>
          <p className="text-textMuted text-sm mt-1">No mercy. Last one standing wins.</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-danger/20 border border-danger/30 text-danger text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Your Name"
            value={playerName}
            onChange={(e) => { setPlayerName(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            maxLength={16}
            className="w-full px-4 py-2.5 rounded-lg bg-bgTertiary border border-textMuted/20 text-textPrimary placeholder-textMuted/50 text-sm outline-none focus:border-blue transition-colors"
          />
          <input
            type="text"
            placeholder="Room Code"
            value={roomId}
            onChange={(e) => { setRoomId(e.target.value.toUpperCase()); setError(''); }}
            onKeyDown={handleKeyDown}
            maxLength={8}
            className="w-full px-4 py-2.5 rounded-lg bg-bgTertiary border border-textMuted/20 text-textPrimary placeholder-textMuted/50 text-sm outline-none focus:border-blue transition-colors"
          />
          <button
            onClick={handleJoin}
            className="w-full py-2.5 rounded-lg bg-blue hover:bg-blue/80 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Join Room
          </button>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-textMuted/20" />
            <span className="text-textMuted text-xs">or</span>
            <div className="flex-1 h-px bg-textMuted/20" />
          </div>
          <button
            onClick={handleCreate}
            className="w-full py-2.5 rounded-lg bg-bgTertiary hover:bg-bgTertiary/80 text-textPrimary font-semibold text-sm border border-textMuted/20 transition-colors cursor-pointer"
          >
            Create New Room
          </button>
        </div>
      </div>
    </div>
  );
}