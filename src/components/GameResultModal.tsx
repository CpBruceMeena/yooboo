'use client';

import Modal from './Modal';
import Button from './Button';
import VictoryFireworks from './VictoryFireworks';

interface GameResultModalProps {
  open: boolean;
  winnerName?: string;
  isWinner?: boolean;
  onPlayAgain?: () => void;
  onLeave?: () => void;
}

export default function GameResultModal({ open, winnerName, isWinner, onPlayAgain, onLeave }: GameResultModalProps) {
  return (
    <>
      {/* Fireworks/celebration overlay */}
      <VictoryFireworks isWinner={!!isWinner} show={open} />

      <Modal open={open} title="">
        <div className="text-center">
          {/* Decorative top line */}
          <div className="h-[2px] w-20 mx-auto bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-6 rounded-full" />

          {isWinner ? (
            <div className="text-5xl mb-4 animate-trophy-bounce">🏆</div>
          ) : (
            <div className="text-5xl mb-4 animate-defeat-skull">💀</div>
          )}

          <h3 className={`font-serif text-2xl font-bold mb-2 ${
            isWinner ? 'text-goldGlow animate-win-text-glow' : 'text-cream'
          }`}>
            {isWinner ? 'VICTORY' : 'DEFEAT'}
          </h3>

          <p className="font-serif-alt italic text-creamMuted/60 text-sm mb-3">
            {isWinner ? 'No mercy shown. The table is yours.' : `${winnerName ?? 'Someone'} takes the crown.`}
          </p>

          {/* Decorative divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent my-5" />

          <div className="flex gap-3 justify-center">
            {onPlayAgain && (
              <Button variant="primary" onClick={onPlayAgain}>Play Again</Button>
            )}
            {onLeave && (
              <Button variant="secondary" onClick={onLeave}>Leave Table</Button>
            )}
          </div>

          {/* Bottom decorative line */}
          <div className="h-[2px] w-20 mx-auto bg-gradient-to-r from-transparent via-gold/20 to-transparent mt-6 rounded-full" />
        </div>
      </Modal>
    </>
  );
}
