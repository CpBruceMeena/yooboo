'use client';

import { useState } from 'react';
import { CardColor } from '@/lib/game';

interface DrawPileProps {
  cardCount: number;
  onClick?: () => void;
  disabled?: boolean;
}

export default function DrawPile({ cardCount, onClick, disabled }: DrawPileProps) {
  return (
    <div className="relative" onClick={disabled ? undefined : onClick}>
      <div className="w-20 h-28 bg-bgTertiary rounded-xl border-2 border-textMuted/30 flex flex-col items-center justify-center cursor-pointer hover:border-textMuted/60 transition-colors">
        <span className="text-2xl text-textMuted">🃏</span>
        <span className="text-xs text-textMuted mt-1">{cardCount}</span>
      </div>
    </div>
  );
}