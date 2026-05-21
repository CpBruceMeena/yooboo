'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GameModes() {
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

  return (
    <section
      id="game-modes"
      className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bgWarm via-charcoal/50 to-bgWarm pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] text-gold/50 uppercase">
            // The Only Way to Play
          </span>
        </motion.div>

        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-cream text-center leading-tight mb-14"
        >
          No Mercy
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* No Mercy Mode — full width */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ type: 'spring', stiffness: 100, damping: 18 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="md:col-span-12 group relative bg-surface/80 backdrop-blur-sm rounded-2xl border border-crimson/20 p-8 sm:p-10 overflow-hidden home-card-glow"
          >
            {/* Red glow accent */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(192,57,43,0.08), transparent)',
              }}
            />

            {/* Badge */}
            <div className="inline-block mb-5 px-3 py-1 rounded-full bg-danger/10 border border-danger/25">
              <span className="font-mono text-[9px] tracking-wider text-danger/70 uppercase">Ruthless</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-cream mb-3">
              No Mercy
            </h3>

            <p className="font-serif-alt text-sm text-creamMuted/50 italic mb-2 leading-relaxed">
              Stacking draws. Hand swaps. Elimination. The full &#39;Show &#39;Em No Mercy&#39; experience.
            </p>

            <ul className="space-y-2 mb-8">
              {['Stacking +2 / +4 / +6 / +10', 'Mercy Rule at 25 cards', '7\'s Swap hands', '0\'s Pass all hands', 'Drawing Smiley cards', 'Elimination on 25+ cards'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-creamMuted/60">
                  <span className="w-1 h-1 rounded-full bg-crimson/50 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <motion.button
              onClick={() => handlePlay()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="
                w-full py-3.5 rounded-lg text-sm font-mono tracking-[0.2em] uppercase font-semibold
                bg-gradient-to-r from-crimson to-danger text-white
                shadow-lg shadow-crimson/25 hover:shadow-crimson/40
                transition-all duration-300 cursor-pointer
              "
            >
              ENTER IF BRAVE
            </motion.button>
          </motion.div>
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
              <h3 className="font-serif text-2xl font-bold text-cream mb-2">Enter Your Callsign</h3>
              <p className="font-serif-alt text-sm text-creamMuted/50 italic mb-6">Pick a name and choose your room.</p>

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
      </div>
    </section>
  );
}
