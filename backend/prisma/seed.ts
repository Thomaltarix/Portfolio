import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const projects = [
  {
    slug: 'realtime-chat-platform',
    title: 'Realtime Chat Platform',
    summary: 'A horizontally scalable chat backend with WebSocket fan-out and message persistence.',
    content: `## Overview

A backend-first realtime messaging system built to explore WebSocket scaling patterns beyond a single process.

## Highlights

- NestJS gateway layer with Redis pub/sub for cross-instance message fan-out.
- PostgreSQL for durable message history, paginated via cursor-based queries.
- Load-tested to confirm delivery ordering under concurrent connections.

## Stack

NestJS, WebSockets, Redis, PostgreSQL, Docker.`,
    techStack: ['NestJS', 'PostgreSQL', 'Redis', 'WebSockets', 'Docker'],
    githubUrl: 'https://github.com/octocat/realtime-chat-platform',
    liveUrl: null,
    featured: true,
  },
  {
    slug: 'infrastructure-as-code-toolkit',
    title: 'Infrastructure-as-Code Toolkit',
    summary: 'A CLI that generates reproducible Terraform modules from a declarative service spec.',
    content: `## Overview

A small CLI tool that turns a declarative YAML service description into reviewed, reusable Terraform modules — reducing copy-pasted infrastructure across services.

## Highlights

- Go CLI with a plugin system for cloud-provider-specific module templates.
- Generated modules pass \`terraform validate\` and \`tflint\` as part of the CLI's own test suite.
- Adopted internally to standardize how new services provision their infrastructure.

## Stack

Go, Terraform, GitHub Actions.`,
    techStack: ['Go', 'Terraform', 'GitHub Actions'],
    githubUrl: 'https://github.com/octocat/infrastructure-as-code-toolkit',
    liveUrl: null,
    featured: true,
  },
  {
    slug: 'api-rate-limiter-library',
    title: 'API Rate Limiter Library',
    summary: 'A framework-agnostic, Redis-backed rate limiting library with a sliding-window algorithm.',
    content: `## Overview

A standalone TypeScript library implementing a sliding-window rate limiter, extracted from a production API that needed more accurate limiting than a fixed-window counter provided.

## Highlights

- Zero framework dependencies — usable in Express, Fastify, or NestJS via small adapters.
- Sliding-window algorithm backed by Redis sorted sets, benchmarked against fixed-window and token-bucket alternatives.
- Published with full TypeScript types and a documented public API.

## Stack

TypeScript, Redis.`,
    techStack: ['TypeScript', 'Redis'],
    githubUrl: 'https://github.com/octocat/api-rate-limiter-library',
    liveUrl: null,
    featured: false,
  },
];

async function main(): Promise<void> {
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }
  console.log(`Seeded ${projects.length} projects.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
