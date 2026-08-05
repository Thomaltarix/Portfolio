# Design System

Visual language reference — creative/visual decisions that will shift with taste over time, kept separate from the behavioral rules in the root `CLAUDE.md`.

## Direction — "Schematic" (Phase 6)

Replaced the original "premium SaaS" brief (Linear/Vercel/Raycast/Supabase/Stripe) after the owner found it too generic — see `roadmap.md` Phase 6 for the design-exploration history. Current direction: engineering-drawing precision. An indigo-slate ground, a single warm copper accent, and a faint blueprint-grid texture with sparse "via" dots (PCB-silkscreen adjacent, not literal graph paper) in the Hero only. The test for any visual addition now: does this look like it was engineered on purpose, or bolted on for polish? If the latter, cut it.

Explored and explicitly rejected on the way here (don't re-propose without new information):
- A live interactive "request lifecycle" demo in Playground — over-built relative to the payoff, reverted entirely.
- Literal document-cosplay (a fake component datasheet, a fake patent application) — read as costume, not identity.
- A light, editorial/serif "print journal" direction and a maximalist color-block direction — both explored as alternatives, neither chosen.

## Explicit anti-patterns

Never use these, even if asked for "polish":

- Skill progress bars.
- Heavy or decorative gradients.
- Bouncing, spinning, or exaggerated motion.
- Particle effects, glassmorphism-for-its-own-sake, animated blobs.
- Generic "AI portfolio" layouts (centered hero with a giant emoji avatar, rainbow gradient headline text, etc).
- Literally impersonating a real-world document format (datasheet, patent, terminal session) — borrow a structural idea, never the costume.

## Color

Dark theme is the default and primary target. Base palette (see `frontend/src/styles/globals.css` for exact tokens, this doc describes intent):

- Background: warm indigo-slate (`#10141a`), not a neutral near-black — the warmth is what keeps it from reading as generic "dark SaaS."
- Surface/card: one step lighter (`#171c23`), subtle border rather than a shadow to separate surfaces.
- Foreground text: warm off-white (`#e9e5da`), not pure `#FFF`.
- Single accent: copper/amber (`#d98a3d` dark, `#a8621f` light) — used sparingly (links, primary buttons, focus rings, the hairline tick before headings) — not a multi-color brand palette.
- Light theme mirrors the same structure inverted (warm paper background, ink foreground); both themes share the accent hue at adjusted lightness/saturation for contrast.

## Typography

- One typeface family for UI text (Inter). A monospace face for labels, data, and small uppercase captions ("THE STACK — RIGHT NOW", table headers, footer) — the recurring signal that something is a fact/measurement rather than prose.
- A modest type scale for body/UI text, but the Hero headline is deliberately oversized and tight (`tracking-tighter`, `leading-[1.05]`) — that contrast is intentional, not a "modest scale everywhere" rule.
- Generous line-height on body text; tighter on large headings.
- A short hairline tick (`—`) precedes the Hero kicker and every section `<h2>` (via the shared `SectionHeading` component) — the one recurring structural motif tying sections together. Don't invent a second competing motif (e.g. numbered markers) alongside it.

## Spacing

Consistent spacing scale (Tailwind's default 4px-based scale is sufficient — no custom scale needed). Prefer generous whitespace between sections over dense stacking.

## Motion

- Duration: 150–250ms for micro-interactions (hover, focus), 300–500ms for section-level fade/slide-ins.
- Easing: standard ease-out for entrances, ease-in-out for layout transitions.
- Stagger children by ~40–60ms when animating a list (e.g. project cards) — enough to read as intentional, not slow.
- Respect `prefers-reduced-motion`.

## Layout

Centered content column with a max width (e.g. `max-w-5xl`/`max-w-6xl`), generous horizontal padding on mobile. Section boundaries communicated with whitespace and optional hairline borders, not background-color blocks or dividers with heavy styling.
