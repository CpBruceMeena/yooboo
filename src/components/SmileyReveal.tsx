'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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

/* ── Particle component — bursts on reveal ── */
function ParticleBurst({ color, count = 12 }: { color: string; count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      tx: (Math.random() - 0.5) * 200,
      ty: (Math.random() - 0.5) * 200,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 0.3,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
            left: '50%',
            top: '50%',
            x: 0,
            y: 0,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.8, 0],
            scale: [0, 1.5, 1, 0],
            x: [0, p.tx],
            y: [0, p.ty],
          }}
          transition={{
            duration: 1 + Math.random() * 0.5,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

/* ── 3D Flip Card component ── */
function FlipCard({ card, isRevealed, index }: { card: CardType; isRevealed: boolean; index: number }) {
  return (
    <motion.div
      layout
      className="relative shrink-0 perspective-800"
      style={{ width: 64, height: 96 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.15 }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{
          rotateY: isRevealed ? 0 : 180,
          scale: isRevealed ? 1 : 0.85,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 18,
          mass: 1.2,
          delay: index * 0.15,
        }}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 rounded-xl backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1A1010] to-[#0D0D12] border-2 border-gold/20 flex items-center justify-center">
            <span className="text-goldGlow/40 font-display text-2xl">?</span>
          </div>
        </div>

        {/* Card Front */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {isRevealed && (
            <>
              <Card type={card.type} color={card.color} value={card.value} size="sm" state="default" />
              {/* Reveal flare */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 via-transparent to-transparent"
                initial={{ opacity: 0.8, scale: 1.1 }}
                animate={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Glow ring on reveal */}
      {isRevealed && (
        <motion.div
          className="absolute -inset-2 rounded-xl border-2 border-goldGlow/30 z-10 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.2, 1.5] }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        />
      )}
    </motion.div>
  );
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
  const [showFace, setShowFace] = useState(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    if (cards.length === 0) {
      const t = setTimeout(() => {
        setAllDone(true);
        setShowFace(true);
        const t2 = setTimeout(() => completeRef.current?.(), 1500);
        return () => clearTimeout(t2);
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
          const delay = 1200 + Math.random() * 1200;
          timeouts.push(setTimeout(revealNext, delay));
        } else {
          setAllDone(true);
          timeouts.push(setTimeout(() => {
            setShowFace(true);
            timeouts.push(setTimeout(() => completeRef.current?.(), 2500));
          }, 1500));
        }
      }
    };

    timeouts.push(setTimeout(revealNext, 1000));
    return () => timeouts.forEach(clearTimeout);
  }, [cards.length]);

  const isLastRevealed = revealedIndex >= cards.length - 1 && cards.length > 0;
  const faceEmoji = eliminated ? '💀' : matched ? '😊' : '😐';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0705] via-[#1A1010] to-[#0A0705]" />

      {/* Dark vignette overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 animate-vignette-pulse" />

      {/* Scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent bg-[length:100%_3px] pointer-events-none" />

      {/* Spotlight glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl w-full px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 15 }}
          className="text-center"
        >
          <motion.p
            className={`text-sm font-mono tracking-[0.25em] mb-2 ${
              eliminated ? 'text-crimson' : matched ? 'text-goldGlow' : 'text-creamMuted'
            }`}
          >
            {eliminated && '☠ ELIMINATION'}
            {matched && '✓ MATCH FOUND'}
            {!eliminated && !matched && '◈ SMILEY DRAW'}
          </motion.p>

          {/* Player name with gold underline */}
          <h3 className="font-display text-3xl text-cream tracking-wider gold-text-shadow">{playerName}</h3>
          <div className="h-[1px] w-24 mx-auto mt-2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </motion.div>

        {/* Card reveal area */}
        <div className="flex flex-wrap justify-center gap-2 min-h-[110px] items-center py-4">
          <AnimatePresence mode="popLayout">
            {cards.length === 0 && !showFace && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-creamMuted/40 text-sm font-mono tracking-wider"
              >
                No cards drawn...
              </motion.p>
            )}

            {cards.map((card, index) => (
              <FlipCard
                key={card.id}
                card={card}
                isRevealed={revealedIndex >= index}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Status messages */}
        <div className="min-h-[3rem] text-center">
          {!allDone && revealedIndex >= 0 && revealedIndex < cards.length && (
            <motion.p
              key={revealedIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-creamMuted/40 text-[10px] font-mono tracking-wider"
            >
              REVEALING CARD {revealedIndex + 1} OF {cards.length}
            </motion.p>
          )}

          {isLastRevealed && allDone && matched && !eliminated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="px-5 py-2 rounded-full bg-gold/10 border border-gold/20"
            >
              <span className="text-goldGlow text-xs font-mono">
                ✓ Match found! All drawn cards secured.
              </span>
            </motion.div>
          )}

          {isLastRevealed && allDone && eliminated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="px-5 py-2 rounded-full bg-crimson/15 border border-crimson/30"
            >
              <span className="text-crimson text-xs font-mono animate-pulse">
                ☠ {playerName} is ELIMINATED — exceeded 25 card limit!
              </span>
            </motion.div>
          )}

          {isLastRevealed && allDone && !matched && !eliminated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="px-5 py-2 rounded-full bg-cream/5 border border-cream/10"
            >
              <span className="text-creamMuted/60 text-xs font-mono">
                ◈ No match. Deck exhausted.
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Skull / Smiley face reveal */}
      <AnimatePresence>
        {showFace && (
          <motion.div
            key="face-reveal"
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            {/* Particle bursts */}
            {eliminated && <ParticleBurst color="#FF003C" count={20} />}
            {matched && <ParticleBurst color="#E8B84B" count={20} />}
            {!eliminated && !matched && <ParticleBurst color="#C4B89B" count={12} />}

            {/* Large face emoji */}
            <motion.span
              className="text-[100px] sm:text-[140px] md:text-[180px] animate-face-reveal drop-shadow-2xl"
              animate={{
                scale: [1, 1.15, 1],
                rotate: eliminated ? [-5, 5, -3, 3, 0] : [0, -5, 5, 0],
              }}
              transition={{
                scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                delay: 0.5,
              }}
            >
              {faceEmoji}
            </motion.span>

            {/* Text under face */}
            <motion.p
              className="absolute bottom-[15%] text-center text-lg font-display tracking-[0.2em]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              style={{
                color: eliminated ? '#C0392B' : matched ? '#E8B84B' : '#C4B89B',
                textShadow: eliminated
                  ? '0 0 30px rgba(192,57,43,0.3), 0 2px 10px rgba(0,0,0,0.5)'
                  : matched
                    ? '0 0 30px rgba(232,184,75,0.3), 0 2px 10px rgba(0,0,0,0.5)'
                    : '0 0 30px rgba(196,184,155,0.2), 0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {eliminated ? 'ELIMINATED' : matched ? 'SAFE' : 'NO MATCH'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
