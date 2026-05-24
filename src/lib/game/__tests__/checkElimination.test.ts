import { describe, it, expect } from 'vitest';
import { checkElimination, isEliminated } from '../checkElimination';
import { GameState, Card } from '../types';

function makeCard(overrides: Partial<Card> = {}): Card {
  return { id: 'card_1', type: 'number', color: 'red', value: 1, ...overrides };
}

describe('checkElimination', () => {
  it('should return null when no player has 25+ cards', () => {
    const state: GameState = {
      roomId: 'test',
      players: [
        { id: 'p1', name: 'Alice', hand: Array.from({ length: 7 }, (_, i) => makeCard({ id: `c${i}` })), isEliminated: false, saidYooboo: false, connected: true },
        { id: 'p2', name: 'Bob', hand: Array.from({ length: 7 }, (_, i) => makeCard({ id: `d${i}` })), isEliminated: false, saidYooboo: false, connected: true },
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
    expect(checkElimination(state)).toBeNull();
  });

  it('should eliminate player with 25 cards', () => {
    const state: GameState = {
      roomId: 'test',
      players: [
        { id: 'p1', name: 'Alice', hand: Array.from({ length: 25 }, (_, i) => makeCard({ id: `c${i}` })), isEliminated: false, saidYooboo: false, connected: true },
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
    const elimId = checkElimination(state);
    expect(elimId).toBe('p1');
    expect(state.players[0].isEliminated).toBe(true);
  });

  it('should eliminate player with more than 25 cards', () => {
    const state: GameState = {
      roomId: 'test',
      players: [
        { id: 'p1', name: 'Alice', hand: Array.from({ length: 30 }, (_, i) => makeCard({ id: `c${i}` })), isEliminated: false, saidYooboo: false, connected: true },
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
    const elimId = checkElimination(state);
    expect(elimId).toBe('p1');
  });

  it('should skip already eliminated players', () => {
    const state: GameState = {
      roomId: 'test',
      players: [
        { id: 'p1', name: 'Alice', hand: Array.from({ length: 25 }, (_, i) => makeCard({ id: `c${i}` })), isEliminated: true, saidYooboo: false, connected: true },
        { id: 'p2', name: 'Bob', hand: Array.from({ length: 7 }, (_, i) => makeCard({ id: `d${i}` })), isEliminated: false, saidYooboo: false, connected: true },
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
    expect(checkElimination(state)).toBeNull(); // Alice already eliminated
  });

  it('should return the first player to reach 25 cards', () => {
    const state: GameState = {
      roomId: 'test',
      players: [
        { id: 'p1', name: 'Alice', hand: Array.from({ length: 25 }, (_, i) => makeCard({ id: `c${i}` })), isEliminated: false, saidYooboo: false, connected: true },
        { id: 'p2', name: 'Bob', hand: Array.from({ length: 30 }, (_, i) => makeCard({ id: `d${i}` })), isEliminated: false, saidYooboo: false, connected: true },
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
    const elimId = checkElimination(state);
    expect(elimId).toBe('p1'); // Alice is first in array
    expect(state.players[1].isEliminated).toBe(false); // Bob not yet checked
  });
});

describe('isEliminated', () => {
  it('should return true for eliminated player', () => {
    const state: GameState = {
      roomId: 'test',
      players: [
        { id: 'p1', name: 'Alice', hand: [], isEliminated: true, saidYooboo: false, connected: true },
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
    expect(isEliminated('p1', state)).toBe(true);
  });

  it('should return false for non-eliminated player', () => {
    const state: GameState = {
      roomId: 'test',
      players: [
        { id: 'p1', name: 'Alice', hand: [], isEliminated: false, saidYooboo: false, connected: true },
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
    expect(isEliminated('p1', state)).toBe(false);
  });

  it('should return false for non-existent player', () => {
    const state: GameState = {
      roomId: 'test',
      players: [],
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
    expect(isEliminated('nobody', state)).toBe(false);
  });
});
