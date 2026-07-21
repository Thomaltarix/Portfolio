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

Both routes render inside `RootLayout` (`Header` + `<Outlet/>` + `Footer`).

## Data fetching

`src/lib/api-client.ts` is a thin `fetch` wrapper (base URL from `VITE_API_BASE_URL`, throws on non-2xx). There is no shared global data-fetching layer beyond that — each feature owns its own `api.ts` and TanStack Query hook(s) (`useProjects`, `useProject(slug)`, `useSubmitContact`, `useGithubActivity`). Query keys are scoped per feature (e.g. `['projects']`, `['projects', slug]`).

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

`src/lib/analytics.ts` conditionally injects a single script tag only if `VITE_ANALYTICS_SCRIPT_URL` (and a site-id var) are set at build time. No vendor is hardcoded — this works with Plausible, Umami, or similar, and is a no-op if the env vars are absent.

## Types: no shared package with the backend

`features/projects/types/project.types.ts` duplicates the shape of the backend's response DTOs by hand rather than importing from a shared workspace package. This is consistent with the two-folder-monorepo decision in `architecture.md` — if this duplication becomes a real maintenance burden, the fix is a shared types package, not before.
