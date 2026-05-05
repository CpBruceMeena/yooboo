import { Card, GameState } from './types';
import { recycleDiscardPile } from './createDeck';

export function resolveStack(state: GameState, playerIndex: number): Card[] {
  if (state.pendingDraw <= 0) return [];

  const drawn: Card[] = [];
  const player = state.players[playerIndex];
  if (!player || player.isEliminated) return [];

  for (let i = 0; i < state.pendingDraw; i++) {
    if (state.drawPile.length === 0) {
      const recycled = recycleDiscardPile(state.discardPile);
      state.drawPile.push(...recycled);
      if (state.drawPile.length === 0) break;
    }
    const card = state.drawPile.pop();
    if (card) {
      player.hand.push(card);
      drawn.push(card);
    }
  }

  state.pendingDraw = 0;
  state.pendingType = null;
  return drawn;
}