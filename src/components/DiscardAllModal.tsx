'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card as CardType, CardColor, COLORS } from '@/lib/game';
import Modal from './Modal';
import Card from './Card';

interface DiscardAllModalProps {
  open: boolean;
  hand: CardType[];
  presetColor: Exclude<CardColor, 'wild'> | null;
  onSelect: (color: Exclude<CardColor, 'wild'>, cardIds?: string[]) => void;
}

const colorMap: Record<string, string> = {
  red: 'bg-red hover:bg-red/80 shadow-[0_0_12px_rgba(228,71,71,0.3)]',
  yellow: 'bg-yellow hover:bg-yellow/80 shadow-[0_0_12px_rgba(243,199,66,0.3)]',
  green: 'bg-green hover:bg-green/80 shadow-[0_0_12px_rgba(51,181,107,0.3)]',
  blue: 'bg-blue hover:bg-blue/80 shadow-[0_0_12px_rgba(52,120,246,0.3)]',
};

const activeRing: Record<string, string> = {
  red: 'ring-2 ring-red',
  yellow: 'ring-2 ring-yellow',
  green: 'ring-2 ring-green',
  blue: 'ring-2 ring-blue',
};

export default function DiscardAllModal({ open, hand, presetColor, onSelect }: DiscardAllModalProps) {
  const [selectedColor, setSelectedColor] = useState<Exclude<CardColor, 'wild'> | null>(null);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  // Auto-select the preset color when modal opens
  const isPreset = presetColor !== null;
  useEffect(() => {
    if (open && presetColor) {
      setSelectedColor(presetColor);
      const colorCards = hand.filter((c) => c.color === presetColor).map((c) => c.id);
      setSelectedCardIds(colorCards);
    } else if (!open) {
      setSelectedColor(null);
      setSelectedCardIds([]);
    }
  }, [open, presetColor, hand]);

  const matchingCards = useMemo(() => {
    if (!selectedColor) return [];
    return hand.filter((c) => c.color === selectedColor);
  }, [hand, selectedColor]);

  const handleColorClick = (color: Exclude<CardColor, 'wild'>) => {
    if (isPreset) return; // color is fixed from the card
    if (selectedColor === color) {
      setSelectedColor(null);
      setSelectedCardIds([]);
    } else {
      setSelectedColor(color);
      const colorCards = hand.filter((c) => c.color === color).map((c) => c.id);
      setSelectedCardIds(colorCards);
    }
  };

  const toggleCard = (cardId: string) => {
    setSelectedCardIds((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId],
    );
  };

  const handleConfirm = () => {
    if (!selectedColor) return;
    onSelect(selectedColor, selectedCardIds);
    setSelectedColor(null);
    setSelectedCardIds([]);
  };

  const handleCancel = () => {
    setSelectedColor(null);
    setSelectedCardIds([]);
  };

  return (      <Modal
        open={open}
        title="Discard — Select Cards to Discard"
        onClose={handleCancel}
      >
        <p className="text-textMuted text-sm mb-4 text-center">
          Select cards of <span className={`font-semibold ${presetColor === 'yellow' ? 'text-black' : 'text-white'}`}>{presetColor?.toUpperCase()}</span> to discard, or play the card alone.
        </p>

      {/* Color indicator — preset from card or picker for legacy */}
      {isPreset ? (
        <div className="flex gap-3 justify-center mb-5">
          <div className={`w-12 h-12 rounded-xl ${colorMap[presetColor ?? '']} scale-110 ring-2 ring-white flex items-center justify-center`}>
            <span className="text-white text-[10px] font-bold uppercase tracking-wider">{presetColor}</span>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 justify-center mb-5">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleColorClick(color)}
              className={`w-12 h-12 rounded-xl transition-all duration-200 cursor-pointer ${
                colorMap[color]
              } ${selectedColor === color ? 'scale-110 ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
            />
          ))}
        </div>
      )}

      {/* Cards of selected color */}
      {selectedColor && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-textMuted uppercase tracking-wider">
              {selectedColor.toUpperCase()} cards ({matchingCards.length})
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCardIds(matchingCards.map((c) => c.id))}
                className="text-[10px] text-accent hover:text-accent/80 font-mono uppercase tracking-wider cursor-pointer"
              >
                All
              </button>
              <button
                onClick={() => setSelectedCardIds([])}
                className="text-[10px] text-textMuted hover:text-textPrimary font-mono uppercase tracking-wider cursor-pointer"
              >
                None
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center max-h-48 overflow-y-auto scrollbar-thin p-2 rounded-lg bg-bgTertiary/30">
            {matchingCards.length === 0 ? (
              <p className="text-textMuted/50 text-xs py-4">No {selectedColor} cards to discard</p>
            ) : (
              matchingCards.map((card) => {
                const isSelected = selectedCardIds.includes(card.id);
                return (
                  <button
                    key={card.id}
                    onClick={() => toggleCard(card.id)}
                    className={`transition-all duration-200 cursor-pointer ${
                      isSelected ? 'scale-105' : 'opacity-50 grayscale-[40%] hover:opacity-80 hover:grayscale-[20%]'
                    }`}
                  >
                    <div className={`rounded-xl ${isSelected ? activeRing[selectedColor] : 'ring-1 ring-white/10'}`}>
                      <Card
                        type={card.type}
                        color={card.color}
                        value={card.value}
                        size="sm"
                        state={isSelected ? 'selected' : 'disabled'}
                      />
                    </div>
                  </button>
                );
              })
            )}
          </div>
          {selectedCardIds.length > 0 && (
            <p className="text-[10px] text-textMuted/60 text-center mt-2 font-mono">
              {selectedCardIds.length} of {matchingCards.length} selected
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <button
          onClick={handleConfirm}
          disabled={!selectedColor}
          className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer ${
            selectedColor
              ? 'bg-gradient-to-r from-neonPink to-neonOrange text-white shadow-lg'
              : 'bg-bgTertiary/50 text-textMuted/30 cursor-not-allowed'
          }`}
        >
          {selectedCardIds.length > 0 ? `Discard ${selectedCardIds.length}` : 'Play Card Only'}
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2.5 rounded-lg bg-bgTertiary/80 hover:bg-bgTertiary text-textPrimary border border-white/10 hover:border-white/20 transition-all cursor-pointer text-sm"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
