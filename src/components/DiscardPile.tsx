'use client';

import { Card as CardType } from '@/lib/game';
import Card from './Card';

interface DiscardPileProps {
  topCard: CardType | null;
  cards?: CardType[];
}

export default function DiscardPile({ topCard, cards = [] }: DiscardPileProps) {
  if (!topCard) {
    return <div className="w-20 h-28 rounded-xl border-2 border-dashed border-textMuted/20" />;
  }

  const recent = cards.slice(-3);

  return (
    <div className="relative flex items-center justify-center">
      {recent.length > 1 && (
        <div
          className="absolute w-20 h-28 rounded-xl opacity-30 -rotate-6"
          style={{ backgroundColor: recent[recent.length - 2]?.color ?? '#242B38' }}
        />
      )}
      <div className="animate-discard-burst">
        <Card
          type={topCard.type}
          color={topCard.color}
          value={topCard.value}
          state="default"
        />
      </div>
    </div>
  );
}