# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and tech leads evaluating Thomas Boué for two internships (part-time Mon/Wed Sep–Feb, full-time Mar–Aug). They skim: within seconds they need to know the profile (backend / software engineer, Epitech), the stack, which projects exist, proof that the work is really deployed, and how to make contact. Bilingual audience (FR/EN).

## Product Purpose

A personal portfolio that is itself a production system: React frontend, NestJS + Prisma + PostgreSQL backend, Docker, CI/CD, admin area, analytics, GitHub activity proxy, legal pages. Success = a recruiter reaches the contact form or downloads the résumé convinced the owner ships production-grade backend work.

## Positioning

The site is the proof: the backend behind it is real (live `/health`, real analytics, real CI), unlike a static template. Backend depth first, frontend craft second.

## Operating Context

FR and EN locales (i18next), dark and light themes, ⌘K command palette, résumé download (EN/FR), contact form, admin dashboard behind login, privacy-first analytics with opt-out.

## Capabilities and Constraints

- Stack: Vite, React 19, Tailwind 4, Framer Motion, TanStack Query, react-router.
- Self-hosted assets only (privacy policy forbids third-party font CDNs).
- No skill progress bars, no decorative gradients, no bouncing/spinning motion, no particles, no glassmorphism for its own sake (see `claude/design-system.md`).
- Nothing is committed automatically; the owner reviews and commits.

## Brand Commitments

Name: Thomas Boué. Voice: precise, engineering-minded, no hype. Existing copy in `frontend/src/locales/` is factual and stays unless the owner changes it.

## Evidence on Hand

Real experience entries (La Trace, Bouygues Telecom, Epitech Nantes, SERAD), real project data served by the backend, a live `/health` endpoint. No testimonials, customers or benchmarks exist; none must be invented.

## Product Principles

1. Content and craft lead; the interface recedes.
2. Real data over decoration: anything that looks live must be live.
3. One idea per section, generous space, restrained motion.
4. Accessible by default (WCAG AA, keyboard, reduced motion, both locales).

## Accessibility & Inclusion

WCAG AA contrast in both themes (already fixed for light in commit ecb01f4), visible focus, `prefers-reduced-motion` respected, French and English copy must both fit.
