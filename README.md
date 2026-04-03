# Prenoms

Application web d'exploration des prenoms en France. Statistiques nationales, classements et repartition regionale.

## Stack

- **Frontend** : React, TanStack Router, PandaCss, Ark Ui
- **Backend** : Elysia (Bun)
- **Base de donnees** : SQLite / Drizzle ORM
- **Deploiement** : Docker, GitHub Actions, Caddy

## Getting Started

```bash
bun install
```

Configurer l'environnement :

```bash
cp .env.example .env
```

Setup la base de donnees :

```bash
bun run db:local         # demarrer la DB locale
bun run db:push
bun run db:seed
bun run db:seed:regional
```

Lancer en dev :

```bash
bun run dev
```

- Web : http://localhost:3001
- API : http://localhost:3000

## API

| Endpoint                     | Description                                                      |
| ---------------------------- | ---------------------------------------------------------------- |
| `GET /ranking`               | Classement des prenoms (sex, yearStart, yearEnd, page, pageSize) |
| `GET /evolution`             | Serie temporelle d'un prenom (firstname, sex)                    |
| `GET /repartition`           | Repartition regionale (firstname, sex, yearStart, yearEnd)       |
| `GET /autocomplete/national` | Autocompletion prenoms nationaux (q, limit)                      |
| `GET /autocomplete/regional` | Autocompletion prenoms regionaux (q, limit)                      |

## Structure

```
prenoms/
├── apps/
│   ├── web/            # Frontend React
│   └── server/         # API Elysia
├── packages/
│   ├── db/             # Schema & migrations Drizzle
│   ├── seed/           # Scripts de seed (national + regional)
│   ├── env/            # Validation des variables d'environnement
│   ├── ui/             # Composants partages (PandaCSS + Ark UI)
│   └── config/         # Config partagee
```

## Scripts

- `bun run dev` : Dev mode (web + server)
- `bun run build` : Build all
- `bun run check` : Lint + format (Oxlint + Oxfmt)
- `bun run check-types` : Typecheck all packages
- `bun run test:server` : Tests integration API (Hurl)
- `bun run db:local` : DB locale (Turso)
- `bun run db:push` : Appliquer le schema
- `bun run db:seed` : Seed national
- `bun run db:seed:regional` : Seed regional
- `bun run db:studio` : Drizzle Studio

## Deploiement

Le projet se deploie via GitHub Actions (`.github/workflows/deploy.yml`) :

1. Build des images Docker (server + web)
2. Push vers GitHub Container Registry
3. Deploy sur VPS via SSH + docker compose
