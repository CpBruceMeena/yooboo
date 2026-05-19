'use client';

interface TopBarProps {
  roomId?: string;
  currentPlayer?: string;
  direction?: 'clockwise' | 'counter';
  stackValue?: number;
}

export default function TopBar({ roomId, currentPlayer, direction, stackValue }: TopBarProps) {
  return (
    <div className="h-14 bg-gradient-to-r from-bgSecondary to-bgPrimary border-b border-textMuted/10 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎴</span>
          <h1 className="text-sm font-bold text-textPrimary tracking-wide">Uno-No-Mercy</h1>
        </div>
        {roomId && (
          <span className="px-2.5 py-1 rounded-md bg-bgTertiary/60 border border-textMuted/10 text-xs text-textMuted font-mono">
            {roomId}
          </span>
        )}
      </div>
      <div className="flex items-center gap-5 text-xs text-textMuted">
        {currentPlayer && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            <span>Turn: <span className="text-textPrimary font-semibold">{currentPlayer}</span></span>
          </div>
        )}
        {direction && (
          <span className="flex items-center gap-1">
            <span className="text-sm">{direction === 'clockwise' ? '↻' : '↺'}</span>
          </span>
        )}
        {stackValue != null && stackValue > 0 && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-danger/15 border border-danger/30 text-danger font-bold text-xs">
            <span>⚡</span>
            <span>Stack: {stackValue}</span>
          </span>
        )}
      </div>
    </div>
  );
}