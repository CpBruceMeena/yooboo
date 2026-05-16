import { GameState } from './types';

export function checkWinner(state: GameState): string | null {
  for (const player of state.players) {
    if (player.isEliminated) continue;
    if (player.hand.length === 0) {
      state.winnerId = player.id;
      state.status = 'finished';
      return player.id;
    }
  }

  const active = state.players.filter((p) => !p.isEliminated);
  if (active.length <= 1 && state.players.length > 1 && active.length > 0) {
    state.winnerId = active[0].id;
    state.status = 'finished';
    return active[0].id;
  }

  return null;
}