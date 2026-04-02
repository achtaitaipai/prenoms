#!/bin/sh
cd /app/packages/db && bunx drizzle-kit push
cd /app/apps/server && exec bun run /app/dist/index.mjs
