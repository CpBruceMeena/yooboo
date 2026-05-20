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
          className="w-8 h-8 flex items-center justify-center text-lg rounded-lg bg-[#130E0A]/60 hover:bg-[#130E0A] border border-white/5 hover:border-gold/20 transition-all cursor-pointer"
        >
          {emote}
        </button>
      ))}
    </div>
  );
}