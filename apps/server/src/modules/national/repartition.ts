import { db, regionalFirstnames } from "@prenoms/db";
import { and, desc, eq, gte, lte, sum } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";

export const repartition = new Elysia().get(
  "/repartition",
  async ({ query }) => {
    const { firstname, sex, yearStart, yearEnd } = query;
    const uppercased = firstname.toUpperCase();

    const conditions = [eq(regionalFirstnames.firstname, uppercased)];
    if (sex !== undefined) {
      conditions.push(eq(regionalFirstnames.sex, sex));
    }
    if (yearStart !== undefined) {
      conditions.push(gte(regionalFirstnames.year, yearStart));
    }
    if (yearEnd !== undefined) {
      conditions.push(lte(regionalFirstnames.year, yearEnd));
    }

    const where = and(...conditions);

    const rows = await db
      .select({
        region: regionalFirstnames.region,
        count: sum(regionalFirstnames.count).mapWith(Number),
      })
      .from(regionalFirstnames)
      .where(where)
      .groupBy(regionalFirstnames.region)
      .orderBy(desc(sum(regionalFirstnames.count)));

    const total = rows.reduce((s, r) => s + r.count, 0);

    const data = rows.map((r) => ({
      region: r.region,
      count: r.count,
      percent: total > 0 ? Math.round((r.count / total) * 10000) / 100 : 0,
    }));

    return { firstname: uppercased, data };
  },
  {
    query: z.object({
      firstname: z.string().min(1),
      sex: z.coerce
        .number()
        .pipe(z.union([z.literal(1), z.literal(2)]))
        .optional(),
      yearStart: z.coerce.number().optional(),
      yearEnd: z.coerce.number().optional(),
    }),
    response: z.object({
      firstname: z.string(),
      data: z.array(
        z.object({
          region: z.string(),
          count: z.number().int(),
          percent: z.number(),
        }),
      ),
    }),
  },
);
