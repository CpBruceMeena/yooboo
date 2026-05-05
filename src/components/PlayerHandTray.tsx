'use client';

import { Card as CardType } from '@/lib/game';
import Card from './Card';

interface PlayerHandTrayProps {
  cards: CardType[];
  playableCardIds: string[];
  selectedCardId?: string | null;
  onCardClick: (cardId: string) => void;
  disabled?: boolean;
}

export default function PlayerHandTray({
  cards,
  playableCardIds,
  selectedCardId,
  onCardClick,
  disabled,
}: PlayerHandTrayProps) {
  if (cards.length === 0) return null;

  return (
    <div className="flex justify-center items-end px-8 pb-4 pt-2">
      <div className="flex gap-[-12px]">
        {cards.map((card, idx) => {
          const isPlayable = playableCardIds.includes(card.id);
          const isSelected = selectedCardId === card.id;
          const state = disabled
            ? 'disabled'
            : isSelected
              ? 'selected'
              : isPlayable
                ? 'playable'
                : 'disabled';

          return (
            <div
              key={card.id}
              className="-ml-6 first:ml-0"
              style={{ zIndex: idx }}
            >
              <Card
                type={card.type}
                color={card.color}
                value={card.value}
                state={state as any}
                onClick={() => (isPlayable || isSelected) && onCardClick(card.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}