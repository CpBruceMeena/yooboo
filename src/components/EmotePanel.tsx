'use client';

const emotes = ['😊', '😂', '😤', '🔥', '💀', '👋', '🎉', '😈'];

interface EmotePanelProps {
  onEmote: (emote: string) => void;
}

export default function EmotePanel({ onEmote }: EmotePanelProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {emotes.map((emote) => (
        <button
          key={emote}
          onClick={() => onEmote(emote)}
          className="w-8 h-8 flex items-center justify-center text-lg rounded-lg bg-bgTertiary hover:bg-bgTertiary/80 transition-colors cursor-pointer"
        >
          {emote}
        </button>
      ))}
    </div>
  );
}