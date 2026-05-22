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

/* ── RevealCard — pops in with dramatic entrance (no DOM for unrevealed cards) ── */
function RevealCard({ card, index }: { card: CardType; index: number }) {
  return (
    <motion.div
      className="relative shrink-0"
      style={{ width: 64, height: 96 }}
      initial={{ scale: 0.3, opacity: 0, y: 20, rotate: -15 }}
      animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 22,
        mass: 0.7,
        delay: index * 0.15,
      }}
    >
      <Card type={card.type} color={card.color} value={card.value} size="sm" state="default" />

      {/* Reveal flare */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 via-transparent to-transparent"
        initial={{ opacity: 0.8, scale: 1.1 }}
        animate={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      />

      {/* Glow ring */}
      <motion.div
        className="absolute -inset-2 rounded-xl border-2 border-goldGlow/30 z-10 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.2, 1.5] }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      />
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
          const delay = 1000 + Math.random() * 1000; // 1–2 seconds between reveals
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
            {!eliminated && '◈ SMILEY DRAW'}
          </motion.p>

          {/* Player name with gold underline */}
          <h3 className="font-display text-3xl text-cream tracking-wider gold-text-shadow">{playerName}</h3>
          <div className="h-[1px] w-24 mx-auto mt-2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </motion.div>

        {/* Card reveal area — always visible once revealed, never hidden */}
        <div className="flex flex-wrap justify-center gap-2 min-h-[110px] items-center py-4 relative">
          {cards.length === 0 && !showFace && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-creamMuted/40 text-sm font-mono tracking-wider"
            >
              No cards drawn...
            </motion.p>
          )}

          {/* Only render cards that have been revealed — no "?" placeholders, no way to count total */}
          {cards.slice(0, revealedIndex + 1).map((card, index) => (
            <RevealCard key={card.id} card={card} index={index} />
          ))}
        </div>

        {/* Status messages — no count display, just reveal one by one silently */}
        <div className="min-h-[3rem] text-center">
          {isLastRevealed && allDone && matched && !eliminated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="px-5 py-2 rounded-full bg-gold/10 border border-gold/20"
            >
              <span className="text-goldGlow text-xs font-mono">
                ◈ Cards secured.
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

      {/* Face emoji — appears as a watermark behind the cards, never covering them */}
      <AnimatePresence>
        {showFace && (
          <motion.div
            key="face-reveal"
            className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Particle bursts — behind cards */}
            {eliminated && <ParticleBurst color="#FF003C" count={20} />}
            {matched && <ParticleBurst color="#E8B84B" count={20} />}
            {!eliminated && !matched && <ParticleBurst color="#C4B89B" count={12} />}

            {/* Large face emoji — subtle background presence */}
            <motion.span
              className="text-[120px] sm:text-[160px] md:text-[200px] drop-shadow-2xl opacity-40"
              animate={{
                scale: [1, 1.1, 1],
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
