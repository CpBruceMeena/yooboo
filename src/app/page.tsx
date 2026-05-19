'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

const cardTypes = [
  {
    icon: <span className="text-sm">⟳</span>,
    gradient: 'from-red to-red/70',
    title: 'Reverse',
    desc: 'Flips the direction of play',
  },
  {
    icon: <span className="text-xs font-bold">+2</span>,
    gradient: 'from-green to-green/70',
    title: '+2',
    desc: 'Next player draws 2 cards',
    tag: 'can stack',
  },
  {
    icon: <span className="text-xs font-bold">+4</span>,
    gradient: 'from-wild to-purple-600',
    title: '+4 (Wild)',
    desc: 'Next player draws 4 + choose any color',
    tag: 'can stack',
  },
  {
    icon: <span className="text-xs font-bold">+6</span>,
    gradient: 'from-wild via-purple-500 to-red-500',
    title: '+6 (Wild)',
    desc: 'Next player draws 6 + choose any color',
    tag: 'can stack',
  },
  {
    icon: <span className="text-xs font-bold">+10</span>,
    gradient: 'from-wild via-red-500 to-orange-500',
    title: '+10 (Wild)',
    desc: 'Next player draws 10 + choose any color',
    tag: 'can stack',
  },
  {
    icon: <span className="text-sm">⟳+4</span>,
    gradient: 'from-wild to-purple-600',
    title: 'Reverse +4 (Wild)',
    desc: 'Flips direction + next player draws 4',
    tag: 'can stack',
  },
  {
    icon: <span className="text-sm font-bold">⊘</span>,
    gradient: 'from-blue to-blue/70',
    title: 'Skip Everyone',
    desc: 'You play again (all opponents skipped)',
  },
  {
    icon: <span className="text-xs">🗑</span>,
    gradient: 'from-yellow to-yellow/70',
    title: 'Discard All',
    desc: 'Choose a color — discard ALL cards of that color',
  },
  {
    icon: <span className="text-sm">😊</span>,
    gradient: 'from-pink-400 via-wild to-blue-400',
    title: 'Smiley (Wild)',
    desc: 'Choose a color — next player draws until they hit that color!',
    tag: 'cannot stack',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 } as const,
  },
} as const;

const cardItemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 18 } as const,
  },
} as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 180, damping: 20 } as const,
  },
} as const;

export default function HomePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [rulesOpen, setRulesOpen] = useState(false);

  const handleJoin = () => {
    if (!playerName.trim()) {
      setError('Enter your name first');
      return;
    }
    if (!roomId.trim()) {
      setError('Enter a room code');
      return;
    }
    router.push(`/game?room=${encodeURIComponent(roomId)}&name=${encodeURIComponent(playerName)}`);
  };

  const handleCreate = () => {
    if (!playerName.trim()) {
      setError('Enter your name first');
      return;
    }
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/game?room=${newRoomId}&name=${encodeURIComponent(playerName)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (roomId.trim()) handleJoin();
      else handleCreate();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-bgPrimary relative overflow-hidden px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-wild/5 blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue/5 blur-3xl"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red/3 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        className="bg-bgSecondary/80 backdrop-blur-sm rounded-2xl border border-textMuted/10 p-8 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <motion.div
            className="text-4xl mb-3"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            🎴
          </motion.div>
          <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Uno-No-Mercy</h1>
          <p className="text-textMuted text-sm mt-1.5">No mercy. Last one standing wins.</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-4 py-2.5 rounded-lg bg-danger/15 border border-danger/25 text-danger text-sm font-medium text-center"
          >
            {error}
          </motion.div>
        )}

        <div className="flex flex-col gap-3">
          <div className="space-y-1">
            <label className="text-xs text-textMuted/60 uppercase tracking-wider font-semibold">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => { setPlayerName(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              maxLength={16}
              className="w-full px-4 py-2.5 rounded-lg bg-bgTertiary border border-textMuted/20 text-textPrimary placeholder-textMuted/40 text-sm outline-none focus:border-blue focus:ring-1 focus:ring-blue/30 transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-textMuted/60 uppercase tracking-wider font-semibold">Room Code</label>
            <input
              type="text"
              placeholder="Enter room code"
              value={roomId}
              onChange={(e) => { setRoomId(e.target.value.toUpperCase()); setError(''); }}
              onKeyDown={handleKeyDown}
              maxLength={8}
              className="w-full px-4 py-2.5 rounded-lg bg-bgTertiary border border-textMuted/20 text-textPrimary placeholder-textMuted/40 text-sm outline-none focus:border-blue focus:ring-1 focus:ring-blue/30 transition-all duration-200 font-mono tracking-wider"
            />
          </div>

          <motion.button
            onClick={handleJoin}
            disabled={!playerName.trim() || !roomId.trim()}
            whileHover={playerName.trim() && roomId.trim() ? { scale: 1.02 } : {}}
            whileTap={playerName.trim() && roomId.trim() ? { scale: 0.98 } : {}}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 cursor-pointer
              ${playerName.trim() && roomId.trim()
                ? 'bg-gradient-to-r from-blue to-blue/80 hover:from-blue/90 hover:to-blue/70 text-white shadow-lg shadow-blue/20'
                : 'bg-bgTertiary/50 text-textMuted/40 cursor-not-allowed'
              }`}
          >
            Join Room
          </motion.button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-textMuted/10" />
            <span className="text-textMuted/40 text-xs">or</span>
            <div className="flex-1 h-px bg-textMuted/10" />
          </div>

          <motion.button
            onClick={handleCreate}
            disabled={!playerName.trim()}
            whileHover={playerName.trim() ? { scale: 1.02 } : {}}
            whileTap={playerName.trim() ? { scale: 0.98 } : {}}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 cursor-pointer
              ${playerName.trim()
                ? 'bg-bgTertiary hover:bg-bgTertiary/80 text-textPrimary border border-textMuted/20 hover:border-textMuted/30'
                : 'bg-bgTertiary/30 text-textMuted/40 cursor-not-allowed'
              }`}
          >
            Create New Room
          </motion.button>
        </div>

        <div className="mt-6 pt-4 border-t border-textMuted/5 text-center">
          <p className="text-[11px] text-textMuted/30">Press Enter to join or create a room</p>
        </div>
      </motion.div>

      {/* Rule Book Toggle */}
      <motion.button
        onClick={() => setRulesOpen(!rulesOpen)}
        aria-expanded={rulesOpen}
        className="mt-4 flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-bgSecondary/60 border border-textMuted/10 hover:bg-bgSecondary/80 transition-colors text-sm text-textMuted hover:text-textPrimary w-full max-w-sm cursor-pointer"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="flex items-center gap-2">
          <motion.span
            className="text-base inline-block"
            animate={rulesOpen ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            📖
          </motion.span>
          <span className="font-semibold">Rules &amp; How to Play</span>
        </span>
        <motion.svg
          className="w-4 h-4"
          animate={{ rotate: rulesOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      {/* Rule Book Content */}
      <AnimatePresence>
        {rulesOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="overflow-hidden w-full max-w-sm"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-2 px-4 py-4 rounded-xl bg-bgSecondary/40 border border-textMuted/5 text-sm text-textMuted space-y-5 max-h-[55vh] overflow-y-auto scrollbar-thin"
            >
              {/* Goal */}
              <motion.section variants={sectionVariants}>
                <h3 className="text-textPrimary font-bold text-sm mb-2 flex items-center gap-2">
                  <motion.span
                    className="inline-block"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🎯
                  </motion.span>
                  Goal
                </h3>
                <p className="text-textMuted/80 text-xs leading-relaxed">
                  Be the first to reach <strong className="text-textPrimary">0 cards</strong> or be the <strong className="text-textPrimary">last player standing</strong>.
                  Eliminated when you reach <strong className="text-danger">≥ 25 cards</strong>.
                </p>
              </motion.section>

              {/* How to Play */}
              <motion.section variants={sectionVariants}>
                <h3 className="text-textPrimary font-bold text-sm mb-2 flex items-center gap-2">
                  <motion.span
                    className="inline-block"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🎮
                  </motion.span>
                  How to Play
                </h3>
                <ol className="text-xs text-textMuted/80 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Match the top card on the discard pile by <strong className="text-textPrimary">color</strong> or <strong className="text-textPrimary">type</strong>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    If you can&apos;t play, draw a card — then you may play any card
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Play all your cards to win!
                  </motion.li>
                </ol>
              </motion.section>

              {/* Card Types */}
              <motion.section variants={sectionVariants}>
                <h3 className="text-textPrimary font-bold text-sm mb-2 flex items-center gap-2">
                  <motion.span
                    className="inline-block"
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🃏
                  </motion.span>
                  Card Types
                </h3>
                <motion.div
                  className="space-y-1.5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {cardTypes.map((card, i) => (
                    <motion.div
                      key={i}
                      variants={cardItemVariants}
                      whileHover={{
                        x: 4,
                        scale: 1.02,
                        transition: { type: 'spring', stiffness: 300, damping: 15 },
                      }}
                      className="flex items-start gap-2.5 p-2 rounded-lg bg-bgTertiary/30 hover:bg-bgTertiary/50 cursor-default transition-colors"
                    >
                      <motion.span
                        className={`shrink-0 w-7 h-7 rounded-md bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-xs font-bold shadow`}
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                        transition={{ duration: 0.4 }}
                      >
                        {card.icon}
                      </motion.span>
                      <div>
                        <span className="text-textPrimary text-xs font-semibold">{card.title}</span>
                        <p className="text-textMuted/60 text-[11px]">
                          {card.desc}
                          {card.tag && (
                            <span className="text-textMuted/40"> ({card.tag})</span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>

              {/* Stacking Rules */}
              <motion.section variants={sectionVariants}>
                <h3 className="text-textPrimary font-bold text-sm mb-2 flex items-center gap-2">
                  <motion.span
                    className="inline-block"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    📐
                  </motion.span>
                  Stacking Rules
                </h3>
                <p className="text-xs text-textMuted/80 mb-2 leading-relaxed">
                  When a <strong className="text-textPrimary">+2, +4, +6, +10, or Reverse+4</strong> is played, the next player can
                  {' '}<strong className="text-textPrimary">counter-stack</strong> with the <strong className="text-textPrimary">same card type</strong>.
                </p>
                <motion.div
                  className="text-xs bg-bgTertiary/40 p-2.5 rounded-lg text-textMuted/70 leading-relaxed"
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(36, 43, 56, 0.6)' }}
                >
                  <p className="font-medium text-textPrimary mb-1">Example:</p>
                  <p>Player A plays +4 → B plays +4 → C draws <strong className="text-textPrimary">8 cards!</strong></p>
                </motion.div>
                <ul className="text-xs text-textMuted/80 mt-2 space-y-1 list-disc list-inside leading-relaxed">
                  <motion.li
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="text-success">✓</span> <strong className="text-textPrimary">Skip Everyone</strong> cannot be played during a stack
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-success">✓</span> <strong className="text-textPrimary">Discard All</strong> cannot be played during a stack
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-success">✓</span> <strong className="text-textPrimary">Smiley</strong> can be played during a stack (passes it forward)
                  </motion.li>
                </ul>
              </motion.section>

              {/* Turns */}
              <motion.section variants={sectionVariants}>
                <h3 className="text-textPrimary font-bold text-sm mb-2 flex items-center gap-2">
                  <motion.span
                    className="inline-block"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    🔄
                  </motion.span>
                  Turn Structure
                </h3>
                <ol className="text-xs text-textMuted/80 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Play a matching card (same color, type, or value)
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Or <strong className="text-textPrimary">draw 1 card</strong> — then you may play any card from your hand
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    If you&apos;re under a stack, you can counter-stack or draw the full penalty
                  </motion.li>
                </ol>
              </motion.section>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
