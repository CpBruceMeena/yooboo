'use client';

import { motion } from 'motion/react';

const steps = [
  {
    step: 1,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M8 7v10" />
        <path d="M12 7v10" />
        <path d="M16 7v10" />
      </svg>
    ),
    title: 'Match Color or Number',
    description: 'Play a card that matches the color or value of the top discard. Same number beats different color.',
    color: '#C9952A',
  },
  {
    step: 2,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Play Action Cards Mercilessly',
    description: 'Stack +2/+4/+6/+10 to force draws. Swap hands with 7s. Pass all hands with 0s. No mercy.',
    color: '#E44747',
  },
  {
    step: 3,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 8 6 8 6" />
        <path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 16 6 16 6" />
        <path d="M8 14h8" />
        <path d="M8 18h5" />
        <path d="M10 22h4" />
        <circle cx="12" cy="11" r="3" />
      </svg>
    ),
    title: 'First to Empty Hand Wins',
    description: 'Reach 25+ cards and you\'re eliminated. Last player standing takes the crown. Victory is survival.',
    color: '#33B56B',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 18, mass: 1 },
  },
};

export default function HowToPlay() {
  return (
    <section
      id="how-to-play"
      className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse, rgba(201,149,42,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] text-gold/50 uppercase">
            // The Rules
          </span>
        </motion.div>

        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-cream text-center leading-tight mb-3"
        >
          How to Play
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-serif-alt text-base sm:text-lg text-creamMuted/60 italic text-center max-w-lg mx-auto mb-14"
        >
          Three rules. Zero mercy.
        </motion.p>

        {/* Step cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {steps.map((step) => (
            <motion.div
              key={step.step}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 200, damping: 18 } }}
              className="group relative bg-surface/90 backdrop-blur-sm rounded-2xl border border-white/5 p-8 overflow-hidden home-card-glow"
            >
              {/* Number badge */}
              <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${step.color}22, transparent)`,
                }}
              >
                <span
                  className="font-display text-5xl tracking-tight opacity-15"
                  style={{ color: step.color }}
                >
                  {step.step}
                </span>
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:brightness-125"
                style={{
                  background: `linear-gradient(135deg, ${step.color}22, ${step.color}11)`,
                  border: `1px solid ${step.color}22`,
                  color: step.color,
                }}
              >
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-bold text-cream mb-3 leading-snug group-hover:text-goldGlow transition-colors duration-300">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-serif-alt text-sm text-creamMuted/60 leading-relaxed">
                {step.description}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, ${step.color}44, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
