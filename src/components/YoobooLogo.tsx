'use client';

import { motion } from 'motion/react';

interface YoobooLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  animated?: boolean;
}

const sizes = {
  sm: { emblem: 48, text: 'text-lg', sub: 'text-[10px]' },
  md: { emblem: 64, text: 'text-xl', sub: 'text-xs' },
  lg: { emblem: 96, text: 'text-3xl', sub: 'text-sm' },
};

export default function YoobooLogo({ size = 'md', showText = true, animated = true }: YoobooLogoProps) {
  const s = sizes[size];
  const d = s.emblem;

  return (
    <div className="flex items-center gap-3">
      {/* Logo image */}
      <div className="relative shrink-0" style={{ width: d, height: d }}>
        {/* Outer glow ring */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(232,184,75,0.2) 0%, transparent 70%)',
              filter: 'blur(6px)',
            }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Pulsing ring */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full border border-gold/20"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* The new logo image */}
        <img
          src="/images/yooboo-logo.jpeg"
          alt="YOOBOO"
          className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
          style={{
            filter: animated ? 'brightness(1.05) contrast(1.05)' : undefined,
          }}
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="text-left">
          <span
            className={`font-serif ${s.text} font-black text-cream tracking-tight block leading-tight`}
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            YOOBOO
          </span>
          <span className={`font-serif ${s.sub} font-bold italic text-gold/70 tracking-[0.15em] block leading-tight`}>
            RAGE MODE
          </span>
        </div>
      )}
    </div>
  );
}
