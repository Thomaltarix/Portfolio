# Portfolio

A production-style portfolio for a Backend & Software Engineer: NestJS + Prisma + PostgreSQL API, React + Vite frontend, Docker Compose for deployment.

See [`CLAUDE.md`](CLAUDE.md) for engineering principles and [`claude/`](claude/CLAUDE.md) for architecture, schema, and roadmap docs.

## Quick start (Docker)

```bash
cp .env.example .env
docker compose --profile production up -d --build
docker compose exec backend npm run prisma:seed
```

Postgres is shared by both profiles and has no `profiles:` of its own, so it always starts. Swap `production` for `staging` to bring up `backend-staging`/`frontend-staging` instead (on ports 3001/8081, against a separate `portfolio_staging` database).

- Frontend: http://localhost:8080
- Backend API docs (Swagger): http://localhost:3000/docs

## Local development (without Docker)

Requires a local PostgreSQL instance (or run just the `postgres` service via `docker compose up -d postgres`).

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run prisma:migrate
npm run prisma:seed
npm run start:dev

# Frontend (separate terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Project layout

```
backend/     NestJS API (Controller → Service → Repository, Prisma, Swagger)
frontend/    React + Vite SPA (feature-based folders, TanStack Query, Tailwind, shadcn/ui)
claude/      Living architecture/design/roadmap reference docs
```
