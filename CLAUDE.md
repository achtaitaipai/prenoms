# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev              # start server (3000) + web (3001) in parallel
bun run dev:server       # server only (hot reload)
bun run dev:web          # frontend only (Vite)
bun run build            # build all packages
bun run check-types      # typecheck all packages
bun run check            # oxlint + oxfmt
bun run test:server      # hurl integration tests (apps/server/tests/*.hurl)
bun run db:local         # start local Turso DB (local.db)
bun run db:push          # apply Drizzle schema to DB
bun run db:studio        # Drizzle Studio UI
bun run db:seed          # seed national data
bun run db:seed:regional # seed regional data
```

## Architecture

Bun monorepo with workspaces (`apps/*`, `packages/*`).

**apps/server** — Elysia API on Bun. Routes as separate modules (`ranking`, `evolution`, `repartition`, `autocomplete`). OpenAPI auto-generated. CORS enabled.

**apps/web** — React 19 + TanStack Router (file-based routes) + TanStack React Query. Styling: PandaCSS (OKLCH tokens, dark mode default) + Ark UI headless components. Charts via Recharts.

**packages/db** — Drizzle ORM + LibSQL/Turso. Two tables: `nationalFirstnames` (firstname, year, count, sex) and `regionalFirstnames` (+ region). Sex: 1=male, 2=female.

**packages/env** — t3-oss/env-core validation. Separate exports: `@prenoms/env/server`, `@prenoms/env/web`.

**packages/ui** — Shared components (PandaCSS + Ark UI). Imported as `@prenoms/ui/components/*`, `@prenoms/ui/hooks/*`, `@prenoms/ui/styled-system/*`.

**packages/seed** — DB seeding scripts for national/regional firstname data.

**packages/config** — Shared TypeScript config (`tsconfig.base.json`).

## Env

Single `.env` at monorepo root. Contains DB URL, CORS origin, Vite server URL.

## Deployment

Docker Compose: Nginx (web) + Elysia (server) + Caddy network. GitHub Actions builds images → pushes to GHCR → SSH deploys to VPS. Server entrypoint runs `drizzle-kit push` before starting.
