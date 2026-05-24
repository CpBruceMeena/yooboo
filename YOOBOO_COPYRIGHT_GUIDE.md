# YOOBOO — Copyright Clearance & Differentiation Guide

> **Project**: YOOBOO (formerly UNO No Mercy)
> **Purpose**: Document all IP risks, required changes, and creative differentiation strategy
> **Inspired by**: UNO (Mattel, Inc.) — not affiliated, not a copy
> **Status**: Pre-launch legal compliance checklist

---

> **Disclaimer**: This document is an engineering and design guide, not legal advice. Before launching commercially, consult a qualified IP attorney familiar with game law in your jurisdiction.

---

## 1. Understanding What Mattel Actually Owns

Before making changes, it's critical to understand what is and isn't legally protected. This determines exactly what you must change vs. what you're free to use.

### 1.1 What Mattel CAN Enforce Against You

| Protected Element | Legal Basis | Risk Level |
|---|---|---|
| The name **"UNO"** | Registered Trademark (Mattel, Inc.) | 🔴 Critical |
| The name **"No Mercy"** (UNO variant) | Trademark / trade dress | 🔴 Critical |
| UNO **logo design** (typography, 3D shadow, red oval) | Copyright + Trademark | 🔴 Critical |
| **Card artwork** — specific illustrations on each card | Copyright | 🔴 Critical |
| **Card back design** — the specific UNO pattern | Copyright | 🔴 Critical |
| Specific **color combinations** tied to UNO brand identity | Trade dress | 🟠 High |
| **Marketing copy** and taglines | Copyright | 🟠 High |
| **"Wild Draw Four"** exact card name/phrasing | Copyright (expression) | 🟡 Medium |

### 1.2 What Mattel CANNOT Enforce Against You

This is the good news. Established IP law (confirmed in multiple U.S. court cases) is very clear:

| Element | Legal Status | Can You Use It? |
|---|---|---|
| **Core game mechanic** — match color or number | Uncopyrightable (idea/system) | ✅ Yes |
| **Draw cards as penalty** mechanic | Uncopyrightable (rule/process) | ✅ Yes |
| **Skip turn** mechanic | Uncopyrightable | ✅ Yes |
| **Reverse play direction** mechanic | Uncopyrightable | ✅ Yes |
| **Wild card** concept (change color) | Uncopyrightable | ✅ Yes |
| **"Shedding" game type** (first to empty hand wins) | Uncopyrightable | ✅ Yes |
| **Colored cards with numbers** (functional design) | Functional = uncopyrightable | ✅ Yes |
| **2–10 player count** | Facts / functional | ✅ Yes |
| **Stacking draw cards** house rule | Uncopyrightable | ✅ Yes |

**The legal precedent**: In *DaVinci Editrice S.R.L. v. Ziko Games, LLC* (2014), a U.S. federal court ruled that game mechanics and rules — even near-identical ones — do not constitute copyright infringement. Only **expressive elements** (artwork, names, specific written text) are protected.

---

## 2. The Name Change: UNO No Mercy → YOOBOO

### Why This Was the Right Call

The name "UNO No Mercy" carried two immediate legal landmines:
- **"UNO"** — registered trademark of Mattel, Inc. Direct infringement.
- **"No Mercy"** — Mattel released an official "UNO No Mercy" variant in 2023. Using this name creates confusion and implies affiliation.

### YOOBOO — Legal Assessment

| Criteria | Status |
|---|---|
| Contains "UNO" | ✅ No |
| Phonetically mimics "UNO" exactly | ✅ No (sounds distinct — "yoo-boo" vs "oo-no") |
| Implies Mattel affiliation | ✅ No |
| Potentially available as trademark | ✅ Likely (conduct a formal search) |

### Recommended Trademark Actions for YOOBOO

Before launch, complete these steps:

1. **Run a USPTO TESS search** at `tmsearch.uspto.gov` for "YOOBOO" in class 28 (games) and class 41 (entertainment services)
2. **Run a Google trademark search** and check WIPO Global Brand Database for international clearance
3. **Register YOOBOO as a trademark** in your jurisdiction (INR 4,500–9,000 in India via IP India portal; ~$350 in the US)
4. **Register the domain** `yooboo.gg` or `yooboo.io` — do this immediately, before any public launch

---

## 3. Complete List of Changes Required

Below is every change needed in the codebase, design, and content. Changes are grouped by priority.

---

### 🔴 PRIORITY 1 — Must Change Before Any Public Showing

#### 3.1 Name & Branding

| Location | Current (Risky) | Replace With |
|---|---|---|
| App title / `<title>` tag | UNO No Mercy | YOOBOO |
| All `H1` / hero headlines | UNO NO MERCY | YOOBOO |
| `package.json` name | uno-nomercy | yooboo |
| All file/folder names | `/uno-nomercy/` | `/yooboo/` |
| README.md | UNO No Mercy | YOOBOO |
| `.env` app name vars | `UNO_NOMERCY_*` | `YOOBOO_*` |
| Database table/collection names | `uno_*` | `yooboo_*` |
| All metadata / OG tags | UNO No Mercy | YOOBOO |

#### 3.2 Card Design — Artwork (Must Be 100% Original)

This is the highest-risk area. Every visual element on every card must be original.

| Card Element | UNO Approach | YOOBOO Approach (Required Change) |
|---|---|---|
| **Card shape** | Rounded rectangle | Keep rounded rectangle (functional, unprotected) — but change proportions |
| **Card background** | Solid flat colors (Red/Blue/Green/Yellow) | Use your own color palette — see Section 4.1 |
| **Center oval** | Colored oval with number | Replace oval with a different shape — diamond, hexagon, arc |
| **Number style** | Specific UNO font, tilted | Use a completely different font and layout |
| **Action card icons** | UNO's specific Skip circle, Reverse arrows, +2 design | Design completely new icons from scratch |
| **Wild card design** | Four-color pie split on black | Original wild card design — different shape, layout, color split |
| **Card back** | UNO logo on colored background | Original YOOBOO back design — no similarity to UNO back |
| **Card border** | White thin border | Your choice — just don't copy UNO's exact border style |

**Rule**: Hire a designer to create all card artwork from scratch. Do not trace, reference, or closely mimic UNO's card images. Use a design tool like Figma with no UNO assets open.

#### 3.3 Remove All UNO Terminology from Code and UI

Search your entire codebase for these strings and replace:

```bash
# Run this audit across your repo
grep -ri "uno" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.md" --include="*.css"
```

| Find | Replace With |
|---|---|
| `"uno"` | `"yooboo"` |
| `"UNO"` | `"YOOBOO"` |
| `"Wild Draw Four"` | `"Power Draw"` (or your own name) |
| `"Draw Two"` | `"Take Two"` (or your own name) |
| `"Skip"` | `"Freeze"` / `"Block"` (your choice) |
| `"Reverse"` | `"Flip"` / `"Echo"` (your choice) |
| `"Wild"` | `"Chaos"` / `"Shift"` (your choice) |
| No Mercy (mode) | `"Brutal Mode"` / `"Rage Mode"` (your choice) |
| `"Mattel"` | Remove entirely |

---

### 🟠 PRIORITY 2 — Change Before Beta / Any Public Release

#### 3.4 Color Palette — Differentiate

UNO uses a very specific four-color system: **Red, Blue, Green, Yellow** on white cards. You are free to use colors (colors alone aren't protected), but using the *exact same four colors in the same role* strengthens a trade dress claim. Differentiate:

| UNO Color | Risk | YOOBOO Alternative |
|---|---|---|
| Red | Low (generic) | Keep red, or shift to Crimson / Coral |
| Blue | Low (generic) | Keep blue, or shift to Cobalt / Teal |
| Green | Low (generic) | Shift to Emerald / Lime to distinguish |
| Yellow | Medium (very UNO-associated) | Replace with **Purple**, **Orange**, or **Gold** |

**Recommended YOOBOO 4-color system**: Crimson · Cobalt · Emerald · Violet — visually distinct from UNO's palette.

#### 3.5 Card Count & Deck Structure

UNO uses a **108-card deck** with a specific distribution. You are free to use any structure, but differentiate anyway:

| UNO Deck | YOOBOO Option |
|---|---|
| 4 colors × 0–9 (×2) + action cards | Consider 4 colors × 1–8 or 1–10 |
| 108 total cards | 96 or 112 — just make it yours |
| 3 types of action cards (Skip, Reverse, Draw 2) | Add new unique action cards |
| 4 Wild + 4 Wild Draw 4 | Rename and redesign |

Add at least **2 original action card types** that UNO doesn't have. This signals innovation, not copying.

#### 3.6 Game Rule Naming — Rename Everything

Rules themselves are free to copy. The *names* and *written descriptions* are expressive and can be protected.

| UNO Rule Name | YOOBOO Alternative |
|---|---|
| "Wild Draw Four" | "Power Surge" / "Mega Draw" |
| "Draw Two" | "Double Tap" |
| "Skip" | "Freeze" |
| "Reverse" | "Flip" |
| "Wild" | "Chaos Card" / "Shift" |
| "UNO!" (the call) | **"YOOBOO!"** — your signature mechanic call |
| "No Mercy" mode | "Rage Mode" / "Brutal Mode" |

**Critical**: The in-game shout when a player has one card left should be **"YOOBOO!"** — not "UNO!" This is your brand moment.

---

### 🟡 PRIORITY 3 — Polish Before Full Launch

#### 3.7 Written Rules & In-App Text

Do not copy UNO's rulebook text. Write all rules in your own voice:

- The **concept** of the rules can be the same (match color/number, first to empty hand wins)
- The **written expression** must be 100% original
- Aim for a distinctive tone — YOOBOO should have its own personality in its text

#### 3.8 Add a Disclaimer (Recommended, Not Required)

Add this to your footer, About page, and App Store description:

```
YOOBOO is an independent game and is not affiliated with any person or organization.
```

This is not legally required (you're not using their trademark), but it signals good faith and reduces any ambiguity.

#### 3.9 Register Your Own Copyright

Once your card artwork, logo, and rulebook text are finalized:
- Register YOOBOO's artwork with the **Copyright Office** (India: `copyright.gov.in`; US: `copyright.gov`)
- This establishes your creation date and makes enforcement in court much easier
- Cost: ~₹500–2,000 per work in India

---

## 4. YOOBOO Identity — What to Build Instead

Rather than just "removing UNO things," use this moment to build YOOBOO as a genuinely distinct brand.

### 4.1 YOOBOO Original Card Design Spec

```
Card dimensions:  63mm × 88mm (standard TCG size — functional, unprotected)
Card shape:       Rounded rectangle, 8px corner radius
Card face:

  ┌──────────────────────────┐
  │  [top-left: small num]   │  ← top & bottom mirrored
  │                          │
  │   [large center gem      │  ← diamond/hexagon shape, NOT oval
  │    with number inside]   │     completely original artwork
  │                          │
  │  [bottom-right: small]   │
  └──────────────────────────┘

Color system: Crimson · Cobalt · Emerald · Violet
Card back:    YOOBOO logo centered, dark background, original pattern
```

### 4.2 YOOBOO Original Action Cards

Beyond renaming UNO's cards, add these original mechanics to make YOOBOO genuinely different:

| Card Name | Mechanic | Unique to YOOBOO |
|---|---|---|
| **Power Surge** | Draw 4, change color | Renamed Wild Draw 4 |
| **Double Tap** | Next player draws 2 | Renamed Draw 2 |
| **Freeze** | Skip next player | Renamed Skip |
| **Flip** | Reverse play direction | Renamed Reverse |
| **Chaos Shift** | Change color freely | Renamed Wild |
| **🆕 Bounce** | Redirect a draw to any player | Original — not in UNO |
| **🆕 Mirror** | Copy the last card played again | Original — not in UNO |
| **🆕 Steal** | Take a card from another player's hand | Original — not in UNO |

The 3 original cards above make YOOBOO mechanically distinct, not just a reskin.

### 4.3 YOOBOO Brand Voice

Establish a personality that is distinctly not UNO:

```
UNO:    Family, classic, friendly, red-dominant
YOOBOO: Cinematic, edgy, premium, high-stakes energy
        "The table has no mercy. Neither do we."
        "Play bold. Play YOOBOO."
```

---

## 5. DeepSeek AI Integration — Copyright Considerations

Since YOOBOO uses DeepSeek for AI opponents and lobby recommendations, additional considerations apply:

- The **AI's game strategy logic** is yours — no IP issue
- Do not train or prompt the AI using text copied from UNO rulebooks or Mattel marketing
- Ensure AI-generated text in the UI (lobby suggestions, taunts, tips) references YOOBOO terminology, not UNO card names
- Example: AI should say "You have a Freeze card — use it!" not "You have a Skip card"

---

## 6. Pre-Launch Legal Checklist

Use this as a final gate before any public release.

### Branding
- [ ] "UNO" removed from all UI, code, metadata, and assets
- [ ] "No Mercy" removed from all branding
- [ ] "YOOBOO" trademark search completed (USPTO / IP India)
- [ ] YOOBOO domain registered
- [ ] Disclaimer added to footer and app store listing

### Card Design
- [ ] All card artwork is 100% original (no UNO reference assets used)
- [ ] Card center shape is not an oval (UNO uses oval)
- [ ] Color palette is visually distinct from UNO's Red/Blue/Green/Yellow
- [ ] Card back design is fully original
- [ ] UNO font/typography not used anywhere on cards

### Naming & Terminology
- [ ] All card types renamed (no "Wild Draw Four", "Skip", "Draw Two", "Reverse" as-is)
- [ ] The victory call is "YOOBOO!" not "UNO!"
- [ ] All in-game text is original writing, not copied from UNO rules
- [ ] Game modes have original names (not "No Mercy")

### Legal
- [ ] Copyright registered for YOOBOO card artwork and logo
- [ ] IP attorney reviewed before commercial launch (paid app, in-app purchases, or ads)
- [ ] No Mattel/UNO assets, screenshots, or references in marketing materials

---

## 7. Summary — What You Can and Cannot Do

### ✅ Safe — You Can Do This
- Build a shedding-type card game where players match colors and numbers
- First player to empty their hand wins
- Include Skip, Reverse, Draw 2, and Wild card *mechanics*
- Stack draw cards as a mode/rule
- Have 2–10 players
- Use 4 colors on your cards
- Charge money for your game

### ❌ Risky — Do Not Do This
- Use "UNO" or "No Mercy" anywhere in the product
- Copy UNO's card artwork or logo
- Use UNO's exact color + oval + number card layout
- Copy the text of UNO's rulebook
- Use Mattel's marketing images in your promotional material
- Name cards exactly as UNO does ("Wild Draw Four", "Skip", etc.)
- Show UNO cards in screenshots or trailers

---

## 8. Recommended Next Steps

1. **This week**: Run full codebase find-replace for "uno" → "yooboo" and all card name strings
2. **This week**: Commission original card artwork from a designer (provide YOOBOO spec in Section 4.1)
3. **Next 2 weeks**: File trademark application for YOOBOO
4. **Before beta**: Have one IP attorney do a 1-hour review (most charge ₹5,000–15,000 / $100–300 for a quick audit)
5. **Before launch**: Ensure all in-game text, help docs, and AI prompts use YOOBOO terminology exclusively

---

*Document version: 1.0 — YOOBOO Pre-Launch IP Compliance*
*Last updated: May 2026*
