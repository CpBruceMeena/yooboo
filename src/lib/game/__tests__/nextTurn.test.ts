import { describe, it, expect } from 'vitest';
import { nextTurn } from '../nextTurn';
import { GameState } from '../types';

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    roomId: 'test',
    players: [
      { id: 'p1', name: 'Alice', hand: [], isEliminated: false, saidUno: false, connected: true },
      { id: 'p2', name: 'Bob', hand: [], isEliminated: false, saidUno: false, connected: true },
      { id: 'p3', name: 'Carol', hand: [], isEliminated: false, saidUno: false, connected: true },
    ],
    drawPile: [],
    discardPile: [],
    currentPlayerIndex: 0,
    direction: 1,
    activeColor: 'red',
    pendingDraw: 0,
    pendingType: null,
    smileyActive: false,
    smileyColor: null,
    skipEveryoneActive: false,
    status: 'in_game',
    winnerId: null,
    ...overrides,
  };
}

describe('nextTurn', () => {
  it('should advance to next player in clockwise direction', () => {
    const state = makeState({ currentPlayerIndex: 0 });
    nextTurn(state);
    expect(state.currentPlayerIndex).toBe(1);
  });

  it('should wrap around from last to first player', () => {
    const state = makeState({ currentPlayerIndex: 2 });
    nextTurn(state);
    expect(state.currentPlayerIndex).toBe(0);
  });

  it('should advance in counter-clockwise direction', () => {
    const state = makeState({ currentPlayerIndex: 1, direction: -1 });
    nextTurn(state);
    expect(state.currentPlayerIndex).toBe(0);
  });

  it('should wrap backwards from index 0 when direction is -1', () => {
    const state = makeState({ currentPlayerIndex: 0, direction: -1 });
    nextTurn(state);
    expect(state.currentPlayerIndex).toBe(2);
  });

  it('should skip eliminated players', () => {
    const state = makeState({
      currentPlayerIndex: 0,
      players: [
        { id: 'p1', name: 'Alice', hand: [], isEliminated: false, saidUno: false, connected: true },
        { id: 'p2', name: 'Bob', hand: [], isEliminated: true, saidUno: false, connected: true },
        { id: 'p3', name: 'Carol', hand: [], isEliminated: false, saidUno: false, connected: true },
      ],
    });
    nextTurn(state);
    expect(state.currentPlayerIndex).toBe(2); // Skip Bob (index 1)
  });

  it('should do nothing when only one active player remains', () => {
    // With only 1 active player, nextTurn returns early (active.length <= 1 guard)
    const state = makeState({
      currentPlayerIndex: 2,
      players: [
        { id: 'p1', name: 'Alice', hand: [], isEliminated: false, saidUno: false, connected: true },
        { id: 'p2', name: 'Bob', hand: [], isEliminated: true, saidUno: false, connected: true },
        { id: 'p3', name: 'Carol', hand: [], isEliminated: true, saidUno: false, connected: true },
      ],
    });
    nextTurn(state);
    // Only 1 active player — nextTurn returns early, index stays unchanged
    expect(state.currentPlayerIndex).toBe(2);
  });

  it('should handle reverse direction skipping eliminated players', () => {
    const state = makeState({
      currentPlayerIndex: 0,
      direction: -1,
      players: [
        { id: 'p1', name: 'Alice', hand: [], isEliminated: false, saidUno: false, connected: true },
        { id: 'p2', name: 'Bob', hand: [], isEliminated: true, saidUno: false, connected: true },
        { id: 'p3', name: 'Carol', hand: [], isEliminated: false, saidUno: false, connected: true },
      ],
    });
    nextTurn(state);
    expect(state.currentPlayerIndex).toBe(2); // Skip Bob backwards, go to Carol
  });

  it('should do nothing if only one active player', () => {
    const state = makeState({
      currentPlayerIndex: 0,
      players: [
        { id: 'p1', name: 'Alice', hand: [], isEliminated: false, saidUno: false, connected: true },
      ],
    });
    nextTurn(state);
    expect(state.currentPlayerIndex).toBe(0);
  });

  it('should fallback to first active player if safety limit is reached', () => {
    // All players eliminated — safety fallback to first non-eliminated player
    const state = makeState({
      currentPlayerIndex: 0,
      players: [
        { id: 'p1', name: 'Alice', hand: [], isEliminated: true, saidUno: false, connected: true },
        { id: 'p2', name: 'Bob', hand: [], isEliminated: true, saidUno: false, connected: true },
        { id: 'p3', name: 'Carol', hand: [], isEliminated: true, saidUno: false, connected: true },
      ],
    });
    nextTurn(state);
    expect(state.currentPlayerIndex).toBe(0);
  });
});
