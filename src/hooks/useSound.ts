'use client';

import { useCallback, useRef } from 'react';

type SoundType = 'card_play' | 'card_draw' | 'reverse' | 'yooboo' | 'special' | 'turn';

export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const play = useCallback((type: SoundType) => {
    try {
      const ctx = getCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      switch (type) {
        case 'card_play':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(660, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
          break;

        case 'card_draw':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
          break;

        case 'reverse': {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.linearRampToValueAtTime(600, now + 0.1);
          osc.frequency.linearRampToValueAtTime(300, now + 0.2);
          osc.frequency.linearRampToValueAtTime(500, now + 0.3);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        }

        case 'yooboo': {
          osc.type = 'square';
          osc.frequency.setValueAtTime(523, now); // C5
          osc.frequency.setValueAtTime(659, now + 0.12); // E5
          osc.frequency.setValueAtTime(784, now + 0.24); // G5
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        }

        case 'special': {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }

        case 'turn': {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(660, now + 0.06);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }
      }
    } catch {
      // Audio not available — silently ignore
    }
  }, [getCtx]);

  return { play };
}
