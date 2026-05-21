'use client';

import { motion } from 'motion/react';

interface TopBarProps {
  roomId?: string;
  currentPlayer?: string;
  direction?: 'clockwise' | 'counter';
  stackValue?: number;
  onLeave?: () => void;
}

export default function TopBar({ roomId, currentPlayer, direction, stackValue, onLeave }: TopBarProps) {
  return (
    <div className="h-14 bg-gradient-to-r from-bgSecondary/90 to-bgPrimary border-b border-gold/10 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">🃏</span>
          <div>
            <h1 className="text-sm font-serif font-bold text-cream tracking-tight leading-tight">UNO</h1>
            <span className="text-[9px] font-serif italic text-gold/60 tracking-wider block leading-tight">NO MERCY</span>
          </div>
        </div>
        {roomId && (
          <span className="px-2.5 py-1 rounded-md bg-[#130E0A]/80 border border-gold/15 text-xs text-goldLight font-mono tracking-wider">
            {roomId}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-creamMuted">
        {currentPlayer && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-goldGlow shadow-[0_0_6px_rgba(232,184,75,0.6)]" />
            <span>Turn: <span className="text-cream font-semibold">{currentPlayer}</span></span>
          </div>
        )}
        {direction && (
          <span className="flex items-center gap-1">
            <span className="text-sm text-gold/60">{direction === 'clockwise' ? '↻' : '↺'}</span>
          </span>
        )}
        {stackValue != null && stackValue > 0 && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-crimson/15 border border-crimson/30 text-crimson font-bold text-xs">
            <span>⚡</span>
            <span>Stack: {stackValue}</span>
          </span>
        )}
        {onLeave && (
          <motion.button
            onClick={onLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 rounded-lg bg-crimson/15 hover:bg-crimson/25 text-crimson text-[11px] font-semibold border border-crimson/20 hover:border-crimson/40 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Leave
          </motion.button>
        )}
      </div>
    </div>
  );
}
