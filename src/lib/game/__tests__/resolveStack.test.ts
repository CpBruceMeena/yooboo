import { describe, it, expect } from 'vitest';
import { resolveStack } from '../resolveStack';
import { GameState, Card } from '../types';

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    roomId: 'test',
    players: [
      { id: 'p1', name: 'Alice', hand: [], isEliminated: false, saidUno: false, connected: true },
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

function makeCard(overrides: Partial<Card> = {}): Card {
  return { id: 'card_1', type: 'number', color: 'red', value: 1, ...overrides };
}

describe('resolveStack', () => {
  it('should return empty array when pendingDraw is 0', () => {
    const state = makeState({ pendingDraw: 0 });
    const drawn = resolveStack(state, 0);
    expect(drawn).toHaveLength(0);
  });

  it('should draw the correct number of cards', () => {
    const state = makeState({
      pendingDraw: 4,
      pendingType: 'plus2',
      drawPile: [
        makeCard({ id: 'd1', color: 'blue', type: 'number', value: 1 }),
        makeCard({ id: 'd2', color: 'green', type: 'number', value: 2 }),
        makeCard({ id: 'd3', color: 'yellow', type: 'number', value: 3 }),
        makeCard({ id: 'd4', color: 'red', type: 'number', value: 4 }),
      ],
    });
    const drawn = resolveStack(state, 0);
    expect(drawn).toHaveLength(4);
    expect(state.players[0].hand).toHaveLength(4);
    expect(state.pendingDraw).toBe(0);
    expect(state.pendingType).toBeNull();
  });

  it('should handle insufficient cards in draw pile by recycling', () => {
    const state = makeState({
      pendingDraw: 6,
      pendingType: 'plus2',
      drawPile: [
        makeCard({ id: 'd1', color: 'blue', type: 'number', value: 1 }),
        makeCard({ id: 'd2', color: 'green', type: 'number', value: 2 }),
      ],
      discardPile: [
        makeCard({ id: 'top', color: 'red', type: 'number', value: 9 }), // stays on top
        makeCard({ id: 'r1', color: 'yellow', type: 'number', value: 3 }),
        makeCard({ id: 'r2', color: 'blue', type: 'number', value: 4 }),
        makeCard({ id: 'r3', color: 'green', type: 'number', value: 5 }),
        makeCard({ id: 'r4', color: 'red', type: 'number', value: 6 }),
      ],
    });
    const drawn = resolveStack(state, 0);
    // 2 from draw pile + 4 recycled = 6 total
    expect(drawn).toHaveLength(6);
    expect(state.players[0].hand).toHaveLength(6);
    expect(state.pendingDraw).toBe(0);
  });

  it('should return empty array for eliminated player', () => {
    const state = makeState({
      pendingDraw: 2,
      pendingType: 'plus2',
      drawPile: [
        makeCard({ id: 'd1', color: 'blue', type: 'number', value: 1 }),
      ],
      players: [
        { id: 'p1', name: 'Alice', hand: [], isEliminated: true, saidUno: false, connected: true },
      ],
    });
    const drawn = resolveStack(state, 0);
    expect(drawn).toHaveLength(0);
  });
});
