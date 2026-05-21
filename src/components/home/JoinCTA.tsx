'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function JoinCTA() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handlePlay = () => {
    setShowInput(true);
  };

  const handleCreateRoom = () => {
    if (!name.trim()) return;
    const newRoom = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/game?room=${newRoom}&name=${encodeURIComponent(name.trim())}`);
  };

  const handleJoinRoom = () => {
    if (!name.trim() || !roomId.trim()) return;
    router.push(`/game?room=${encodeURIComponent(roomId.trim().toUpperCase())}&name=${encodeURIComponent(name.trim())}`);
  };

  // Floating card data
  const floatingCards = [
    { id: 1, label: '+4', color: '#7A4DFF', x: '15%', y: '20%', delay: 0, duration: 12 },
    { id: 2, label: '+2', color: '#E44747', x: '75%', y: '30%', delay: 2, duration: 14 },
    { id: 3, label: '☺', color: '#FF2E9A', x: '85%', y: '60%', delay: 4, duration: 10 },
    { id: 4, label: '+6', color: '#F3C742', x: '10%', y: '65%', delay: 1, duration: 13 },
    { id: 5, label: '↺', color: '#33B56B', x: '50%', y: '15%', delay: 3, duration: 11 },
    { id: 6, label: '7', color: '#3478F6', x: '20%', y: '75%', delay: 5, duration: 15 },
  ];

  return (
    <section
      id="join-cta"
      className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-bgWarm via-charcoal/80 to-bgWarm pointer-events-none" />

      {/* Floating card backgrounds */}
      {floatingCards.map((card) => (
        <motion.div
          key={card.id}
          className="absolute pointer-events-none opacity-[0.06] sm:opacity-[0.08]"
          style={{
            left: card.x,
            top: card.y,
            width: 60,
            height: 85,
            borderRadius: 10,
            background: `linear-gradient(145deg, ${card.color}dd, ${card.color}88)`,
          }}
          animate={{
            y: [0, -20, 10, -15, 0],
            rotate: [0, 5, -5, 3, 0],
          }}
          transition={{
            duration: card.duration,
            repeat: Infinity,
            delay: card.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-12"
        />

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-cream leading-tight mb-4 gold-text-shadow"
        >
          The Table Is Set.
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold italic text-gold/70 mb-6 gold-text-shadow"
        >
          Are You?
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="font-serif-alt text-base sm:text-lg text-creamMuted/50 italic max-w-md mx-auto mb-10 leading-relaxed"
        >
          Every turn escalates. No safe plays. Only the ruthless survive.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
        >
          <motion.button
            onClick={handlePlay}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="
              px-12 py-4 rounded-lg text-sm font-mono tracking-[0.25em] uppercase font-semibold
              bg-gradient-to-r from-gold to-goldGlow text-bgWarm
              shadow-xl shadow-gold/25 hover:shadow-gold/40
              transition-all duration-300 cursor-pointer
              animate-cta-pulse
            "
          >
            PLAY NOW
          </motion.button>

          <motion.button
            onClick={() => {
              const el = document.querySelector('#how-to-play');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="
              px-12 py-4 rounded-lg text-sm font-mono tracking-[0.25em] uppercase
              border border-gold/25 text-gold/70 hover:text-goldGlow hover:border-gold/50
              bg-transparent hover:bg-gold/[0.04]
              transition-all duration-300 cursor-pointer
            "
          >
            VIEW RULES
          </motion.button>
        </motion.div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 font-mono text-[9px] tracking-[0.35em] text-creamMuted/20 uppercase"
        >
          No Mercy. Last One Standing Wins.
        </motion.p>

        {/* Bottom decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mt-12"
        />
      </div>

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
