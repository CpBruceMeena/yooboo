'use client';

import { Card as CardType } from '@/lib/game';

interface CardProps {
  type: CardType['type'];
  color: CardType['color'];
  value?: number;
  state?: 'default' | 'playable' | 'selected' | 'disabled';
  onClick?: () => void;
}

const colorMap: Record<string, string> = {
  red: 'bg-red text-white',
  yellow: 'bg-yellow text-black',
  green: 'bg-green text-white',
  blue: 'bg-blue text-white',
  wild: 'bg-wild text-white',
};

const colorBorderMap: Record<string, string> = {
  red: 'border-red',
  yellow: 'border-yellow',
  green: 'border-green',
  blue: 'border-blue',
  wild: 'border-wild',
};

const glowMap: Record<string, string> = {
  wild: 'shadow-[0_0_12px_rgba(122,77,255,0.6)]',
  red: 'shadow-[0_0_12px_rgba(228,71,71,0.6)]',
};

const stateStyles: Record<string, string> = {
  default: '',
  playable: 'cursor-pointer hover:-translate-y-4 transition-transform duration-150 hover:shadow-[0_8px_24px_rgba(247,248,250,0.25)]',
  selected: '-translate-y-6 shadow-[0_8px_24px_rgba(247,248,250,0.3)]',
  disabled: 'opacity-40 cursor-not-allowed',
};

const symbolMap: Record<string, string> = {
  reverse: '⟳',
  plus2: '+2',
  reverse4: '⟳+4',
  plus4: '+4',
  plus6: '+6',
  plus10: '+10',
  skipEveryone: '⊘',
  discardAll: '🗑',
  smiley: '😊',
};

export default function Card({ type, color, value, state = 'default', onClick }: CardProps) {
  const bg = color === 'wild' ? 'bg-wild' : `bg-${color}`;
  const borderColor = color === 'wild' ? 'border-wild' : `border-${color}`;
  const textColor = color === 'yellow' ? 'text-black' : 'text-white';

  const isPlayable = state === 'playable';
  const isSelected = state === 'selected';
  const isDisabled = state === 'disabled';

  return (
    <div
      onClick={isPlayable || isSelected ? onClick : undefined}
      className={`
        relative w-20 h-28 rounded-xl border-2 flex flex-col items-center justify-center
        font-bold transition-all duration-150 cursor-pointer shrink-0
        ${bg} ${textColor} ${borderColor}
        ${glowMap[color] ?? ''}
        ${isPlayable ? 'cursor-pointer hover:-translate-y-4 transition-transform duration-150 hover:shadow-[0_8px_24px_rgba(247,248,250,0.25)]' : ''}
        ${isSelected ? '-translate-y-6 shadow-[0_8px_24px_rgba(247,248,250,0.3)]' : ''}
        ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
      `}
    >
      <span className="absolute top-1 left-2 text-xs">{type === 'number' ? value : symbolMap[type] ?? type}</span>
      <span className="text-2xl">
        {type === 'number' ? value : symbolMap[type] ?? '?'}
      </span>
      <span className="absolute bottom-1 right-2 text-xs rotate-180">{type === 'number' ? value : symbolMap[type] ?? type}</span>
    </div>
  );
}