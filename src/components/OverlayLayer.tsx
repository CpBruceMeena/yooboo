'use client';

import { useState } from 'react';
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
  onDiscardSelect: (color: any) => void;
  onPlayAgain?: () => void;
  onLeave?: () => void;
  onCancelColor?: () => void;
  toast?: { message: string; type?: 'info' | 'success' | 'error' } | null;
  onToastDismiss?: () => void;
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