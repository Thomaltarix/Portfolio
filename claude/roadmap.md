# Roadmap

Living plan — update as phases complete or priorities shift. Distinct from `README.md`, which is a static quick-start.

## Phase 0 — Documentation (done)

Root `CLAUDE.md` + this `claude/` reference set, written before any app code.

## Phase 1 — Scaffold (this pass)

A working full-stack skeleton proving the architecture end-to-end, not the finished site:

- Backend: NestJS bootstrap, Prisma + Postgres, `health`/`projects`/`contact`/`github` modules, Swagger, seed script.
- Frontend: Vite + React + TS + Tailwind + shadcn, routing, all seven sections (Hero/About/Experience/Skills/Projects/Playground/Contact) with real (if simple) implementations except Playground, which is a placeholder card.
- Dynamic projects: seeded in Postgres, served through the real API, rendered in the UI — the one genuinely working vertical slice this pass proves out.
- Contact form: persisted to Postgres, no email sending.
- GitHub activity widget: backend proxy with in-memory caching, embedded in the About section.
- Docker Compose: Postgres + backend + frontend, one-command bring-up.

## Phase 2 — Content and polish

- Real personal content (bio, experience, skills, actual project write-ups) replacing placeholders.
- Playground: actual interactive content (concept still TBD).
- Visual polish pass against `design-system.md` once real content exists to design around.

## Phase 3 — Deferred features from the original spec

- Blog: `BlogPost` Prisma model, `blog` backend module, `/blog` and `/blog/:slug` frontend routes, reusing the markdown-rendering pattern from project detail pages.
- ~~Contact-form email delivery~~ — done: `MailModule`/`MailService` wraps Resend, `ContactService` sends a best-effort notification to `CONTACT_NOTIFICATION_EMAIL` after persisting. See `backend.md`.
- Real analytics vendor account wired into the existing `VITE_ANALYTICS_SCRIPT_URL` env-var slot.
- Dynamic sitemap generation reflecting real project slugs (build-time API call or backend-served sitemap).

## Phase 4 — Operational maturity (done)

- ~~CI/CD via GitHub Actions~~ — done: `ci.yml` (lint/test/build/Docker validation on every branch but `main`), `deploy-staging.yml` (push to `main`), `deploy-prod.yml` (manual, branch or tag), `release.yml` (GitHub Release on version tag), composite actions `deploy` and `discord-notify`, branch protection on `main`, separate `Production`/`Staging` GitHub Environments. See `architecture.md`.
- ~~Staging environment~~ — done: `docker-compose.yml` profiles (`production`/`staging`) sharing one Postgres instance via separate databases, routed through dedicated subdomains (`dev.thomasboue.com`, `api.dev.thomasboue.com`) — see `architecture.md`.
- ~~Automated tests~~ — done: backend Jest unit tests for `ContactService`/`ProjectsService`/`GithubService`/`MailService` (repositories/Resend mocked at the boundary); frontend Vitest + Testing Library component/integration tests for the Projects flow (`ProjectCard`, `ProjectsSection`, `ProjectDetailPage`) and Contact flow (`ContactSection`, form schema, `apiFetch`). `ci.yml` runs both without `--passWithNoTests`.
- ~~Rate limiting~~ — done: `@nestjs/throttler`'s `ThrottlerGuard` applied globally (60 req/min default), with `POST /contact` (5/min) and `GET /github/activity` (20/min) tightened via `@Throttle()`, and `GET /health` exempted via `@SkipThrottle()`. See `backend.md`.
- ~~Runtime-configurable frontend API base URL~~ — done: a `docker-entrypoint.d` script regenerates `public/config.js` from the `API_BASE_URL` env var at container startup; `api-client.ts` reads `window.__APP_CONFIG__.apiBaseUrl` first, falling back to the build-time `VITE_API_BASE_URL`. Changing a deployed frontend's API URL is now a config change + `docker compose up -d`, not a rebuild. See `architecture.md`.
- ~~Revisit the "no shared types" and "no workspace tooling" decisions~~ — reviewed 2026-08-03: still not worth it. Three shapes are hand-duplicated (stable since Phase 1, no drift incidents); the workspace-tooling cost isn't justified yet. See `frontend.md`.

## Phase 5 — Admin dashboard and analytics

Requirements changed: the owner wants to see what's happening on the site and edit content without reseeding. Supersedes the "no admin panel" line that used to be under "Explicitly not planned" below.

### Part 1 (done)

- Auth: a single DB-backed `Admin` (bcrypt-hashed password), JWT in an httpOnly/secure/sameSite=strict cookie, `JwtAuthGuard` reused across modules. No refresh-token flow — re-login after the token expires (default 2h).
- Projects: full CRUD (`POST`/`PATCH`/`DELETE /projects`) from `/admin/projects`, replacing hand-seeding as the way to change project content day-to-day (seeding still works, e.g. for initial/CI setup).
- Contact inbox: `GET /contact`, mark-as-read, delete — from `/admin/messages`. Resolves the gap noted in `database-schema.md`.
- Analytics: privacy-first first-party page-view tracking (no cookies, no stored IPs — country via `geoip-lite`, device/browser via `ua-parser-js`, a daily-salted `visitorHash` for approximate unique-visitor counts) feeding a `/admin/dashboard` with a time-series chart and ranked breakdowns (pages, referrers, devices, countries). Distinct from the Phase 3 "real analytics vendor" item — this is an in-house dashboard, not a Plausible/Umami embed.
- See `backend.md`, `frontend.md`, `database-schema.md`, `architecture.md` for the modules, models, and cookie-auth flow.

### Part 2 (not started, on hold — see Phase 6)

- Audit log of project edits (who changed what, when — moot with a single admin today, but cheap to add before a second admin ever exists).
- CSV export of analytics stats.
- 2FA on admin login.
- Reuse the same admin shell for the Phase 3 blog CMS, once that's built.

## Phase 6 — Design system rework (before Phase 5 Part 2 resumes)

The owner wants the public site to stand out from generic "AI portfolio" layouts rather than read as another Linear/Vercel clone. Inserted ahead of Phase 5 Part 2 (admin-only, lower stakes) because the public-facing identity of the site is the higher-priority open question right now.

Inspiration: structural/interaction patterns from sites like axel-eck.fr — not its visual style, which must not be copied. The pattern worth borrowing is turning the owner's *actual* technical practice into literal UI, rather than decorative animation: live infra status as a real widget, section identity expressed through a technical/code idiom, real data over placeholder data. This portfolio already has the backend depth to do the same honestly (`/health`, admin analytics, GitHub activity proxy, real CI/CD) — see candidate concepts below.

Scope of this phase:

- Revisit `design-system.md`'s "Direction" section once enough concepts land — current "premium SaaS, dark-mode-first" framing may need to evolve into something more distinctive rather than being replaced wholesale.
- Prototype concepts one at a time, deliberately contained rather than spread across every section — the owner explicitly does not want the site to become "interactions everywhere" / bling-bling.
- No backend changes expected beyond small, honest, single-purpose endpoints in service of a specific concept (see below).

### Tried and reverted

- **Request-lifecycle + Docker topology demo** in `PlaygroundSection` — built, iterated on through several rounds (traveling indicator, user-supplied input, typed data display, JSON panel, arrow-based diagram), then pulled entirely: the owner didn't like the result on either the visual design or the underlying concept, not just the execution. Fully reverted — no `playground` backend module, no `PlaygroundSection` changes, back to the Phase 2 "coming soon" placeholder. Worth remembering before re-attempting something similar: a single interactive diagram trying to explain the request lifecycle turned into a lot of surface area (speed controls, live-typed payloads, arrows) without ever landing on a design the owner wanted — the next concept should probably be simpler to build *and* simpler to judge quickly, so a miss costs less.

### Candidate concepts (not yet decided)

- **Live system status strip** — small persistent widget (header/footer) reading the real `/health` endpoint: API/DB status, uptime. Not decorative — it breaks if the backend is actually down.
- **Public API explorer** — an embedded "try it" panel for a safe read-only slice of the API (e.g. `GET /projects`), showing real request/response next to the Swagger docs instead of just linking out to them.
- **CI/CD as content** — extend the existing GitHub activity widget to surface the latest GitHub Actions run status/link for this repo, tying the "production-ready" claim to a live, checkable artifact.
- **Public analytics ticker** — a thin, anonymized slice of the Phase 5 analytics dashboard (visits today, avg response time) exposed as transparency/proof-of-work rather than vanity numbers.
- **Command-palette navigation (Cmd+K)** — CLI-flavored site navigation, consistent with the existing Raycast inspiration in `design-system.md`, distinct from a conventional nav bar. Owner expressed interest in this one back when Playground was first discussed.

Next step: owner picks a candidate (or proposes a new one) to try next; `design-system.md` stays as-is until a concept actually lands.

## Explicitly not planned unless requirements change

- Redis or any shared cache — the in-memory GitHub cache is sufficient at single-instance scale.
