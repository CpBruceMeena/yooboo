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
    <div className="w-48 bg-bgSecondary/90 border-l border-gold/10 flex flex-col gap-4 p-4">
      <div>
        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-3" />
        <h3 className="text-[10px] font-mono text-creamMuted/50 uppercase tracking-[0.25em] mb-2">Actions</h3>
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
        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-3" />
        <h3 className="text-[10px] font-mono text-creamMuted/50 uppercase tracking-[0.25em] mb-2">Emotes</h3>
        <EmotePanel onEmote={onEmote} />
      </div>
      <div className="mt-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-3" />
        <button
          onClick={onLeave}
          className="w-full px-3 py-2.5 rounded-lg bg-crimson/15 text-crimson text-sm font-semibold hover:bg-crimson/25 transition-colors cursor-pointer border border-crimson/20"
        >
          Leave Game
        </button>
      </div>
    </div>
  );
}