# Uno-No-Mercy – Desktop UI Spec (Claude-Optimized, Tailwind, WebRTC)

## 1. Purpose

This document defines a **desktop-only UI system** for Uno-No-Mercy, optimized for:

* Claude-based UI generation (no MCP)
* Next.js + Tailwind CSS
* WebRTC real-time multiplayer

Claude must treat this as a **strict UI + component contract**, not a loose design guideline.

---

# 2. Platform Scope

* Target: Desktop Web
* Resolution: 1440 x 900
* Minimum: 1280 x 800

## Layout Rules

* Centered game table
* Circular opponent layout
* Bottom player hand
* Right-side utility panel
* No mobile responsiveness required

---

# 3. Layout Hierarchy (MANDATORY)

```id="layout-structure"
GameLayout
 ├── TopBar
 ├── GameTable
 │    ├── DrawPile
 │    ├── DiscardPile
 │    ├── ActiveColorIndicator
 │    ├── DirectionIndicator
 │    └── StackMeter
 ├── PlayerRing
 │    ├── OpponentSeat[]
 │    └── LocalPlayerSeat
 ├── PlayerHandTray
 ├── RightPanel
 │    ├── EmotePanel
 │    └── GameActions
 └── OverlayLayer
      ├── Modal
      ├── Toast
      └── AnimationLayer
```

Claude must not alter this hierarchy.

---

# 4. Tailwind Design Tokens

## Colors

Use Tailwind config extension:

```id="tailwind-colors"
colors: {
  red: "#E44747",
  yellow: "#F3C742",
  green: "#33B56B",
  blue: "#3478F6",
  wild: "#7A4DFF",
  bgPrimary: "#10131A",
  bgSecondary: "#1A1F29",
  bgTertiary: "#242B38",
  textPrimary: "#F7F8FA",
  textMuted: "#AAB2C0",
  danger: "#FF6B6B",
  success: "#4CD97B"
}
```

---

## Spacing & Radius

* spacing base: 4px
* card radius: rounded-xl
* button radius: rounded-lg
* modal radius: rounded-2xl

---

# 5. Card System (FINAL)

## Allowed Card Types

Claude MUST support:

1. number
2. reverse
3. plus2
4. reverse4
5. plus4
6. plus6
7. plus10
8. skipEveryone
9. discardAll
10. smiley

---

## Card Component Contract

```id="card-contract"
<Card
  type="number | reverse | plus2 | reverse4 | plus4 | plus6 | plus10 | skipEveryone | discardAll | smiley"
  color="red | yellow | green | blue | wild"
  value?: number
  state="default | playable | selected | disabled"
/>
```

---

## Card Behavior Rules (IMPORTANT)

### Stackable cards:

* plus2
* plus4
* plus6
* plus10
* reverse4

### Non-stackable:

* skipEveryone
* discardAll
* smiley

---

## Special Cards UI Behavior

### plus6

* Same as +4 but higher intensity
* Strong red glow

---

### skipEveryone

* All opponents skipped
* UI:

  * All PlayerSeat briefly dim
  * Turn returns to same player

---

### discardAll

* Opens modal
* Player selects color to discard
* All matching cards removed

---

### smiley

* Wild card
* Opens color picker modal

---

# 6. Core Components

## Button

```id="button"
<Button variant="primary | secondary | danger" />
```

---

## PlayerSeat

```id="player-seat"
<PlayerSeat
  id
  name
  avatar
  cardCount
  state="idle | active | underAttack | uno | eliminated"
/>
```

---

## StackMeter

```id="stack-meter"
<StackMeter value={number} />
```

---

## Indicators

```id="indicators"
<ColorIndicator />
<DirectionIndicator />
```

---

# 7. Game Table Behavior

## Turn System

* Active player:

  * glowing ring
  * slight scale

---

## Stack System

* StackMeter accumulates
* Target player highlighted red
* On failure → draw cards animation

---

## Skip Everyone Flow

* All players dim
* Turn stays same
* Show "SKIPPED ALL" banner

---

## Discard All Flow

* Modal opens
* Selected color cards removed
* Hand updates instantly

---

## UNO State

* When 1 card left:

  * UNO badge appears
  * Pulsing animation

---

## Elimination

* If cards > 25:

  * PlayerSeat → eliminated
  * opacity reduced
  * no interaction

---

# 8. Player Hand Tray

## Rules

* Bottom aligned flex row
* Cards overlap using negative margin
* Hover = spread
* Selected = lifted

---

# 9. Modals

## Change Color

```id="change-color"
<ChangeColorModal />
```

---

## Discard All

```id="discard-all"
<DiscardAllModal />
```

---

## Game Result

```id="game-result"
<GameResultModal />
```

---

# 10. Right Panel

* Emotes
* Leave game
* Settings

---

# 11. Animations (REQUIRED)

Claude must use Tailwind + minimal motion libs.

### Required:

* card hover lift
* card play movement
* stack pulse
* turn glow
* discard burst

---

# 12. WebRTC State Mapping (IMPORTANT)

UI must react to real-time state.

## GameState

```id="game-state"
GameState {
  players: Player[]
  currentTurn: string
  direction: "clockwise" | "counter"
  discardTop: Card
  drawStack: number
  activeColor: string
}
```

---

## Player

```id="player"
Player {
  id: string
  name: string
  cards: Card[]
  status: "active | eliminated"
}
```

---

## Event Hooks (for WebRTC)

* onCardPlay
* onDraw
* onStackUpdate
* onTurnChange
* onPlayerEliminated

Claude should assume these exist.

---

# 13. Interaction Rules

* Click card → select
* Click again → play
* Special cards → modal
* No drag interactions

---

# 14. Constraints for Claude

Claude MUST:

* Use React + Tailwind
* Use functional components
* Keep components reusable
* Use props (no hardcoding)

Claude MUST NOT:

* Create mobile UI
* Invent new card types
* Break layout hierarchy
* Use inline styles heavily

---

# 15. First Components to Generate

Claude should start with:

1. GameTable
2. Card
3. PlayerHandTray

These define the entire system.

---

# 🔧 PATCH: Game Rules & UI Corrections

## 1. Elimination Rule (UPDATED – CRITICAL)

### Rule

* Maximum cards allowed: **24**
* If a player reaches **≥ 25 cards → eliminated immediately**

---

## UI Behavior

When elimination happens:

* PlayerSeat state → `eliminated`
* Apply:

  * `opacity-40`
  * disable interactions
  * show "ELIMINATED" badge

---

## Real-Time Handling

* Elimination must trigger instantly after:

  * draw resolution
  * stack resolution

---

## Edge Case (IMPORTANT)

If a player receives a stack:

Example:

* Stack = 18
* Player has 10 cards
  → total = 28 → eliminated immediately

👉 UI should:

* Skip rendering full card draw animation
* Directly transition to elimination state

---

# 2. Stack System Update (IMPORTANT)

## Stackable Cards (FINAL)

Claude MUST treat these as stackable:

* plus2
* plus4
* plus6
* plus10
* reverse4
* smiley ✅ (NEW)

---

## Smiley Card Behavior (UPDATED)

### Previous:

* Wild only

### Now:

Smiley is BOTH:

* Wild (choose color)
* Stackable penalty modifier

---

## Smiley Stack Rules

When used in stack:

* Does NOT add numeric value
* But:

  * passes stack forward
  * allows player to change color

---

### Example Flow

* Player A: +4
* Player B: +6
* Player C: Smiley

👉 Result:

* Stack continues
* Next player must respond OR draw total stack
* Active color changes based on Smiley

---

## UI Behavior for Smiley in Stack

* Show:

  * color picker modal
  * stack continues after selection

* StackMeter:

  * remains unchanged (Smiley adds 0)

---

# 3. Stack Resolution Logic (STRICT)

When player cannot respond:

* Draw total stack
* Reset stack to 0

---

## Elimination Check Order

Claude must enforce:

```id="stack-resolution-order"
1. Apply total draw
2. Update player card count
3. If >= 25 → eliminate
4. Else → continue turn flow
```

---

# 4. Stack Meter UI (UPDATED)

## Behavior

* Shows accumulated numeric value ONLY
* Does NOT include Smiley

---

## Visual States

* 0 → hidden
* 1–6 → yellow glow
* 7–15 → orange glow
* 16+ → red pulsing glow

---

# 5. Turn Flow Update (IMPORTANT)

## Skip Everyone Interaction with Stack

Rule:

* Skip Everyone CANNOT be played during stack

---

## Discard All Interaction with Stack

Rule:

* Discard All CANNOT be played during stack

---

## Smiley Interaction with Stack

Rule:

* Smiley CAN be played during stack

---

# 6. UI Priority Rules (VERY IMPORTANT)

When multiple effects happen:

Priority order:

```id="priority-order"
1. Elimination
2. Stack resolution
3. Turn change
4. Visual effects
```

---

# 7. Claude Enforcement Rules (UPDATED)

Claude MUST:

* Check elimination immediately after stack resolution
* Treat Smi .ley as stackable
* Not add Smiley value to StackMeter
* Block invalid card plays during stack

Claude MUST NOT:

* Allow Skip Everyone during stack
* Allow Discard All during stack
* Delay elimination animation
* Include Smiley in stack numeric value

---

## Update Notes (agent)

- Date: 2026-05-16
- A `.agent.md` developer agent was added to help triage and apply fixes for runtime and UI issues.
- Immediate UI/UX tasks:
  1. Verify the current UI components render without runtime errors in Next.js dev mode.
  2. Confirm Tailwind v4 tokens are present in `tailwind.config` and that CSS builds.
  3. Ensure component props match `src/components/*` implementations to avoid hydration/runtime mismatches.

