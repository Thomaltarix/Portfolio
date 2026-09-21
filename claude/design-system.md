# Design System

Visual language reference — creative/visual decisions that will shift with taste over time, kept separate from the behavioral rules in the root `CLAUDE.md`.

## Direction — "Ascension" (Phase 6, replaces "Monolith" and "Schematic")

The site is a climb. It opens on a full-bleed photograph of Mount Fuji at dawn (taken by the owner at Lake Kawaguchi, 830 m, 1 January 2026) and the page rises toward the summit: the experience section is a trail that draws itself, and Contact is the summit, set on a second photo of the lake reflection. Palette, weight and mood come from the photograph: dawn slate, snow white, one sunrise-vermilion accent, and light-weight (300) type at large sizes.

The test for any visual addition: does it belong to the climb, or is it decoration? If decoration, cut it.

Photos live in `frontend/public/images/`, exported from the full-resolution originals (colour-managed to sRGB, light contrast/clarity pass, sharpened after downscale) as `fuji-dawn-{1600,2560,3840}.webp` and `fuji-reflection-{1600,2560}.webp`, served through `srcSet`. Both are the owner's own; nobody appears in them. Any other image must also be the owner's own or licensed.

History of what was explored and rejected (don't re-propose without new information):
- "Premium SaaS" (Linear/Vercel/Raycast/Supabase/Stripe) — too generic.
- "Schematic" (indigo-slate + copper, blueprint grid) and "Monolith" (cool near-black + cobalt, bento, editorial rows) — both retired; the owner wanted something prettier and more classic, anchored in a real photograph.
- Three concept previews shown and declined: railway signal-box lever frame, metro line diagram, Rietveld sliding planes.
- A scroll-linked altitude gauge (830 m to 3 776 m) on the right edge — built, then removed: it added nothing the header progress line doesn't already say.
- A live "request lifecycle" demo, literal document-cosplay (datasheet, patent), a serif "print journal" direction, a maximalist color-block direction, an acid-lime accent.

## Explicit anti-patterns

Never use these, even if asked for "polish":

- Skill progress bars.
- Decorative gradients, glows, outer halos.
- Bouncing, spinning, or exaggerated motion.
- Particle effects, glassmorphism-for-its-own-sake, animated blobs. (The header pill's `backdrop-blur` is a functional exception: it keeps content legible while scrolling underneath.)
- Generic "AI portfolio" layouts (centered hero with a giant emoji avatar, rainbow gradient headline text, etc).
- A kicker/eyebrow label above a heading, and numbered section markers (01 / 02 / 03). The heading carries its own weight.
- Nested cards, and grids of identical icon + heading + text cards.
- Monospace used as costume. It is reserved for data (the hero "Stack" value, code, measurements).
- Literally impersonating a real-world document format (datasheet, patent, terminal session).

## Color

Tokens live in `frontend/src/styles/globals.css`; this doc describes intent. Dark is the default. Both themes share one cool-neutral family and one accent.

| Token | Dark | Light |
| --- | --- | --- |
| `--background` | `#0d1116` | `#f4f3ef` |
| `--surface` | `#141a21` | `#eae8e2` |
| `--border` | `#232c36` | `#d6d3cb` |
| `--foreground` | `#eceae4` | `#10141a` |
| `--muted-foreground` | `#97a1ad` | `#5a6470` |
| `--accent` | `#f0906a` | `#b8431f` |
| `--accent-foreground` | `#1a0c06` | `#fff8f4` |

- Accent (sunrise vermilion): primary buttons, the trail line and its dots, job roles, link hovers. Nothing else.
- Accent contrast is WCAG AA (dark ~8.4:1, light ~5.4:1). Re-check when changing values.
- Text that sits on a photograph uses fixed colours, not tokens (the hero headline is ink `#0d1116` on the sky; the Contact copy is light on a 75% dark scrim), because the photo does not change with the theme. The bottom of the hero fades into `--background` so the theme still owns everything below the mountain.

## Typography

- **Geist Variable** for all text, **Geist Mono Variable** for data only (dates, the stack line, contact addresses), self-hosted through `@fontsource-variable/*` (no third-party font CDN; the privacy policy relies on that).
- Section headings use weight **300**, `tracking-[-0.03em]` (never tighter than -0.04em), `leading-[1.08]`. The hero headline is the exception: **semibold (600)**, 2rem → 2.75rem → `lg:` 3.25rem, in a `54rem` column: measured, that is the width range where both French and English wrap onto exactly three lines. Copy set directly on the photo (the hero subtitle) uses a soft halo in the page-background colour (`text-shadow` with `var(--background)`) so it stays legible where the photo is pale. Section headings `text-4xl` → `lg:text-6xl`.
- Body `text-lg`/`text-base`, muted color for secondary text, measure around 65ch. `text-wrap: balance` on headings and `pretty` on paragraphs (global).

## Shape

Interactive controls are pills (`rounded-full`); containers use `rounded-lg` (`--radius` = 1.25rem); inputs `rounded-lg`. Separation is a 1px border, not a shadow.

## Layout

- Content column `max-w-6xl`, `px-6`, sections `py-32`.
- **Header**: the floating pill, sticky, with a reading-progress accent line on its bottom edge and the active section highlighted (`useActiveSection`). The hero is pulled up under it (`-mt-[4.5rem]`) so the photo runs behind the pill.
- **Hero**: full-viewport photo, headline in the sky, then subtitle, two CTAs and a three-column facts list, with a one-line photo caption. A parallax drift on the photo as you leave.
- **About**: a large light-weight statement (first paragraph) beside the heading, the supporting paragraphs in two columns underneath.
- **Experience**: a vertical trail; the accent line is scroll-linked (`useScroll`) and each entry has a dot on it.
- **Skills**: a definition list, one row per group; the lead item is bright, the others muted.
- **Projects**: two-column grid of large cards (`ProjectCard`), title in light weight, stack badges at the bottom, a View Transition to the detail page (`view-transition-name: project-<slug>` on both pages).
- **Contact**: the summit. Full-bleed reflection photo under a dark scrim, copy on the left, the form in a themed panel on the right.

## Motion

- One authored entrance in the hero (16px rise, exponential ease-out, staggered 100–180ms); sections fade/slide in once with `FadeIn`. The scroll-linked pieces (trail, header progress, hero drift) all use Framer Motion's `useScroll`, never a scroll listener.
- Ease-out only for entrances and hover (`--ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1)`); never ease-in on UI. UI motion stays under 300ms except entrances (400–700ms).
- Buttons scale to 0.97 on `:active`; hover styles are gated by `@media (hover: hover)`.
- `prefers-reduced-motion`: the hero entrance and drift and the trail animation are skipped entirely (the trail shows fully drawn), and view transitions are disabled.
- Nothing animates on keyboard-driven actions (the ⌘K palette stays instant).

## Mobile

The site is designed phone-first at 360–390px and scales up; the breakpoint that matters is `md` (768px).

- **Navigation**: below `md` the header pill keeps only the name and a menu button. The button opens a sheet under the pill (`MobileMenu`) with the five sections as 56px rows, the résumé downloads (48px), and the language and theme toggles. It closes on link click, Escape, outside tap and route change. From `md` up the pill shows the inline nav and controls as before.
- **Touch targets**: at least 44px. Buttons grow on coarse pointers (`[@media(pointer:coarse)]`), and text links get vertical padding (`py-3`) rather than a bigger font. Hover styles are gated to real pointers.
- **Forms**: inputs and textareas are 16px on phones (below that iOS zooms the page on focus) and 48px tall; the desktop 14px / 40px applies from `sm` up.
- **Hero**: the two calls to action are full width and stacked below `sm`; the title steps 28px → 32px (≥ 400px) → 44px (`sm`) → 52px (`lg`). The photo is not stretched over the whole (tall) hero on phones: it is `150vw` tall, aligned to the top, with its own fade at the bottom (`80vw`–`150vw`), and the title block reserves `135vw` so the mountain sits between the title and the copy. The scroll drift is disabled there. From `sm` up the photo fills the hero as before.
- **Rhythm**: sections use `py-20` on phones and `py-32` from `md`; cards use `p-6` on phones and `p-8` from `sm`.
- **Overflow**: no page may scroll horizontally at 360px. Markdown tables and code blocks scroll inside their own box.
- **How to test**: Chrome will not go below about 500px, so load the site in an `<iframe width="360">` (same origin) and compare `scrollWidth` with `innerWidth`.

## Accessibility

- WCAG AA contrast in both themes, visible `:focus-visible` outline in the accent color, selection color themed from the palette.
- Every layout must be checked in French (the longer locale) and English, dark and light, at desktop and phone width.
