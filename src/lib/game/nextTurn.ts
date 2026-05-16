import { GameState } from './types';

export function nextTurn(state: GameState): void {
  const active = state.players.filter((p) => !p.isEliminated);
  if (active.length <= 1) return;

  let next = state.currentPlayerIndex + state.direction;
  const len = state.players.length;

  while (true) {
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