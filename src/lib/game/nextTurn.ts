import { GameState } from './types';

export function nextTurn(state: GameState): void {
  const active = state.players.filter((p) => !p.isEliminated);
  if (active.length <= 1) return;

  let next = state.currentPlayerIndex + state.direction;
  const len = state.players.length;

  // Safety: prevent infinite loop if all players somehow become eliminated
  let safety = 0;
  const maxIterations = len * 2;

  while (true) {
    if (++safety > maxIterations) {
      // Fallback: move to the first active player
      const fallback = state.players.findIndex((p) => !p.isEliminated);
      if (fallback >= 0) state.currentPlayerIndex = fallback;
      return;
    }
    if (next < 0) next = len - 1;
    if (next >= len) next = 0;
    if (!state.players[next].isEliminated) break;
    next += state.direction;
  }

  state.currentPlayerIndex = next;
}

export function skipToNext(state: GameState): void {
  nextTurn(state);
}