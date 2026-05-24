import { describe, it, expect } from 'vitest';
import { resolveSmileyDraw } from '../resolveSmiley';
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
    smileyActive: true,
    smileyColor: 'red',
    skipEveryoneActive: false,
    status: 'in_game',
    winnerId: null,
    ...overrides,
  };
}

function makeCard(overrides: Partial<Card> = {}): Card {
  return { id: 'card_1', type: 'number', color: 'red', value: 1, ...overrides };
}

describe('resolveSmileyDraw', () => {
  it('should return matched=true when drawn card matches target color', () => {
    const state = makeState({
      drawPile: [makeCard({ id: 'draw1', color: 'red', type: 'number', value: 5 })],
    });
    const result = resolveSmileyDraw(state, 0, 'red');
    expect(result.matched).toBe(true);
    expect(result.eliminated).toBe(false);
    expect(result.drawn).toHaveLength(1);
    expect(state.smileyActive).toBe(false);
    expect(state.smileyColor).toBeNull();
  });

  it('should keep drawing until matching color is found', () => {
    // Stack.pop() removes from the END, so matching card must be at the back
    const state = makeState({
      drawPile: [
        makeCard({ id: 'draw4', color: 'red', type: 'number', value: 4 }),
        makeCard({ id: 'draw1', color: 'blue', type: 'number', value: 1 }),
        makeCard({ id: 'draw2', color: 'green', type: 'number', value: 2 }),
        makeCard({ id: 'draw3', color: 'yellow', type: 'number', value: 3 }),
      ],
    });
    const result = resolveSmileyDraw(state, 0, 'red');
    expect(result.matched).toBe(true);
    expect(result.drawn).toHaveLength(4);
    expect(state.players[0].hand).toHaveLength(4);
  });

  it('should eliminate player when hand reaches 25 cards', () => {
    const hand = Array.from({ length: 24 }, (_, i) =>
      makeCard({ id: `existing_${i}`, color: 'blue', type: 'number', value: i % 10 })
    );
    const state = makeState({
      players: [
        { id: 'p1', name: 'Alice', hand, isEliminated: false, saidUno: false, connected: true },
      ],
      drawPile: [
        makeCard({ id: 'draw1', color: 'green', type: 'number', value: 1 }),
        makeCard({ id: 'draw2', color: 'green', type: 'number', value: 2 }),
      ],
    });
    const result = resolveSmileyDraw(state, 0, 'red');
    expect(result.eliminated).toBe(true);
    expect(result.matched).toBe(false);
    expect(state.players[0].isEliminated).toBe(true);
    expect(state.smileyActive).toBe(false);
  });

  it('should return eliminated=true when hand exactly reaches 25 on last card', () => {
    const hand = Array.from({ length: 24 }, (_, i) =>
      makeCard({ id: `existing_${i}`, color: 'blue', type: 'number', value: i % 10 })
    );
    const state = makeState({
      players: [
        { id: 'p1', name: 'Alice', hand, isEliminated: false, saidUno: false, connected: true },
      ],
      drawPile: [
        makeCard({ id: 'draw1', color: 'red', type: 'number', value: 5 }), // matches color but too late
      ],
    });
    const result = resolveSmileyDraw(state, 0, 'red');
    expect(result.eliminated).toBe(true);
    // Hand is 24 + 1 = 25 -> eliminated
    expect(state.players[0].hand).toHaveLength(25);
    expect(state.players[0].isEliminated).toBe(true);
  });

  it('should return matched=false when draw pile is exhausted', () => {
    const state = makeState({
      drawPile: [
        makeCard({ id: 'draw1', color: 'green', type: 'number', value: 1 }),
      ],
      discardPile: [
        makeCard({ id: 'top', color: 'blue', type: 'number', value: 3 }),
        makeCard({ id: 'recyclable', color: 'yellow', type: 'number', value: 7 }),
      ],
    });
    const result = resolveSmileyDraw(state, 0, 'red');
    expect(result.matched).toBe(false);
    expect(result.eliminated).toBe(false);
    // Should have recycled and found 1 more card (no red match)
    expect(result.drawn.length).toBeGreaterThanOrEqual(1);
  });

  it('should return empty result for eliminated player', () => {
    const state = makeState({
      players: [
        { id: 'p1', name: 'Alice', hand: [], isEliminated: true, saidUno: false, connected: true },
      ],
    });
    const result = resolveSmileyDraw(state, 0, 'red');
    expect(result.drawn).toHaveLength(0);
    expect(result.matched).toBe(false);
    expect(result.eliminated).toBe(false);
  });
});
