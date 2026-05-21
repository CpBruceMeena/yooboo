'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useMemo } from 'react';
import { Card as CardType } from '@/lib/game';
import Card from './Card';

interface DiscardPileProps {
  topCard: CardType | null;
  cards?: CardType[];
}

export default function DiscardPile({ topCard, cards = [] }: DiscardPileProps) {
  if (!topCard) {
    return <div className="w-20 h-28 rounded-xl border-2 border-dashed border-creamMuted/20" />;
  }

  // Show last 4 cards in fan, newest on top
  const recent = useMemo(() => {
    if (cards.length === 0 && topCard) return [topCard];
    const all = [...cards];
    // Ensure topCard is the most recent
    if (topCard && all[all.length - 1]?.id !== topCard.id) {
      all.push(topCard);
    }
    return all.slice(-4);
  }, [cards, topCard]);

  const fanConfigs = useMemo(() => {
    const len = recent.length;
    return recent.map((_, i) => {
      // Newest card (last index) = no offset, sits on top
      // Older cards fan outward
      const isNewest = i === len - 1;
      const fanIndex = len - 1 - i; // 0 = newest, 3 = oldest
      const offsetX = fanIndex * -16;
      const rotation = fanIndex * -4;
      const yOffset = fanIndex * -2;
      return {
        x: isNewest ? 0 : offsetX,
        rotate: isNewest ? 0 : rotation,
        y: isNewest ? 0 : yOffset,
        zIndex: i + 1,
        opacity: isNewest ? 1 : Math.max(0.3, 0.85 - fanIndex * 0.2),
      };
    });
  }, [recent]);

  return (
    <div className="relative flex items-center justify-center w-28 h-36">
      {/* Dust puff effect on new card land */}
      <AnimatePresence>
        {topCard && (
          <motion.div
            key={`dust-${topCard.id}`}
            className="absolute inset-0 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-goldGlow/10 blur-md animate-dust-puff" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fan layout: oldest at bottom-left, newest on top-center */}
      <AnimatePresence mode="popLayout">
        {recent.map((card, index) => {
          const isNewest = index === recent.length - 1;
          const cfg = fanConfigs[index];

          return (
            <motion.div
              key={card.id}
              className="absolute"
              style={{
                zIndex: cfg.zIndex,
              }}
              initial={isNewest ? {
                scale: 0.3,
                rotate: -20,
                opacity: 0,
                y: -40,
              } : {
                scale: 0.8,
                rotate: cfg.rotate - 5,
                opacity: 0,
                x: cfg.x,
                y: cfg.y - 10,
              }}
              animate={{
                scale: 1,
                rotate: cfg.rotate,
                opacity: cfg.opacity,
                x: cfg.x,
                y: cfg.y,
              }}
              exit={{
                scale: 0.5,
                rotate: cfg.rotate + 10,
                opacity: 0,
                x: cfg.x - 20,
              }}
              transition={isNewest ? {
                type: 'spring',
                stiffness: 400,
                damping: 16,
                mass: 0.8,
              } : {
                type: 'spring',
                stiffness: 250,
                damping: 20,
                delay: 0.05,
              }}
            >
              <Card
                type={card.type}
                color={card.color}
                value={card.value}
                state="default"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Impact ring on newest card */}
      <AnimatePresence>
        {topCard && (
          <motion.div
            key={`ring-${topCard.id}`}
            className="absolute w-20 h-28 rounded-xl border border-goldGlow/20 z-0 pointer-events-none"
            initial={{ opacity: 0.6, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
