'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, useMemo } from 'react';
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

/* ── Draw trail glow component ── */
function DrawTrail({ index }: { index: number }) {
  return (
    <motion.div
      className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-16 z-20 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0] }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-b from-goldGlow via-gold/60 to-transparent blur-sm" />
    </motion.div>
  );
}

/* ── Flying card wrapper — animates newly drawn cards from above ── */
function FlyingCard({
  card,
  index,
  isPlayable,
  isSelected,
  state,
  onClick,
}: {
  card: CardType;
  index: number;
  isPlayable: boolean;
  isSelected: boolean;
  state: 'playable' | 'selected' | 'disabled';
  onClick: () => void;
}) {
  // Stagger: each card flies in slightly after the previous
  const delay = index * 0.06;
  // Stable random params per card instance
  const animParams = useMemo(() => ({
    rot: (Math.random() - 0.5) * 20,   // random spin
    fromX: (Math.random() - 0.5) * 80,  // random horizontal entry
  }), []);
  const { rot, fromX } = animParams;

  return (
    <motion.div
      key={card.id}
      className="relative"
      initial={{
        opacity: 0,
        y: -150,
        x: fromX,
        rotate: rot,
        scale: 0.4,
        filter: 'blur(6px)',
      }}
      animate={{
        opacity: 1,
        y: 0,
        x: 0,
        rotate: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 20,
        mass: 0.7,
        delay,
      }}
    >
      {/* Trail glow */}
      <DrawTrail index={index} />

      <Card
        type={card.type}
        color={card.color}
        value={card.value}
        state={state}
        size="sm"
        onClick={onClick}
      />
    </motion.div>
  );
}



export default function PlayerHandTray({
  cards,
  playableCardIds,
  selectedCardId,
  onCardClick,
  disabled,
}: PlayerHandTrayProps) {

  const [prevCardIds, setPrevCardIds] = useState<Set<string>>(new Set());
  const [newCardIds, setNewCardIds] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect newly added cards for fly-in animation
  useEffect(() => {
    const currentIds = new Set(cards.map((c) => c.id));

    // Only animate if cards increased (draw action)
    if (prevCardIds.size > 0 && currentIds.size > prevCardIds.size) {
      const added = new Set<string>();
      currentIds.forEach((id) => {
        if (!prevCardIds.has(id)) added.add(id);
      });
      setNewCardIds(added);

      // Clear after animation completes
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setNewCardIds(new Set());
      }, 1000);
    }

    setPrevCardIds(currentIds);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [cards]);

  if (cards.length === 0) return null;

  const cardSize = 'sm';

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
                  {rowCards.map((card, idx) => {
                    const isPlayable = playableCardIds.includes(card.id);
                    const isSelected = selectedCardId === card.id;
                    const state = disabled
                      ? 'disabled'
                      : isSelected
                        ? 'selected'
                        : isPlayable
                          ? 'playable'
                          : 'disabled';

                    const isNew = newCardIds.has(card.id);
                    const canClick = (isPlayable || isSelected) && !disabled;

                    if (isNew) {
                      return (
                        <FlyingCard
                          key={card.id}
                          card={card}
                          index={idx}
                          isPlayable={isPlayable}
                          isSelected={isSelected}
                          state={state}
                          onClick={() => canClick && onCardClick(card.id)}
                        />
                      );
                    }

                    return (
                      <motion.div
                        key={card.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6, y: 20 }}
                        transition={{
                          type: 'spring',
                          stiffness: 350,
                          damping: 22,
                          mass: 0.6,
                        }}
                      >
                        <Card
                          type={card.type}
                          color={card.color}
                          value={card.value}
                          state={state}
                          size={cardSize}
                          onClick={() => canClick && onCardClick(card.id)}
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
