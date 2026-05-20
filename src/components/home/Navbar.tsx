'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { label: 'PLAY', href: '#hero' },
  { label: 'RULES', href: '#how-to-play' },
  { label: 'MODES', href: '#game-modes' },
  { label: 'RULES', href: '#join-cta' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
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
            onClick={() => scrollTo('#hero')}
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

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-2 text-[11px] font-mono tracking-[0.2em] text-creamMuted/70 hover:text-goldGlow uppercase transition-all duration-300 cursor-pointer hover:bg-white/[0.02] rounded-lg"
              >
                {link.label}
              </button>
            ))}
            <div className="ml-4 pl-4 border-l border-white/5">
              <button
                onClick={() => scrollTo('#join-cta')}
                className="
                  px-6 py-2.5 rounded-lg text-[11px] font-mono tracking-[0.2em] uppercase font-semibold
                  bg-gradient-to-r from-gold to-goldGlow text-bgWarm
                  hover:shadow-lg hover:shadow-gold/30 hover:brightness-110
                  transition-all duration-300 cursor-pointer
                "
              >
                PLAY NOW
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-creamMuted/70 hover:text-cream cursor-pointer transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden bg-bgWarm/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => scrollTo(link.href)}
                className="text-2xl font-serif text-cream hover:text-goldGlow transition-colors cursor-pointer"
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.35 }}
              onClick={() => scrollTo('#join-cta')}
              className="
                mt-4 px-10 py-4 rounded-lg text-sm font-mono tracking-[0.2em] uppercase font-semibold
                bg-gradient-to-r from-gold to-goldGlow text-bgWarm
                shadow-lg shadow-gold/30 cursor-pointer
              "
            >
              PLAY NOW
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
