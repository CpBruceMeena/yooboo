import { Card, GameState } from './types';

export function applyCardEffect(
  state: GameState,
  card: Card,
  chosenColor?: Exclude<Card['color'], 'wild'>,
): string[] {
  const effects: string[] = [];

  switch (card.type) {
    case 'number':
      if (card.color !== 'wild') {
        state.activeColor = card.color;
        effects.push('color_change');
      }
      break;

    case 'reverse': {
      if (card.color !== 'wild') {
        state.activeColor = card.color;
        effects.push('color_change');
      }
      state.direction = (state.direction === 1 ? -1 : 1) as 1 | -1;
      effects.push('reverse');
      effects.push('skip'); // Server handles turn advancement via 'skip' effect
      break;
    }

    case 'plus2':
      if (card.color !== 'wild') {
        state.activeColor = card.color;
        effects.push('color_change');
      }
      state.pendingDraw += 2;
      state.pendingType = 'plus2';
      effects.push('stack');
      break;

    case 'plus4':
      if (card.color !== 'wild') {
        state.activeColor = card.color;
        effects.push('color_change');
      }
      state.pendingDraw += 4;
      state.pendingType = 'plus4';
      effects.push('stack');
      break;

    case 'plus6':
      state.activeColor = chosenColor ?? null;
      state.pendingDraw += 6;
      state.pendingType = 'plus6';
      effects.push('stack');
      effects.push('color_change');
      break;

    case 'plus10':
      state.activeColor = chosenColor ?? null;
      state.pendingDraw += 10;
      state.pendingType = 'plus10';
      effects.push('stack');
      effects.push('color_change');
      break;

    case 'reverse4': {
      state.direction = (state.direction === 1 ? -1 : 1) as 1 | -1;
      state.activeColor = chosenColor ?? null;
      state.pendingDraw += 4;
      state.pendingType = 'reverse4';
      effects.push('reverse');
      effects.push('stack');
      effects.push('color_change');
      break;
    }

    case 'skipEveryone':
      if (card.color !== 'wild') {
        state.activeColor = card.color;
        effects.push('color_change');
      }
      state.skipEveryoneActive = true;
      effects.push('skip_everyone');
      break;

    case 'discardAll':
      if (card.color !== 'wild') {
        state.activeColor = card.color;
        effects.push('color_change');
      }
      effects.push('discard_all');
      break;

    case 'smiley':
      state.activeColor = chosenColor ?? null;
      state.pendingDraw = 0;
      state.pendingType = 'smiley';
      state.smileyActive = true;
      state.smileyColor = chosenColor ?? null;
      effects.push('smiley');
      break;
  }

  return effects;
}