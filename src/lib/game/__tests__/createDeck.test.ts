import { describe, it, expect } from 'vitest';
import { createDeck, shuffle, recycleDiscardPile } from '../createDeck';
import { COLORS, Card } from '../types';

describe('createDeck', () => {
  it('should create a deck with 152 cards', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(152);
  });

  it('should contain unique card IDs', () => {
    const deck = createDeck();
    const ids = deck.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have correct number of each number card per color', () => {
    const deck = createDeck();
    for (const color of COLORS) {
      const zeros = deck.filter(c => c.color === color && c.type === 'number' && c.value === 0);
      expect(zeros).toHaveLength(1);

      for (let v = 1; v <= 9; v++) {
        const cards = deck.filter(c => c.color === color && c.type === 'number' && c.value === v);
        expect(cards).toHaveLength(2);
      }
    }
  });

  it('should have correct number of action cards per color', () => {
    const deck = createDeck();
    for (const color of COLORS) {
      expect(deck.filter(c => c.color === color && c.type === 'reverse')).toHaveLength(2);
      expect(deck.filter(c => c.color === color && c.type === 'plus2')).toHaveLength(2);
      expect(deck.filter(c => c.color === color && c.type === 'plus4')).toHaveLength(4);
      expect(deck.filter(c => c.color === color && c.type === 'skipEveryone')).toHaveLength(1);
      expect(deck.filter(c => c.color === color && c.type === 'discardAll')).toHaveLength(4);
    }
  });

  it('should have correct number of wild cards', () => {
    const deck = createDeck();
    expect(deck.filter(c => c.type === 'plus6')).toHaveLength(4);
    expect(deck.filter(c => c.type === 'plus10')).toHaveLength(4);
    expect(deck.filter(c => c.type === 'reverse4')).toHaveLength(8);
    expect(deck.filter(c => c.type === 'smiley')).toHaveLength(8);
  });

  it('should shuffle the deck (order differs from sorted)', () => {
    // Multiple decks should have different orders (statistically near-certain)
    const deck1 = createDeck();
    const deck2 = createDeck();
    const ids1 = deck1.map(c => c.id);
    const ids2 = deck2.map(c => c.id);
    // Very unlikely that two shuffled decks have the same order
    const sameOrder = ids1.every((id, i) => id === ids2[i]);
    expect(sameOrder).toBe(false);
  });
});

describe('shuffle', () => {
  it('should return an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(arr);
    expect(shuffled).toHaveLength(arr.length);
  });

  it('should contain all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(arr);
    expect(shuffled.sort()).toEqual(arr.sort());
  });

  it('should not mutate the original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    shuffle(arr);
    expect(arr).toEqual(original);
  });
});

describe('recycleDiscardPile', () => {
  it('should return empty array for single card discard pile', () => {
    const pile: Card[] = [
      { id: 'c1', type: 'number', color: 'red', value: 5 },
    ];
    const recycled = recycleDiscardPile(pile);
    expect(recycled).toHaveLength(0);
    expect(pile).toHaveLength(1);
  });

  it('should recycle all but the top card', () => {
    const pile: Card[] = [
      { id: 'c1', type: 'number', color: 'red', value: 1 },
      { id: 'c2', type: 'number', color: 'blue', value: 2 },
      { id: 'c3', type: 'number', color: 'green', value: 3 },
      { id: 'c4', type: 'number', color: 'yellow', value: 4 },
    ];
    const top = pile[pile.length - 1];
    const recycled = recycleDiscardPile(pile);
    expect(recycled).toHaveLength(3);
    // Top card should remain in the pile
    expect(pile).toHaveLength(1);
    expect(pile[0].id).toBe(top.id);
    // Recycled cards should not include the top
    expect(recycled.find(c => c.id === top.id)).toBeUndefined();
  });

  it('should shuffle the recycled cards', () => {
    // Use a larger pile so shuffle has many permutations
    const pile: Card[] = [
      { id: 'c1', type: 'number', color: 'red', value: 1 },
      { id: 'c2', type: 'number', color: 'blue', value: 2 },
      { id: 'c3', type: 'number', color: 'green', value: 3 },
      { id: 'c4', type: 'number', color: 'yellow', value: 4 },
      { id: 'c5', type: 'number', color: 'red', value: 5 },
      { id: 'c6', type: 'number', color: 'blue', value: 6 },
      { id: 'c7', type: 'number', color: 'green', value: 7 },
      { id: 'c8', type: 'number', color: 'yellow', value: 8 },
      { id: 'c9', type: 'number', color: 'red', value: 9 },
    ];
    const originalOrder = pile.slice(0, -1).map(c => c.id);
    const recycled = recycleDiscardPile([...pile]);
    const recycledIds = recycled.map(c => c.id);
    // The recycled cards should not be in the original order
    const sameOrder = recycledIds.every((id, i) => id === originalOrder[i]);
    expect(sameOrder).toBe(false);
  });

  it('should return empty for empty discard pile', () => {
    const pile: Card[] = [];
    const recycled = recycleDiscardPile(pile);
    expect(recycled).toHaveLength(0);
  });
});
