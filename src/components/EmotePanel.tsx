'use client';

import { motion } from 'motion/react';
import { useState } from 'react';

const emotes = ['😊', '😂', '😤', '🔥', '💀', '👋', '🎉', '😈', '🤡', '👑', '💯', '✨', '🙏', '🫵', '🃏', '⚡', '💪', '🫡'];

interface EmotePanelProps {
  onEmote: (emote: string) => void;
}

function EmoteButton({ emote, onClick }: { emote: string; onClick: () => void }) {
  const [pop, setPop] = useState(false);

  const handleClick = () => {
    setPop(true);
    onClick();
    setTimeout(() => setPop(false), 300);
  };

  return (
    <motion.button
      key={emote}
      onClick={handleClick}
      whileHover={{ scale: 1.25, y: -2 }}
      whileTap={{ scale: 0.85 }}
      animate={pop ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : {}}
      transition={{ type: 'keyframes', duration: 0.3, ease: 'easeOut' }}
      className="w-8 h-8 flex items-center justify-center text-lg rounded-lg bg-[#130E0A]/60 hover:bg-[#130E0A] border border-white/5 hover:border-gold/20 transition-colors cursor-pointer select-none"
    >
      {emote}
    </motion.button>
  );
}

export default function EmotePanel({ onEmote }: EmotePanelProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {emotes.map((emote) => (
        <EmoteButton key={emote} emote={emote} onClick={() => onEmote(emote)} />
      ))}
    </div>
  );
}