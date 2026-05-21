'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/* ── Confetti piece ── */
function ConfettiPiece({ index, isWinner }: { index: number; isWinner: boolean }) {
  const params = useMemo(() => {
    const colors = isWinner
      ? ['#E8B84B', '#C9952A', '#FFD60A', '#FFFFFF', '#FF003C']
      : ['#C0392B', '#8B0000', '#FF6B6B', '#666666', '#444444'];
    return {
      color: colors[index % colors.length],
      x: (Math.random() - 0.5) * 300,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      rot: Math.random() * 720,
      size: 4 + Math.random() * 6,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
      fallY: 100 + Math.random() * 200,
      driftX: (Math.random() - 0.5) * 80,
    };
  }, [index, isWinner]);

  return (
    <motion.div
      className="absolute top-0 pointer-events-none"
      style={{ left: `calc(50% + ${params.x}px)` }}
      initial={{ y: -20, opacity: 0, rotate: 0, x: 0 }}
      animate={{
        y: [0, params.fallY],
        x: [0, params.driftX],
        opacity: [0, 1, 0.8, 0],
        rotate: params.rot,
      }}
      transition={{
        duration: params.duration,
        delay: params.delay,
        ease: 'easeIn',
        times: [0, 0.1, 0.5, 1],
      }}
    >
      <div
        className={params.shape === 'circle' ? 'rounded-full' : 'rounded-sm'}
        style={{
          width: params.size,
          height: params.size * (params.shape === 'rect' ? 0.5 : 1),
          backgroundColor: params.color,
          boxShadow: `0 0 ${params.size}px ${params.color}40`,
        }}
      />
    </motion.div>
  );
}

/* ── Firework burst ── */
function FireworkBurst({ x, y, delay, color }: { x: number; y: number; delay: number; color: string }) {
  const particles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const dist = 30 + Math.random() * 40;
      return {
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        size: 2 + Math.random() * 3,
      };
    });
  }, []);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 1.5, 0] }}
        transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      >
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: color,
              boxShadow: `0 0 ${p.size * 2}px ${color}`,
              left: 0,
              top: 0,
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: p.tx,
              y: p.ty,
              opacity: [1, 0.8, 0],
            }}
            transition={{
              duration: 0.6,
              delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ── Floating gold particles (victory only) ── */
function GoldParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      size: 2 + Math.random() * 4,
      driftX: (Math.random() - 0.5) * 60,
      driftY: -(40 + Math.random() * 80),
      duration: 3 + Math.random() * 2,
      repeatDelay: Math.random() * 3,
    }));
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            bottom: '10%',
            backgroundColor: '#E8B84B',
            boxShadow: `0 0 ${p.size * 3}px rgba(232,184,75,0.3)`,
          }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            y: p.driftY,
            x: p.driftX,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: p.repeatDelay,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}

/* ── Canvas-style defeat skull particles ── */
function SkullParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return {
        tx: Math.cos(angle) * (50 + Math.random() * 40),
        ty: Math.sin(angle) * (50 + Math.random() * 40),
        size: 2 + Math.random() * 4,
        delay: Math.random() * 0.3,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: '#C0392B',
            boxShadow: `0 0 ${p.size * 2}px rgba(192,57,43,0.3)`,
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: p.tx,
            y: p.ty,
            opacity: [1, 0.5, 0],
          }}
          transition={{
            duration: 0.8,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

interface VictoryFireworksProps {
  isWinner: boolean;
  show: boolean;
}

export default function VictoryFireworks({ isWinner, show }: VictoryFireworksProps) {
  // Firework launch positions — deterministic placement
  const fireworks = useMemo(() => {
    return [
      { x: 15, y: 25, delay: 0.2, color: '#E8B84B' },
      { x: 50, y: 20, delay: 0.6, color: '#FFD60A' },
      { x: 85, y: 30, delay: 1.0, color: '#FF003C' },
      { x: 30, y: 35, delay: 1.5, color: '#00D4FF' },
      { x: 70, y: 22, delay: 2.0, color: '#E8B84B' },
      { x: 50, y: 40, delay: 2.8, color: '#FF6B00' },
    ];
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-40 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Confetti pieces */}
          {Array.from({ length: isWinner ? 30 : 15 }).map((_, i) => (
            <ConfettiPiece key={`confetti-${i}`} index={i} isWinner={isWinner} />
          ))}

          {/* Firework bursts (winner only) */}
          {isWinner && fireworks.map((fw, i) => (
            <FireworkBurst key={`firework-${i}`} {...fw} />
          ))}

          {/* Floating gold particles (winner only) */}
          {isWinner && <GoldParticles />}

          {/* Skull particles (defeat only) */}
          {!isWinner && <SkullParticles />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
