# UNO No Mercy Homepage Design Brief

## Project Overview

This document defines the homepage design direction for a Next.js project based on **UNO Show 'Em No Mercy**, adapted here as **UNO No Mercy**. The game is a harsher, more chaotic variant of classic UNO, built around a larger 168-card deck, stacking penalties, high-impact action cards, forced hand swaps, and a Mercy rule that knocks players out when they reach 25 or more cards.[cite:28][cite:34] The homepage should communicate that this is not a soft family-card experience; it is tense, competitive, dramatic, and slightly dangerous in tone.[cite:34][cite:37]

The page should feel like a premium interactive game landing screen: cinematic, dark, glossy, physically layered, and highly animated. It should sell the fantasy of escalation, retaliation, and survival while remaining clear enough to guide users into gameplay, matchmaking, or onboarding. The intended technical stack is Next.js with integrated **ui-ux-pro** and **Framer Motion**, and the project will use DeepSeek models for AI-assisted systems and game-adjacent intelligence.

## Product Intent

UNO No Mercy is defined by two emotional pillars: **chaos** and **control**. The official rules emphasize penalty stacking, stronger draw cards such as +6 and +10, hand-swapping via 7s, full-table hand passing via 0s, and elimination through the Mercy rule.[cite:28][cite:34] This means the homepage must avoid generic “party game” visuals and instead frame the product as a high-stakes social battle with momentum swings, tactical retaliation, and spectacle.[cite:30][cite:34]

The design should make players feel three things within the first five seconds:
- This game is intense.
- This game is polished and modern.
- This game is ready to play now.

## Design Vision

The homepage should be **3D-animated, realistic, and immersive**. The visual language should borrow from premium game launchers, modern cinematic product pages, and tactile tabletop realism rather than flat casual-game UI. Cards should look physically present, with believable thickness, edge highlights, subtle wear, shadows, and depth stacking. Motion should suggest real forces such as slide, snap, tilt, collision, hover lift, and deck compression.

The overall art direction should be:
- Dark base with high-contrast saturated card colors.
- Glossy, premium surfaces with soft reflections.
- Realistic card-table atmosphere, not cartoon casino styling.
- Aggressive but controlled motion.
- Bold typography with compact, game-grade UI.
- Clear call-to-action hierarchy.

A good mental model is: **“tabletop brutality meets premium game launcher.”**

## Audience

The homepage is for:
- Players already familiar with UNO who want a more extreme version.[cite:34][cite:37]
- New visitors attracted by intense multiplayer card gameplay.
- Social players who enjoy party competition and revenge mechanics.
- Mobile and desktop users entering a fast game session.

The experience must therefore balance spectacle with usability. The first screen should impress immediately, but navigation and actions must remain obvious.

## Brand Personality

The brand should feel:
- Ruthless
- Electric
- Competitive
- Tactical
- Premium
- Social
- Volatile

Avoid making it feel childish, overly comic, or meme-based. The tone can be playful, but the presentation should stay sharp and elevated.

## Homepage Goals

The homepage should do the following:
- Establish a strong visual identity in the first viewport.
- Explain, at a glance, why UNO No Mercy differs from classic UNO.[cite:34][cite:37]
- Present one primary action immediately, such as **Play Now**.
- Offer secondary actions such as **Learn Rules**, **How It Works**, or **Watch Gameplay**.
- Preview the major mechanics: stacking, Mercy rule, 7’s Swap, 0’s Pass, brutal action cards.[cite:28][cite:34]
- Build trust through polished UX and responsive motion.
- Set up a reusable visual system for later pages such as lobby, matchmaking, profile, and match view.

## Homepage Information Architecture

Recommended homepage structure:

1. Hero section
2. Core mechanics strip
3. Featured action cards / chaos showcase
4. “Why No Mercy” explanation section
5. Gameplay preview / interactive 3D card moment
6. CTA section for play or sign-in

This structure keeps the first screen focused while allowing the rest of the page to educate and convert.

## Hero Section

The hero must be the strongest part of the page.

### Hero content
- Primary headline: short, brutal, and memorable.
- Subheadline: explain this is UNO pushed into a harsher competitive format with stacking penalties and elimination mechanics.[cite:34][cite:37]
- Primary CTA: **Play Now**.
- Secondary CTA: **View Rules** or **How It Works**.
- Optional tertiary microcopy: player count or quick pitch such as “Stack. Swap. Survive.”

### Hero visual system
The hero should feature a cinematic 3D card composition suspended above or emerging from a realistic table-like environment. The layout can include:
- A central glowing deck stack.
- 3D hero cards fanned in perspective.
- One or two oversized special cards such as Wild Draw 10 or Skip Everyone featured as dominant visual anchors, since these cards help signal the “No Mercy” identity.[cite:34]
- Floating particles, subtle embers, dust, or energy streaks kept low-opacity.
- A volumetric spotlight or directional rim light to separate cards from background.

### Hero motion behavior
- Cards slowly hover with independent depth offsets.
- Mouse move produces a subtle parallax tilt across the entire card cluster.
- Hovering a featured card increases scale slightly, sharpens shadow, and reveals card metadata.
- CTA buttons should feel pressure-based: compress on tap, rebound on release.
- On first load, cards should assemble into scene rather than simply fade in.

The motion should feel expensive. Avoid fast, floaty, random movement.

## Visual Theme

### Color direction
Base palette:
- Near-black charcoal background.
- Deep graphite and brushed-dark surfaces.
- Card colors as primary accents: red, yellow, blue, green.
- High-danger accent for No Mercy moments: molten red or hot orange.
- Limited glow for interactive moments, not constant neon.

Suggested semantic usage:
- Red/orange for danger, elimination, penalty, stack escalation.
- Yellow for volatility and warning.
- Blue/green to balance classic UNO recognition.
- White or warm-gray for text on dark surfaces.

The page should remain mostly dark so the cards become the brightest objects.

### Texture and materials
Use realistic material cues:
- Slight table grain or matte felt-inspired surface, but more premium and modern than casino green.
- Plastic-laminated card reflections.
- Soft bevel and edge highlights on cards.
- Fine grain/noise overlay on background for realism.
- Shadow layering that communicates real depth.

## Typography

Use a bold display font for headlines and a clean modern sans-serif for UI and body content. The typography should feel compact, high-energy, and game-native.

Recommended approach:
- Headlines: condensed or semi-condensed, powerful, uppercase-friendly.
- Body/UI: highly legible sans for buttons, stats, labels, tabs.
- Numbers and effect values such as +10 should feel iconic and heavy.

Tone rules:
- Headings should be short.
- Supporting copy should be concise.
- Buttons should use direct verbs.
- Avoid long marketing paragraphs.

## Motion Principles

Since Framer Motion is already in the repo, motion should be a first-class layer of the design.

### Motion characteristics
- Sharp entry, smooth settle.
- Tension before release.
- Visible weight.
- Micro-interactions on every clickable high-value element.
- Reduced motion fallback for accessibility.

### Motion patterns to use
- Spring-based card movement.
- Layered parallax in hero.
- Scroll-driven reveals for mechanics sections.
- Flip or fan animations for card showcases.
- Count-up or surge effects for penalties like +2, +4, +6, +10.
- Animated stack buildup that visually communicates escalation.[cite:28][cite:34]

### Motion patterns to avoid
- Random floating blobs.
- Generic SaaS fade-up on every section.
- Overused neon trails.
- Constant pulsing everywhere.
- Cartoon bounce easing.

## 3D and Realism Direction

The user requirement is that the homepage should feel **very 3D, animated, and realistic**. That should be achieved through composition and motion even if the implementation starts with DOM, CSS transforms, and Framer Motion before adding full WebGL.

### Level 1 implementation target
For the first production version, a realistic 3D feel can be achieved with:
- Perspective camera-style layout using CSS perspective.
- Layered card planes with depth-aware shadows.
- Multi-plane parallax on cursor movement.
- Reflection overlays and anisotropic gloss effects.
- Animated deck stacks and card fan geometry.
- Strong lighting simulation via gradients and shadows.

### Level 2 enhancement target
If later needed, the hero can evolve into a full WebGL or Three.js presentation with:
- Real 3D card meshes.
- Physics-based shuffle/spread interactions.
- Dynamic lighting.
- Card flip simulation.
- Particle atmosphere.

For now, the design should be written so that Level 1 is sufficient and production-friendly in Next.js.

## Key Homepage Sections

### 1. Hero: Play the brutal version of UNO
This section should sell the fantasy instantly. It should visually imply stacking penalties, chaos, and survival rather than explaining rules in detail.[cite:34]

### 2. Mechanics strip
Show 4 key mechanics as premium interactive cards:
- **Stacking** — chain penalties and pass the pain onward.[cite:34]
- **Mercy Rule** — 25 cards and you are out.[cite:34]
- **7’s Swap** — steal or dump a hand strategically.[cite:34]
- **0’s Pass** — rotate every hand across the table.[cite:34]

Each mechanic card should animate on hover, with a small visual simulation rather than static icons.

### 3. Action card showcase
Feature the cards that make the variant feel extreme:
- Wild Draw 6
- Wild Draw 10
- Skip Everyone
- Discard All
- Wild Reverse Draw 4
- Wild Color Roulette[cite:34]

This area should feel like a premium character roster, but for cards. Each card tile should have depth, rarity-like emphasis, and a dramatic hover state.

### 4. Why No Mercy section
Explain the difference from classic UNO in a simple narrative:
- More cards.
- Tougher penalties.
- Elimination is possible.
- Tactical retaliation matters more.[cite:28][cite:34]

This section should help visitors understand that the homepage is not just a visual skin over standard UNO.

### 5. Gameplay preview section
Create an animated mock interaction such as:
- A stack of draw cards increasing from +2 to +10.
- A hand count rising toward the 25-card Mercy threshold.[cite:34]
- A forced swap moment when a 7 is played.[cite:34]

This is one of the best places to use Framer Motion to demonstrate the game’s identity without requiring users to read dense text.

### 6. CTA conversion section
End with a cleaner section that restores focus:
- Primary CTA: Play Now.
- Secondary CTA: Sign In / Continue / View Rules.
- Minimal copy.
- Reduced visual noise.

## UI Components Needed

The homepage design system should include:
- Header / top nav
- Primary CTA button
- Secondary ghost button
- 3D action card component
- Mechanics info card
- Section label / eyebrow
- Animated stat chip
- Rule tag / badge
- Modal or drawer trigger for quick rules
- Responsive bottom CTA pattern for mobile

## Header Design

The header should be lightweight and premium, not bulky.

Recommended elements:
- UNO No Mercy wordmark / logo
- Nav items: Home, Rules, Modes, About
- Theme-safe but dark-first styling
- Play Now button on the right

Behavior:
- Transparent or translucent at top.
- Gains blur and subtle border on scroll.
- Slight collapse on scroll for focus.

## CTA Design

The primary CTA should feel like a game start button, not a normal website button.

Characteristics:
- Strong fill color, likely danger red or heated orange.
- Slight inner glow or gloss sweep.
- Press animation with depth compression.
- Distinct hover state.
- Large enough to be thumb-friendly on mobile.

Secondary CTA should be lower contrast and more minimal, ideally transparent or dark glass.

## Card Component Design

Because the game is card-first, card components must be the star of the UI.

Each card component should support:
- Front-face artwork.
- Subtle 3D tilt.
- Edge highlight.
- Heavy but realistic shadow.
- Hover lift.
- Optional backside texture.
- Status overlays such as “Stackable”, “Penalty”, “Wildcard”, or “Featured”.

Cards should never look flat or like pasted JPGs on a webpage.

## Content and Copy Tone

Homepage copy should be concise, sharp, and active.

Examples of acceptable tone:
- Stack the pain.
- Swap hands. Burn bridges.
- Hit 25 cards. You’re out.
- Not classic. Not kind.
- Every turn escalates.

Copy should sound modern and game-native, not corporate.

## UX Strategy

The homepage must not become visually overwhelming. Realism and animation are valuable only if the layout still converts.

UX rules:
- Keep one dominant CTA in each viewport.
- Left-align most supporting content for readability.
- Use animation to explain mechanics, not distract from them.
- Preserve performance on mid-tier devices.
- Respect reduced motion settings.
- Keep tap targets large on mobile.

## Mobile Behavior

Mobile should not be a reduced-quality afterthought.

Requirements:
- Hero composition stacks vertically while preserving the 3D card moment.
- Primary CTA remains visible without scrolling too far.
- Card hover states become tap interactions.
- Motion remains smooth but simplified.
- Sticky bottom action bar can be used for **Play Now** on mobile.

The mobile experience should feel like a premium game app landing page rather than a compressed desktop site.

## Accessibility and Performance

The page should remain practical despite its visual ambition.

Requirements:
- Maintain readable contrast on dark backgrounds.
- Provide reduced motion support for large scene animations.
- Use semantic HTML structure.
- Ensure keyboard accessibility for CTA and card interactions.
- Optimize hero assets for performance.
- Prefer GPU-friendly transforms over layout-heavy animation.
- Lazy-load below-the-fold visual assets.

## Next.js Implementation Notes

Recommended component structure:
- `HomeHero`
- `HeroCardCluster`
- `MechanicsStrip`
- `ActionCardsShowcase`
- `GameplayPreview`
- `PrimaryCTASection`
- `TopNav`

Suggested technical approach:
- Use Next.js app router component boundaries cleanly.
- Use Framer Motion for choreography, staggering, parallax mapping, and interactions.
- Use ui-ux-pro primitives where they accelerate polished layout and component consistency.
- Keep 3D illusion reusable via a shared card component system.
- Prepare hero composition so it can later be upgraded to WebGL if needed.

## DeepSeek Integration Direction

DeepSeek models are not the visual layer, but the homepage can hint at intelligent systems in the broader product if relevant. Possible future use cases include:
- adaptive onboarding,
- AI-assisted rule explanation,
- move education,
- strategy hints,
- player-facing smart summaries.

The homepage does not need to foreground AI unless the product positioning explicitly includes it. The game fantasy should remain primary.

## Suggested Visual References to Emulate

The design should take inspiration from the following qualities, not copy them literally:
- AAA game launcher landing pages for drama and polish.
- Premium card-battle interfaces for depth and lighting.
- High-end product pages for restrained layout and conversion clarity.
- Tactile tabletop photography for material realism.

## Design Do’s

- Make cards the visual heroes.
- Use realistic depth and layered shadows.
- Keep the page dark so card colors dominate.
- Show mechanics through motion.
- Make the first viewport feel premium and playable.
- Build a reusable visual system for later game surfaces.

## Design Don’ts

- Do not make it look like a generic casino site.
- Do not use childish party-game visuals.
- Do not use flat SaaS cards and standard landing-page layouts.
- Do not overfill the page with copy.
- Do not use random decorative neon effects.
- Do not let animation reduce clarity or performance.

## Open Questions

Before final implementation, these product decisions should be confirmed:

1. Is the homepage meant to be a public marketing landing page, or the signed-in app home?
2. Is the main primary action **Play Now**, **Create Room**, or **Continue**?
3. Do you already have official card artwork, or should the homepage use custom-inspired card visuals?
4. Do you want the hero built with DOM/CSS 3D plus Framer Motion only, or should the design anticipate Three.js from phase one?
5. Should the brand lean more **premium-dark realistic** or **stylized-arcade cinematic**?
6. Do you want sound-reactive or audio-aware interactions later?
7. Should DeepSeek be visible in branding, or remain purely infrastructural?

## Recommended Default Direction

Unless product answers change the scope, the recommended direction is:

- **Homepage type:** Public marketing + entry landing page.
- **Mood:** Premium-dark, cinematic, aggressive, realistic.
- **Core visual:** Central animated 3D card cluster over a dark table surface.
- **Primary CTA:** Play Now.
- **Secondary CTA:** Rules.
- **Motion style:** Framer Motion with depth, spring physics, and scroll choreography.
- **Differentiator messaging:** stack penalties, brutal action cards, Mercy elimination, tactical swaps.[cite:28][cite:34]

## Next Step

Once the open questions are answered, this design brief can be expanded into:
- a final homepage UX spec,
- a section-by-section wireframe,
- a component inventory,
- motion behavior specs,
- and a build-ready implementation plan for the Next.js repo.
