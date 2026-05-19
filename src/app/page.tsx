'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import RuleVault from '@/components/RuleVault';

const Hero3DScene = dynamic(() => import('@/components/Hero3DScene'), { ssr: false });

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
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* 3D Scene Background */}
      <Hero3DScene />

      {/* Arcade Glitch Overlay Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {/* Top-left neon beam */}
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(180,255,57,0.3) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Bottom-right neon beam */}
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(255,46,154,0.3) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Center cyan glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, rgba(0,240,255,0.4) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Scanline bar */}
      <motion.div
        className="absolute left-0 w-full h-[2px] opacity-[0.04] z-[2] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, #B4FF39, #FF2E9A, #00F0FF, transparent)',
        }}
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.2 }}
          className="bg-bgSecondary/90 backdrop-blur-md rounded-2xl border border-white/10 p-8"
        >
          {/* Top glitch line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-accent to-transparent mb-6 animate-border-glitch rounded-full" />

          <div className="text-center mb-8">
            <motion.div
              className="text-5xl mb-4 inline-block"
              animate={{ y: [0, -8, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🎴
            </motion.div>
            <h1 className="font-display text-5xl tracking-widest text-white leading-none mb-2 animate-glitch-text">
              UNO-NO-MERCY
            </h1>
            <p className="text-textMuted/60 text-xs font-mono tracking-wider">
              // NO MERCY. LAST ONE STANDING WINS.
            </p>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, x: -2 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 px-4 py-2.5 rounded-lg bg-danger/15 border border-danger/30 text-danger text-sm font-mono text-center"
              >
                <span className="text-danger/50">[!] </span>{error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-textMuted/50 uppercase tracking-[0.2em] font-mono font-semibold">
                &gt;&gt; CALLSIGN
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => { setPlayerName(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                maxLength={16}
                className="w-full px-4 py-3 rounded-lg bg-bgTertiary/80 border border-white/10 text-textPrimary placeholder-textMuted/30 text-sm outline-none font-mono tracking-wider focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-textMuted/50 uppercase tracking-[0.2em] font-mono font-semibold">
                &gt;&gt; ROOM KEY
              </label>
              <input
                type="text"
                placeholder="Enter room code"
                value={roomId}
                onChange={(e) => { setRoomId(e.target.value.toUpperCase()); setError(''); }}
                onKeyDown={handleKeyDown}
                maxLength={8}
                className="w-full px-4 py-3 rounded-lg bg-bgTertiary/80 border border-white/10 text-textPrimary placeholder-textMuted/30 text-sm outline-none font-mono tracking-[0.3em] uppercase focus:border-neonCyan/50 focus:ring-1 focus:ring-neonCyan/20 transition-all duration-200"
              />
            </div>

            <motion.button
              onClick={handleJoin}
              disabled={!playerName.trim() || !roomId.trim()}
              whileHover={playerName.trim() && roomId.trim() ? { scale: 1.02 } : {}}
              whileTap={playerName.trim() && roomId.trim() ? { scale: 0.98 } : {}}
              className={`
                w-full py-3 rounded-lg font-display text-xl tracking-wider transition-all duration-200 cursor-pointer
                ${playerName.trim() && roomId.trim()
                  ? 'bg-gradient-to-r from-neonPink to-neonOrange text-white shadow-lg shadow-neonPink/30 hover:shadow-neonPink/50 hover:brightness-110'
                  : 'bg-bgTertiary/50 text-textMuted/30 cursor-not-allowed'
                }
              `}
            >
              JOIN ROOM
            </motion.button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-textMuted/30 text-[10px] font-mono tracking-wider">||</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <motion.button
              onClick={handleCreate}
              disabled={!playerName.trim()}
              whileHover={playerName.trim() ? { scale: 1.02 } : {}}
              whileTap={playerName.trim() ? { scale: 0.98 } : {}}
              className={`
                w-full py-3 rounded-lg font-display text-xl tracking-wider transition-all duration-200 cursor-pointer
                ${playerName.trim()
                  ? 'bg-bgTertiary/80 hover:bg-bgTertiary text-textPrimary border border-white/10 hover:border-white/20'
                  : 'bg-bgTertiary/30 text-textMuted/30 cursor-not-allowed'
                }
              `}
            >
              CREATE ROOM
            </motion.button>
          </div>

          <div className="mt-5 pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-textMuted/25 font-mono tracking-wider">
              PRESS [ENTER] TO JOIN OR CREATE A ROOM
            </p>
          </div>

          {/* Bottom glitch line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-neonCyan to-transparent mt-6 animate-border-glitch rounded-full" />
        </motion.div>
      </div>

      {/* Rule Vault */}
      <RuleVault />
    </div>
  );
}
