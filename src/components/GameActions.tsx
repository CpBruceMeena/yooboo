'use client';

import Button from './Button';

interface GameActionsProps {
  onDraw: () => void;
  onSayUno: () => void;
  disabled?: boolean;
  unoEligible?: boolean;
}

export default function GameActions({ onDraw, onSayUno, disabled, unoEligible }: GameActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="primary" onClick={onDraw} disabled={disabled}>
        Draw Card
      </Button>
      {unoEligible && (
        <Button variant="secondary" onClick={onSayUno} disabled={disabled}>
          Say UNO!
        </Button>
      )}
    </div>
  );
}