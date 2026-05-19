import { Card, COLORS } from './types';

let idCounter = 0;

function cardId(): string {
  return `card_${++idCounter}_${Date.now()}`;
}

function numberCards(color: typeof COLORS[number], count: number, value: number): Card[] {
  return Array.from({ length: count }, () => ({
    id: cardId(),
    type: 'number' as const,
    color,
    value,
  }));
}

function actionCards(color: typeof COLORS[number], type: Card['type'], count: number): Card[] {
  return Array.from({ length: count }, () => ({
    id: cardId(),
    type,
    color,
  }));
}

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const color of COLORS) {
    deck.push({ id: cardId(), type: 'number', color, value: 0 });
    for (let v = 1; v <= 9; v++) {
      deck.push(...numberCards(color, 2, v));
    }
    deck.push(...actionCards(color, 'reverse', 2));
    deck.push(...actionCards(color, 'plus2', 2));
    deck.push(...actionCards(color, 'plus4', 4));
    deck.push(...actionCards(color, 'skipEveryone', 1));
    deck.push(...actionCards(color, 'discardAll', 4));
  }
  deck.push(...actionCards('wild' as any, 'plus6', 4));
  deck.push(...actionCards('wild' as any, 'plus10', 4));
  deck.push(...actionCards('wild' as any, 'reverse4', 8));
  deck.push(...actionCards('wild' as any, 'smiley', 8));

  return shuffle(deck);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function recycleDiscardPile(discardPile: Card[]): Card[] {
  if (discardPile.length <= 1) return [];
  const top = discardPile[discardPile.length - 1];
  const rest = discardPile.slice(0, -1);
  return shuffle(rest);
}