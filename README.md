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
cp apps/server/.env.example apps/server/.env
```

Setup la base de donnees :

```bash
bun run db:push
bun run db:seed
bun run db:seed:regional
```

Lancer en dev :

```bash
bun run dev
```

- Web : http://localhost:5173
- API : http://localhost:3000

## API

| Endpoint                    | Description                                                      |
| --------------------------- | ---------------------------------------------------------------- |
| `GET /national/ranking`     | Classement des prenoms (sex, yearStart, yearEnd, page, pageSize) |
| `GET /national/stats`       | Serie temporelle d'un prenom (firstname, sex)                    |
| `GET /national/repartition` | Repartition regionale (firstname, sex, yearStart, yearEnd)       |

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
│   ├── ui/             # Composants shadcn/ui partages
│   └── config/         # Config partagee
```

## Scripts

- `bun run dev` : Dev mode (web + server)
- `bun run build` : Build all
- `bun run db:push` : Appliquer le schema
- `bun run db:seed` : Seed national
- `bun run db:seed:regional` : Seed regional
- `bun run db:studio` : Drizzle Studio
- `bun run check` : Lint + format (Oxlint)

## Deploiement

Le projet se deploie via GitHub Actions (`.github/workflows/deploy.yml`) :

1. Build des images Docker (server + web)
2. Push vers GitHub Container Registry
3. Deploy sur VPS via SSH + docker compose
