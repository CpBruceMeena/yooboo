'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`
        fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3
        transition-all duration-500
        ${scrolled
          ? 'bg-[#0A0705]/90 backdrop-blur-xl border-b border-gold/10 shadow-lg shadow-black/20'
          : 'bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <span className="text-2xl">🃏</span>
          <div className="text-left">
            <span className="font-serif text-lg sm:text-xl font-black text-cream tracking-tight block leading-tight group-hover:text-goldGlow transition-colors duration-300">
              UNO
            </span>
            <span className="font-serif text-[10px] sm:text-xs font-bold italic text-gold/70 tracking-[0.15em] block leading-tight">
              NO MERCY
            </span>
          </div>
        </button>

        {/* Spacer for right side (keeps layout balanced) */}
        <div />
      </div>
    </motion.nav>
  );
}
