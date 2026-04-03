import { MAX_YEAR, MIN_YEAR } from "@prenoms/config";
import { db, nationalFirstnames } from "@prenoms/db";
import { birthsPerYearQuerySchema, evolutionQuerySchema } from "@prenoms/validators";
import { and, asc, eq, sum } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";

function fillMissingYears(rows: { year: number; count: number }[]) {
  if (rows.length === 0) return [];
  const map = new Map(rows.map((r) => [r.year, r.count]));
  return Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => {
    const year = MIN_YEAR + i;
    return { year, count: map.get(year) ?? 0 };
  });
}

export const statistiques = new Elysia()
  .get(
    "/births-per-year",
    async ({ query }) => {
      const { sex } = query;
      const conditions = sex !== undefined ? eq(nationalFirstnames.sex, sex) : undefined;

      const dbRows = await db
        .select({
          year: nationalFirstnames.year,
          total: sum(nationalFirstnames.count).mapWith(Number),
        })
        .from(nationalFirstnames)
        .where(conditions)
        .groupBy(nationalFirstnames.year)
        .orderBy(asc(nationalFirstnames.year));

      const map = new Map(dbRows.map((r) => [r.year, r.total]));
      const byYear = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => {
        const year = MIN_YEAR + i;
        return { year, total: map.get(year) ?? 0 };
      });

      return { byYear };
    },
    {
      query: birthsPerYearQuerySchema,
      response: z.object({
        byYear: z.array(
          z.object({
            year: z.number().int(),
            total: z.number().int(),
          }),
        ),
      }),
    },
  )
  .get(
    "/evolution",
    async ({ query }) => {
      const { firstname, sex } = query;
      const uppercased = firstname.toUpperCase();

      const conditions = [eq(nationalFirstnames.firstname, uppercased)];
      if (sex !== undefined) {
        conditions.push(eq(nationalFirstnames.sex, sex));
      }

      const where = and(...conditions);

      if (sex !== undefined) {
        const dbRows = await db
          .select({
            year: nationalFirstnames.year,
            count: nationalFirstnames.count,
          })
          .from(nationalFirstnames)
          .where(where)
          .orderBy(asc(nationalFirstnames.year));

        const rows = fillMissingYears(dbRows);
        const totalCount = rows.reduce((s, r) => s + r.count, 0);

        return { firstname: uppercased, totalCount, byYear: rows };
      }

      const dbRows = await db
        .select({
          year: nationalFirstnames.year,
          count: sum(nationalFirstnames.count).mapWith(Number),
        })
        .from(nationalFirstnames)
        .where(where)
        .groupBy(nationalFirstnames.year)
        .orderBy(asc(nationalFirstnames.year));

      const rows = fillMissingYears(dbRows);
      const totalCount = rows.reduce((s, r) => s + r.count, 0);

      return { firstname: uppercased, totalCount, byYear: rows };
    },
    {
      query: evolutionQuerySchema,
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
