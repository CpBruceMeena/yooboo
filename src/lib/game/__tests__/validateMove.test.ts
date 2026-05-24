import { describe, it, expect } from 'vitest';
import { canPlayCard, validatePlay, getPlayableCards } from '../validateMove';
import { GameState, Card } from '../types';

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: 'card_1',
    type: 'number',
    color: 'red',
    value: 5,
    ...overrides,
  };
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    roomId: 'test',
    players: [],
    drawPile: [],
    discardPile: [makeCard({ id: 'discard_top', type: 'number', color: 'blue', value: 3 })],
    currentPlayerIndex: 0,
    direction: 1,
    activeColor: 'blue',
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

describe('canPlayCard', () => {
  describe('normal play (no pending draw, no smiley)', () => {
    it('should allow same color number card', () => {
      const card = makeCard({ color: 'blue', type: 'number', value: 7 });
      const top = makeCard({ id: 'top', color: 'blue', type: 'number', value: 3 });
      expect(canPlayCard(card, 'blue', top, 0, null)).toBe(true);
    });

    it('should allow same value number card (different color)', () => {
      const card = makeCard({ color: 'red', type: 'number', value: 3 });
      const top = makeCard({ id: 'top', color: 'blue', type: 'number', value: 3 });
      expect(canPlayCard(card, 'blue', top, 0, null)).toBe(true);
    });

    it('should allow wild card', () => {
      const card = makeCard({ color: 'wild', type: 'plus4' });
      const top = makeCard({ id: 'top', color: 'blue', type: 'number', value: 3 });
      expect(canPlayCard(card, 'blue', top, 0, null)).toBe(true);
    });

    it('should allow same type action card (matching color)', () => {
      const card = makeCard({ color: 'blue', type: 'reverse' });
      const top = makeCard({ id: 'top', color: 'blue', type: 'reverse' });
      expect(canPlayCard(card, 'blue', top, 0, null)).toBe(true);
    });

    it('should allow same type action card (matching type only)', () => {
      const card = makeCard({ color: 'red', type: 'plus2' });
      const top = makeCard({ id: 'top', color: 'blue', type: 'plus2' });
      expect(canPlayCard(card, 'blue', top, 0, null)).toBe(true);
    });

    it('should allow smiley card', () => {
      const card = makeCard({ color: 'wild', type: 'smiley' });
      const top = makeCard({ id: 'top', color: 'blue', type: 'number', value: 3 });
      expect(canPlayCard(card, 'blue', top, 0, null)).toBe(true);
    });

    it('should reject card with no matching color or type', () => {
      const card = makeCard({ color: 'green', type: 'number', value: 7 });
      const top = makeCard({ id: 'top', color: 'blue', type: 'number', value: 3 });
      expect(canPlayCard(card, 'blue', top, 0, null)).toBe(false);
    });
  });

  describe('during stack (pendingDraw > 0)', () => {
    it('should allow matching stack type card', () => {
      const card = makeCard({ color: 'red', type: 'plus2' });
      const top = makeCard({ id: 'top', color: 'blue', type: 'plus2' });
      expect(canPlayCard(card, 'blue', top, 2, 'plus2')).toBe(true);
    });

    it('should reject non-stackable card during stack', () => {
      const card = makeCard({ color: 'red', type: 'reverse' });
      const top = makeCard({ id: 'top', color: 'blue', type: 'plus2' });
      expect(canPlayCard(card, 'blue', top, 2, 'plus2')).toBe(false);
    });

    it('should reject wrong stack type', () => {
      const card = makeCard({ color: 'red', type: 'plus4' });
      const top = makeCard({ id: 'top', color: 'blue', type: 'plus2' });
      expect(canPlayCard(card, 'blue', top, 2, 'plus2')).toBe(false);
    });
  });

  describe('during smiley active', () => {
    it('should allow only smiley card', () => {
      const smiley = makeCard({ color: 'wild', type: 'smiley' });
      const number = makeCard({ color: 'blue', type: 'number', value: 5 });
      const top = makeCard({ id: 'top', color: 'blue', type: 'number', value: 3 });
      expect(canPlayCard(smiley, 'blue', top, 0, null, true)).toBe(true);
      expect(canPlayCard(number, 'blue', top, 0, null, true)).toBe(false);
    });
  });
});

describe('validatePlay', () => {
  it('should return null for a valid play', () => {
    const state = makeState({
      players: [
        { id: 'p1', name: 'Alice', hand: [makeCard({ color: 'blue', type: 'number', value: 7 })], isEliminated: false, saidUno: false, connected: true },
      ],
      currentPlayerIndex: 0,
    });
    expect(validatePlay(state, 'p1', 'card_1')).toBeNull();
  });

  it('should return error if player not found', () => {
    const state = makeState();
    expect(validatePlay(state, 'nonexistent', 'card_1')).toBe('Player not found');
  });

  it('should return error if player is eliminated', () => {
    const state = makeState({
      players: [
        { id: 'p1', name: 'Alice', hand: [makeCard({ color: 'blue', type: 'number', value: 7 })], isEliminated: true, saidUno: false, connected: true },
      ],
    });
    expect(validatePlay(state, 'p1', 'card_1')).toBe('Player is eliminated');
  });

  it('should return error if not players turn', () => {
    const state = makeState({
      players: [
        { id: 'p1', name: 'Alice', hand: [makeCard()], isEliminated: false, saidUno: false, connected: true },
        { id: 'p2', name: 'Bob', hand: [makeCard()], isEliminated: false, saidUno: false, connected: true },
      ],
      currentPlayerIndex: 1,
    });
    expect(validatePlay(state, 'p1', 'card_1')).toBe('Not your turn');
  });

  it('should return error if card not in hand', () => {
    const state = makeState({
      players: [
        { id: 'p1', name: 'Alice', hand: [makeCard({ id: 'other_card', color: 'blue' })], isEliminated: false, saidUno: false, connected: true },
      ],
      currentPlayerIndex: 0,
    });
    expect(validatePlay(state, 'p1', 'card_1')).toBe('Card not in hand');
  });

  it('should return error if card cannot be played', () => {
    const state = makeState({
      players: [
        { id: 'p1', name: 'Alice', hand: [makeCard({ color: 'green', type: 'number', value: 7 })], isEliminated: false, saidUno: false, connected: true },
      ],
      currentPlayerIndex: 0,
      activeColor: 'red',
    });
    expect(validatePlay(state, 'p1', 'card_1')).toBe('Card cannot be played');
  });
});

describe('getPlayableCards', () => {
  it('should return ids of all playable cards', () => {
    const hand: Card[] = [
      makeCard({ id: 'c1', color: 'blue', type: 'number', value: 5 }),
      makeCard({ id: 'c2', color: 'red', type: 'number', value: 3 }),
      makeCard({ id: 'c3', color: 'wild', type: 'plus4' }),
      makeCard({ id: 'c4', color: 'green', type: 'number', value: 7 }),
    ];
    const top = makeCard({ id: 'top', color: 'blue', type: 'number', value: 3 });
    const playable = getPlayableCards(hand, 'blue', top, 0, null);
    // c1 (matches color), c2 (matches value 3), c3 (wild), c4 (doesn't match)
    expect(playable).toEqual(['c1', 'c2', 'c3']);
  });

  it('should return empty array when no cards are playable', () => {
    const hand: Card[] = [
      makeCard({ id: 'c1', color: 'green', type: 'number', value: 7 }),
      makeCard({ id: 'c2', color: 'yellow', type: 'reverse' }),
    ];
    const top = makeCard({ id: 'top', color: 'blue', type: 'number', value: 3 });
    const playable = getPlayableCards(hand, 'blue', top, 0, null);
    expect(playable).toHaveLength(0);
  });
});
