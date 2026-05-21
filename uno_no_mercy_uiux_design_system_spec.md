# UNO – NO MERCY
## Complete UI/UX Reverse Engineering & Frontend Design Specification

---

# 1. Product Overview

This document provides a pixel-level reverse engineering and implementation blueprint for the UI/UX design shown in the provided image.

The product is a competitive, neon-cyberpunk styled multiplayer UNO-inspired card game named:

# UNO – NO MERCY

The design language combines:

- Dark futuristic gaming UI
- Premium casino-inspired visuals
- Neon red/orange glow aesthetics
- Minimal metallic gold accents
- Esports / multiplayer lobby structure
- High contrast readability
- Mobile + desktop responsive gameplay

This specification is intended for:

- Frontend engineers
- UI engineers
- Game UI developers
- React / Next.js implementation
- Unity UI implementation
- Flutter / React Native adaptation
- Tailwind / CSS architecture
- Figma recreation
- Animation system implementation

---

# 2. Global Design Language

## 2.1 Core Mood

The entire experience is designed around:

- Aggression
- Speed
- Competitive multiplayer
- Premium gaming energy
- Neon-lit atmosphere
- Tactical card gameplay

The interface should feel:

- Alive
- Reactive
- Energetic
- Glowing
- Metallic
- Cinematic

---

# 3. Color System

## 3.1 Primary Colors

| Role | Color | HEX |
|---|---|---|
| Background Black | Rich Black | #06070B |
| Deep Navy | Dark Navy | #0A1220 |
| Primary Neon Red | Neon Crimson | #FF3B30 |
| Neon Orange | Fire Orange | #FF6A00 |
| Gold Accent | Metallic Gold | #D6B16A |
| Border Gold | Soft Gold | #A98542 |
| UI Gray | Steel Gray | #5C6470 |
| White Text | Pure White | #FFFFFF |
| Secondary Text | Cool Gray | #A8B0BB |

---

## 3.2 Gradient System

### Main Hero Gradient

```css
background: radial-gradient(circle at center,
#401010 0%,
#14070A 35%,
#05060B 100%);
```

### Neon Button Gradient

```css
background: linear-gradient(
180deg,
#FF6A00 0%,
#FF3B30 100%
);
```

### Gold Metallic Gradient

```css
background: linear-gradient(
180deg,
#E9D089 0%,
#B98932 100%
);
```

---

# 4. Typography System

## 4.1 Font Recommendations

### Primary Heading Font

Recommended:

- Bebas Neue
- Anton
- Oswald
- Rajdhani Bold

Used for:

- Main title
- UNO text
- Buttons
- Hero headlines
- Action labels

### Secondary UI Font

Recommended:

- Inter
- Manrope
- Exo 2
- Orbitron

Used for:

- Room labels
- Metadata
- Player counts
- Settings
- Panels

---

## 4.2 Typography Scale

| Element | Size | Weight |
|---|---|---|
| Hero Title | 92px | 800 |
| Hero Subtitle | 64px | 700 |
| CTA Buttons | 28px | 700 |
| Panel Headers | 22px | 700 |
| Room Labels | 18px | 600 |
| Body UI Text | 14px | 500 |
| Metadata | 12px | 400 |

---

# 5. Overall Layout Architecture

The composition contains 3 major UI sections.

---

# 5.1 Section A — Active Gameplay

Position:

- Top left quadrant
- Approx 38% width
- Approx 40% height

Purpose:

- Live gameplay preview
- Demonstrate active multiplayer match
- Showcase interactive gameplay loop

---

# 5.2 Section B — Homepage Hero

Position:

- Center/right dominant region
- Largest visual area

Purpose:

- Marketing hero
- Entry point
- CTA conversion
- Branding focus

---

# 5.3 Section C — Game Lobby

Position:

- Bottom left quadrant

Purpose:

- Multiplayer room browsing
- Match creation
- Rules preview
- Social interaction

---

# 6. Global Background Design

## 6.1 Background Layer Stack

### Layer 1 — Base

```css
background: #05060B;
```

### Layer 2 — Ambient Glow

Use multiple radial gradients.

```css
radial-gradient(circle at 20% 10%, rgba(255,0,0,0.12), transparent 30%)
radial-gradient(circle at 80% 20%, rgba(255,80,0,0.10), transparent 35%)
```

### Layer 3 — Noise Texture

Very subtle grain/noise overlay.

Opacity:

```css
0.03 - 0.06
```

### Layer 4 — Vignette

```css
box-shadow: inset 0 0 300px rgba(0,0,0,0.9);
```

---

# 7. Gameplay Screen Breakdown

# 7.1 Gameplay Container

## Shape

- Rounded rectangle
- Radius: 16px

## Border

```css
1px solid rgba(255,255,255,0.08)
```

## Background

```css
linear-gradient(180deg,
#0D1320 0%,
#090B12 100%)
```

## Shadow

```css
0 0 40px rgba(255,60,30,0.15)
```

---

# 7.2 UNO Table Design

## Shape

- Large oval arena
- Center aligned

## Border Glow

```css
box-shadow:
0 0 12px rgba(255,60,30,0.8),
0 0 50px rgba(255,60,30,0.4);
```

## Table Edge

Gradient:

```css
#FF3B30 -> #FF6A00
```

## Table Interior

```css
background: radial-gradient(circle,
#101726 0%,
#0A101A 100%);
```

---

# 7.3 Player Card Positioning

## Layout Logic

Players arranged around table circumference.

### Bottom Player

- Current user
- Largest cards
- Full hand visible

### Top Player

- Mini avatar
- Cards hidden
- Compact layout

### Left/Right Players

- Vertical placement
- Smaller UI

---

# 7.4 Cards Styling

## Card Base

### Dimensions

Desktop:

```css
width: 90px
height: 130px
```

### Border Radius

```css
14px
```

### Background

```css
#0D0D11
```

---

## Card Border

```css
border: 1px solid rgba(255,100,50,0.3)
```

---

## Card Glow

```css
box-shadow:
0 0 20px rgba(255,80,0,0.25);
```

---

# 7.5 Active Card State

The active card in the center glows heavily.

## Animation

Pulse loop.

### Example

```css
@keyframes pulseGlow {
  0% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(255,80,0,0.4);
  }

  50% {
    transform: scale(1.05);
    box-shadow: 0 0 50px rgba(255,80,0,0.9);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(255,80,0,0.4);
  }
}
```

---

# 7.6 Bottom Player Hand

## Arc Layout

Cards are arranged in a curved arc.

### Rotation Logic

```text
left-most = -18deg
center = 0deg
right-most = +18deg
```

### Hover Behavior

On hover:

- Raise card upward
- Increase scale
- Intensify glow
- Bring to front layer

Example:

```css
transform: translateY(-20px) scale(1.08);
```

---

# 7.7 Action Buttons

## UNO Button

### Purpose

Emergency/high priority action.

### Style

- Bright neon red
- Thick glow
- Large typography
- Aggressive attention

### Dimensions

```css
width: 180px
height: 72px
```

### Glow

```css
box-shadow:
0 0 20px rgba(255,60,30,0.7),
0 0 60px rgba(255,60,30,0.35);
```

---

## End Turn Button

### Style

- Dark neutral background
- Gold border
- Minimal glow

---

# 7.8 Chat Reactions Panel

Position:

Bottom-left.

Contains:

- Emoji reactions
- Quick responses
- Small rounded cards

Style:

```css
background: rgba(255,255,255,0.05)
backdrop-filter: blur(10px)
```

---

# 8. Homepage Hero Breakdown

# 8.1 Hero Container

This is the visual centerpiece.

## Layout

- Large widescreen cinematic composition
- Card fan spanning left-to-right
- Central title focus
- CTA buttons at bottom center

---

# 8.2 Hero Card Fan

## Structure

Cards arranged in dramatic perspective arc.

### Transform Logic

```text
left cards rotate negative
center cards face forward
right cards rotate positive
```

### Perspective

```css
transform-style: preserve-3d;
perspective: 1200px;
```

---

# 8.3 Special Effect Cards

Some cards contain:

- Fire overlays
- Neon symbols
- Metallic holographic gradients
- Heavy emissive edges

---

## Wild Cards

Use:

```css
background: linear-gradient(
45deg,
#FF3B30,
#FFD600,
#3BFF8F,
#3BCBFF,
#9F3BFF
);
```

Apply:

```css
filter: saturate(1.4);
```

---

# 8.4 Main Headline

## Structure

```text
UNO
SHOW ‘EM
NO MERCY
```

### Alignment

Center aligned.

### Styling

```css
text-transform: uppercase;
letter-spacing: 2px;
```

### Gradient Fill

```css
linear-gradient(180deg,
#FFE7A8 0%,
#FF7033 100%)
```

### Text Glow

```css
text-shadow:
0 0 20px rgba(255,80,30,0.7),
0 0 60px rgba(255,80,30,0.3);
```

---

# 8.5 CTA Buttons

Two buttons:

- Quick Match
- Browse Lobby

---

## Quick Match Button

### Style

Primary button.

```css
background: linear-gradient(
180deg,
#FF6A00,
#FF3B30
);
```

Glow:

```css
0 0 25px rgba(255,80,30,0.55)
```

---

## Browse Lobby Button

### Style

Secondary metallic button.

```css
background: rgba(255,255,255,0.06)
```

Border:

```css
1px solid #C89B4D
```

---

# 8.6 Top Right Navigation

Contains:

- Log In
- Sign Up

### Style

Compact metallic buttons.

### Hover

- Border glow
- Background brighten
- Slight upward movement

---

# 8.7 Mobile Preview Device

A phone mockup overlaps bottom-right.

Purpose:

- Showcase responsive mobile experience
- Improve conversion trust

---

## Phone Frame

### Radius

```css
36px
```

### Bezel

```css
background: #0A0A0A
```

### Screen Glow

```css
0 0 50px rgba(255,60,30,0.25)
```

---

# 9. Game Lobby Breakdown

# 9.1 Lobby Container

Dark panel with subtle metallic borders.

## Structure

- Tabs at top
- Room list
- Rules side panel
- Create Room button

---

# 9.2 Tabs

Tabs:

- Players
- Players
- Hiverts (as seen in image)

Active tab uses:

- Gold underline
- Bright text
- Glow

Inactive tabs:

- Muted gray

---

# 9.3 Room Rows

Each room row contains:

- Room name
- Player count
- Avatars
- Status

---

## Room Row Style

```css
background: rgba(255,255,255,0.02)
```

Hover:

```css
background: rgba(255,255,255,0.05)
transform: translateX(4px);
```

---

# 9.4 Avatars

Small circular images.

### Border

```css
2px solid rgba(255,180,80,0.4)
```

### Shadow

```css
0 0 10px rgba(255,180,80,0.25)
```

---

# 9.5 Rules Panel

Contains:

- +4 reverse
- +6
- +10
- Smiley
- Color flow

---

## Panel Style

### Background

```css
rgba(15,15,20,0.95)
```

### Border

```css
1px solid rgba(255,180,80,0.25)
```

### Glow

```css
0 0 20px rgba(255,180,80,0.08)
```

---

# 9.6 Create Room Button

Large CTA centered at bottom.

### Style

Neon orange-red button.

### Animation

Slow breathing glow.

---

# 10. Animation System

# 10.1 Global Animation Philosophy

Animations should:

- Never feel static
- Always feel alive
- Use soft motion
- Avoid excessive bouncing
- Use cinematic easing

---

# 10.2 Recommended Durations

| Interaction | Duration |
|---|---|
| Hover | 180ms |
| Card Lift | 220ms |
| Glow Pulse | 2.5s |
| Page Transition | 500ms |
| Modal Open | 300ms |
| Hero Idle Motion | 8s |

---

# 10.3 Hero Idle Motion

Cards slightly float.

```css
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
}
```

---

# 10.4 Particle Effects

Use:

- Ember particles
- Soft dust
- Floating sparks
- Tiny glow specks

Opacity should remain subtle.

---

# 11. Glassmorphism Rules

Use sparingly.

Only for:

- Tooltips
- Chat reactions
- Small overlays
- Dropdowns

Recommended:

```css
backdrop-filter: blur(12px);
background: rgba(255,255,255,0.05);
```

---

# 12. Responsive System

# 12.1 Desktop

Target:

```text
1920x1080
```

Layout:

- Multi-panel showcase
- Horizontal composition

---

# 12.2 Tablet

Hero becomes stacked.

Gameplay preview shrinks.

Lobby moves below hero.

---

# 12.3 Mobile

Single-column layout.

Hero cards reduce.

Buttons become full-width.

Lobby becomes scrollable.

---

# 13. UX Recommendations

# 13.1 Matchmaking UX

Quick Match flow:

1. Click button
2. Fullscreen animated queue modal
3. Rotating cards animation
4. Match found transition
5. Table zoom-in cinematic

---

# 13.2 Gameplay UX

Important actions:

- Must glow
- Must pulse
- Must attract attention

Invalid moves:

- Shake animation
- Red flash border

Turn indicator:

- Active player ring pulse
- Timer countdown glow

---

# 13.3 Accessibility

Minimum contrast ratio:

```text
4.5:1
```

Support:

- Colorblind mode
- Reduced motion mode
- Scalable text

---

# 14. Sound Design Suggestions

# UI Sounds

Use:

- Metallic clicks
- Electric pulses
- Soft synth sweeps
- Card slap sounds
- Neon activation sounds

---

# 15. Frontend Tech Recommendations

# Recommended Stack

## Web

- Next.js
- React
- TailwindCSS
- Framer Motion
- GSAP
- Three.js (optional)

---

## Game Rendering

Optional:

- PixiJS
- Phaser
- Unity WebGL

---

# 16. Tailwind Design Tokens

## Example Config

```js
colors: {
  bg: '#05060B',
  neonRed: '#FF3B30',
  neonOrange: '#FF6A00',
  gold: '#D6B16A',
  navy: '#0A1220'
}
```

---

# 17. Recommended Component Architecture

# Components

```text
<App>
 ├── HeroSection
 ├── GameplayPreview
 ├── LobbyPreview
 ├── Navbar
 ├── MatchmakingModal
 ├── PlayerAvatar
 ├── UnoCard
 ├── NeonButton
 ├── RoomList
 ├── RulesPanel
 └── MobileMockup
```

---

# 18. Suggested CSS Architecture

```text
styles/
 ├── globals.css
 ├── variables.css
 ├── animations.css
 ├── components/
 │    ├── buttons.css
 │    ├── cards.css
 │    ├── lobby.css
 │    ├── gameplay.css
 │    └── hero.css
```

---

# 19. Lighting Direction

The scene lighting comes from:

- Neon red edges
- Center glowing table
- Emissive cards
- Bottom CTA glow

Avoid flat lighting.

Everything should feel illuminated by the UI itself.

---

# 20. Final Visual Principles

The design succeeds because of:

- Strong contrast
- Cinematic composition
- Premium glow treatment
- Excellent focal hierarchy
- Aggressive CTA styling
- Consistent neon language
- Balanced metallic accents
- Controlled visual density

---

# 21. Implementation Priorities

## Priority 1

Build:

- Hero section
- Card system
- Glow system
- CTA buttons

---

## Priority 2

Build:

- Gameplay table
- Card animations
- Player positioning
- Lobby list

---

## Priority 3

Build:

- Matchmaking flows
- Responsive system
- Particle effects
- Advanced transitions

---

# 22. Final Notes

This UI style works because it maintains:

- Controlled chaos
- Aggressive lighting
- Strong readability
- Premium visual polish
- Cinematic energy

The most important implementation detail is:

# GLOW BALANCE

Too much glow:

- looks cheap
- loses readability
- reduces depth

Too little glow:

- loses energy
- feels generic
- loses gaming identity

The target should feel:

```text
Premium Competitive Neon-Cyberpunk Card Arena
```

with:

- subtle motion
- layered depth
- strong interaction feedback
- cinematic UI presentation

---

# END OF DOCUMENT

