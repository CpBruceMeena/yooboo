# Uno-No-Mercy – Technical Design Specification (Final)

---

# 1. Product Overview

Uno-No-Mercy is a **real-time multiplayer card game** with a **server-authoritative game engine** and **WebRTC-based client communication**.

### Core Objective

* Win by:

  * Reaching **0 cards**, OR
  * Being the **last remaining player**

### Elimination Rule

* If a player reaches **≥ 25 cards → eliminated immediately**

---

# 2. Architecture Overview

## Model

* **WebRTC (Data Channel)** → low-latency client messaging
* **Server (authoritative)** → validates ALL actions

## Responsibilities

### Client (Next.js + Tailwind)

* UI rendering
* Input actions
* Optimistic UI (optional)

### Server

* Game state ownership
* Rule validation
* Conflict resolution
* Broadcasting state

---

## Flow

```text
Client → WebRTC → Server → Validate → Update State → Broadcast → Clients
```

---

# 3. Player Constraints

* Players: **2–8**
* No bots (v1)
* No turn timeout (v1)

---

# 4. Card System (FINAL)

## Card Types

```ts
type CardType =
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
```

---

## Card Model

```ts
type CardColor = 'red' | 'yellow' | 'green' | 'blue' | 'wild';

interface Card {
  id: string;
  type: CardType;
  color: CardColor;
  value?: number;
}
```

---

# 5. Game State Model

```ts
interface GameState {
  roomId: string;
  players: Player[];
  drawPile: Card[];
  discardPile: Card[];
  currentPlayerIndex: number;
  direction: 1 | -1;
  activeColor: Exclude<CardColor, 'wild'> | null;

  // stack system
  pendingDraw: number;
  pendingType: CardType | null;

  // smiley mode
  smileyActive: boolean;
  smileyColor: CardColor | null;

  status: 'lobby' | 'in_game' | 'finished';
  winnerId: string | null;
}
```

---

## Player Model

```ts
interface Player {
  id: string;
  name: string;
  hand: Card[];
  isEliminated: boolean;
  saidUno: boolean;
  connected: boolean;
}
```

---

# 6. Turn System

## Turn Options

Player can:

1. Play a valid card
2. Draw 1 card
3. Draw → then play ANY card (not restricted)

---

# 7. Card Validation Rules

## Valid Play

Card is playable if:

* Matches color OR
* Matches type OR
* Is Smiley

---

## Stack Mode (FINAL)

### Rule: SAME CARD ONLY

Allowed:

* +4 → +4
* +6 → +6
* +10 → +10
* reverse4 → reverse4

---

## Stackable Cards

```ts
const STACKABLE = [
  'plus2',
  'plus4',
  'plus6',
  'plus10',
  'reverse4'
];
```

---

## Non-stackable During Stack

* skipEveryone ❌
* discardAll ❌

---

# 8. Smiley Card (SPECIAL LOGIC)

## Behavior

Smiley is NOT a normal stack card.

### When played:

1. Player selects a color
2. Next player:

   * Must draw cards **until that color appears**
   * All drawn cards are revealed to all players
   * Turn ends immediately after match

---

## State Changes

```ts
smileyActive = true
smileyColor = chosenColor
```

---

## Resolution Logic

```ts
while (true) {
  const card = draw();

  reveal(card);

  if (card.color === smileyColor) {
    addToHand(card);
    break;
  }

  addToHand(card);
}
```

---

## Important Rules

* Smiley **cannot stack**
* Smiley **overrides pending stack**
* Smiley **resets pendingDraw**

---

# 9. Card Effects

## Reverse

* Flip direction

---

## Reverse4

* Flip direction
* `pendingDraw += 4`
* Set stack mode

---

## +2 / +4 / +6 / +10

* Add to `pendingDraw`
* Set `pendingType`

---

## Skip Everyone

* Current player plays again
* No stack interaction

---

## Discard All

* Player discards ALL cards of that color
* Optional action
* If hand = 0 → WIN immediately

---

# 10. Stack Resolution

## When player cannot respond:

```ts
draw(pendingDraw);
pendingDraw = 0;
pendingType = null;
```

---

## Elimination Check

```ts
if (player.hand.length >= 25) {
  eliminate(player);
}
```

---

# 11. Turn Flow (STRICT ORDER)

```ts
1. Validate move
2. Apply card effect
3. Resolve stack OR smiley
4. Update hand
5. Check elimination
6. Check winner
7. Move turn
```

---

# 12. Events

## Client → Server

```ts
'play_card'
'draw_card'
'say_uno'
'join_room'
'leave_room'
```

---

## Server → Client

```ts
'state_update'
'invalid_move'
'player_eliminated'
'game_won'
```

---

## Play Payload

```ts
interface PlayCardEvent {
  playerId: string;
  cardId: string;
  chosenColor?: CardColor;
}
```

---

# 13. WebRTC Model

## Approach

* WebRTC → data channel
* Server → authoritative logic

## Server Responsibilities

* Validate moves
* Prevent cheating
* Maintain single source of truth

---

# 14. Edge Cases

## Draw pile empty

* Shuffle discard pile (except top card)

---

## Smiley + Stack Conflict

* Smiley overrides stack
* Stack is cleared

---

## Reverse (2 players)

* Acts as Skip

---

## Discard All → Zero cards

* Instant win

---

## Stack causing elimination

* Apply full draw
* THEN eliminate

---

# 15. Validation Rules

Server must check:

* Correct turn
* Player not eliminated
* Card exists in hand
* Card is playable
* Stack rules followed
* Smiley color provided

---

# 16. Backend Modules

```ts
/lib/game/
  createDeck.ts
  validateMove.ts
  applyCardEffect.ts
  resolveStack.ts
  resolveSmiley.ts
  nextTurn.ts
  checkElimination.ts
  checkWinner.ts
```

---

# 17. MongoDB Schema

## rooms

```ts
{
  roomId,
  players,
  gameState,
  createdAt,
  updatedAt
}
```

---

## events (optional)

```ts
{
  roomId,
  playerId,
  eventType,
  payload,
  timestamp
}
```

---

# 18. Testing Requirements

Must test:

* stacking same card
* smiley behavior
* discard all edge cases
* elimination at 25
* reverse direction
* skip everyone
* win condition

---

# 19. v1 Scope

Included:

* Multiplayer (2–8)
* Full card system
* Smiley mechanic
* Elimination system
* WebRTC sync

Excluded:

* Bots
* Spectators
* Ranked mode
* Replays

---
