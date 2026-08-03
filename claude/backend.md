# Backend

NestJS + Prisma + PostgreSQL, documented with Swagger.

## Module map

| Module | Responsibility |
|---|---|
| `PrismaModule` | `@Global()` module exposing `PrismaService` (a `PrismaClient` wrapper with lifecycle hooks) to every feature module. |
| `MailModule` | `@Global()` module exposing `MailService`, a thin wrapper around the Resend SDK (`send({ to, subject, html })`). No domain knowledge — just transport. |
| `health` | `GET /health` — real readiness check (`SELECT 1` through Prisma). |
| `projects` | Public read API for the dynamic project system: list + detail by slug. |
| `contact` | Validates and persists contact-form submissions, then emails a notification via `MailService` (best-effort — persistence is the source of truth, so a mail failure is logged, not thrown). Also exposes an admin-only inbox (list/mark-read/delete). |
| `github` | Proxies and caches GitHub's public REST API for the activity widget. |
| `auth` | Admin login (`POST /auth/login`, `/logout`, `/me`), all cookie-based JWT — see below. |
| `analytics` | Public `POST /analytics/track` beacon + admin-only `GET /analytics/stats` aggregation — see below. |

Modules are independent: `contact` does not import from `projects`, `github` does not touch Prisma at all. Shared infrastructure (Prisma, Mail, config) lives in its own module and is injected, not imported ad hoc. `projects` and `contact` also expose admin-only write/read routes (project CRUD; message list/read/delete) guarded by `JwtAuthGuard` — a plain class imported from `auth/guards/jwt-auth.guard.ts`, not a Nest module dependency on `AuthModule`, so those modules stay independent in the sense that matters (no import cycle, no shared providers).

## Admin auth (cookie-based JWT)

A single `Admin` row (bcrypt-hashed password, provisioned via `prisma/create-admin.ts` — same upsert-by-key idiom as `seed.ts`, run manually) backs `POST /auth/login`. On success the server signs a JWT (`@nestjs/jwt`) and sets it as an **httpOnly, secure-in-production, sameSite=strict** cookie (`admin_token`, see `auth/auth.constants.ts`) — never returned in the response body, never touched by frontend JS. `JwtStrategy` (`passport-jwt`) extracts it from the cookie via a custom extractor (not the `Authorization` header); `JwtAuthGuard extends AuthGuard('jwt')` is the guard every admin-only route uses via `@UseGuards(JwtAuthGuard)`.

No refresh-token flow — the token's lifetime (`JWT_EXPIRES_IN_SECONDS`, default 7200 = 2h) is the whole session; re-login after expiry. Deliberately simple for a single-admin, low-traffic panel — see `roadmap.md` Phase 5 for what'd change this.

`main.ts` registers `cookie-parser` and turns on `credentials: true` in CORS — both required for the cookie to round-trip from the frontend's separate origin.

## Analytics: privacy-first, no cookies, no stored IPs

`POST /analytics/track` (public, rate-limited like `contact`) derives everything itself from the request rather than trusting the client: `geoip-lite` (a bundled local IP→country database, no outbound network call — same "no new external vendor" posture as the GitHub cache below) for country, `ua-parser-js` for device/browser, and a `visitorHash = sha256(ip + user-agent + today's date)` for approximate unique-visitor counting. The salt (today's UTC date) is intentionally public, not secret: the privacy property being bought is "no persistent visitor id across days," not "we can't recompute the hash ourselves" — we could, trivially, since we control the algorithm. The raw IP is never persisted.

`GET /analytics/stats` (admin-only) pulls raw `PageView` rows for the window and aggregates in memory in `AnalyticsService` (`AnalyticsRepository` stays a thin `findSince`/`create`). Fine at personal-portfolio scale; revisit with real Prisma `groupBy` queries only if the row count ever makes that slow.

## Controller → Service → Repository

Each feature module keeps a strict three-layer shape:

- **Controller** — routing, Swagger decorators, DTO binding. No business logic, no direct Prisma calls.
- **Service** — business logic, orchestration, error semantics (e.g. throwing `NotFoundException` when a project slug doesn't exist).
- **Repository** — the only layer that talks to `PrismaService`. Thin wrappers around `findMany`/`findUnique`/`create`.

Example (`projects`):

```
ProjectsController.findBySlug(slug)
  → ProjectsService.getBySlug(slug)
      → ProjectsRepository.findBySlug(slug)   // prisma.project.findUnique
      ← null → throws NotFoundException
  ← ProjectDetailDto
```

A mapper function lives inline in the service until it's reused by more than one place — extracting a `projects.mapper.ts` before that happens would be a premature abstraction.

## DTOs and validation

`class-validator` + `class-transformer`, enforced globally in `main.ts` via:

```ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
```

Every incoming payload (currently just `POST /contact`) is validated against a DTO before it reaches a service. Response DTOs (`ProjectSummaryDto`, `ProjectDetailDto`) exist to decouple the public API shape from the Prisma model — e.g. the summary DTO omits `content` so the list endpoint stays light.

## Swagger

Mounted at `/docs`. Every controller uses `@ApiTags`, every route uses `@ApiOperation`/`@ApiResponse`, every DTO field is documented with `@ApiProperty`. No endpoint ships undocumented.

## Error handling

Built-in Nest exceptions (`NotFoundException`, `BadRequestException`) are the default. A custom exception class is only introduced when it carries meaning beyond an HTTP status + message (none needed yet).

## Configuration

`ConfigModule.forRoot({ isGlobal: true, load: [configuration], validate })`, where `validate` runs a Joi schema over `process.env` at boot. Missing or malformed env vars fail startup immediately rather than surfacing as a confusing runtime error later.

## Rate limiting

`@nestjs/throttler`'s `ThrottlerGuard` is registered globally (`APP_GUARD`) with a generous default (60 requests/minute per IP) covering every route. `POST /contact` and `GET /github/activity` override it with `@Throttle()` to a tighter, endpoint-specific limit — 5/min and 20/min respectively — because they're the two routes that do real work per request (a DB write + email send; a potential upstream call to GitHub's own rate-limited API) and are the most exposed to abuse from being public and unauthenticated. `GET /health` is exempted with `@SkipThrottle({ default: true })` since it's an infra check, not a public-facing route worth protecting — spelled out explicitly (rather than the bare `@SkipThrottle()`) so it doesn't silently depend on that being the library's default for an unnamed throttler.

The limits are hardcoded rather than env-configurable — unlike `GITHUB_CACHE_TTL_SECONDS`, there's no expected need to tune these per environment, and adding config for numbers nobody needs to change yet would be premature.

**`trust proxy` matters more than the guard itself.** Production sits behind exactly one Nginx reverse proxy (see `architecture.md`), which sets `X-Forwarded-For`. `main.ts` calls `app.set('trust proxy', 1)` on the Express adapter — without it, Express ignores that header and every request's `req.ip` resolves to Nginx's own address, so `ThrottlerGuard`'s default IP-based tracker would bucket *all* visitors together instead of limiting each one independently. `1` (not `true`) because there's exactly one trusted hop in front; trusting an unbounded chain would let a client spoof its own `X-Forwarded-For`. `rate-limiting.spec.ts` has a regression test for this — it fails immediately if the `trust proxy` line is removed.

## GitHub caching: in-memory, not Redis

The `github` module caches GitHub API responses in a plain `Map<string, { data, expiresAt }>` keyed by username, with a configurable TTL (`GITHUB_CACHE_TTL_SECONDS`, default 300). No Redis, no database table.

Why: this is a single-instance app, cache loss on restart is harmless (GitHub's API is the actual source of truth, just rate-limited), and the data is small and short-lived. Introducing Redis here would be infrastructure for a problem that doesn't exist yet — revisit only if the backend is ever scaled to multiple instances needing a shared cache.
