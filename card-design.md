ROLE: You are a senior game UI designer + 3D material artist for a AAA mobile card game.

TASK: Redesign the full 108-card UNO NoMercy deck for a next-gen 3D web game built in Next.js with react-three-fiber.

DESIGN DIRECTION:
- Style: "Casino Noir + Cyberpunk". Not childish. Premium, tactile, collectible.
- Materials: Photoreal PBR. Think: brushed metal numbers, liquid glass color fields, holographic foil edges, embossed UNO logo on back.
- NoMercy twist: Cards should feel AGGRESSIVE. Add subtle scratches, ink bleed, neon underglow.
- Colors: Keep UNO readability but upgrade:
    - Red: #FF003C (neon ruby, not flat)
    - Blue: #00D4FF (electric)
    - Green: #00FF88 (toxic)
    - Yellow: #FFD60A (amber gold)
    - Wild: Black base with iridescent rainbow foil
- Typography: Numbers use "Bebas Neue Bold" or "Anton", extruded 3D with bevel. Large, readable from top-down camera.

SPECIFIC CARDS TO DESIGN:
1. Number cards 0-9 (each color) - Front has giant central number with metallic finish, small corner pips
2. Action cards: +2, Skip, Reverse - Add iconography + motion trails in design
3. NoMercy specials: +4, +6, +10, Wild Draw Color, Skip Everyone - Make these LEGENDARY rarity. Black base, animated shader, skull motif subtly integrated
4. Back design: Symmetrical, dark charcoal with "NO MERCY" in chrome, red/blue edge glow that pulses

OUTPUT REQUIRED:
- 4K PNG front/back for each type (or master PSD with smart layers)
- Separate layers: base color, number, icon, foil mask, normal map, roughness map
- 3D-ready assets: Provide .glb with proper UVs for use in react-three-fiber
- Provide a style tile showing all 4 colors + wild side by side

CONSTRAINTS:
- Must read clearly at 64px size (mobile hand)
- Must look stunning at 1024px (close-up play animation)
- Keep file size <200kb per card after Basis compression
- Avoid copyrighted UNO font/logo exact copy — create original "NoMercy" wordmark