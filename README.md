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
bun run db:generate      # generer les migrations SQL
bun run db:migrate       # appliquer les migrations
bun run db:seed          # seed national + regional + similaires
```

Lancer en dev :

```bash
bun run dev
```

- Web : http://localhost:3001
- API : http://localhost:3000

## API

| Endpoint                    | Description                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------- |
| `GET /ranking`              | Classement des prenoms (sex, yearStart, yearEnd, page, pageSize)                        |
| `GET /ranking/search`       | Recherche d'un prenom dans le classement (firstname, sex, yearStart, yearEnd, pageSize) |
| `GET /births-per-year`      | Naissances par annee (sex)                                                              |
| `GET /evolution`            | Serie temporelle d'un prenom (firstname, sex)                                           |
| `GET /repartition`          | Repartition regionale (firstname, sex, yearStart, yearEnd)                              |
| `GET /comparison`           | Comparaison entre deux prenoms (firstname1, sex1, firstname2, sex2)                     |
| `GET /similaires`           | Prenoms similaires (firstname, sourceSex, targetSex)                                    |
| `GET /autocomplete/national`| Autocompletion prenoms nationaux (q, limit)                                             |
| `GET /autocomplete/regional`| Autocompletion prenoms regionaux (q, limit)                                             |
| `GET /autocomplete/similar` | Autocompletion prenoms similaires (q, limit)                                            |

## Structure

```
prenoms/
├── apps/
│   ├── web/            # Frontend React
│   └── server/         # API Elysia
├── packages/
│   ├── db/             # Schema & migrations Drizzle
│   ├── seed/           # Scripts de seed (national + regional + similaires)
│   ├── env/            # Validation des variables d'environnement
│   ├── ui/             # Composants partages (PandaCSS + Ark UI)
│   ├── validators/     # Schemas Zod partages (front + back)
│   ├── functions/      # Fonctions utilitaires partagees
│   └── config/         # Config partagee
```

## Scripts

- `bun run dev` : Dev mode (web + server)
- `bun run build` : Build all
- `bun run check` : Lint + format (Oxlint + Oxfmt)
- `bun run check-types` : Typecheck all packages
- `bun run test:server` : Tests integration API (Hurl)
- `bun run db:local` : DB locale (Turso)
- `bun run db:generate` : Generer les migrations SQL
- `bun run db:migrate` : Appliquer les migrations
- `bun run db:seed` : Seed complet (national + regional + similaires)
- `bun run db:studio` : Drizzle Studio

## Deploiement

Le projet se deploie via GitHub Actions (`.github/workflows/deploy.yml`) :

1. Build des images Docker (server + web)
2. Push vers GitHub Container Registry
3. Deploy sur VPS via SSH + docker compose
