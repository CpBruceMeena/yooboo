import { Card, CardColor, CardType, GameState, STACKABLE } from './types';

export function canPlayCard(
  card: Card,
  activeColor: Exclude<CardColor, 'wild'> | null,
  discardTop: Card,
  pendingDraw: number,
  pendingType: CardType | null,
  smileyActive?: boolean,
): boolean {
  const isWild = card.color === 'wild';
  const matchesColor = activeColor !== null && card.color === activeColor;

  // Number cards match by value (not just type)
  let matchesType: boolean;
  if (card.type === 'number' && discardTop.type === 'number') {
    matchesType =
      card.value !== undefined &&
      discardTop.value !== undefined &&
      card.value === discardTop.value;
  } else {
    matchesType = discardTop.type === card.type;
  }

  // SMILEY ACTIVE: only smiley can be stacked on an unresolved smiley
  if (smileyActive) {
    return card.type === 'smiley';
  }

  // DURING A STACK: only matching stack type cards can be played
  if (pendingDraw > 0 && pendingType) {
    if (!STACKABLE.includes(card.type)) return false;
    if (card.type !== pendingType) return false;
    return true;
  }

  if (card.type === 'smiley') return true;
  if (isWild) return true;
  if (matchesColor) return true;
  if (matchesType) return true;

  return false;
}

export function validatePlay(
  state: GameState,
  playerId: string,
  cardId: string,
): string | null {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return 'Player not found';
  if (player.isEliminated) return 'Player is eliminated';
  if (player.id !== state.players[state.currentPlayerIndex]?.id) return 'Not your turn';

  const card = player.hand.find((c) => c.id === cardId);
  if (!card) return 'Card not in hand';

  const discardTop = state.discardPile[state.discardPile.length - 1];
  if (!discardTop) return 'No discard top';

  if (!canPlayCard(card, state.activeColor, discardTop, state.pendingDraw, state.pendingType, state.smileyActive)) {
    return 'Card cannot be played';
  }

  if (state.pendingDraw > 0) {
    if (card.type === 'skipEveryone' || card.type === 'discardAll') {
      return 'Cannot play that card during stack';
    }
  }

  return null;
}

export function getPlayableCards(
  hand: Card[],
  activeColor: Exclude<CardColor, 'wild'> | null,
  discardTop: Card,
  pendingDraw: number,
  pendingType: CardType | null,
  smileyActive?: boolean,
): string[] {
  return hand
    .filter((c) => canPlayCard(c, activeColor, discardTop, pendingDraw, pendingType, smileyActive))
    .map((c) => c.id);
}