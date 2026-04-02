#!/bin/sh
cd /app/packages/db && bunx drizzle-kit push
cd /app && exec bun run dist/index.mjs
