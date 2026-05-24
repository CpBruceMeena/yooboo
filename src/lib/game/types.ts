export type CardType =
  | 'number'
  | 'reverse'
  | 'plus2'
  | 'reverse4'
  | 'plus4'
  | 'plus6'
  | 'plus10'
  | 'skipEveryone'
  | 'discardAll'
  | 'smiley';

export type CardColor = 'red' | 'yellow' | 'green' | 'blue' | 'wild';

export interface Card {
  id: string;
  type: CardType;
  color: CardColor;
  value?: number;
}

export type Direction = 1 | -1;

export type GameStatus = 'lobby' | 'in_game' | 'finished';

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  handSize?: number;
  isEliminated: boolean;
  saidYooboo: boolean;
  connected: boolean;
}

export interface GameState {
  roomId: string;
  players: Player[];
  drawPile: Card[];
  discardPile: Card[];
  currentPlayerIndex: number;
  direction: Direction;
  activeColor: Exclude<CardColor, 'wild'> | null;
  pendingDraw: number;
  pendingType: CardType | null;
  smileyActive: boolean;
  smileyColor: Exclude<CardColor, 'wild'> | null;
  skipEveryoneActive: boolean;
  status: GameStatus;
  winnerId: string | null;
}

export const STACKABLE: CardType[] = [
  'plus2', 'plus4', 'plus6', 'plus10', 'reverse4', 'smiley',
];

export const COLORS: Exclude<CardColor, 'wild'>[] = ['red', 'yellow', 'green', 'blue'];
export const ALL_COLORS: CardColor[] = ['red', 'yellow', 'green', 'blue', 'wild'];

export const MAX_CARDS_BEFORE_ELIMINATION = 25;

export interface PlayCardEvent {
  playerId: string;
  cardId: string;
  chosenColor?: Exclude<CardColor, 'wild'>;
}

export type ClientMessage =
  | { type: 'join_room'; playerName: string }
  | { type: 'leave_room' }
  | { type: 'play_card'; payload: PlayCardEvent }
  | { type: 'draw_card' }
  | { type: 'say_yooboo' }
  | { type: 'chat_message'; message: string }
  | { type: 'emote'; emote: string };

export type ServerMessage =
  | { type: 'state_update'; state: GameState }
  | { type: 'invalid_move'; reason: string }
  | { type: 'player_eliminated'; playerId: string }
  | { type: 'game_won'; winnerId: string }
  | { type: 'card_revealed'; card: Card; playerId: string }
  | { type: 'you_are'; playerId: string; playerName: string }
  | { type: 'room_joined'; roomId: string; players: Player[] }
  | { type: 'chat_message'; playerId: string; playerName: string; message: string }
  | { type: 'emote_received'; playerId: string; playerName: string; emote: string };