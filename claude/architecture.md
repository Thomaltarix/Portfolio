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

One `docker-compose.yml`, one Postgres instance, two Compose **profiles** rather than two separate stacks:

- `postgres` — `postgres:16-alpine`, named volume for data, `pg_isready` healthcheck. Carries no `profiles:` key, so it always starts regardless of which profile is requested — it's shared by both environments.
- `backend` / `frontend` — `profiles: [production]`. Same services as before profiles were introduced; their names were deliberately left unchanged (rather than renamed to `backend-prod`/`frontend-prod`) so introducing staging couldn't force a container rename/recreate on the already-running production deployment.
- `backend-staging` / `frontend-staging` — `profiles: [staging]`. Same images, built from the same `backend/Dockerfile` and `frontend/Dockerfile`, on host ports `3001`/`8081` instead of `3000`/`8080`.

`docker compose up` with no `--profile` starts only `postgres` — see `README.md` for the explicit `--profile production`/`--profile staging` invocations.

Seeding (`npm run prisma:seed`) is a manual step run via `docker compose exec backend`, not automatic on every container start — explicit over implicit, even though the seed script is idempotent.

## Environments and domains

Production and staging share one VPS, one Docker Compose project, and one Postgres instance — isolated by database name and port, not by separate infrastructure:

| Domain | Routes to | Compose service | Database |
|---|---|---|---|
| `thomasboue.com` | Nginx → `127.0.0.1:8080` | `frontend` | — |
| `api.thomasboue.com` | Nginx → `127.0.0.1:3000` | `backend` | `portfolio` |
| `dev.thomasboue.com` | Nginx → `127.0.0.1:8081` | `frontend-staging` | — |
| `api.dev.thomasboue.com` | Nginx → `127.0.0.1:3001` | `backend-staging` | `portfolio_staging` |

Nginx vhosts live in [`infra/nginx/`](../infra/nginx/README.md), one file per domain, versioned even though installing them on the VPS is still a manual step (`nginx -t && systemctl reload nginx`) — there is no automated step that touches the VPS's Nginx config.

Both databases live in the same Postgres container. `portfolio_staging` can't be created via `docker-entrypoint-initdb.d` (that only runs against an empty data directory, and the production volume already has data), so the deploy pipeline creates it idempotently on first use instead — see the `deploy` composite action below.

## Env-var flow

- Root `.env` feeds `docker-compose.yml` — Postgres credentials, `GITHUB_USERNAME`/`GITHUB_TOKEN` (shared by both profiles), and per-profile `CORS_ORIGIN`/`CORS_ORIGIN_STAGING`, `VITE_API_BASE_URL`/`VITE_API_BASE_URL_STAGING`, `POSTGRES_DB`/`POSTGRES_DB_STAGING`. The staging variables are purely additive — production's variable names never changed, so the VPS's existing `.env` keeps working without edits for the production profile.
- `backend/.env` is used for local (non-Docker) development, where `DATABASE_URL` points at `localhost` instead of the `postgres` service name. This is a small, intentional duplication rather than a shared-config abstraction.
- `frontend/.env` sets `VITE_API_BASE_URL` for local dev. In Docker, this same value is passed as a **build ARG**, because Vite inlines `import.meta.env.*` at build time — there is no runtime env injection for a static Nginx-served bundle. Changing the API URL in a deployed container requires a rebuild; a runtime `config.js` injection pattern is a known fast-follow if this becomes painful.

## CI/CD

Three workflows, two reusable composite actions:

- `ci.yml` — on every PR to `main` and every push to any other branch: lint/test/build backend, lint/build frontend, and a Docker build of both images (no push). Never runs on `main` directly and never deploys.
- `deploy-prod.yml` — on push to `main` (i.e. after a PR merges), `environment: Production`.
- `deploy-dev.yml` — manual (`workflow_dispatch`, picks a branch/ref), `environment: Staging`.

Both deploy workflows are thin: they call `.github/actions/deploy` (SSH → git reset → ensure the target database exists → `docker compose --profile <profile> up -d --build` → prune old images → healthcheck against the public URL, retried, failing the workflow if the site doesn't come back) and `.github/actions/discord-notify` (one embed, `status: ${{ job.status }}`, `if: always()` — no separate success/failure steps). Branch protection on `main` requires the CI jobs to pass and blocks direct pushes, so `main` is always in a deployable state before `deploy-prod` ever runs.

## Dependency direction

Frontend → Backend → Database. Never the reverse. Within the backend, Controller → Service → Repository → Prisma; a repository never calls a service, a service never touches `Request`/`Response` objects directly.
