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
- `frontend/.env` sets `VITE_API_BASE_URL` for local dev. Vite inlines `import.meta.env.*` at build time, so this same value is also passed as a Docker build ARG and baked into the bundle as a fallback. The value the frontend actually uses in Docker comes from `public/config.js`, which `frontend/docker-entrypoint.d/40-generate-runtime-config.sh` regenerates at **container startup** from the `API_BASE_URL` runtime env var (`docker-compose.yml` sets it to the same `VITE_API_BASE_URL`/`VITE_API_BASE_URL_STAGING` value, so there's one variable to set, not two). `api-client.ts` reads `window.__APP_CONFIG__.apiBaseUrl` first, falling back to the build-time value if `config.js` never loaded. This means changing a deployed frontend's API URL is a `docker compose up -d` (no `--build`) after editing `.env`, not a rebuild.

## CI/CD

Four workflows, two reusable composite actions:

- `ci.yml` — on every PR to `main` and every push to any other branch: lint/test/build backend, lint/build frontend, and a Docker build of both images (no push). Never runs on `main` directly and never deploys.
- `deploy-staging.yml` — on every push to `main` (i.e. after a PR merges), `environment: Staging`. Staging deploys automatically so it stays a true preview of what's about to ship.
- `deploy-prod.yml` — manual (`workflow_dispatch`, picks a branch/tag to deploy, defaults to `main`), `environment: Production`. Gated behind a manual trigger rather than auto-deploying on merge, so a merge to `main` doesn't immediately go live.
- `release.yml` — on pushing a `v*.*.*` tag: creates a GitHub Release. Independent of deployment; a tag is just a marker, not a trigger to deploy it (deploy-prod can target one manually).

Both deploy workflows are thin: they call `.github/actions/deploy` (SSH → git reset → ensure the target database exists → `docker compose --profile <profile> up -d --build` → prune old images → verify the right build is live → healthcheck against the public URL, failing the workflow if either check fails) and `.github/actions/discord-notify` (one embed, `status: ${{ job.status }}`, `if: always()` — no separate success/failure steps). Branch protection on `main` requires the CI jobs to pass and blocks direct pushes, so `main` is always in a deployable state before either deploy workflow runs.

**Verifying the right build is live happens in two places, on purpose:**
- Inside the deploy action's SSH session, right after `docker compose up`: a retry loop curls `127.0.0.1:<8080|8081>/version.txt` directly on the VPS — no Cloudflare, no public DNS — and fails the deploy if it doesn't match the commit just built. This is the authoritative check.
- `healthcheck.sh` afterwards only confirms the public URL is reachable (DNS → TLS → Cloudflare → the VPS's Nginx vhost) — it does **not** compare `version.txt` through the public URL anymore.

That split exists because a real deploy once failed the public-URL version check even though the loopback check (run manually to debug it) proved the container was serving the correct build within milliseconds of starting: Cloudflare's edge served a stale cached response for longer than any reasonable retry budget after the origin connection was briefly interrupted by the container swap. The public check is only useful for confirming the whole external chain works, not for deciding whether the deploy itself succeeded.

## Admin auth: cookie-based JWT, not a session store

The admin dashboard (`/admin/*`, Phase 5) authenticates with a JWT in an httpOnly, secure-in-production, `sameSite=strict` cookie — not a database-backed session table. `thomasboue.com` and `api.thomasboue.com` share the same registrable domain (`thomasboue.com`), so the cookie set by the API is still sent as "same-site" when the frontend's JS calls `fetch('https://api.thomasboue.com/...', { credentials: 'include' })`; `sameSite=strict` doesn't need loosening to `lax` for this to work. This is why `main.ts` also turns on CORS `credentials: true` — without it, the browser drops the cookie on cross-origin requests even within the same site.

No Redis, no session table: the JWT itself is the full session state, stateless and cheap, consistent with the "no shared cache" stance below — there's exactly one admin, so there's nothing to share across instances yet.

## Dependency direction

Frontend → Backend → Database. Never the reverse. Within the backend, Controller → Service → Repository → Prisma; a repository never calls a service, a service never touches `Request`/`Response` objects directly.
