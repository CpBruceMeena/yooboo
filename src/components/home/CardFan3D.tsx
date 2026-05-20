'use client';

import { useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface CardData {
  id: number;
  label: string;
  color: string;
  textColor?: string;
  special?: boolean;
}

const cards: CardData[] = [
  { id: 0, label: '+4', color: '#7A4DFF', special: true },
  { id: 1, label: '+6', color: '#E44747', special: true },
  { id: 2, label: '7', color: '#33B56B' },
  { id: 3, label: '0', color: '#3478F6' },
  { id: 4, label: '+2', color: '#E44747' },
  { id: 5, label: '☺', color: '#FF2E9A', special: true },
  { id: 6, label: '+10', color: '#7A4DFF', special: true },
];

const ENTRY_DELAY = 0.08;
const FAN_ANGLE = 12;
const CARD_WIDTH = 110;
const CARD_HEIGHT = 160;

export default function CardFan3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(0, { stiffness: 100, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    rotateY.set(x * 8);
    rotateX.set(-y * 6);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const totalCards = cards.length;
  const middle = (totalCards - 1) / 2;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[560px] mx-auto overflow-hidden"
      style={{ perspective: '1200px', height: CARD_HEIGHT + 60 }}
    >
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {cards.map((card, i) => {
          const offset = i - middle;
          const rotation = offset * FAN_ANGLE;
          const yOffset = Math.abs(offset) * 4;
          const zOffset = -Math.abs(offset) * 10;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 100, rotate: rotation + 15 }}
              animate={{ opacity: 1, y: 0, rotate: rotation }}
              transition={{
                delay: i * ENTRY_DELAY,
                type: 'spring',
                stiffness: 60,
                damping: 14,
                mass: 1,
              }}
              whileHover={{
                y: -20,
                scale: 1.12,
                rotate: rotation,
                zIndex: 50,
                transition: { type: 'spring', stiffness: 300, damping: 18 },
              }}
              className="absolute cursor-pointer"
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                transformStyle: 'preserve-3d',
                transform: `rotate(${rotation}deg) translateY(${yOffset}px) translateZ(${zOffset}px)`,
                zIndex: i,
              }}
            >
              {/* Card body */}
              <div
                className="w-full h-full rounded-xl border border-white/15 overflow-hidden relative flex flex-col items-center justify-center"
                style={{
                  background: `linear-gradient(145deg, ${card.color}dd, ${card.color}88)`,
                  boxShadow: `
                    0 4px 6px -1px rgba(0,0,0,0.3),
                    0 8px 15px -3px rgba(0,0,0,0.2),
                    inset 0 1px 0 rgba(255,255,255,0.15),
                    inset 0 -1px 0 rgba(0,0,0,0.15)
                  `,
                }}
              >
                {/* Edge highlight */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                {/* Top-left label */}
                <span
                  className="absolute top-2 left-2.5 text-[10px] font-bold leading-none"
                  style={{ color: card.textColor || 'rgba(255,255,255,0.9)' }}
                >
                  {card.label}
                </span>

                {/* Center icon */}
                <span
                  className="text-[32px] font-black leading-none drop-shadow-lg"
                  style={{
                    color: card.textColor || 'white',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {card.label}
                </span>

                {/* Special badge */}
                {card.special && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <span className="text-[7px] font-mono tracking-wider text-white/50 uppercase bg-black/20 px-2 py-0.5 rounded-full">
                      WILD
                    </span>
                  </div>
                )}

                {/* Glass reflection */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/8 to-transparent rounded-t-xl pointer-events-none" />
              </div>

              {/* Bottom shadow */}
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[90%] h-8 rounded-full blur-xl opacity-20 pointer-events-none"
                style={{ background: card.color }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
