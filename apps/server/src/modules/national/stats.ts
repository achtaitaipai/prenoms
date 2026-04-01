import { db, nationalFirstnames } from "@prenoms/db";
import { and, asc, eq, sum } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";

export const stats = new Elysia().get(
  "/stats",
  async ({ query }) => {
    const { firstname, sex } = query;
    const uppercased = firstname.toUpperCase();

    const conditions = [eq(nationalFirstnames.firstname, uppercased)];
    if (sex !== undefined) {
      conditions.push(eq(nationalFirstnames.sex, sex));
    }

    const where = and(...conditions);

    if (sex !== undefined) {
      const rows = await db
        .select({
          year: nationalFirstnames.year,
          count: nationalFirstnames.count,
        })
        .from(nationalFirstnames)
        .where(where)
        .orderBy(asc(nationalFirstnames.year));

      const totalCount = rows.reduce((s, r) => s + r.count, 0);

      return { firstname: uppercased, totalCount, byYear: rows };
    }

    const rows = await db
      .select({
        year: nationalFirstnames.year,
        count: sum(nationalFirstnames.count).mapWith(Number),
      })
      .from(nationalFirstnames)
      .where(where)
      .groupBy(nationalFirstnames.year)
      .orderBy(asc(nationalFirstnames.year));

    const totalCount = rows.reduce((s, r) => s + r.count, 0);

    return { firstname: uppercased, totalCount, byYear: rows };
  },
  {
    query: z.object({
      firstname: z.string().min(1),
      sex: z.coerce
        .number()
        .pipe(z.union([z.literal(1), z.literal(2)]))
        .optional(),
    }),
    response: z.object({
      firstname: z.string(),
      totalCount: z.number().int(),
      byYear: z.array(
        z.object({
          year: z.number().int(),
          count: z.number().int(),
        }),
      ),
    }),
  },
);
