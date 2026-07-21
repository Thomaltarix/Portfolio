# Design System

Visual language reference — creative/visual decisions that will shift with taste over time, kept separate from the behavioral rules in the root `CLAUDE.md`.

## Direction

Premium SaaS, dark-mode-first. Inspired by Linear, Vercel, Raycast, Supabase, Stripe. The test for any visual addition: would this look at home in one of those products' marketing site? If not, cut it.

## Explicit anti-patterns

Never use these, even if asked for "polish":

- Skill progress bars.
- Heavy or decorative gradients.
- Bouncing, spinning, or exaggerated motion.
- Particle effects, glassmorphism-for-its-own-sake, animated blobs.
- Generic "AI portfolio" layouts (centered hero with a giant emoji avatar, rainbow gradient headline text, etc).

## Color

Dark theme is the default and primary target. Base palette:

- Background: near-black neutral (e.g. `#0A0A0B`), not pure `#000`.
- Surface/card: one step lighter than background, subtle border rather than a shadow to separate surfaces.
- Foreground text: near-white, not pure `#FFF`, to keep contrast comfortable.
- Single accent color, used sparingly (links, primary buttons, focus rings) — not a multi-color brand palette.
- Light theme mirrors the same structure inverted; both themes share the same accent hue at adjusted lightness.

Exact token values live in `frontend/src/styles/globals.css` (Tailwind CSS variables) — this doc describes the intent, the CSS file is the source of truth for values.

## Typography

- One typeface family for UI text, one (optionally) for headings if it adds real character — otherwise the same family throughout.
- A modest type scale (e.g. 12/14/16/18/24/32/48px) rather than a large arbitrary range.
- Generous line-height on body text; tighter on large headings.

## Spacing

Consistent spacing scale (Tailwind's default 4px-based scale is sufficient — no custom scale needed). Prefer generous whitespace between sections over dense stacking.

## Motion

- Duration: 150–250ms for micro-interactions (hover, focus), 300–500ms for section-level fade/slide-ins.
- Easing: standard ease-out for entrances, ease-in-out for layout transitions.
- Stagger children by ~40–60ms when animating a list (e.g. project cards) — enough to read as intentional, not slow.
- Respect `prefers-reduced-motion`.

## Layout

Centered content column with a max width (e.g. `max-w-5xl`/`max-w-6xl`), generous horizontal padding on mobile. Section boundaries communicated with whitespace and optional hairline borders, not background-color blocks or dividers with heavy styling.
