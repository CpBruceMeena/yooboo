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

const colorRows: { label: string; colorFilter: (c: CardType) => boolean }[] = [
  { label: 'RED', colorFilter: (c) => c.color === 'red' },
  { label: 'YELLOW', colorFilter: (c) => c.color === 'yellow' },
  { label: 'GREEN', colorFilter: (c) => c.color === 'green' },
  { label: 'BLUE', colorFilter: (c) => c.color === 'blue' },
  { label: 'WILD', colorFilter: (c) => c.color === 'wild' },
];

const rowAccents: Record<string, string> = {
  RED: 'border-red/40 bg-red/5',
  YELLOW: 'border-yellow/40 bg-yellow/5',
  GREEN: 'border-green/40 bg-green/5',
  BLUE: 'border-blue/40 bg-blue/5',
  WILD: 'border-wild/40 bg-wild/5',
};

const rowLabelColors: Record<string, string> = {
  RED: 'text-red',
  YELLOW: 'text-yellow',
  GREEN: 'text-green',
  BLUE: 'text-blue',
  WILD: 'text-wild',
};

export default function PlayerHandTray({
  cards,
  playableCardIds,
  selectedCardId,
  onCardClick,
  disabled,
}: PlayerHandTrayProps) {
  if (cards.length === 0) return null;

  // More compact — use 'sm' size when 8+ cards to keep the tray compact
  const cardSize = cards.length > 7 ? 'sm' : 'md';

  return (
    <div className="flex justify-center px-2 pb-1.5 pt-0.5 overflow-x-auto scrollbar-thin">
      <div className="flex flex-col gap-1 min-w-0 max-w-full">
        {colorRows.map((row) => {
          const rowCards = cards.filter(row.colorFilter);
          if (rowCards.length === 0) return null;

          return (
            <div
              key={row.label}
              className={`flex items-center gap-1.5 rounded-md border ${rowAccents[row.label]} px-1.5 py-1`}
            >
              {/* Row label */}
              <span className={`text-[8px] font-mono font-bold tracking-widest ${rowLabelColors[row.label]} opacity-60 shrink-0 w-8 text-right`}>
                {row.label}
              </span>

              {/* Cards in this row */}
              <div className="flex gap-1 overflow-x-auto scrollbar-thin">
                <AnimatePresence mode="popLayout">
                  {rowCards.map((card) => {
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
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 25,
                        }}
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
        })}
      </div>
    </div>
  );
}
