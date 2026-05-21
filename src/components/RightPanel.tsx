'use client';

import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import EmotePanel from './EmotePanel';
import GameActions from './GameActions';

interface ChatMessage {
  playerId: string;
  playerName: string;
  message: string;
}

interface RightPanelProps {
  onDraw: () => void;
  onSkipTurn: () => void;
  onSayUno: () => void;
  onEmote: (emote: string) => void;
  onSendChat: (message: string) => void;
  chatMessages?: ChatMessage[];
  playerId?: string | null;
  disabled?: boolean;
  hasDrawn?: boolean;
  unoEligible?: boolean;
}

/* ── Detect whether a message is a single emoji ── */
const isSingleEmoji = (text: string): boolean => {
  const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u;
  return emojiRegex.test(text.trim());
};

function ChatMessageRow({ msg, isOwn }: { msg: ChatMessage; isOwn: boolean }) {
  const isEmoji = isSingleEmoji(msg.message);

  if (isEmoji) {
    // Emoji-only message — larger, pop-in animation
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.3, y: 20, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 12, mass: 0.8 }}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
      >
        <div className="relative">
          {/* Glow ring behind emoji */}
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0.6, scale: 1.5 }}
            animate={{ opacity: 0, scale: 2.5 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              background: 'radial-gradient(circle, rgba(232,184,75,0.2) 0%, transparent 70%)',
            }}
          />
          <span
            className="relative text-2xl drop-shadow-lg cursor-default"
            title={msg.playerName}
          >
            {msg.message}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] px-2.5 py-1.5 rounded-lg ${
          isOwn
            ? 'bg-gold/15 border border-gold/20 rounded-br-sm'
            : 'bg-[#130E0A]/60 border border-white/5 rounded-bl-sm'
        }`}
      >
        <div className={`flex items-center gap-1.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className={`text-[10px] font-mono font-semibold ${isOwn ? 'text-goldGlow' : 'text-gold/60'}`}>
            {msg.playerName}
          </span>
        </div>
        <p className={`text-xs leading-relaxed mt-0.5 ${isOwn ? 'text-cream' : 'text-creamMuted/80'}`}>
          {msg.message}
        </p>
      </div>
    </motion.div>
  );
}

function ChatBox({ messages, onSend, playerId }: { messages: ChatMessage[]; onSend: (msg: string) => void; playerId?: string | null }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages area — scrollable, fills available space */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1 pr-1 mb-2 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[11px] text-creamMuted/20 font-mono italic">No messages yet...</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <ChatMessageRow key={i} msg={msg} isOwn={msg.playerId === playerId} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div className="flex gap-1.5 items-end shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, 200))}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          maxLength={200}
          className="flex-1 px-2.5 py-1.5 text-xs font-mono text-cream placeholder-creamMuted/15 outline-none bg-transparent"
        />
        <motion.button
          onClick={handleSend}
          whileHover={input.trim() ? { scale: 1.05 } : {}}
          whileTap={input.trim() ? { scale: 0.95 } : {}}
          disabled={!input.trim()}
          className={`px-2 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
            input.trim()
              ? 'text-goldGlow hover:text-gold'
              : 'text-creamMuted/15 cursor-not-allowed'
          }`}
        >
          Send
        </motion.button>
      </div>
    </div>
  );
}

export default function RightPanel({
  onDraw, onSkipTurn, onSayUno,
  onEmote, onSendChat,
  chatMessages = [],
  playerId, disabled, hasDrawn, unoEligible
}: RightPanelProps) {
  return (
    <div className="w-60 bg-bgSecondary/90 border-l border-gold/10 flex flex-col h-full">
      {/* Top section — actions + emotes (tight padding) */}
      <div className="shrink-0 px-3 pt-2.5 pb-3 border-b border-gold/10">
        <div className="mb-3">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-2" />
          <h3 className="text-[10px] font-mono text-creamMuted/50 uppercase tracking-[0.25em] mb-1.5">Actions</h3>
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
          <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-2" />
          <h3 className="text-[10px] font-mono text-creamMuted/50 uppercase tracking-[0.25em] mb-1.5">Emotes</h3>
          <EmotePanel onEmote={onEmote} />
        </div>
      </div>

      {/* Chat — simple vertical list below emotes, fills remaining space */}
      <div className="flex-1 flex flex-col min-h-0 px-3 pb-3">
        <div className="flex-1 min-h-0">
          <ChatBox messages={chatMessages} onSend={onSendChat} playerId={playerId} />
        </div>
      </div>
    </div>
  );
}
