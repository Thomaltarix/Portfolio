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

### Part 2 (not started)

- Audit log of project edits (who changed what, when — moot with a single admin today, but cheap to add before a second admin ever exists).
- CSV export of analytics stats.
- 2FA on admin login.
- Reuse the same admin shell for the Phase 3 blog CMS, once that's built.

## Explicitly not planned unless requirements change

- Redis or any shared cache — the in-memory GitHub cache is sufficient at single-instance scale.
