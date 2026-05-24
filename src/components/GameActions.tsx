'use client';

import Button from './Button';

interface GameActionsProps {
  onDraw: () => void;
  onSkipTurn: () => void;
  onSayYooboo: () => void;
  disabled?: boolean;
  hasDrawn?: boolean;
  yoobooEligible?: boolean;
}

export default function GameActions({ onDraw, onSkipTurn, onSayYooboo, disabled, hasDrawn, yoobooEligible }: GameActionsProps) {
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
      {yoobooEligible && (
        <Button variant="secondary" onClick={onSayYooboo} disabled={disabled}>
          Say YOOBOO!
        </Button>
      )}
    </div>
  );
}