'use client';

import { motion, AnimatePresence } from 'motion/react';
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
  const cardSize = cards.length > 8 ? 'sm' : 'md';
  // Tighter overlap for many cards, looser for few
  const overlap = cards.length > 10 ? '-ml-2' : cards.length > 7 ? '-ml-3' : '-ml-4';

  if (cards.length === 0) return null;

  return (
    <div className="flex justify-center items-end px-6 pb-4 pt-2 overflow-x-auto scrollbar-thin">
      <div className="flex items-end">
        <AnimatePresence mode="popLayout">
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
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  delay: idx * 0.03,
                }}
                className={`${overlap} first:ml-0`}
                style={{ zIndex: idx }}
              >
                <Card
                  type={card.type}
                  color={card.color}
                  value={card.value}
                  state={state as any}
                  size={cardSize as any}
                  onClick={() => (isPlayable || isSelected) && onCardClick(card.id)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
