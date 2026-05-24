import { describe, it, expect } from 'vitest';
import { applyCardEffect } from '../applyCardEffect';
import { GameState, Card } from '../types';

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    roomId: 'test',
    players: [],
    drawPile: [],
    discardPile: [],
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

function makeCard(overrides: Partial<Card> = {}): Card {
  return { id: 'card_1', type: 'number', color: 'red', value: 5, ...overrides };
}

describe('applyCardEffect', () => {
  describe('number card', () => {
    it('should set activeColor to card color', () => {
      const state = makeState();
      const card = makeCard({ type: 'number', color: 'green', value: 7 });
      const effects = applyCardEffect(state, card);
      expect(state.activeColor).toBe('green');
      expect(effects).toContain('color_change');
    });
  });

  describe('reverse', () => {
    it('should flip direction from 1 to -1', () => {
      const state = makeState({ direction: 1 });
      const card = makeCard({ type: 'reverse', color: 'blue' });
      applyCardEffect(state, card);
      expect(state.direction).toBe(-1);
    });

    it('should flip direction from -1 to 1', () => {
      const state = makeState({ direction: -1 });
      const card = makeCard({ type: 'reverse', color: 'blue' });
      applyCardEffect(state, card);
      expect(state.direction).toBe(1);
    });

    it('should add reverse and skip effects', () => {
      const state = makeState();
      const card = makeCard({ type: 'reverse', color: 'blue' });
      const effects = applyCardEffect(state, card);
      expect(effects).toContain('reverse');
      expect(effects).toContain('skip');
    });
  });

  describe('plus2', () => {
    it('should add 2 to pendingDraw', () => {
      const state = makeState();
      const card = makeCard({ type: 'plus2', color: 'blue' });
      applyCardEffect(state, card);
      expect(state.pendingDraw).toBe(2);
      expect(state.pendingType).toBe('plus2');
    });

    it('should stack with existing pendingDraw', () => {
      const state = makeState({ pendingDraw: 4, pendingType: 'plus2' });
      const card = makeCard({ type: 'plus2', color: 'blue' });
      applyCardEffect(state, card);
      expect(state.pendingDraw).toBe(6);
    });
  });

  describe('plus4', () => {
    it('should add 4 to pendingDraw', () => {
      const state = makeState();
      const card = makeCard({ type: 'plus4', color: 'blue' });
      applyCardEffect(state, card);
      expect(state.pendingDraw).toBe(4);
      expect(state.pendingType).toBe('plus4');
    });
  });

  describe('plus6', () => {
    it('should add 6 to pendingDraw', () => {
      const state = makeState();
      const card = makeCard({ type: 'plus6', color: 'wild' });
      const effects = applyCardEffect(state, card, 'red');
      expect(state.pendingDraw).toBe(6);
      expect(state.pendingType).toBe('plus6');
      expect(state.activeColor).toBe('red');
      expect(effects).toContain('stack');
      expect(effects).toContain('color_change');
    });
  });

  describe('plus10', () => {
    it('should add 10 to pendingDraw', () => {
      const state = makeState();
      const card = makeCard({ type: 'plus10', color: 'wild' });
      applyCardEffect(state, card, 'yellow');
      expect(state.pendingDraw).toBe(10);
      expect(state.pendingType).toBe('plus10');
    });
  });

  describe('reverse4', () => {
    it('should reverse direction and add 4 to pendingDraw', () => {
      const state = makeState({ direction: 1 });
      const card = makeCard({ type: 'reverse4', color: 'wild' });
      const effects = applyCardEffect(state, card, 'green');
      expect(state.direction).toBe(-1);
      expect(state.pendingDraw).toBe(4);
      expect(state.pendingType).toBe('reverse4');
      expect(state.activeColor).toBe('green');
      expect(effects).toContain('reverse');
      expect(effects).toContain('stack');
      expect(effects).toContain('color_change');
    });
  });

  describe('skipEveryone', () => {
    it('should set skipEveryoneActive to true', () => {
      const state = makeState();
      const card = makeCard({ type: 'skipEveryone', color: 'blue' });
      const effects = applyCardEffect(state, card);
      expect(state.skipEveryoneActive).toBe(true);
      expect(effects).toContain('skip_everyone');
    });
  });

  describe('discardAll', () => {
    it('should add discard_all effect and set activeColor', () => {
      const state = makeState();
      const card = makeCard({ type: 'discardAll', color: 'blue' });
      const effects = applyCardEffect(state, card);
      expect(state.activeColor).toBe('blue');
      expect(effects).toContain('discard_all');
    });
  });

  describe('smiley', () => {
    it('should set smileyActive and clear pendingDraw', () => {
      const state = makeState({ pendingDraw: 4, pendingType: 'plus2' });
      const card = makeCard({ type: 'smiley', color: 'wild' });
      const effects = applyCardEffect(state, card, 'red');
      expect(state.smileyActive).toBe(true);
      expect(state.smileyColor).toBe('red');
      expect(state.activeColor).toBe('red');
      expect(state.pendingDraw).toBe(0);
      expect(state.pendingType).toBe('smiley');
      expect(effects).toContain('smiley');
    });
  });
});
