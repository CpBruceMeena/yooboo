'use client';

import { motion } from 'motion/react';
import CardFan3D from './CardFan3D';
import ParticleField from './ParticleField';

export default function Hero() {
  const scrollToCta = () => {
    const el = document.querySelector('#join-cta');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRules = () => {
    const el = document.querySelector('#how-to-play');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.9 }}
        className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-5"
      >
        <motion.button
          onClick={scrollToCta}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="
            px-10 py-4 rounded-lg text-sm font-mono tracking-[0.25em] uppercase font-semibold
            bg-gradient-to-r from-gold to-goldGlow text-bgWarm
            shadow-xl shadow-gold/25 hover:shadow-gold/40
            transition-all duration-300 cursor-pointer
            animate-cta-pulse
          "
        >
          PLAY NOW
        </motion.button>

        <motion.button
          onClick={scrollToRules}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="
            px-10 py-4 rounded-lg text-sm font-mono tracking-[0.25em] uppercase
            border border-gold/30 text-gold/80 hover:text-goldGlow hover:border-gold/60
            bg-transparent hover:bg-gold/[0.04]
            transition-all duration-300 cursor-pointer
          "
        >
          HOW TO PLAY
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
    </section>
  );
}
