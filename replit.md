# Overview

A personal bio/portfolio page with a hacker/matrix aesthetic. It's a full-stack TypeScript application featuring a React frontend with an animated Matrix rain background, a 3D-interactive bio card with social links, and a background music player. The backend is a minimal Express server that currently serves the frontend and has a basic user storage interface (not actively used by the bio page).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) — currently just `/` (home) and a 404 page
- **Styling**: Tailwind CSS with CSS variables for theming. The theme is a dark green/hacker aesthetic (green-on-black color scheme using HSL CSS variables)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives. Components live in `client/src/components/ui/`. These are pre-installed and ready to use
- **State/Data Fetching**: TanStack React Query with a custom `apiRequest` helper in `client/src/lib/queryClient.ts`
- **Animations**: Framer Motion for card interactions and entrance animations
- **Key Custom Components**:
  - `MatrixRain` — canvas-based falling character animation (background effect)
  - `BioCard` — 3D tilt-on-hover card with avatar, name, description, and social links
  - `MusicPlayer` — fixed-position audio toggle button (expects `/music/background.mp3` in public assets)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 on Node.js, written in TypeScript and run with `tsx`
- **Architecture**: Single `server/index.ts` entry point creates an HTTP server. Routes are registered in `server/routes.ts`. In development, Vite dev server middleware is used (`server/vite.ts`); in production, static files are served from `dist/public` (`server/static.ts`)
- **Storage Layer**: `server/storage.ts` defines an `IStorage` interface with a `MemStorage` in-memory implementation. Currently only has basic user CRUD methods (getUser, getUserByUsername, createUser). This is a placeholder — swap to a database-backed implementation when needed
- **API Convention**: All API routes should be prefixed with `/api`

### Database
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Defined in `shared/schema.ts` — currently just a `users` table with `id` (UUID), `username`, and `password`
- **Validation**: Zod schemas auto-generated from Drizzle schema via `drizzle-zod`
- **Migrations**: Drizzle Kit configured to output migrations to `./migrations`. Use `npm run db:push` to push schema changes
- **Connection**: Requires `DATABASE_URL` environment variable. The app currently uses in-memory storage, so Postgres isn't strictly required until database features are added

### Build System
- **Development**: `npm run dev` — runs the Express server with Vite middleware for HMR
- **Production Build**: `npm run build` — Vite builds the client to `dist/public`, esbuild bundles the server to `dist/index.cjs`. Frequently-used server dependencies are bundled (allowlisted in `script/build.ts`) while others are kept external
- **Production Start**: `npm start` — runs `node dist/index.cjs`

### Key Design Decisions
- **Monorepo-style layout**: Client (`client/`), server (`server/`), and shared code (`shared/`) in one repo. Shared schema types are imported by both sides
- **In-memory storage as default**: The storage interface pattern makes it easy to swap implementations (e.g., from `MemStorage` to a Postgres-backed `DatabaseStorage`) without changing route handlers
- **Dark-only theme**: CSS variables are set for a single dark green theme — no light/dark toggle

## External Dependencies

- **PostgreSQL**: Required when using database features (configured via `DATABASE_URL` env var). Currently the app runs with in-memory storage
- **Google Fonts**: Loaded from Google Fonts CDN (Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Replit Plugins**: Vite plugins for Replit integration (runtime error overlay, cartographer, dev banner) — only active in development on Replit
- **No external APIs currently used**: The social links in the bio card are placeholder URLs (github.com, discord.com, twitter.com)