'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card as CardType } from '@/lib/game';
import Card from './Card';

interface SmileyRevealProps {
  cards: CardType[];
  playerName: string;
  matched: boolean;
  eliminated: boolean;
  onComplete: () => void;
}

export default function SmileyReveal({
  cards,
  playerName,
  matched,
  eliminated,
  onComplete,
}: SmileyRevealProps) {
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [allDone, setAllDone] = useState(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    if (cards.length === 0) {
      const t = setTimeout(() => {
        setAllDone(true);
        completeRef.current?.();
      }, 500);
      return () => clearTimeout(t);
    }

    let currentIndex = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const revealNext = () => {
      if (currentIndex < cards.length) {
        setRevealedIndex(currentIndex);
        currentIndex++;
        if (currentIndex < cards.length) {
          const delay = 1500 + Math.random() * 1500; // 1.5s–3s
          timeouts.push(setTimeout(revealNext, delay));
        } else {
          // All cards revealed — wait then complete
          setAllDone(true);
          timeouts.push(setTimeout(() => {
            completeRef.current?.();
          }, 2000));
        }
      }
    };

    // Start after a brief intro
    timeouts.push(setTimeout(revealNext, 800));

    return () => timeouts.forEach(clearTimeout);
  }, [cards.length]);

  const isLastRevealed = revealedIndex >= cards.length - 1 && cards.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-6 max-w-xl w-full px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <p className={`text-sm font-mono tracking-wider mb-1 ${
            eliminated ? 'text-danger' : matched ? 'text-success' : 'text-accent'
          }`}>
            {eliminated
              ? '☠ ELIMINATION'
              : matched
                ? '✓ MATCH FOUND'
                : '◈ SMILEY DRAW'}
          </p>
          <h3 className="font-display text-xl text-white">{playerName}</h3>
        </motion.div>

        {/* Card reveal area */}
        <div className="flex flex-wrap justify-center gap-3 min-h-[130px] items-center py-4">
          <AnimatePresence mode="popLayout">
            {cards.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-textMuted/60 text-sm font-mono"
              >
                No cards drawn...
              </motion.p>
            )}
            {cards.map((card, index) => {
              const isRevealed = revealedIndex >= index;
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, rotateY: 180, scale: 0.3, y: -40 }}
                  animate={{
                    opacity: isRevealed ? 1 : 0,
                    rotateY: isRevealed ? 0 : 180,
                    scale: isRevealed ? 1 : 0.3,
                    y: isRevealed ? 0 : -40,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 250,
                    damping: 22,
                    mass: 0.8,
                  }}
                  className="relative shrink-0"
                >
                  {/* Card back (shown before reveal) */}
                  {!isRevealed && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 border-2 border-white/20 flex items-center justify-center z-10 w-16 h-22">
                      <span className="text-white/30 text-2xl font-display">?</span>
                    </div>
                  )}
                  <Card
                    type={card.type}
                    color={card.color}
                    value={card.value}
                    size="md"
                    state="default"
                  />
                  {/* Flash glow on reveal */}
                  {revealedIndex === index && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-white/30"
                      initial={{ opacity: 0.7, scale: 1.1 }}
                      animate={{ opacity: 0, scale: 1 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Status messages */}
        <div className="min-h-[2rem] text-center">
          {!allDone && revealedIndex >= 0 && revealedIndex < cards.length && (
            <motion.p
              key={revealedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-textMuted/60 text-xs font-mono"
            >
              Card {revealedIndex + 1} of {cards.length}
            </motion.p>
          )}

          {isLastRevealed && allDone && matched && !eliminated && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="px-5 py-2 rounded-full bg-success/15 border border-success/30"
            >
              <span className="text-success text-xs font-mono">
                ✓ Match found! {playerName} keeps all drawn cards.
              </span>
            </motion.div>
          )}

          {isLastRevealed && allDone && eliminated && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="px-5 py-2 rounded-full bg-danger/20 border border-danger/40"
            >
              <span className="text-danger text-xs font-mono animate-pulse">
                ☠ {playerName} is ELIMINATED — exceeded 25 card limit!
              </span>
            </motion.div>
          )}

          {isLastRevealed && allDone && !matched && !eliminated && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="px-5 py-2 rounded-full bg-yellow/15 border border-yellow/30"
            >
              <span className="text-yellow text-xs font-mono">
                ◈ No match. Deck exhausted before finding {cards[cards.length-1]?.color || 'target'}.
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
