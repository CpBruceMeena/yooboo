import { describe, it, expect } from 'vitest';
import { checkWinner } from '../checkWinner';
import { GameState, Card } from '../types';

function makeCard(overrides: Partial<Card> = {}): Card {
  return { id: 'card_1', type: 'number', color: 'red', value: 1, ...overrides };
}

describe('checkWinner', () => {
  it('should return null when no player has empty hand', () => {
    const state: GameState = {
      roomId: 'test',
      players: [
        { id: 'p1', name: 'Alice', hand: [makeCard()], isEliminated: false, saidYooboo: false, connected: true },
        { id: 'p2', name: 'Bob', hand: [makeCard()], isEliminated: false, saidYooboo: false, connected: true },
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
    };
    expect(checkWinner(state)).toBeNull();
  });

  it('should declare winner when a player has empty hand', () => {
    const state: GameState = {
      roomId: 'test',
      players: [
        { id: 'p1', name: 'Alice', hand: [], isEliminated: false, saidYooboo: false, connected: true },
        { id: 'p2', name: 'Bob', hand: [makeCard()], isEliminated: false, saidYooboo: false, connected: true },
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
    };
    const winner = checkWinner(state);
    expect(winner).toBe('p1');
    expect(state.winnerId).toBe('p1');
    expect(state.status).toBe('finished');
  });

  it('should declare winner when all other players are eliminated', () => {
    const state: GameState = {
      roomId: 'test',
      players: [
        { id: 'p1', name: 'Alice', hand: [makeCard()], isEliminated: false, saidYooboo: false, connected: true },
        { id: 'p2', name: 'Bob', hand: [makeCard()], isEliminated: true, saidYooboo: false, connected: true },
        { id: 'p3', name: 'Carol', hand: [makeCard()], isEliminated: true, saidYooboo: false, connected: true },
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
    };
    const winner = checkWinner(state);
    expect(winner).toBe('p1');
    expect(state.status).toBe('finished');
  });

  it('should not declare winner when only one player total but not eliminated', () => {
    const state: GameState = {
      roomId: 'test',
      players: [
        { id: 'p1', name: 'Alice', hand: [makeCard()], isEliminated: false, saidYooboo: false, connected: true },
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
    };
    // Single player with cards — no winner (not all eliminated against them)
    expect(checkWinner(state)).toBeNull();
  });

  it('should skip eliminated players when checking empty hands', () => {
    const state: GameState = {
      roomId: 'test',
      players: [
        { id: 'p1', name: 'Alice', hand: [], isEliminated: true, saidYooboo: false, connected: true },
        { id: 'p2', name: 'Bob', hand: [makeCard()], isEliminated: false, saidYooboo: false, connected: true },
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
    };
    // Alice has empty hand but is already eliminated — not a winner
    // Bob is the only active player remaining, so he wins
    const winner = checkWinner(state);
    expect(winner).toBe('p2');
    expect(state.status).toBe('finished');
  });
});
