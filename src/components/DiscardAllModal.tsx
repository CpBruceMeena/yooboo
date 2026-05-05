'use client';

import { CardColor, COLORS } from '@/lib/game';
import Modal from './Modal';
import Button from './Button';

interface DiscardAllModalProps {
  open: boolean;
  onSelect: (color: Exclude<CardColor, 'wild'>) => void;
}

const colorMap: Record<string, string> = {
  red: 'bg-red hover:bg-red/80',
  yellow: 'bg-yellow hover:bg-yellow/80',
  green: 'bg-green hover:bg-green/80',
  blue: 'bg-blue hover:bg-blue/80',
};

export default function DiscardAllModal({ open, onSelect }: DiscardAllModalProps) {
  return (
    <Modal open={open} title="Discard All — Pick a Color">
      <p className="text-textMuted text-sm mb-4 text-center">
        Discard all cards matching this color from your hand.
      </p>
      <div className="flex gap-3 justify-center">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className={`w-14 h-14 rounded-xl ${colorMap[color]} transition-transform hover:scale-110 cursor-pointer`}
          />
        ))}
      </div>
    </Modal>
  );
}