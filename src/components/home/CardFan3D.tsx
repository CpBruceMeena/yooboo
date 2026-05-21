'use client';

import { useRef } from 'react';
import { motion, useSpring } from 'motion/react';
import Card from '@/components/Card';

interface CardData {
  id: number;
  type: 'number' | 'plus2' | 'plus4' | 'plus6' | 'plus10' | 'reverse4' | 'skipEveryone' | 'smiley';
  color: 'red' | 'yellow' | 'green' | 'blue' | 'wild';
  value?: number;
}

const cards: CardData[] = [
  { id: 0, type: 'plus4', color: 'wild' },
  { id: 1, type: 'plus6', color: 'wild' },
  { id: 2, type: 'number', color: 'green', value: 7 },
  { id: 3, type: 'number', color: 'blue', value: 0 },
  { id: 4, type: 'plus2', color: 'red' },
  { id: 5, type: 'smiley', color: 'wild' },
  { id: 6, type: 'plus10', color: 'wild' },
];

const ENTRY_DELAY = 0.08;
const FAN_ANGLE = 12;
const CARD_WIDTH = 112;  // w-28 = 7rem = 112px
const CARD_HEIGHT = 164; // xl height

export default function CardFan3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax values
  const rotateX = useSpring(0, { stiffness: 100, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
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
      className="relative w-full max-w-[600px] mx-auto overflow-visible"
      style={{ perspective: '1200px', height: CARD_HEIGHT + 50 }}
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
                y: -8,
                transition: { type: 'spring', stiffness: 200, damping: 15 },
              }}
              className="absolute cursor-pointer"
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                transformStyle: 'preserve-3d',
                transform: `rotate(${rotation}deg) translateY(${yOffset}px) translateZ(${zOffset}px)` as any,
                zIndex: i,
              }}
            >
              <Card
                type={card.type}
                color={card.color}
                value={card.value}
                size="xl"
                state="default"
              />

              {/* Bottom shadow on hover */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[85%] h-6 rounded-full blur-lg pointer-events-none"
                initial={{ opacity: 0.08 }}
                whileHover={{ opacity: 0.2 }}
                style={{ background: card.color === 'wild' ? '#7A4DFF' : `var(--color-${card.color})` }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
