#!/bin/sh
cd /app && bun run packages/db/src/migrate.ts
cd /app && exec bun run apps/server/src/index.ts
