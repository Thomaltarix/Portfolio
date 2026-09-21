import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const projects: {
  slug: string;
  title: string;
  summary: string;
  content: string;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
}[] = [
  {
    slug: 'melo',
    title: 'Melo',
    summary:
      'My end-of-studies project at Epitech: a music event recommendation app built with a team, with a Go microservices backend, a Flutter mobile app and a Vue web front.',
    content: `## What it is

Melo is a music event recommendation application, and the project I built with my team as my end-of-studies project at Epitech (EIP). It recommends events to users, who can also browse events by title, date, location, cost and type, save favourites and see events on a calendar, with a search radius set in their account settings.

## My role

Technical lead of the backend and its main developer. I wrote about half of the backend commits (292 out of roughly 570) over a project that ran from March 2025 to September 2026.

## Backend

- A **Go microservices** architecture behind an API gateway: user, favourites, recommendations, calendar and a public web service, each with its own Dockerfile, on a shared PostgreSQL database with a dedicated migration step.
- **Authentication** with login, registration and refresh tokens, plus per-user settings.
- **API documentation** generated as Swagger / OpenAPI, and Bruno collections used to exercise the services.
- Python scripts for maintenance tasks such as cleaning up orphaned event images.

## Around the backend

- A **Flutter** mobile app and a **Vue** web front-end.
- Separate **preprod** and **prod** environments, GitHub Actions and a dedicated CI/CD repository.
- A monitoring application for the app's statistics, and a library of scraping scripts.
- Early **benchmark repositories** comparing back-end, database and ORM, front-end and mobile technologies before the stack was chosen.

The source code lives in a private organisation, so there is no public repository. I am happy to walk through it on request.`,
    techStack: [
      'Go',
      'PostgreSQL',
      'Docker',
      'Flutter',
      'Vue',
      'Swagger',
      'CI/CD',
    ],
    githubUrl: null,
    liveUrl: null,
    featured: true,
  },
  {
    slug: 'portfolio',
    title: 'Portfolio',
    summary:
      'This very site: a production-style portfolio with a NestJS API, a React frontend and a full Docker and CI/CD setup.',
    content: `## What it is

A portfolio built like a real product rather than a template. The site you are reading is served by the API described below.

## Highlights

- **Backend**: NestJS with Prisma and PostgreSQL, organised by feature modules (controller, service, repository), with every request validated by DTOs and every endpoint documented in Swagger.
- **Frontend**: React and Vite, bilingual (French and English), with light and dark themes and a command palette.
- **Admin dashboard**: JWT-protected area to manage projects, read contact messages and view analytics.
- **Contact form**: validated server-side and delivered by email through Resend.
- **Privacy-first analytics**: first-party page-view stats with an opt-out, no third-party trackers.
- **GitHub activity**: a small server-side proxy with an in-memory cache, so the client never talks to GitHub directly.
- **Delivery**: Docker Compose with production and staging profiles, and GitHub Actions workflows for CI, releases and deployment.`,
    techStack: [
      'NestJS',
      'Prisma',
      'PostgreSQL',
      'React',
      'TypeScript',
      'Docker',
      'GitHub Actions',
    ],
    githubUrl: 'https://github.com/Thomaltarix/Portfolio',
    liveUrl: null,
    featured: true,
  },
  {
    slug: 'unified-calendar',
    title: 'UnifiedCalendar',
    summary:
      'A work-in-progress SaaS that synchronises Google Calendar and Microsoft Outlook into a single calendar view.',
    content: `## Status

Work in progress: the architecture and the authentication are in place, but the product is not finished.

## What it is

A calendar synchronisation platform that brings events from several calendar sources into one interface.

## Planned features

- Connect and sync **Google Calendar** and **Microsoft Outlook**.
- Unified dashboard with filtering by source, date range and keywords.
- Create, edit and delete events across platforms.
- Authentication with Google and Microsoft OAuth, or email and password, using JWT with refresh tokens.

## Engineering

- **Backend**: NestJS with Prisma and PostgreSQL, with authentication and user modules, end-to-end tests and Swagger / OpenAPI documentation.
- **Frontend**: Next.js (App Router) with Tailwind CSS, mobile-first.
- Full TypeScript across the monorepo.`,
    techStack: [
      'NestJS',
      'Next.js',
      'Prisma',
      'PostgreSQL',
      'TypeScript',
      'Docker',
    ],
    githubUrl: 'https://github.com/Thomaltarix/UnifiedCalendar',
    liveUrl: null,
    featured: false,
  },
  {
    slug: 'momentum',
    title: 'Momentum',
    summary:
      'A native Flutter app that unifies daily habit tracking, step counting and nutrition logging with gamified streaks and rewards.',
    content: `## What it is

A solo, gamified daily-habit app for Android. Rather than rebuilding step counting, workout logging or a food diary, it reads what those apps already do well through **Health Connect** and layers routines and rewards on top.

## Features

- Routines with recurrence and scheduled local notifications.
- Steps, workouts, nutrition and weight read from Health Connect (read-only), with a manual-entry fallback per metric.
- Configurable daily goals and a macro calculator that suggests targets from body parameters.
- Deterministic gamification: streaks, XP, levels and badges, replayed for every day since the app was last opened.

## Engineering

- Flutter with Riverpod for state and go_router for navigation.
- Local-first: data lives on the device in a Drift (SQLite) database, with no backend or account.
- Daily Health Connect data is cached locally so history survives OS query failures or revoked permissions.`,
    techStack: ['Flutter', 'Dart', 'Riverpod', 'Drift', 'Health Connect'],
    githubUrl: 'https://github.com/Thomaltarix/Momentum',
    liveUrl: null,
    featured: false,
  },
];

// French versions of the projects above, keyed by slug. English lives on the Project
// row itself; a slug missing here simply falls back to English on the site.
const frenchTranslations: Record<
  string,
  { title: string; summary: string; content: string }
> = {
  melo: {
    title: 'Melo',
    summary:
      "Mon projet de fin d'études à Epitech : une application de recommandation d'événements musicaux réalisée en équipe, avec un backend Go en microservices, une application mobile Flutter et un front web Vue.",
    content: `## De quoi s'agit-il

Melo est une application de recommandation d'événements musicaux, et le projet que j'ai réalisé avec mon équipe comme projet de fin d'études à Epitech (EIP). Elle recommande des événements aux utilisateurs, qui peuvent aussi parcourir les événements par titre, date, lieu, prix et type, enregistrer des favoris et voir les événements dans un calendrier, avec un rayon de recherche défini dans les paramètres de leur compte.

## Mon rôle

Responsable technique du backend et son développeur principal. J'ai écrit environ la moitié des commits du backend (292 sur environ 570) sur un projet qui a duré de mars 2025 à septembre 2026.

## Backend

- Une architecture de **microservices Go** derrière une passerelle d'API : utilisateurs, favoris, recommandations, calendrier et un service web public, chacun avec son propre Dockerfile, sur une base PostgreSQL partagée avec une étape de migration dédiée.
- **Authentification** avec connexion, inscription et jetons de rafraîchissement, ainsi que des paramètres par utilisateur.
- **Documentation d'API** générée en Swagger / OpenAPI, et collections Bruno pour tester les services.
- Des scripts Python pour les tâches de maintenance, comme le nettoyage des images d'événements orphelines.

## Autour du backend

- Une application mobile **Flutter** et un front web **Vue**.
- Des environnements **preprod** et **prod** distincts, GitHub Actions et un dépôt CI/CD dédié.
- Une application de monitoring des statistiques de l'application, et une bibliothèque de scripts de scraping.
- Des **dépôts de benchmark** en amont, comparant les technologies de back-end, de base de données et d'ORM, de front-end et de mobile avant le choix de la stack.

Le code source se trouve dans une organisation privée, il n'y a donc pas de dépôt public. Je le présente volontiers sur demande.`,
  },
  portfolio: {
    title: 'Portfolio',
    summary:
      'Ce site même : un portfolio conçu comme un vrai produit, avec une API NestJS, un front React et une chaîne Docker et CI/CD complète.',
    content: `## De quoi s'agit-il

Un portfolio construit comme un vrai produit plutôt que comme un modèle. Le site que vous lisez est servi par l'API décrite ci-dessous.

## Points clés

- **Backend** : NestJS avec Prisma et PostgreSQL, organisé en modules par fonctionnalité (contrôleur, service, repository), chaque requête validée par des DTO et chaque endpoint documenté dans Swagger.
- **Frontend** : React et Vite, bilingue (français et anglais), avec thèmes clair et sombre et une palette de commandes.
- **Tableau de bord admin** : espace protégé par JWT pour gérer les projets, lire les messages de contact et consulter les statistiques.
- **Formulaire de contact** : validé côté serveur et envoyé par e-mail via Resend.
- **Statistiques respectueuses de la vie privée** : mesure d'audience maison avec possibilité de refus, sans traceur tiers.
- **Activité GitHub** : un petit proxy côté serveur avec cache en mémoire, pour que le client ne contacte jamais GitHub directement.
- **Livraison** : Docker Compose avec profils production et staging, et workflows GitHub Actions pour la CI, les releases et le déploiement.`,
  },
  momentum: {
    title: 'Momentum',
    summary:
      "Une application Flutter native qui réunit suivi d'habitudes quotidiennes, comptage de pas et suivi nutritionnel, avec séries et récompenses ludiques.",
    content: `## De quoi s'agit-il

Une application Android d'habitudes quotidiennes, pensée pour un usage personnel et ludique. Plutôt que de refaire un compteur de pas, un suivi d'entraînement ou un journal alimentaire, elle lit ce que ces applications font déjà bien via **Health Connect** et y ajoute des routines et des récompenses.

## Fonctionnalités

- Routines avec récurrence et notifications locales programmées.
- Pas, entraînements, nutrition et poids lus depuis Health Connect (en lecture seule), avec une saisie manuelle de secours pour chaque mesure.
- Objectifs quotidiens configurables et un calculateur de macros qui suggère des cibles à partir des paramètres corporels.
- Gamification déterministe : séries, XP, niveaux et badges, recalculés pour chaque jour écoulé depuis la dernière ouverture de l'application.

## Ingénierie

- Flutter avec Riverpod pour l'état et go_router pour la navigation.
- Local d'abord : les données vivent sur l'appareil dans une base Drift (SQLite), sans backend ni compte.
- Les données quotidiennes de Health Connect sont mises en cache localement, pour que l'historique survive aux échecs de requête du système ou à une permission révoquée.`,
  },
  'unified-calendar': {
    title: 'UnifiedCalendar',
    summary:
      'Un SaaS en cours de développement qui synchronise Google Agenda et Microsoft Outlook dans une seule vue de calendrier.',
    content: `## Statut

Projet en cours : l'architecture et l'authentification sont en place, mais le produit n'est pas terminé.

## De quoi s'agit-il

Une plateforme de synchronisation de calendriers qui réunit dans une seule interface les événements de plusieurs sources.

## Fonctionnalités prévues

- Connecter et synchroniser **Google Agenda** et **Microsoft Outlook**.
- Tableau de bord unifié avec filtres par source, période et mots-clés.
- Créer, modifier et supprimer des événements sur les différentes plateformes.
- Authentification avec OAuth Google et Microsoft, ou e-mail et mot de passe, via JWT avec jetons de rafraîchissement.

## Ingénierie

- **Backend** : NestJS avec Prisma et PostgreSQL, avec des modules d'authentification et d'utilisateurs, des tests de bout en bout et une documentation Swagger / OpenAPI.
- **Frontend** : Next.js (App Router) avec Tailwind CSS, pensé mobile d'abord.
- TypeScript de bout en bout dans le monorepo.`,
  },
};

async function main(): Promise<void> {
  const slugs = projects.map((project) => project.slug);
  await prisma.project.deleteMany({ where: { slug: { notIn: slugs } } });

  for (const project of projects) {
    const saved = await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });

    const french = frenchTranslations[project.slug];
    if (!french) continue;
    await prisma.projectTranslation.upsert({
      where: { projectId_locale: { projectId: saved.id, locale: 'fr' } },
      update: french,
      create: { projectId: saved.id, locale: 'fr', ...french },
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
