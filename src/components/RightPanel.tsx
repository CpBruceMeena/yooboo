'use client';

import EmotePanel from './EmotePanel';
import GameActions from './GameActions';

interface RightPanelProps {
  onDraw: () => void;
  onSkipTurn: () => void;
  onSayUno: () => void;
  onLeave: () => void;
  onEmote: (emote: string) => void;
  disabled?: boolean;
  hasDrawn?: boolean;
  unoEligible?: boolean;
}

export default function RightPanel({ onDraw, onSkipTurn, onSayUno, onLeave, onEmote, disabled, hasDrawn, unoEligible }: RightPanelProps) {
  return (
    <div className="w-48 bg-bgSecondary border-l border-textMuted/10 flex flex-col gap-4 p-4">
      <div>
        <h3 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Actions</h3>
        <GameActions
          onDraw={onDraw}
          onSkipTurn={onSkipTurn}
          onSayUno={onSayUno}
          disabled={disabled}
          hasDrawn={hasDrawn}
          unoEligible={unoEligible}
        />
      </div>
      <div>
        <h3 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Emotes</h3>
        <EmotePanel onEmote={onEmote} />
      </div>
      <div className="mt-auto">
        <button
          onClick={onLeave}
          className="w-full px-3 py-2 rounded-lg bg-danger/20 text-danger text-sm font-semibold hover:bg-danger/30 transition-colors cursor-pointer"
        >
          Leave Game
        </button>
      </div>
    </div>
  );
}