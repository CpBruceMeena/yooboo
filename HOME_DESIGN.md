# 🃏 UNO No Mercy — Homepage Design Specification

> **Project**: UNO No Mercy (Next.js)
> **Stack**: Next.js · Framer Motion · UI-UX Pro · DeepSeek Models
> **Scope**: Homepage (`/`) — cinematic, 3D-animated, premium feel
> **Audience**: All ages — casual & competitive players alike

---

## 1. Design Philosophy

The homepage must feel like the **opening scene of a blockbuster**. Not a game lobby — a *cinematic experience* that pulls the player in before they've clicked a single button.

> **Core Concept**: *"The Table Has Been Set. There Is No Mercy."*

Think: rich leather table textures, dramatic lighting, cards that breathe and float in 3D space. Every scroll should feel like a camera dolly. Every hover should feel like a spotlight.

**Three words to always revisit**: **Cinematic. Tactile. Inevitable.**

---

## 2. Visual Identity

### 2.1 Color Palette

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Background Deep | `--color-bg` | `#0A0705` | Base canvas — near-black with warmth |
| Surface | `--color-surface` | `#130E0A` | Card backgrounds, panels |
| Gold Accent | `--color-gold` | `#C9952A` | CTAs, highlights, card borders |
| Gold Glow | `--color-gold-glow` | `#E8B84B` | Hover states, animated halos |
| Red Danger | `--color-red` | `#C0392B` | "No Mercy" accents, +4, Wild cards |
| Cream Text | `--color-text-primary` | `#F2EBD9` | Headlines, body |
| Muted Text | `--color-text-muted` | `#7A6A55` | Subtitles, labels |
| Felt Green | `--color-felt` | `#1A2E1A` | Table felt texture base |

> **Rationale**: The palette evokes a midnight casino — warm blacks, aged gold, and urgent red. Never pure white; always cream. The felt green grounds the 3D card scene in physical reality.

### 2.2 Typography

```
Display / Hero  →  "Playfair Display" (Serif, Bold Italic)
                   — grand, editorial, connotes stakes
Sub-headlines   →  "Cormorant Garamond" (Serif, Medium)
                   — refined, slightly dangerous
Body / UI       →  "Geist Mono" (Monospace)
                   — modern, game-UI precision
Labels / Caps   →  "Bebas Neue" (Display, all-caps)
                   — punchy, arcade authority
```

> Typography stack delivers tension between the **old world** (serifs = high-stakes card games) and the **digital** (mono = game system).

### 2.3 Textures & Materials

- **Table surface**: SVG/CSS felt grain with subtle specular highlight — creates a tangible playing field
- **Card material**: CSS `box-shadow` layering (3–5 layers) + `perspective` transform + subtle paper grain overlay
- **Ambient grain**: Global 4% noise overlay (CSS `filter: url(#grain)`) — cinematic film look
- **Vignette**: Radial gradient overlay on hero — darkens edges, spotlights center
- **Depth fog**: Bottom-fade gradient from `--color-bg` for section transitions

---

## 3. Page Sections

### Section 1 — Hero

**Purpose**: First impression. Establish atmosphere. Convert curiosity into action.

#### Layout
```
┌─────────────────────────────────────────────────────┐
│  [ambient particle field — subtle, drifting]        │
│                                                     │
│         ┌──────────────────────┐                    │
│         │  3D CARD FAN         │  ← center stage   │
│         │  (floating, tilted)  │                    │
│         └──────────────────────┘                    │
│                                                     │
│    UNO                                              │
│    NO MERCY          ← massive serif headline       │
│                                                     │
│    "Draw four. No take-backs. No excuses."          │
│    ← subtitle in Cormorant, muted cream             │
│                                                     │
│    [  PLAY NOW  ]   [  HOW TO PLAY  ]               │
│    ← gold CTA         ← ghost/outline button        │
│                                                     │
│    ↓ scroll indicator (animated chevron)            │
└─────────────────────────────────────────────────────┘
```

#### 3D Card Fan — Framer Motion Spec

The hero card fan is the **centerpiece of the entire page**. It must feel physically real.

```
Cards: 7 UNO cards in a spread fan
Position: Slightly above center, tilted 10–15° on Z axis
Animation states:
  1. ENTRY      — cards fly in from below, staggered 80ms apart
                  spring: { stiffness: 60, damping: 14 }
  2. IDLE       — gentle float loop (Y: ±8px, 4s ease-in-out, infinite)
                  each card has unique phase offset (no sync)
  3. HOVER      — hovered card lifts (Y: -24px, scale: 1.08)
                  neighboring cards push apart slightly
  4. PARALLAX   — cards respond to mouse position
                  rotateX: mouseY * 0.015, rotateY: mouseX * 0.02
                  smooth with 150ms lerp

CSS perspective on container: 1200px
Each card:
  - transform-style: preserve-3d
  - 3–5 layered box-shadows for depth
  - subtle gradient on face (light source top-left)
  - 1px gold border with 0.5 opacity
```

**Card faces shown** (suggested mix for drama):
- Wild Draw +4 (the villain card)
- Skip (×2)
- Reverse
- Draw +2
- A number card (face down — back showing)

#### Background
- Deep radial gradient: center slightly lighter (`#1A110C`) → edges `#0A0705`
- 40–60 floating particle dots (Framer Motion, 0.2–0.5 opacity, random drift)
- Subtle animated noise (CSS keyframe opacity pulse 3–6% range)

#### Copy
```
Headline:     UNO NO MERCY
Sub:          Draw four. No take-backs. No excuses.
CTA Primary:  PLAY NOW
CTA Ghost:    HOW TO PLAY
```

---

### Section 2 — How To Play

**Purpose**: Onboard new players without boring experienced ones. Quick, visual, cinematic.

#### Layout — Horizontal scroll cards (desktop) / vertical stack (mobile)
```
┌──────────────────────────────────────────────────────┐
│  HOW TO PLAY                  ← section label        │
│  Three rules. Zero mercy.     ← sub                  │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  STEP 1  │  │  STEP 2  │  │  STEP 3  │            │
│  │          │  │          │  │          │            │
│  │ [icon]   │  │ [icon]   │  │ [icon]   │            │
│  │          │  │          │  │          │            │
│  │ Match    │  │ Play     │  │ First to │            │
│  │ color or │  │ action   │  │ empty    │            │
│  │ number   │  │ cards    │  │ hand     │            │
│  │          │  │ mercilessly│ wins     │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└──────────────────────────────────────────────────────┘
```

#### Step Cards
Each card:
- Background: `--color-surface` with felt texture
- Gold numbered badge top-left (Bebas Neue, large)
- Animated icon (Framer Motion, plays on scroll-enter)
- Hover: lifts + gold border glow (`box-shadow: 0 0 20px var(--color-gold-glow)`)

#### Scroll Animation
- Cards enter with `whileInView` — slide up + fade in, staggered 150ms
- Trigger: `once: true`, margin: `-80px`

#### Icons (SVG, animated)
1. Two cards overlapping — pulsing match indicator
2. Lightning bolt — action card energy
3. Trophy with crown — victory moment

---

### Section 3 — Game Modes

**Purpose**: Show depth. Tease competitive and casual lanes. Drive lobby engagement.

#### Layout — 2-column asymmetric grid
```
┌────────────────────────────────────────────────────┐
│  CHOOSE YOUR BATTLEFIELD                           │
│                                                    │
│  ┌──────────────────────┐  ┌────────────────────┐  │
│  │                      │  │                    │  │
│  │   CLASSIC MODE       │  │  NO MERCY MODE     │  │
│  │   [wider card]       │  │  [narrower, red    │  │
│  │                      │  │   glow accent]     │  │
│  │  2–10 Players        │  │  Stacking draws    │  │
│  │  Standard rules      │  │  No safe plays     │  │
│  │  Family-friendly     │  │  Elimination rounds│  │
│  │                      │  │                    │  │
│  │  [ JOIN LOBBY ]      │  │  [ ENTER IF BRAVE ]│  │
│  └──────────────────────┘  └────────────────────┘  │
└────────────────────────────────────────────────────┘
```

#### Mode Card Design

**Classic Mode card**:
- Border: 1px gold
- Background image: felt texture + warm spotlight
- Badge: "FRIENDLY" in green

**No Mercy Mode card**:
- Border: 2px animated red (`border-color` pulses via keyframe)
- Background: darker, cooler felt + red-tinted vignette
- Badge: "RUTHLESS" in red with glow
- Subtle flame/particle effect in corners (CSS or Framer Motion)

#### Hover Interaction
Both cards: `whileHover={{ scale: 1.03, y: -6 }}` + reveal overlay with mode description text

---

### Section 4 — Login / Join CTA

**Purpose**: Convert. Minimize friction. Make signing up feel like accepting a challenge.

#### Layout — Full-width cinematic banner
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│          [background: animated card shuffle]         │
│                                                      │
│          THE TABLE IS WAITING.                       │
│          ARE YOU?                                    │
│                                                      │
│          [ CREATE ACCOUNT ]   [ LOG IN ]             │
│                                                      │
│          or continue as Guest →                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Background Animation
- 8–12 UNO cards slowly drift across the background (Framer Motion, low opacity 0.12–0.2)
- Cards rotate gently as they drift (Z rotation 0→360, 8–15s each, infinite)
- Creates depth without distracting from CTA

#### CTA Buttons
```
Primary "Create Account":
  background: linear-gradient(135deg, #C9952A, #E8B84B)
  color: #0A0705
  font: Bebas Neue, 18px, letter-spacing: 3px
  padding: 16px 48px
  border-radius: 2px  ← sharp corners = authoritative
  hover: scale(1.04) + glow shadow

Secondary "Log In":
  background: transparent
  border: 1.5px solid #C9952A
  color: #C9952A
  same sizing as primary
  hover: background fills with gold at 10% opacity

Ghost "Guest":
  underline style, muted cream color
  arrow icon animates right on hover
```

---

## 4. Navigation

### Design
```
┌────────────────────────────────────────────────────┐
│  🃏 UNO NO MERCY        PLAY  MODES  RULES  LOGIN  │
└────────────────────────────────────────────────────┘
```

- **Logo**: Card suit icon + wordmark in Playfair Display Bold
- **Links**: Geist Mono, 13px, all-caps, letter-spacing 2px
- **Background**: Transparent on load → `rgba(10, 7, 5, 0.92)` + `backdrop-filter: blur(12px)` on scroll
- **Active link**: Gold underline, 2px, animated width expand
- **Mobile**: Hamburger → full-screen overlay menu with staggered link entries

### Scroll Behavior
Framer Motion `useScroll` + `useMotionValue` — navbar background opacity animates from 0→0.92 as user scrolls past 80px.

---

## 5. Motion Design System

All animations should follow these principles: **purposeful, physical, unhurried**.

### Timing Tokens
```
--duration-instant:   80ms   (micro-feedback, button press)
--duration-fast:     180ms   (hover reveals, small state changes)
--duration-medium:   400ms   (component enter/exit)
--duration-slow:     700ms   (page-level entries, hero load)
--duration-cinematic: 1200ms (dramatic reveals, section transitions)
```

### Spring Presets (Framer Motion)
```js
// Snappy — button interactions
spring.snappy = { type: "spring", stiffness: 400, damping: 30 }

// Physical — card movements
spring.physical = { type: "spring", stiffness: 80, damping: 16 }

// Cinematic — hero entrances
spring.cinematic = { type: "spring", stiffness: 40, damping: 12, mass: 1.2 }
```

### Scroll-Triggered Animations
Use Framer Motion `whileInView` with `viewport={{ once: true, margin: "-100px" }}` for:
- How To Play cards: `y: 40 → 0`, `opacity: 0 → 1`
- Game Mode cards: `x: ±60 → 0`, `opacity: 0 → 1`
- CTA section: `scale: 0.96 → 1`, `opacity: 0 → 1`

### Parallax Layers (Hero)
```
Layer 1 (particles):    scrollY * 0.15  — slowest
Layer 2 (cards):        scrollY * 0.35
Layer 3 (headline):     scrollY * 0.55
Layer 4 (CTA buttons):  scrollY * 0.70  — fastest
```
Creates true cinematic depth on scroll.

---

## 6. DeepSeek Integration Points

The DeepSeek model is embedded as a **game intelligence layer**, not a chatbot. On the homepage it surfaces as:

### 6.1 Smart Lobby Suggestion (Hero CTA area)
Below the PLAY NOW button:
```
┌────────────────────────────────────────┐
│ 🤖  "3 players are waiting for you"   │
│     QUICK JOIN  →                      │
└────────────────────────────────────────┘
```
- DeepSeek API call on page load: fetch active lobby count + recommend mode based on time of day / session history
- Rendered as a subtle animated pill — slides in 1.5s after hero loads
- Tone: confident, taunting ("They're already shuffling.")

### 6.2 Mode Recommendation Badge
On Game Mode cards:
```
┌─────────────────────┐
│  ⚡ RECOMMENDED      │  ← DeepSeek-driven, based on player profile
│  NO MERCY MODE      │
└─────────────────────┘
```
- API: lightweight inference on player history (if logged in) or device/time signals (if guest)
- Badge animates in after card renders (300ms delay)

### 6.3 AI Opponent Teaser (optional section hook)
Small copy line under Game Modes:
```
"Our AI never folds. Are you ready?"  [PLAY VS AI →]
```
Links to the AI game mode — powered by DeepSeek game logic.

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Single column, vertical card stack, simplified card fan (3 cards), bottom-fixed CTA |
| Tablet | 640–1024px | 2-column grids, reduced parallax intensity, nav collapses |
| Desktop | 1024–1440px | Full layout as designed |
| Wide | > 1440px | Max-width container 1400px, centered, background bleeds full-width |

**Mobile card fan**: Reduce to 3 cards, disable mouse parallax (use gyroscope on mobile via `DeviceOrientationEvent` if permission granted), idle float animation persists.

---

## 8. Accessibility

- All animated elements respect `prefers-reduced-motion` — replace with instant fade
- Color contrast: all text ≥ 4.5:1 against backgrounds (WCAG AA)
- Card fan: `aria-hidden="true"` — decorative, not interactive for screen readers
- Focus states: gold `outline: 2px solid var(--color-gold)` with 2px offset
- Keyboard nav: full tab order through nav → hero CTA → sections → footer CTA

---

## 9. File Structure (Homepage)

```
/app
  /page.tsx                    ← Homepage root

/components
  /home
    /Hero.tsx                  ← Hero section + 3D card fan
    /CardFan.tsx               ← 3D card fan component (Framer Motion)
    /HowToPlay.tsx             ← Step cards section
    /GameModes.tsx             ← Mode selection cards
    /JoinCTA.tsx               ← Login / signup banner
    /NavBar.tsx                ← Scroll-aware navbar
    /ParticleField.tsx         ← Ambient background particles
    /AISuggestion.tsx          ← DeepSeek lobby suggestion pill

/lib
  /deepseek.ts                 ← DeepSeek API client
  /lobby.ts                    ← Lobby state fetching

/styles
  /globals.css                 ← CSS variables, grain overlay, base reset
  /tokens.css                  ← Design tokens (colors, spacing, duration)
```

---

## 10. Implementation Priority

| Priority | Component | Complexity | Notes |
|---|---|---|---|
| P0 | Hero + CardFan | High | Defines first impression — do this first |
| P0 | NavBar | Low | Needed for all pages |
| P1 | JoinCTA | Medium | Core conversion surface |
| P1 | HowToPlay | Medium | Onboarding |
| P2 | GameModes | Medium | Lobby routing |
| P2 | AISuggestion | Medium | Requires DeepSeek API ready |
| P3 | ParticleField | Low | Atmospheric — can ship without |

---

## 11. Reference Mood

The visual DNA sits at the intersection of:

- **Casino Royale** (2006) — elegant danger, night textures, high stakes
- **Balatro** (game, 2024) — card game UI that feels alive and tactile
- **Letterboxd** homepage — cinematic dark theme done right
- **Cartier website** — premium material feel, restrained gold

> When in doubt, ask: *"Would this feel at home in a high-end casino at midnight?"* If yes — ship it.

---

*Document version: 1.0 — Ready for frontend implementation.*
