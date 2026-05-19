import { Card, GameState, COLORS, MAX_CARDS_BEFORE_ELIMINATION } from './types';
import { recycleDiscardPile } from './createDeck';

export function resolveSmileyDraw(
  state: GameState,
  playerIndex: number,
  targetColor: Exclude<Card['color'], 'wild'>,
): { drawn: Card[]; matched: boolean; eliminated: boolean } {
  const drawn: Card[] = [];
  const player = state.players[playerIndex];
  if (!player || player.isEliminated) return { drawn, matched: false, eliminated: false };

  while (true) {
    if (state.drawPile.length === 0) {
      const recycled = recycleDiscardPile(state.discardPile);
      state.drawPile.push(...recycled);
      if (state.drawPile.length === 0) break;
    }
    const card = state.drawPile.pop();
    if (!card) break;

    player.hand.push(card);
    drawn.push(card);

    // Check elimination: total hand cards (existing + drawn so far) >= 25
    if (player.hand.length >= MAX_CARDS_BEFORE_ELIMINATION) {
      player.isEliminated = true;
      state.smileyActive = false;
      state.smileyColor = null;
      return { drawn, matched: false, eliminated: true };
    }

    if (card.color === targetColor) {
      state.smileyActive = false;
      state.smileyColor = null;
      return { drawn, matched: true, eliminated: false };
    }
  }

  state.smileyActive = false;
  state.smileyColor = null;
  return { drawn, matched: false, eliminated: false };
}