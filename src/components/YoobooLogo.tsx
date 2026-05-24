'use client';

import { motion } from 'motion/react';

interface YoobooLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  animated?: boolean;
}

const sizes = {
  sm: { emblem: 32, text: 'text-lg', sub: 'text-[10px]' },
  md: { emblem: 40, text: 'text-xl', sub: 'text-xs' },
  lg: { emblem: 56, text: 'text-3xl', sub: 'text-sm' },
};

export default function YoobooLogo({ size = 'md', showText = true, animated = true }: YoobooLogoProps) {
  const s = sizes[size];
  const d = s.emblem;

  return (
    <div className="flex items-center gap-2.5">
      {/* Emblem */}
      <div className="relative shrink-0" style={{ width: d, height: d }}>
        {/* Outer glow ring */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'radial-gradient(circle, rgba(232,184,75,0.15) 0%, transparent 70%)',
              filter: 'blur(4px)',
            }}
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Diamond/gem shape */}
        <svg
          width={d}
          height={d}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-lg"
        >
          <defs>
            <linearGradient id="y-gold-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F3D779" />
              <stop offset="35%" stopColor="#E8B84B" />
              <stop offset="65%" stopColor="#C9952A" />
              <stop offset="100%" stopColor="#A67B1E" />
            </linearGradient>
            <linearGradient id="y-bg-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1A1512" />
              <stop offset="50%" stopColor="#0D0A08" />
              <stop offset="100%" stopColor="#1A1512" />
            </linearGradient>
            <linearGradient id="y-border-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8B84B" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#E8B84B" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#E8B84B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#E8B84B" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="y-crimson-accent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF1A4A" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FF1A4A" stopOpacity="0" />
            </linearGradient>
            <filter id="y-emboss">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Diamond outer shape */}
          <path
            d="M32 2 L60 22 L50 60 L14 60 L4 22 Z"
            fill="url(#y-bg-grad)"
            stroke="url(#y-border-grad)"
            strokeWidth="1.5"
            filter="url(#y-emboss)"
          />

          {/* Crimson accent at top tip */}
          <path
            d="M32 2 L48 16 L42 22 L22 22 L16 16 Z"
            fill="url(#y-crimson-accent)"
            opacity="0.6"
          />

          {/* Inner diamond highlight */}
          <path
            d="M32 10 L46 24 L40 52 L24 52 L18 24 Z"
            fill="none"
            stroke="url(#y-border-grad)"
            strokeWidth="0.5"
            opacity="0.3"
          />

          {/* Top facet shimmer */}
          <path
            d="M32 2 L48 16 L42 22 L22 22 L16 16 Z"
            fill="url(#y-border-grad)"
            opacity="0.06"
          />

          {/* Stylized "Y" letterform */}
          <g filter="url(#y-emboss)">
            <path
              d="M28 18 L32 30 L36 18 L42 18 L34 34 L34 48 L30 48 L30 34 L22 18 Z"
              fill="url(#y-gold-grad)"
            />
          </g>

          {/* Small diamond accent at center */}
          <polygon
            points="32,36 34,34 32,32 30,34"
            fill="#F3D779"
            opacity="0.4"
          />

          {/* Corner gem accents */}
          <circle cx="16" cy="22" r="2" fill="#E8B84B" opacity="0.3" />
          <circle cx="48" cy="22" r="2" fill="#E8B84B" opacity="0.3" />
          <circle cx="22" cy="54" r="2" fill="#E8B84B" opacity="0.2" />
          <circle cx="42" cy="54" r="2" fill="#E8B84B" opacity="0.2" />
        </svg>
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
