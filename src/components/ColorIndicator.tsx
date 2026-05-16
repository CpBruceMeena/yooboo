'use client';

import { CardColor } from '@/lib/game';

interface ColorIndicatorProps {
  color: Exclude<CardColor, 'wild'> | null;
}

const colorMap: Record<string, string> = {
  red: 'bg-red shadow-[0_0_10px_rgba(228,71,71,0.6)]',
  yellow: 'bg-yellow shadow-[0_0_10px_rgba(243,199,66,0.6)]',
  green: 'bg-green shadow-[0_0_10px_rgba(51,181,107,0.6)]',
  blue: 'bg-blue shadow-[0_0_10px_rgba(52,120,246,0.6)]',
};

export default function ColorIndicator({ color }: ColorIndicatorProps) {
  if (!color) return null;

  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded-full ${colorMap[color] ?? 'bg-textMuted'}`} />
      <span className="text-sm text-textMuted capitalize">{color}</span>
    </div>
  );
}