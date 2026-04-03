import { resolve } from "node:path";
import { createClient } from "@libsql/client";
import { env } from "@prenoms/env/server";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

const ROOT = resolve(import.meta.dirname, "../../..");

function resolveDbUrl(url: string) {
  if (url.startsWith("file:") && !url.startsWith("file:/")) {
    return `file:${resolve(ROOT, url.slice(5))}`;
  }
  return url;
}

export function createDb() {
  const client = createClient({
    url: resolveDbUrl(env.DATABASE_URL),
  });

  return drizzle({ client, schema });
}

export const db = createDb();

export * from "./schema";
