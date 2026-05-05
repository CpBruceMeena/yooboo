'use client';

interface TopBarProps {
  roomId?: string;
  currentPlayer?: string;
  direction?: 'clockwise' | 'counter';
  stackValue?: number;
}

export default function TopBar({ roomId, currentPlayer, direction, stackValue }: TopBarProps) {
  return (
    <div className="h-12 bg-bgSecondary border-b border-textMuted/10 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-bold text-textPrimary">Uno-No-Mercy</h1>
        {roomId && (
          <span className="text-xs text-textMuted">Room: {roomId}</span>
        )}
      </div>
      <div className="flex items-center gap-4 text-xs text-textMuted">
        {currentPlayer && (
          <span>Turn: <span className="text-textPrimary font-semibold">{currentPlayer}</span></span>
        )}
        {direction && (
          <span>{direction === 'clockwise' ? '→' : '←'} {direction}</span>
        )}
        {stackValue && stackValue > 0 ? (
          <span className="text-danger font-bold">Stack: {stackValue}</span>
        ) : null}
      </div>
    </div>
  );
}