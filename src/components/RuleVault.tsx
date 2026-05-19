'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Rule {
  icon: string;
  title: string;
  text: string;
  hex1: string;
  hex2: string;
  bgClass: string;
  glow: string;
}

const rules: Rule[] = [
  {
    icon: '🎯',
    title: 'GOAL',
    text: 'First to empty your hand OR last one standing after eliminations wins.',
    hex1: '#B4FF39',
    hex2: '#33B56B',
    bgClass: 'from-accent/20 to-green/10',
    glow: 'shadow-[0_0_15px_rgba(180,255,57,0.3)]',
  },
  {
    icon: '🎮',
    title: 'MATCH',
    text: 'Play a card matching the color OR type/value of the top discard. Same number overrides color.',
    hex1: '#00F0FF',
    hex2: '#3478F6',
    bgClass: 'from-neonCyan/20 to-blue/10',
    glow: 'shadow-[0_0_15px_rgba(0,240,255,0.3)]',
  },
  {
    icon: '⚡',
    title: 'STACK',
    text: '+2 / +4 / +6 / +10 / Reverse+4 stack by type only. Draw the full stack if you can\'t counter.',
    hex1: '#FF6A00',
    hex2: '#E44747',
    bgClass: 'from-neonOrange/20 to-red/10',
    glow: 'shadow-[0_0_15px_rgba(255,106,0,0.3)]',
  },
  {
    icon: '🎨',
    title: 'COLOR FLOW',
    text: 'Color-specific cards update the active color. Same-number different-color swaps it. Wild/Special lets you pick.',
    hex1: '#7A4DFF',
    hex2: '#6B21A8',
    bgClass: 'from-wild/20 to-purple-900/20',
    glow: 'shadow-[0_0_15px_rgba(122,77,255,0.3)]',
  },
  {
    icon: '👆',
    title: 'DRAW & SKIP',
    text: 'Draw once per turn. After drawing, either play a matching card or skip — turn passes either way.',
    hex1: '#00F0FF',
    hex2: '#1a4fa8',
    bgClass: 'from-neonCyan/20 to-blue/5',
    glow: 'shadow-[0_0_15px_rgba(0,240,255,0.3)]',
  },
  {
    icon: '😊',
    title: 'SMILEY',
    text: 'Pick a color — next player draws until they hit it. Cannot be stacked.',
    hex1: '#FF2E9A',
    hex2: '#7A4DFF',
    bgClass: 'from-neonPink/20 to-wild/10',
    glow: 'shadow-[0_0_15px_rgba(255,46,154,0.3)]',
  },
  {
    icon: '🔄',
    title: '+4 REVERSE',
    text: 'Reverses direction FIRST, then next player draws 4. Stackable with another +4 Reverse only.',
    hex1: '#FF6A00',
    hex2: '#E44747',
    bgClass: 'from-neonOrange/20 to-red/10',
    glow: 'shadow-[0_0_15px_rgba(255,106,0,0.3)]',
  },
  {
    icon: '⚡',
    title: '+6 / +10',
    text: '+6: next draws 6. +10 (MAX): next draws 10. Stackable by matching type only.',
    hex1: '#FF2E9A',
    hex2: '#E44747',
    bgClass: 'from-neonPink/20 to-red/10',
    glow: 'shadow-[0_0_15px_rgba(255,46,154,0.3)]',
  },
  {
    icon: '🗑',
    title: 'DISCARD ALL',
    text: 'Pick a color — discard every card of that color from your hand. Changes active color.',
    hex1: '#F3C742',
    hex2: '#c49a20',
    bgClass: 'from-yellow/20 to-yellow/5',
    glow: 'shadow-[0_0_15px_rgba(243,199,66,0.3)]',
  },
  {
    icon: '🚫',
    title: 'ELIMINATION',
    text: 'Reach 25+ cards in hand and you\'re out. Last player standing wins.',
    hex1: '#FF6B6B',
    hex2: '#E44747',
    bgClass: 'from-danger/20 to-red/10',
    glow: 'shadow-[0_0_15px_rgba(255,107,107,0.3)]',
  },
];

const vaultVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 250, damping: 22 } as const,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.15 },
  },
};

const ruleItemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: 0.05 * i, type: 'spring', stiffness: 200, damping: 18 } as const,
  }),
};

export default function RuleVault() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Vault trigger button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="
          fixed bottom-6 right-6 z-40
          px-5 py-3 rounded-xl font-display text-xl tracking-widest
          bg-gradient-to-r from-neonPink to-neonOrange
          text-white font-bold shadow-lg cursor-pointer
          border border-white/10
          animate-neon-pulse
          hover:shadow-[0_0_30px_rgba(255,46,154,0.5)]
          transition-shadow duration-300
        "
      >
        <span className="flex items-center gap-2">
          <span>⚔️</span>
          <span>THE VAULT</span>
        </span>
      </motion.button>

      {/* Vault modal overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Vault content */}
            <motion.div
              variants={vaultVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto scrollbar-thin bg-bgSecondary/95 border border-neonPink/30 rounded-2xl shadow-2xl shadow-neonPink/10"
            >
              {/* Vault header */}
              <div className="sticky top-0 z-10 bg-bgSecondary/95 backdrop-blur-md border-b border-neonPink/20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.span
                    className="text-2xl inline-block"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    📜
                  </motion.span>
                  <div>
                    <h2 className="font-display text-2xl tracking-widest text-white">
                      RULE VAULT
                    </h2>
                    <p className="text-[10px] text-textMuted/50 font-mono tracking-wider">
                      // KNOW THE CODE — BREAK THE CODE
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setOpen(false)}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  className="w-8 h-8 rounded-lg bg-bgTertiary hover:bg-bgTertiary/80 flex items-center justify-center text-textMuted hover:text-textPrimary cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Vault body */}
              <div className="p-5 space-y-3">
                {rules.map((rule, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={ruleItemVariants}
                    initial="hidden"
                    animate="visible"
                    className="glitch-card group overflow-hidden rounded-xl"
                  >
                    <div
                      className={`
                        flex items-start gap-4 p-4 rounded-xl border border-white/5
                        bg-gradient-to-r ${rule.bgClass}
                        relative overflow-hidden cursor-default
                        ${rule.glow}
                        hover:border-white/15 transition-all duration-200
                      `}
                      style={{ background: `linear-gradient(135deg, ${rule.hex1}20, ${rule.hex2}10)` }}
                    >
                      {/* Glitch overlay on hover */}
                      <div className="absolute inset-0 bg-black/30 rounded-xl pointer-events-none" />

                      {/* Icon */}
                      <motion.span
                        className="relative z-10 text-2xl shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-black/30"
                        whileHover={{ rotate: [0, -15, 15, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {rule.icon}
                      </motion.span>

                      {/* Content */}
                      <div className="relative z-10 flex-1 min-w-0">
                        <h3 className="font-display text-lg tracking-wider text-white flex items-center gap-2">
                          {rule.title}
                          <span className="text-[8px] font-mono text-textMuted/30">// RULE_{i + 1}</span>
                        </h3>
                        <p className="text-xs text-textMuted/80 leading-relaxed mt-0.5">
                          {rule.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Vault footer */}
              <div className="px-6 py-3 border-t border-neonPink/10 text-center">
                <p className="text-[10px] text-textMuted/30 font-mono tracking-wider">
                  ⚡ NO MERCY. LAST ONE STANDING WINS. ⚡
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
