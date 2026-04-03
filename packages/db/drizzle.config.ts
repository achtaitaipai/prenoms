import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: "../../.env",
});

function resolveDbUrl(url: string) {
  const dir = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url));
  const root = resolve(dir, "../..");
  if (url.startsWith("file:") && !url.startsWith("file:/")) {
    return `file:${resolve(root, url.slice(5))}`;
  }
  return url;
}

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "turso",
  dbCredentials: {
    url: resolveDbUrl(process.env.DATABASE_URL || ""),
  },
});
