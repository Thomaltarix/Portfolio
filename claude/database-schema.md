# Database Schema

Prisma + PostgreSQL. Schema source of truth: `backend/prisma/schema.prisma`.

## `Project`

| Field | Type | Notes |
|---|---|---|
| `id` | `String @id @default(uuid())` | |
| `slug` | `String @unique` | URL identifier, used by `GET /projects/:slug`. |
| `title` | `String` | |
| `summary` | `String` | Short description, shown on `ProjectCard`. |
| `content` | `String` (`@db.Text`) | Long-form markdown, rendered on the detail page only. |
| `techStack` | `String[]` | Rendered as badges. |
| `githubUrl` | `String?` | Optional — not every project has a public repo. |
| `liveUrl` | `String?` | Optional. |
| `featured` | `Boolean @default(false)` | Reserved for future sorting/highlighting; not yet used to filter the list endpoint. |
| `createdAt` / `updatedAt` | `DateTime` | Standard timestamps. |

The list endpoint (`GET /projects`) returns everything except `content` (kept out of the summary DTO to keep the list payload light); the detail endpoint (`GET /projects/:slug`) returns the full row.

## `ContactMessage`

| Field | Type | Notes |
|---|---|---|
| `id` | `String @id @default(uuid())` | |
| `name` | `String` | 2–100 chars, validated in the DTO. |
| `email` | `String` | Validated as an email in the DTO; not unique — the same person can submit more than once. |
| `message` | `String` (`@db.Text`) | 10–2000 chars, validated in the DTO. |
| `createdAt` | `DateTime` | |

No email-sending is wired to this table yet — submissions are persisted only. Reading them today means a direct DB query (`psql`/Prisma Studio); an admin view is a deferred feature (see `roadmap.md`).

## Migration policy

- Never edit a previously-applied migration file. If a mistake ships, write a new migration that corrects it.
- `prisma migrate dev` locally to generate migrations; `prisma migrate deploy` in Docker/production to apply them without prompting.

## Seed data

`backend/prisma/seed.ts` upserts (keyed by `slug`) 2–3 placeholder projects with realistic `techStack` and sample markdown `content`, so the frontend always has real data to render against. Idempotent — safe to re-run.

## Deliberately not modeled

- **`GithubActivity`** — no table. The GitHub activity widget is served from an in-memory cache in the `github` backend module (see `backend.md`); GitHub's API is the source of truth, so persisting it would just be a stale copy.
- **`BlogPost`** — not modeled yet. Blog support is a documented future feature (see `roadmap.md`); when it's built, expect a `BlogPost` model shaped similarly to `Project` (slug, title, content, timestamps), added via its own migration rather than retrofitted into `Project`.
