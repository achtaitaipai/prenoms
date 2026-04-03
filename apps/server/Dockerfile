FROM oven/bun:debian
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/config/package.json ./packages/config/
COPY packages/seed/package.json ./packages/seed/
COPY packages/ui/package.json ./packages/ui/
RUN bun install --frozen-lockfile --ignore-scripts
COPY . .
COPY apps/server/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
ENV NODE_ENV=production
EXPOSE 3000
CMD ["./entrypoint.sh"]
