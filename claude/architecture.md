# Architecture

## Monorepo layout

Two independent folders at the repo root: `backend/` and `frontend/`. Each has its own `package.json`, `tsconfig.json`, and ESLint config. There is no npm workspace, Turborepo, or Nx wrapper.

This is a deliberate choice, not an oversight: with only two apps, a workspace tool adds configuration surface (root manifest, shared tooling versions, workspace-aware scripts) without a matching benefit. Docker builds each app independently anyway, so there's no build-graph to orchestrate. Revisit this only if real duplication emerges — e.g. if the same DTO shape needs to be shared and kept in sync by hand becomes error-prone (see the "no shared types" note in `frontend.md`).

## Request flow

```
Browser (React SPA, static bundle served by Nginx)
   │  fetch (VITE_API_BASE_URL)
   ▼
NestJS API (Express under the hood)
   │  Prisma Client
   ▼
PostgreSQL
```

The frontend never talks to Postgres or GitHub's API directly — everything goes through the NestJS backend, which is the single source of truth for data shape, validation, and caching.

## Docker Compose topology

Three services:

- `postgres` — `postgres:16-alpine`, named volume for data, `pg_isready` healthcheck.
- `backend` — built from `backend/Dockerfile`, waits for `postgres` to be healthy, runs `prisma migrate deploy` on start, then serves on port `3000`.
- `frontend` — built from `frontend/Dockerfile` (multi-stage: Vite build → Nginx static serve), port `8080` (deliberately distinct from Vite's local dev port `5173`, so "Docker prod-like" and "local dev" are never confused).

Seeding (`npm run prisma:seed`) is a manual step run via `docker compose exec backend`, not automatic on every container start — explicit over implicit, even though the seed script is idempotent.

## Env-var flow

- Root `.env` feeds `docker-compose.yml` (Postgres credentials, ports, `GITHUB_USERNAME`, `GITHUB_TOKEN`, `CORS_ORIGIN`).
- `backend/.env` is used for local (non-Docker) development, where `DATABASE_URL` points at `localhost` instead of the `postgres` service name. This is a small, intentional duplication rather than a shared-config abstraction.
- `frontend/.env` sets `VITE_API_BASE_URL` for local dev. In Docker, this same value is passed as a **build ARG**, because Vite inlines `import.meta.env.*` at build time — there is no runtime env injection for a static Nginx-served bundle. Changing the API URL in a deployed container requires a rebuild; a runtime `config.js` injection pattern is a known fast-follow if this becomes painful.

## Dependency direction

Frontend → Backend → Database. Never the reverse. Within the backend, Controller → Service → Repository → Prisma; a repository never calls a service, a service never touches `Request`/`Response` objects directly.
