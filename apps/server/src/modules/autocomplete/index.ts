import { db, nationalFirstnames, regionalFirstnames, similarFirstnames } from "@prenoms/db";
import { autocompleteQuerySchema } from "@prenoms/validators";
import { like } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";

function sanitize(q: string) {
  return q.replace(/[%_]/g, "");
}

export const autocomplete = new Elysia({ prefix: "/autocomplete" })
  .get(
    "/national",
    async ({ query }) => {
      const pattern = `${sanitize(query.q.toUpperCase())}%`;
      const rows = await db
        .selectDistinct({ firstname: nationalFirstnames.firstname })
        .from(nationalFirstnames)
        .where(like(nationalFirstnames.firstname, pattern))
        .limit(query.limit);
      return rows.map((r) => r.firstname);
    },
    {
      query: autocompleteQuerySchema,
      response: z.array(z.string()),
    },
  )
  .get(
    "/regional",
    async ({ query }) => {
      const pattern = `${sanitize(query.q.toUpperCase())}%`;
      const rows = await db
        .selectDistinct({ firstname: regionalFirstnames.firstname })
        .from(regionalFirstnames)
        .where(like(regionalFirstnames.firstname, pattern))
        .limit(query.limit);
      return rows.map((r) => r.firstname);
    },
    {
      query: autocompleteQuerySchema,
      response: z.array(z.string()),
    },
  )
  .get(
    "/similar",
    async ({ query }) => {
      const pattern = `${sanitize(query.q.toUpperCase())}%`;
      const rows = await db
        .selectDistinct({ firstname: similarFirstnames.firstname })
        .from(similarFirstnames)
        .where(like(similarFirstnames.firstname, pattern))
        .limit(query.limit);
      return rows.map((r) => r.firstname);
    },
    {
      query: autocompleteQuerySchema,
      response: z.array(z.string()),
    },
  );
