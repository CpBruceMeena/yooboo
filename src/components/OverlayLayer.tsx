'use client';

import { useState } from 'react';
import { Card as CardType, CardColor } from '@/lib/game';
import ChangeColorModal from './ChangeColorModal';
import DiscardAllModal from './DiscardAllModal';
import GameResultModal from './GameResultModal';
import Toast from './Toast';

interface OverlayLayerProps {
  showChangeColor: boolean;
  showDiscardAll: boolean;
  showGameResult: boolean;
  gameResult?: { winnerName?: string; isWinner?: boolean };
  onColorSelect: (color: any) => void;
  onDiscardSelect: (color: any, cardIds?: string[]) => void;
  onPlayAgain?: () => void;
  onLeave?: () => void;
  onCancelColor?: () => void;
  toast?: { message: string; type?: 'info' | 'success' | 'error' } | null;
  onToastDismiss?: () => void;
  discardHandCards?: CardType[];
  discardPresetColor?: string | null;
}

export default function OverlayLayer({
  showChangeColor,
  showDiscardAll,
  showGameResult,
  gameResult,
  onColorSelect,
  onDiscardSelect,
  onPlayAgain,
  onLeave,
  onCancelColor,
  toast,
  onToastDismiss,
  discardHandCards = [],
  discardPresetColor = null,
}: OverlayLayerProps) {
  return (
    <>
      <ChangeColorModal
        open={showChangeColor}
        onSelect={onColorSelect}
        onCancel={onCancelColor}
      />
      <DiscardAllModal
        open={showDiscardAll}
        hand={discardHandCards}
        presetColor={discardPresetColor as Exclude<CardColor, 'wild'> | null}
        onSelect={onDiscardSelect}
      />
      <GameResultModal
        open={showGameResult}
        winnerName={gameResult?.winnerName}
        isWinner={gameResult?.isWinner}
        onPlayAgain={onPlayAgain}
        onLeave={onLeave}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={onToastDismiss}
        />
      )}
    </>
  );
}