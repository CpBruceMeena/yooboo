'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CardFan3D from './CardFan3D';
import ParticleField from './ParticleField';
import LobbyRooms from './LobbyRooms';

export default function Hero() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleCreateRoom = () => {
    if (!name.trim()) return;
    const newRoom = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/game?room=${newRoom}&name=${encodeURIComponent(name.trim())}`);
  };

  const handleJoinRoom = () => {
    if (!name.trim() || !roomId.trim()) return;
    router.push(`/game?room=${encodeURIComponent(roomId.trim().toUpperCase())}&name=${encodeURIComponent(name.trim())}`);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden pt-20 pb-12"
    >
      {/* Background - deep radial vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A110C]/60 via-bgWarm to-bgWarm pointer-events-none" />

      {/* Spotlight glow */}
      <motion.div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,149,42,0.06) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Secondary glow - crimson */}
      <motion.div
        className="absolute top-[35%] left-[55%] w-[400px] h-[400px] rounded-full pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(192,57,43,0.04) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Ambient particles */}
      <ParticleField count={35} />

      {/* 3D Card Fan */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        className="relative z-10 mb-8 sm:mb-10 w-full max-w-[560px]"
      >
        <CardFan3D />
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
        className="relative z-10 text-center mb-6"
      >
        <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-cream leading-none tracking-tight gold-text-shadow">
          UNO
        </h1>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold italic text-gold/80 leading-tight mt-2 gold-text-shadow">
          NO MERCY
        </h2>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.7 }}
        className="relative z-10 text-creamMuted/70 font-serif-alt text-base sm:text-lg md:text-xl italic text-center max-w-md mb-10 leading-relaxed"
      >
        &ldquo;Draw four. No take-backs. No excuses.&rdquo;
      </motion.p>

      {/* PLAY NOW CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.9 }}
        className="relative z-10 mb-12"
      >
        <motion.button
          onClick={() => setShowInput(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="
            relative px-10 py-4 rounded-xl text-sm font-mono tracking-[0.25em] uppercase font-bold
            bg-gradient-to-b from-gold/90 to-amber-700/90
            text-bgWarm shadow-2xl shadow-gold/30
            border border-goldGlow/40
            group cursor-pointer
          "
        >
          {/* Shine overlay */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/10 via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Border glow */}
          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20 group-hover:ring-white/40 transition-all duration-300" />
          <span className="relative z-10">Play Now</span>
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-mono tracking-[0.3em] text-creamMuted/30 uppercase">Scroll</span>
        <motion.svg
          className="w-4 h-4 text-gold/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </motion.div>

      {/* Name & Room input modal */}
      {showInput && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowInput(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-surface border border-gold/20 rounded-2xl p-8 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl font-bold text-cream mb-2">Your Callsign</h3>
            <p className="font-serif-alt text-sm text-creamMuted/50 italic mb-6">Name yourself and claim your seat.</p>

            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
              maxLength={16}
              className="w-full px-4 py-3 rounded-lg bg-bgWarm border border-gold/20 text-cream placeholder-creamMuted/30 text-sm outline-none font-mono tracking-wider focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-200 mb-3"
              autoFocus
            />

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gold/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-surface text-[10px] font-mono tracking-wider text-creamMuted/40 uppercase">or join existing</span>
              </div>
            </div>

            <input
              type="text"
              placeholder="Room code (optional)"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && (roomId.trim() ? handleJoinRoom() : handleCreateRoom())}
              maxLength={8}
              className="w-full px-4 py-3 rounded-lg bg-bgWarm border border-gold/20 text-cream placeholder-creamMuted/30 text-sm outline-none font-mono tracking-widest focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-200 mb-4 uppercase"
            />

            <LobbyRooms onJoinRoom={(rid) => {
              setRoomId(rid);
              if (name.trim()) {
                router.push(`/game?room=${encodeURIComponent(rid.toUpperCase())}&name=${encodeURIComponent(name.trim())}`);
              }
            }} />

            <div className="flex flex-col gap-2">
              <motion.button
                onClick={handleCreateRoom}
                disabled={!name.trim()}
                whileHover={name.trim() ? { scale: 1.02 } : {}}
                whileTap={name.trim() ? { scale: 0.98 } : {}}
                className={`
                  w-full py-3 rounded-lg text-sm font-mono tracking-[0.2em] uppercase font-semibold transition-all cursor-pointer
                  ${name.trim()
                    ? 'bg-gradient-to-r from-gold to-goldGlow text-bgWarm shadow-lg shadow-gold/25'
                    : 'bg-charcoal/50 text-creamMuted/30 cursor-not-allowed'}
                `}
              >
                CREATE NEW ROOM
              </motion.button>
              {roomId.trim() && (
                <motion.button
                  onClick={handleJoinRoom}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  disabled={!name.trim() || !roomId.trim()}
                  whileHover={name.trim() && roomId.trim() ? { scale: 1.02 } : {}}
                  whileTap={name.trim() && roomId.trim() ? { scale: 0.98 } : {}}
                  className={`
                    w-full py-3 rounded-lg text-sm font-mono tracking-[0.2em] uppercase font-semibold transition-all cursor-pointer
                    ${name.trim() && roomId.trim()
                      ? 'bg-charcoal/80 border border-gold/30 text-cream hover:bg-charcoal shadow-lg'
                      : 'bg-charcoal/50 text-creamMuted/30 cursor-not-allowed'}
                  `}
                >
                  JOIN ROOM [{roomId.toUpperCase()}]
                </motion.button>
              )}
              <motion.button
                onClick={() => setShowInput(false)}
                whileHover={{ scale: 1.02 }}
                className="w-full py-2.5 rounded-lg text-sm font-mono tracking-wider text-creamMuted/40 hover:text-cream border border-white/5 hover:border-white/15 transition-all cursor-pointer mt-1"
              >
                CANCEL
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
