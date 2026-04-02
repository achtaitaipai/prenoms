FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/config/package.json ./packages/config/
COPY packages/seed/package.json ./packages/seed/
COPY packages/ui/package.json ./packages/ui/
RUN bun install --frozen-lockfile

FROM oven/bun:1-alpine AS build
WORKDIR /app
COPY --from=deps /app .
COPY . .
RUN cd apps/server && bun run build

FROM oven/bun:1-alpine AS runtime
WORKDIR /app
COPY --from=deps /app .
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=build /app/packages/db/src/schema ./packages/db/src/schema
COPY --from=build /app/packages/db/drizzle.config.ts ./packages/db/drizzle.config.ts
COPY --from=build /app/packages/db/package.json ./packages/db/package.json
COPY apps/server/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
ENV NODE_ENV=production
EXPOSE 3000
CMD ["./entrypoint.sh"]
