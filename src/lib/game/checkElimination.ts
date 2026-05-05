import { GameState, MAX_CARDS_BEFORE_ELIMINATION } from './types';

export function checkElimination(state: GameState): string | null {
  for (const player of state.players) {
    if (player.isEliminated) continue;
    if (player.hand.length >= MAX_CARDS_BEFORE_ELIMINATION) {
      player.isEliminated = true;
      return player.id;
    }
  }
  return null;
}

export function isEliminated(playerId: string, state: GameState): boolean {
  const player = state.players.find((p) => p.id === playerId);
  return player ? player.isEliminated : false;
}