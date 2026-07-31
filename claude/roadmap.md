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

## Phase 4 — Operational maturity

- ~~CI/CD via GitHub Actions~~ — done: `ci.yml` (lint/test/build/Docker validation on every branch but `main`), `deploy-prod.yml` (push to `main`), `deploy-dev.yml` (manual, any branch), composite actions `deploy` and `discord-notify`, branch protection on `main`, separate `Production`/`Staging` GitHub Environments. See `architecture.md`.
- ~~Staging environment~~ — done: `docker-compose.yml` profiles (`production`/`staging`) sharing one Postgres instance via separate databases, routed through dedicated subdomains (`dev.thomasboue.com`, `api.dev.thomasboue.com`) — see `architecture.md`.
- Automated tests: backend unit tests for services (Prisma mocked at the repository boundary), frontend component/integration tests for the Projects and Contact flows. CI already runs `npm test` but there's nothing for it to run yet (`--passWithNoTests`).
- Rate limiting on `POST /contact` and `GET /github/activity` (`@nestjs/throttler`).
- Runtime-configurable frontend API base URL (currently build-time only, due to Vite's env-inlining — see `architecture.md`).
- Revisit the "no shared types" and "no workspace tooling" decisions if backend/frontend duplication becomes a real maintenance cost.

## Explicitly not planned unless requirements change

- Authentication/admin panel — projects stay public read-only, seeded by hand.
- Redis or any shared cache — the in-memory GitHub cache is sufficient at single-instance scale.
