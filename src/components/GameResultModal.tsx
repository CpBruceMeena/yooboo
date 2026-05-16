'use client';

import Modal from './Modal';
import Button from './Button';

interface GameResultModalProps {
  open: boolean;
  winnerName?: string;
  isWinner?: boolean;
  onPlayAgain?: () => void;
  onLeave?: () => void;
}

export default function GameResultModal({ open, winnerName, isWinner, onPlayAgain, onLeave }: GameResultModalProps) {
  return (
    <Modal open={open} title="Game Over">
      <div className="text-center">
        <div className="text-4xl mb-3">{isWinner ? '🏆' : '😔'}</div>
        <p className="text-textPrimary text-lg font-bold mb-1">
          {isWinner ? 'You Win!' : `${winnerName ?? 'Someone'} Wins!`}
        </p>
        <p className="text-textMuted text-sm mb-6">
          {isWinner ? 'No mercy shown. Well played.' : 'Better luck next time.'}
        </p>
        <div className="flex gap-3 justify-center">
          {onPlayAgain && (
            <Button variant="primary" onClick={onPlayAgain}>Play Again</Button>
          )}
          {onLeave && (
            <Button variant="secondary" onClick={onLeave}>Leave</Button>
          )}
        </div>
      </div>
    </Modal>
  );
}