# Frontend

React + Vite + TypeScript + Tailwind + shadcn/ui + React Router + TanStack Query + Framer Motion.

## Feature-folder convention

```
src/features/<feature>/
  api/          one file per feature, thin fetch wrappers
  hooks/        TanStack Query hooks built on top of api/
  components/   feature-specific UI
  types/        local types (see "no shared types" below)
```

Cross-cutting, non-feature UI (layout, generic shadcn primitives, motion helpers) lives in `src/components/`. Anything reusable enough to belong there must have no dependency on a specific feature's data.

## Routing map

- `/` → `HomePage`, assembling section components in order: Hero → About → Experience → Skills → Projects → Playground → Contact.
- `/projects/:slug` → `ProjectDetailPage`.
- `*` → `NotFoundPage`.

These routes render inside `RootLayout` (`Header` + `<Outlet/>` + `Footer`).

- `/admin/login` → `AdminLoginPage` (public).
- `/admin/*` → gated by `ProtectedRoute` (redirects to `/admin/login` if `useMe()` fails), then rendered inside `AdminLayout` (its own header/nav — not the public site chrome): `/admin/dashboard`, `/admin/projects`, `/admin/messages`.

## Data fetching

`src/lib/api-client.ts` is a thin `fetch` wrapper (base URL from the runtime `window.__APP_CONFIG__`, falling back to the build-time `VITE_API_BASE_URL` — see `architecture.md`; throws on non-2xx). There is no shared global data-fetching layer beyond that — each feature owns its own `api.ts` and TanStack Query hook(s) (`useProjects`, `useProject(slug)`, `useSubmitContact`, `useGithubActivity`). Query keys are scoped per feature (e.g. `['projects']`, `['projects', slug]`).

No Redux, no Zustand, no global client state store — React Query covers server state, and the only client-only state (theme) is small enough for a dedicated context (`theme-provider.tsx`).

## Styling and components

Tailwind is the styling layer; shadcn/ui primitives are added only when a feature actually needs them (`button`, `card`, `badge` for tech-stack tags, plus `input`/`textarea`/`label` once the contact form needed real form fields). Don't pre-install shadcn components speculatively. Primitives here are hand-written following shadcn's copy-paste convention (`cn` + `class-variance-authority`) rather than pulled from the shadcn CLI, to avoid a network dependency during scaffolding — behavior is identical.

## Framer Motion

Use fade, slide, stagger, and layout animations only — see `design-system.md` for exact timing values. No bounce, no spin, no exaggerated effects. Prefer a small set of shared variants (`src/components/motion/FadeIn.tsx`) over one-off animation configs scattered across components.

## Markdown rendering

`react-markdown` renders `Project.content` on `ProjectDetailPage` only — it's not needed anywhere else yet, so it isn't wired into a shared layout.

## Dark mode

A small custom `theme-provider.tsx` (~30 lines): reads/writes `localStorage`, toggles a class on `<html>`. Default theme is `dark` (dark-mode-first, per the design brief). No `next-themes` dependency — this isn't a Next.js app, and the actual need (persist + toggle a class) doesn't justify an external package.

## SEO: the CSR trade-off

This is a Vite SPA, not a Next.js app — there is no server-side rendering, so crawlers that don't execute JavaScript see a near-empty shell on first response. This is a known, accepted trade-off of the stack choice in `instructions.md`, not an oversight.

Mitigations actually in place:
- `react-helmet-async` sets per-page `<title>`, meta description, and OG tags client-side.
- Static `robots.txt` and a minimal `sitemap.xml` covering static routes.

Explicitly deferred: dynamic sitemap entries per project slug (needs either a build-time API call or a backend-served sitemap), and any SSR/prerendering exploration — see `roadmap.md`.

## Analytics

Two independent things, both called "analytics" — don't conflate them:

- `src/lib/analytics.ts` conditionally injects a single script tag only if `VITE_ANALYTICS_SCRIPT_URL` (and a site-id var) are set at build time. No vendor is hardcoded — this works with Plausible, Umami, or similar, and is a no-op if the env vars are absent. (Phase 3 item, still unconfigured.)
- `features/analytics/` is the first-party, in-house page-view tracker feeding the admin dashboard (Phase 5). `PageViewTracker` (mounted once at the router root, inside `BrowserRouter`) calls `useTrackPageView()`, which fires a `POST /analytics/track` beacon on every `useLocation()` change — skipped for `/admin/*` paths so the owner's own visits don't skew their own stats. Best-effort: a failed beacon is swallowed, never surfaced to the visitor. See `backend.md` for what the backend derives from that request server-side.

## Admin dashboard (`features/admin/`, `features/auth/`, `features/analytics/`)

- `features/auth/` — `useMe()`/`useLogin()`/`useLogout()` (TanStack Query on top of `/auth/*`). `apiFetch` always sends `credentials: 'include'` so the httpOnly admin cookie round-trips to `api.<domain>` (harmless for anonymous requests — there's simply no cookie yet).
- `features/admin/components/ProtectedRoute.tsx` gates the `/admin/*` subtree; `AdminLayout` is a separate shell from the public `RootLayout` (own nav: Dashboard/Projets/Messages + logout).
- Charts and ranked breakdowns (`features/analytics/components/TimeSeriesChart.tsx`, `RankedList.tsx`) are hand-rolled (inline SVG / styled lists), not a charting library — the design system (`design-system.md`) has exactly one accent color and no categorical palette, so a magnitude/ranked-list encoding (one hue, varying bar length) fits without inventing new colors or a dependency. Followed the `dataviz` skill's procedure (form → color → hover interaction → legend) rather than reaching for a library by default.
- Project create/edit (`features/admin/components/ProjectForm.tsx`) reuses the existing `Button`/`Input`/`Label`/`Textarea` primitives and the react-hook-form + zod pattern from the contact form — no new `table`/`dialog`/`toast` primitives were needed; edit is a full-page form swap, not a modal, and save/delete feedback is inline text, matching `ContactSection`'s existing convention.
- Deliberately **not** wired into i18n: the admin UI is a private tool for the site owner, not indexed/public content, so it's French-only hardcoded strings rather than extending the `locales/en`+`fr` JSON machinery to a surface with one audience of one.

## Types: no shared package with the backend

`features/projects/types/project.types.ts` duplicates the shape of the backend's response DTOs by hand rather than importing from a shared workspace package. This is consistent with the two-folder-monorepo decision in `architecture.md` — if this duplication becomes a real maintenance burden, the fix is a shared types package, not before.

**Reviewed 2026-08-03 (Phase 4):** three shapes are hand-duplicated today — `ProjectSummary`/`ProjectDetail` (mirrors `ProjectSummaryDto`/`ProjectDetailDto`) and `GithubActivityItem` (mirrors `GithubActivityItemDto`). The contact form's `ContactFormValues` looks like a fourth, but it isn't one to fix — its Zod schema exists for translated, UX-facing validation messages, a concern the backend's `class-validator` DTO doesn't share, so the two are meant to diverge even if a types package existed. All three real duplicates have been stable since Phase 1 with zero drift incidents. Conclusion: still not worth a workspace package — the tooling cost (root manifest, workspace-aware scripts/CI, an extra build step) outweighs keeping three small, rarely-changed shapes in sync by hand. Revisit again if a shape starts changing often, a fourth or fifth genuine duplicate appears, or a drift bug actually ships.
