'use client';

import { useState } from 'react';
import { CardColor, COLORS } from '@/lib/game';
import Modal from './Modal';
import Button from './Button';

interface ChangeColorModalProps {
  open: boolean;
  onSelect: (color: Exclude<CardColor, 'wild'>) => void;
  onCancel?: () => void;
  title?: string;
}

const colorMap: Record<string, string> = {
  red: 'bg-red hover:bg-red/80',
  yellow: 'bg-yellow hover:bg-yellow/80',
  green: 'bg-green hover:bg-green/80',
  blue: 'bg-blue hover:bg-blue/80',
};

export default function ChangeColorModal({ open, onSelect, onCancel, title = 'Choose a Color' }: ChangeColorModalProps) {
  return (
    <Modal open={open} title={title}>
      <div className="flex gap-3 justify-center">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className={`w-14 h-14 rounded-xl ${colorMap[color]} transition-transform hover:scale-110 cursor-pointer`}
          />
        ))}
      </div>
      {onCancel && (
        <div className="flex justify-center mt-4">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        </div>
      )}
    </Modal>
  );
}