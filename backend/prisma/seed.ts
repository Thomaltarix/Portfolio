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
      'My end-of-studies project at Epitech, still in progress: a music event recommendation app I am building with a team, with a Go microservices backend, a Flutter mobile app and a Vue web front.',
    content: `## What it is

Melo is a music event recommendation application, and the end-of-studies project (EIP) I have been building with my team at Epitech since March 2025. It is still in active development, and I keep working on it until I graduate. It recommends events to users, who can also browse events by title, date, location, cost and type, save favourites and see events on a calendar, with a search radius set in their account settings.

## My role

Technical lead of the backend and its main developer. So far I have written about half of the backend commits (292 out of roughly 570).

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
- **Delivery**: Docker Compose with production and staging profiles, and GitHub Actions workflows for CI, releases and deployment.

## Built with AI

This site was built with Claude Code. I made the architecture and design decisions, and reviewed every change before it shipped.`,
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
    slug: 'r-type',
    title: 'R-Type',
    summary:
      'A networked remake of the arcade shooter, built by a team of five on our own C++ game engine with an entity-component-system architecture.',
    content: `## What it is

A third-year Epitech project (September to December 2024): a multiplayer remake of R-Type with a multi-threaded server and a graphical client, built on a game engine we wrote ourselves rather than an existing one. The engine turned out generic enough that we built a second game, in 3D, on top of it.

## My role

I was the top contributor, with 386 of about 1,300 commits. I owned the gameplay design and implemented much of it as engine systems and components:

- Physics: gravity, collisions that deal damage, jumping and hitboxes.
- The second game, in 3D: player spawning and movement, the camera, the ground and obstacles.
- Hitbox drawing in the graphics library interface, and the event handlers that connect systems together.

## Engineering

- C++ built with CMake and vcpkg, with Raylib for rendering.
- The engine, the network layer and each game are separate modules.
- Continuous integration on both Linux and Windows, with unit tests.`,
    techStack: ['C++', 'CMake', 'vcpkg', 'Raylib', 'ECS', 'GitHub Actions'],
    githubUrl: 'https://github.com/FppEpitech/R-Type',
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
      "Mon projet de fin d'études à Epitech, toujours en cours : une application de recommandation d'événements musicaux que je développe en équipe, avec un backend Go en microservices, une application mobile Flutter et un front web Vue.",
    content: `## De quoi s'agit-il

Melo est une application de recommandation d'événements musicaux, et le projet de fin d'études (EIP) que je développe avec mon équipe à Epitech depuis mars 2025. Il est toujours en développement actif, et j'y travaille jusqu'à la fin de mes études. Elle recommande des événements aux utilisateurs, qui peuvent aussi parcourir les événements par titre, date, lieu, prix et type, enregistrer des favoris et voir les événements dans un calendrier, avec un rayon de recherche défini dans les paramètres de leur compte.

## Mon rôle

Responsable technique du backend et son développeur principal. J'ai écrit jusqu'ici environ la moitié des commits du backend (292 sur environ 570).

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
- **Livraison** : Docker Compose avec profils production et staging, et workflows GitHub Actions pour la CI, les releases et le déploiement.

## Conçu avec l'IA

Ce site a été développé avec Claude Code. Les choix d'architecture et de design sont les miens, et chaque modification a été relue avant d'être mise en ligne.`,
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
  'r-type': {
    title: 'R-Type',
    summary:
      "Un remake en réseau du jeu d'arcade, développé à cinq sur notre propre moteur de jeu en C++, avec une architecture entité-composant-système.",
    content: `## De quoi s'agit-il

Un projet de 3e année à Epitech (septembre à décembre 2024) : un remake multijoueur de R-Type, avec un serveur multithreadé et un client graphique, construit sur un moteur de jeu écrit par nous plutôt que sur un moteur existant. Le moteur s'est révélé assez générique pour qu'on développe un second jeu, en 3D, par-dessus.

## Mon rôle

J'étais le premier contributeur, avec 386 commits sur environ 1 300. J'avais la charge du game design et j'en ai implémenté une grande partie sous forme de systèmes et de composants du moteur :

- Physique : gravité, collisions infligeant des dégâts, saut et hitboxes.
- Le second jeu, en 3D : apparition et déplacement du joueur, caméra, sol et obstacles.
- L'affichage des hitboxes dans l'interface de la bibliothèque graphique, et les gestionnaires d'événements qui relient les systèmes entre eux.

## Ingénierie

- C++ compilé avec CMake et vcpkg, rendu avec Raylib.
- Le moteur, la couche réseau et chaque jeu sont des modules séparés.
- Intégration continue sous Linux et Windows, avec des tests unitaires.`,
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
