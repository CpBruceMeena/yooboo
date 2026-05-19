'use client';

import Button from './Button';

interface GameActionsProps {
  onDraw: () => void;
  onSkipTurn: () => void;
  onSayUno: () => void;
  disabled?: boolean;
  hasDrawn?: boolean;
  unoEligible?: boolean;
}

export default function GameActions({ onDraw, onSkipTurn, onSayUno, disabled, hasDrawn, unoEligible }: GameActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      {hasDrawn ? (
        <Button variant="secondary" onClick={onSkipTurn} disabled={disabled}>
          Skip Turn
        </Button>
      ) : (
        <Button variant="primary" onClick={onDraw} disabled={disabled}>
          Draw Card
        </Button>
      )}
      {unoEligible && (
        <Button variant="secondary" onClick={onSayUno} disabled={disabled}>
          Say UNO!
        </Button>
      )}
    </div>
  );
}