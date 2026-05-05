import { Card, CardColor, CardType, GameState, STACKABLE } from './types';

export function canPlayCard(
  card: Card,
  activeColor: Exclude<CardColor, 'wild'> | null,
  discardTop: Card,
  pendingDraw: number,
  pendingType: CardType | null,
): boolean {
  if (card.type === 'smiley') return true;

  const isWild = card.color === 'wild';
  const matchesColor = activeColor !== null && card.color === activeColor;
  const matchesType = discardTop.type === card.type;

  if (pendingDraw > 0 && pendingType) {
    if (!STACKABLE.includes(card.type)) return false;
    if (card.type !== pendingType) return false;
    return true;
  }

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

  if (!canPlayCard(card, state.activeColor, discardTop, state.pendingDraw, state.pendingType)) {
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
): string[] {
  return hand
    .filter((c) => canPlayCard(c, activeColor, discardTop, pendingDraw, pendingType))
    .map((c) => c.id);
}