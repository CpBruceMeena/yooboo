'use client';

import { motion } from 'motion/react';
import Card from '@/components/Card';

/* ─── Card Gallery Data ─── */

interface CardDemo {
  label: string;
  desc: string;
  type: 'number' | 'reverse' | 'plus2' | 'plus4' | 'plus6' | 'plus10' | 'reverse4' | 'skipEveryone' | 'discardAll' | 'smiley';
  color: 'red' | 'yellow' | 'green' | 'blue' | 'wild';
  value?: number;
  badge?: string;
}

const cardGroups: { title: string; cards: CardDemo[] }[] = [
  {
    title: 'Number Cards',
    cards: [
      { label: 'Red 7', desc: 'Match by color or same number.', type: 'number', color: 'red', value: 7 },
      { label: 'Blue 0', desc: 'Match by color or same number.', type: 'number', color: 'blue', value: 0 },
      { label: 'Green 7', desc: 'Match by color or same number.', type: 'number', color: 'green', value: 7 },
      { label: 'Yellow 5', desc: 'Classic number — match color or value.', type: 'number', color: 'yellow', value: 5 },
    ],
  },
  {
    title: 'Stacking Draw Cards',
    cards: [
      { label: '+2', desc: 'Next player draws 2. Stackable with +2.', type: 'plus2', color: 'red' },
      { label: '+4', desc: 'Color-specific +4. Stacks with other +4 cards.', type: 'plus4', color: 'green' },
      { label: '+6 WILD', desc: 'Wild +6 — 6-card stack. Choose color.', type: 'plus6', color: 'wild', badge: 'LEGENDARY' },
      { label: '+10 WILD', desc: 'MAX DRAW — 10-card stack. Ominous.', type: 'plus10', color: 'wild', badge: 'LEGENDARY' },
    ],
  },
  {
    title: 'Action Cards',
    cards: [
      { label: 'Reverse', desc: 'Flips direction. 2 players = skip.', type: 'reverse', color: 'yellow' },
      { label: 'Reverse+4', desc: 'Wild — reverse + stack 4 draws. Choose color.', type: 'reverse4', color: 'wild', badge: 'LEGENDARY' },
      { label: 'Skip All', desc: 'Skips every other player. Turn stays with you.', type: 'skipEveryone', color: 'blue' },
      { label: 'Discard All', desc: 'Discard all cards of chosen color from hand.', type: 'discardAll', color: 'red' },
      { label: 'Smiley', desc: 'Next player draws one-by-one until they hit your chosen color.', type: 'smiley', color: 'wild', badge: 'GAMBLE' },
    ],
  },
];

/* ─── Rules Data ─── */

const ruleCategories = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M8 7v10" /><path d="M12 7v10" /><path d="M16 7v10" />
      </svg>
    ),
    title: 'Basics',
    rules: [
      'Each player starts with 7 cards.',
      'Match the top discard by color, number, or symbol.',
      'If you can\'t play, draw one card. If it\'s playable, you may play it.',
      'First to empty their hand wins the round.',
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Stacking',
    rules: [
      'Only the SAME draw type can stack: +2→+2, +4→+4, +6→+6, etc.',
      'Each stacked card adds its draw value to the total.',
      'If you cannot match the stack, you draw ALL accumulated cards.',
      'Skip Everyone and Discard All CANNOT be played during a stack.',
      'Reverse4 stacks +4 draws AND reverses direction.',
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 8 6 8 6" />
        <path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 16 6 16 6" />
        <path d="M8 14h8" /><path d="M8 18h5" /><path d="M10 22h4" />
        <circle cx="12" cy="11" r="3" />
      </svg>
    ),
    title: 'Special Rules',
    rules: [

      'Smiley — Choose a color. The next player draws one card at a time until they draw that color. If they hit 25+ cards during the draw, they are eliminated.',
      'Discard All — Pick a color, then discard every card of that color from your hand. Discarded cards are removed from the game entirely.',
      'Skip Everyone — Your turn stays. Every other player is skipped. Play again immediately.',
    ],
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2v20M2 12h20" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    title: 'Elimination & Victory',
    rules: [
      '25+ cards in hand = instant elimination.',
      'Eliminated players are out of the game entirely.',
      'If only one player remains, they win by survival.',
      'Call UNO when you play your second-to-last card.',
      'Last player standing takes the crown. No mercy.',
    ],
  },
];

/* ── Fade-up animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, type: 'spring' as const, stiffness: 80, damping: 16 },
  }),
};

export default function HowToPlay() {
  return (
    <section
      id="how-to-play"
      className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse, rgba(201,149,42,0.03) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ════════════════════════════════════════════ */}
        {/* SECTION HEADER                              */}
        {/* ════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          className="text-center mb-4"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] text-gold/50 uppercase">
            // The Complete Guide
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-cream text-center leading-tight mb-3"
        >
          How to Play
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.2 }}
          className="font-serif-alt text-base sm:text-lg text-creamMuted/60 italic text-center max-w-lg mx-auto mb-16"
        >
          Every card explained. Every rule laid bare.
        </motion.p>

        {/* ════════════════════════════════════════════ */}
        {/* RULES CATEGORIES                            */}
        {/* ════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-24"
        >
          {ruleCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              custom={i}
              variants={fadeUp}
              className="relative bg-surface/80 backdrop-blur-sm rounded-2xl border border-white/5 p-7 sm:p-8 overflow-hidden group hover:border-gold/10 transition-colors duration-500"
            >
              {/* Category header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-gold/70 bg-gold/5 border border-gold/10 shrink-0">
                  {cat.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-cream group-hover:text-goldGlow transition-colors duration-300">
                  {cat.title}
                </h3>
              </div>

              {/* Rules list */}
              <ul className="space-y-3">
                {cat.rules.map((rule, ri) => (
                  <li key={ri} className="flex items-start gap-3 text-[15px] text-creamMuted/65 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/30 mt-1.5 shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* ════════════════════════════════════════════ */}
        {/* CARD GALLERY                                */}
        {/* ════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          className="text-center mb-4"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] text-gold/50 uppercase">
            // The Arsenal
          </span>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream text-center leading-tight mb-14"
        >
          Card Types
        </motion.h3>

        {cardGroups.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: gi * 0.1 }}
            className="mb-16 last:mb-0"
          >
            {/* Group title */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-gold/20 to-transparent" />
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-cream/80 tracking-wide">
                {group.title}
              </h4>
              <div className="h-px flex-1 bg-gradient-to-l from-gold/20 to-transparent" />
            </div>

            {/* Cards grid — flex-wrap for clean row/column alignment */}
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-8">
              {group.cards.map((demo, di) => (
                <motion.div
                  key={demo.label}
                  custom={di}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  className="flex flex-col items-center gap-3"
                >
                  {/* Badge */}
                  {demo.badge && (
                    <span
                      className="font-mono text-[10px] tracking-[0.25em] uppercase px-2.5 py-0.5 rounded-full border"
                      style={{
                        color: demo.badge === 'LEGENDARY' ? 'rgba(232,184,75,0.8)' : 'rgba(255,46,154,0.7)',
                        borderColor: demo.badge === 'LEGENDARY' ? 'rgba(232,184,75,0.25)' : 'rgba(255,46,154,0.2)',
                        background: demo.badge === 'LEGENDARY' ? 'rgba(232,184,75,0.08)' : 'rgba(255,46,154,0.06)',
                      }}
                    >
                      {demo.badge}
                    </span>
                  )}

                  {/* The actual Card component */}
                  <div className="pointer-events-none">
                    <Card
                      type={demo.type}
                      color={demo.color}
                      value={demo.value}
                      size="lg"
                      state="default"
                    />
                  </div>

                  {/* Label */}
                  <span className="font-mono text-xs tracking-wider text-cream/70 text-center">
                    {demo.label}
                  </span>

                  {/* Description */}
                  <p className="font-serif-alt text-xs text-creamMuted/55 text-center leading-relaxed max-w-[160px]">
                    {demo.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Bottom divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mt-16"
        />
      </div>
    </section>
  );
}
