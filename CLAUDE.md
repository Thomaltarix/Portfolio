# CLAUDE.md

Durable engineering principles for this repository. This file is auto-loaded every session and should rarely change — it describes *how* to work, not *what* the project currently looks like. For living, project-specific reference material (architecture, schema, roadmap, design system), see [`claude/CLAUDE.md`](claude/CLAUDE.md).

## General philosophy

- Favor simplicity over unnecessary abstractions.
- Prefer readable code over clever code.
- Every file should have a clear responsibility.
- Avoid overengineering.
- Keep the codebase scalable but lightweight.
- Think as if the project will still be maintained in 5 years.
- If a pattern does not provide clear value, do not introduce it.

## Architecture

- Use a modular architecture.
- Group code by feature instead of technical layers whenever possible.
- Avoid huge services or utility folders.
- Keep dependencies flowing in one direction.
- Controllers should stay thin.
- Business logic belongs in services.
- Data access belongs in repositories.
- DTOs should validate all incoming data.

## Backend

- Use NestJS best practices.
- Prefer dependency injection everywhere.
- Use Prisma as ORM.
- Swagger should document every endpoint.
- Use environment variables correctly.
- Return meaningful HTTP errors.
- Use custom exceptions when appropriate.
- Avoid static helper classes unless absolutely necessary.
- Keep modules independent.

## Frontend

- Components should remain small.
- Prefer composition over inheritance.
- Avoid prop drilling.
- Keep business logic inside hooks when appropriate.
- Pages should mostly assemble components.
- Reusable UI belongs inside components.
- Feature-specific UI belongs inside feature folders.

## TypeScript

- Strict mode enabled.
- Never use `any`.
- Prefer explicit types.
- Prefer `readonly` when possible.
- Favor discriminated unions over booleans.
- Avoid unnecessary generics.

## Naming

- Use meaningful names.
- Avoid abbreviations.
- Avoid generic names like `Utils`, `Manager` or `Helper`.
- File names should reflect their content.

## API

- REST-first.
- Consistent endpoint naming.
- Version API if needed.
- Validate every request.
- Never trust client input.

## Database

- Design normalized schemas.
- Use foreign keys.
- Prefer explicit relations.
- Keep migrations clean.
- Never edit previous migrations.

## Git

- Small commits.
- Meaningful commit messages.
- One logical change per commit.

## Code Style

- Keep functions short.
- Prefer early returns.
- Avoid nested conditionals.
- Avoid duplicated code.
- Comment WHY instead of WHAT.
- Self-documenting code first.

## UI / UX

The portfolio should feel like a premium SaaS product.

Inspired by:
- Linear
- Vercel
- Raycast
- Supabase
- Stripe

Avoid:
- generic AI portfolio layouts
- skill progress bars
- excessive gradients
- unnecessary animations
- flashy effects

Prefer:
- whitespace
- typography
- subtle motion
- polished interactions
- accessibility

## Animations

Animations should never distract.

Use Framer Motion carefully.

Prioritize:
- fade
- slide
- stagger
- layout animations

Avoid:
- bouncing
- spinning
- exaggerated effects

## Project Quality

Assume this project will be reviewed by senior software engineers.

Code should be:
- production-ready
- modular
- maintainable
- well documented
- easy to extend

## Decision Making

Whenever several implementations are possible:

1. Choose the simplest maintainable solution.
2. Explain why it is preferred.
3. Mention trade-offs when relevant.

Never choose complexity just because it looks impressive.

## AI Behaviour

Do not generate unnecessary files.

Do not introduce libraries without justification.

Do not create abstractions before they become useful.

Always explain architectural decisions before implementing them.

When refactoring:
- preserve behavior
- simplify code
- reduce duplication
- improve readability

Always think like a senior engineer performing a professional code review.

## Personal Preferences

The project owner prefers backend engineering over frontend development.

When proposing solutions:
- prioritize architecture over visual effects
- prioritize maintainability over speed of implementation
- prefer explicit code over magic
- avoid unnecessary design patterns
- use Docker from the beginning
- use CI/CD whenever it adds value
- keep the project ready for production

The owner enjoys:
- Go
- TypeScript
- NestJS
- PostgreSQL
- Docker
- GitHub Actions
- Clean APIs
- Strong typing

The owner dislikes:
- boilerplate
- overengineered architectures
- giant utility files
- global state when unnecessary
- duplicated logic
- "AI-looking" code

## Before writing code

Before implementing a new feature:

- explain the architecture
- explain where files will be created
- explain why this approach is chosen

Only then start implementing.
