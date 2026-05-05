'use client';

interface DirectionIndicatorProps {
  direction: 1 | -1;
}

export default function DirectionIndicator({ direction }: DirectionIndicatorProps) {
  return (
    <div className="flex items-center gap-1 text-textMuted text-sm">
      <span className="text-lg">{direction === 1 ? '→' : '←'}</span>
      <span>{direction === 1 ? 'Clockwise' : 'Counter'}</span>
    </div>
  );
}