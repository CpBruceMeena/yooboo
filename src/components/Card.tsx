'use client';

import { motion } from 'motion/react';
import { Card as CardType } from '@/lib/game';

interface CardProps {
  type: CardType['type'];
  color: CardType['color'];
  value?: number;
  state?: 'default' | 'playable' | 'selected' | 'disabled';
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap: Record<string, string> = {
  sm: 'w-[38px] h-[54px] text-[9px]',
  md: 'w-16 h-22 text-xs',
  lg: 'w-20 h-26 text-base',
  xl: 'w-28 h-[164px] text-lg',
};

/* ── Premium Casino Noir + Cyberpunk Gradients ── */
const colorGradients: Record<string, string> = {
  red:    'bg-gradient-to-br from-[#FF1A4A] via-[#D60030] to-[#8E001E]',
  yellow: 'bg-gradient-to-br from-[#FFE055] via-[#E8B800] to-[#B88A00]',
  green:  'bg-gradient-to-br from-[#00FF88] via-[#00CC6A] to-[#00994E]',
  blue:   'bg-gradient-to-br from-[#00E0FF] via-[#0099CC] to-[#006699]',
  wild:   'bg-gradient-to-br from-[#1A1010] via-[#0D0D12] to-[#1A1010]',
};

/* ── Metallic inset highlight per color ── */
const metalHighlights: Record<string, string> = {
  red:    'shadow-[inset_0_1px_0_rgba(255,70,90,0.35),inset_0_-1px_0_rgba(0,0,0,0.25)]',
  yellow: 'shadow-[inset_0_1px_0_rgba(255,230,80,0.35),inset_0_-1px_0_rgba(0,0,0,0.25)]',
  green:  'shadow-[inset_0_1px_0_rgba(50,255,150,0.3),inset_0_-1px_0_rgba(0,0,0,0.25)]',
  blue:   'shadow-[inset_0_1px_0_rgba(50,230,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.25)]',
  wild:   'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.35)]',
};

/* ── Neon underglow per color ── */
const colorGlows: Record<string, string> = {
  red:    'shadow-[0_0_12px_rgba(255,0,60,0.3),0_0_30px_rgba(255,0,60,0.08),inset_0_1px_0_rgba(255,255,255,0.12)]',
  yellow: 'shadow-[0_0_12px_rgba(255,214,10,0.3),0_0_30px_rgba(255,214,10,0.08),inset_0_1px_0_rgba(255,255,255,0.12)]',
  green:  'shadow-[0_0_12px_rgba(0,255,136,0.25),0_0_30px_rgba(0,255,136,0.06),inset_0_1px_0_rgba(255,255,255,0.12)]',
  blue:   'shadow-[0_0_12px_rgba(0,212,255,0.25),0_0_30px_rgba(0,212,255,0.06),inset_0_1px_0_rgba(255,255,255,0.12)]',
  wild:   'shadow-[0_0_14px_rgba(122,77,255,0.25),0_0_35px_rgba(122,77,255,0.08),inset_0_1px_0_rgba(255,255,255,0.06)]',
};

/* ── Icon SVGs for action cards ── */
const ActionIcons = {
  reverse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11v-1a4 4 0 014-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v1a4 4 0 01-4 4H3" />
    </svg>
  ),
  skipEveryone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
    </svg>
  ),
  discardAll: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  ),
};

/* ── Row highlight wrapper for size-consistent centering ── */
function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full">{children}</div>;
}

function NumberDisplay({ value, size }: { value: number; size: string }) {
  return (
    <span
      className={`relative z-10 font-display tracking-tight text-chrome metal-number ${
        size === 'sm' ? 'text-xl leading-none' : 'text-[28px] leading-none'
      }`}
    >
      {value}
    </span>
  );
}

export default function Card({ type, color, value, state = 'default', onClick, size = 'md' }: CardProps) {
  const isPlayable = state === 'playable';
  const isSelected = state === 'selected';
  const isDisabled = state === 'disabled';
  const isWild = color === 'wild';
  const isNumber = type === 'number';

  const canInteract = isPlayable || isSelected;
  const isSmiley = type === 'smiley';
  const isReverse = type === 'reverse' || type === 'reverse4';
  const isSkip = type === 'skipEveryone';
  const isDiscard = type === 'discardAll';

  /* NoMercy legendary cards */
  const isLegendary = type === 'plus4' || type === 'plus6' || type === 'plus10' || type === 'reverse4';

  const textColor = color === 'yellow' ? 'text-[#1A1512]' : 'text-white';

  return (
    <motion.div
      onClick={canInteract ? onClick : undefined}
      whileHover={canInteract ? { y: -4 } : undefined}
      whileTap={canInteract ? { scale: 0.95 } : undefined}
      animate={{
        y: isSelected ? -14 : 0,
        scale: isSelected ? 1.08 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 20,
        mass: 0.8,
      }}
      className={`
        relative rounded-xl border flex flex-col items-center justify-center
        font-bold cursor-pointer shrink-0 select-none overflow-hidden
        ${sizeMap[size]}
        ${colorGradients[color] ?? 'bg-bgTertiary'}
        ${textColor}
        ${metalHighlights[color] ?? ''}
        ${colorGlows[color] ?? ''}
        ${isWild ? 'border-white/10' : 'border-white/18'}
        ${isPlayable ? 'cursor-pointer ring-2 ring-white/45 ring-offset-1 ring-offset-transparent animate-pulse-glow' : ''}
        ${isDisabled ? 'opacity-30 cursor-not-allowed grayscale-[40%] saturate-50' : ''}
        ${isSelected ? 'ring-2 ring-goldGlow ring-offset-2 ring-offset-[#0A0705] shadow-[0_0_20px_rgba(232,184,75,0.35)]' : ''}
        ${isLegendary && isWild ? 'legendary-card border-gold/50' : ''}
        scratch-overlay
      `}
      style={{
        boxShadow: isPlayable && !isLegendary
          ? `0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18), 0 0 25px rgba(255,255,255,0.06)`
          : undefined,
      }}
    >
      {/* ── Glass reflection layer ── */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/12 via-white/05 to-transparent pointer-events-none z-[1]" />

      {/* ── Bottom vignette for depth ── */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none z-[1]" />

      {/* ── Wild: chroma rainbow foil border ── */}
      {isWild && !isLegendary && (
        <div className="absolute inset-[1px] rounded-[11px] chroma-foil-subtle z-[1] pointer-events-none" />
      )}

      {/* ── Legendary: gold ornate diamond frame ── */}
      {isLegendary && isWild && (
        <>
          {/* Outer gold glow frame */}
          <div className="absolute inset-[1px] rounded-[11px] border border-goldGlow/25 z-[1] pointer-events-none shadow-[inset_0_0_15px_rgba(232,184,75,0.06)]" />
          {/* Inner gold diamond */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] rotate-45 border border-goldGlow/15 rounded-sm z-[1] pointer-events-none" />
          {/* Corner gold ornaments */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-goldGlow/30 z-[2] pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-goldGlow/30 z-[2] pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-goldGlow/30 z-[2] pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-goldGlow/30 z-[2] pointer-events-none" />
        </>
      )}

      {/* ── Foil edge highlight (except wild legendaries — they have gold) ── */}
      {!isWild && <div className="absolute inset-0 rounded-xl foil-edge pointer-events-none z-[1]" />}

      {/* ── Corner pips (top-left) ── */}
      <span className={`absolute top-1 left-1.5 z-[3] card-pip ${isNumber ? '' : 'hidden'} metal-number opacity-80`}>
        {isNumber ? value : ''}
      </span>

      {/* ════════════════════════════════════════════ */}
      {/*               CARD CONTENT                  */}
      {/* ════════════════════════════════════════════ */}

      {/* ── Number Card (0-9) ── */}
      {isNumber && (
        <CardContent>
          <NumberDisplay value={value!} size={size} />
        </CardContent>
      )}

      {/* ── Reverse Card ── */}
      {isReverse && !isWild && (
        <CardContent>
          <div className={`${size === 'sm' ? 'w-5 h-5' : 'w-7 h-7'} drop-shadow-lg`}>
            {ActionIcons.reverse}
          </div>
          {size !== 'sm' && (
            <span className="text-[7px] mt-0.5 font-bold opacity-80 tracking-[0.15em] font-mono">REVERSE</span>
          )}
        </CardContent>
      )}

      {/* ── Reverse4 (Wild Legendary) ── */}
      {type === 'reverse4' && isWild && (
        <CardContent>
          <div className={`${size === 'sm' ? 'w-5 h-5' : 'w-7 h-7'} drop-shadow-lg text-goldGlow`}>
            {ActionIcons.reverse}
          </div>
          <span className={`${size === 'sm' ? 'text-base' : 'text-xl'} font-display text-gold-emboss leading-none -mt-0.5`}>
            +4
          </span>
          {size !== 'sm' && (
            <span className="text-[7px] font-mono font-bold text-goldGlow/60 tracking-[0.1em] leading-none">REV</span>
          )}
        </CardContent>
      )}

      {/* ── +2 Card ── */}
      {type === 'plus2' && !isWild && (
        <CardContent>
          <span className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} font-display metal-number leading-none`}>+2</span>
          {size !== 'sm' && (
            <span className="text-[7px] mt-0.5 font-bold opacity-75 tracking-[0.15em] font-mono">DRAW</span>
          )}
        </CardContent>
      )}

      {/* ── +4 (color-specific, non-wild) ── */}
      {type === 'plus4' && !isWild && (
        <CardContent>
          <span className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} font-display metal-number leading-none`}>+4</span>
          {size !== 'sm' && (
            <span className="text-[7px] mt-0.5 font-bold opacity-75 tracking-[0.15em] font-mono">DRAW 4</span>
          )}
        </CardContent>
      )}

      {/* ── Wild +4 (Legendary NoMercy) ── */}
      {type === 'plus4' && isWild && (
        <CardContent>
          <span className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} font-display text-gold-emboss leading-none`}>+4</span>
          {size !== 'sm' && (
            <span className="text-[7px] font-mono font-bold text-goldGlow/60 tracking-[0.1em]">WILD</span>
          )}
        </CardContent>
      )}

      {/* ── +6 (Wild Legendary) ── */}
      {type === 'plus6' && isWild && (
        <CardContent>
          {/* Double gold rings */}
          <div className="absolute rounded-full border border-goldGlow/20 w-8 h-8 pointer-events-none" />
          <div className="absolute rounded-full border border-goldGlow/10 w-6 h-6 pointer-events-none" />
          <span className={`${size === 'sm' ? 'text-xl' : 'text-3xl'} font-display text-gold-emboss leading-none`}>6</span>
          {size !== 'sm' && (
            <span className="text-[7px] font-mono font-bold text-goldGlow/60 tracking-[0.1em] -mt-0.5">⚡+6</span>
          )}
        </CardContent>
      )}

      {/* ── +10 (Wild Legendary — MAX DRAW) ── */}
      {type === 'plus10' && isWild && (
        <CardContent>
          {/* Triple ominous rings */}
          <div className="absolute rounded-full border-[2px] border-crimson/30 w-9 h-9 pointer-events-none" />
          <div className="absolute rounded-full border border-goldGlow/25 w-7 h-7 pointer-events-none" />
          <div className="absolute rounded-full border border-goldGlow/10 w-5 h-5 pointer-events-none" />
          <span className={`${size === 'sm' ? 'text-sm' : 'text-xl'} font-display text-gold-emboss leading-none`}>+10</span>
          {size !== 'sm' && (
            <span className="text-[6px] font-mono font-bold text-crimson/70 tracking-[0.1em] leading-none mt-0.5">☠ MAX</span>
          )}
        </CardContent>
      )}

      {/* ── Skip Everyone ── */}
      {isSkip && (
        <CardContent>
          <div className={`${size === 'sm' ? 'w-5 h-5' : 'w-7 h-7'} drop-shadow-lg`}>
            {ActionIcons.skipEveryone}
          </div>
          {size !== 'sm' && (
            <span className="text-[7px] mt-0.5 font-bold opacity-80 tracking-[0.1em] font-mono">SKIP ALL</span>
          )}
        </CardContent>
      )}

      {/* ── Discard All ── */}
      {isDiscard && (
        <CardContent>
          <div className={`${size === 'sm' ? 'w-5 h-5' : 'w-7 h-7'} drop-shadow-lg`}>
            {ActionIcons.discardAll}
          </div>
          {size !== 'sm' && (
            <span className="text-[7px] mt-0.5 font-bold opacity-80 tracking-[0.08em] font-mono">DISCARD</span>
          )}
        </CardContent>
      )}

      {/* ── Smiley Card ── */}
      {isSmiley && (
        <CardContent>
          <span className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} drop-shadow-lg`}>😊</span>
          {size !== 'sm' && (
            <span className="text-[7px] mt-0.5 font-bold opacity-75 font-mono">SMILEY</span>
          )}
        </CardContent>
      )}

      {/* ── Wild plain (no special type assigned) ── */}
      {isWild && !isSmiley && type !== 'plus4' && type !== 'plus6' && type !== 'plus10' && type !== 'reverse4' && (
        <CardContent>
          {/* Chroma rainbow shimmer */}
          <div className="absolute inset-2 rounded-lg chroma-foil-subtle opacity-40 z-0 pointer-events-none" />
          <svg className={`${size === 'sm' ? 'w-5 h-5' : 'w-7 h-7'} drop-shadow-lg relative z-10`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" strokeDasharray="3 3" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          {size !== 'sm' && (
            <span className="text-[7px] mt-0.5 font-bold opacity-60 tracking-[0.15em] font-mono relative z-10">WILD</span>
          )}
        </CardContent>
      )}

      {/* ── Corner pips (bottom-right, rotated) ── */}
      <span className={`absolute bottom-1 right-1.5 z-[3] card-pip ${isNumber ? '' : 'hidden'} metal-number rotate-180 opacity-80`}>
        {isNumber ? value : ''}
      </span>
    </motion.div>
  );
}
