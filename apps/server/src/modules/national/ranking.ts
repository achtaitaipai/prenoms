import { db, nationalFirstnames } from "@prenoms/db";
import { and, desc, eq, gte, lte, sum } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";

export const ranking = new Elysia().get(
  "/ranking",
  async ({ query }) => {
    const { sex, yearStart, yearEnd, page = 1, pageSize = 20 } = query;

    const conditions = [];
    if (sex !== undefined) {
      conditions.push(eq(nationalFirstnames.sex, sex));
    }
    if (yearStart !== undefined) {
      conditions.push(gte(nationalFirstnames.year, yearStart));
    }
    if (yearEnd !== undefined) {
      conditions.push(lte(nationalFirstnames.year, yearEnd));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select({
        firstname: nationalFirstnames.firstname,
        total: sum(nationalFirstnames.count).mapWith(Number),
      })
      .from(nationalFirstnames)
      .where(where)
      .groupBy(nationalFirstnames.firstname)
      .orderBy(desc(sum(nationalFirstnames.count)))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return { page, pageSize, data };
  },
  {
    query: z.object({
      sex: z.coerce
        .number()
        .pipe(z.union([z.literal(1), z.literal(2)]))
        .optional(),
      yearStart: z.coerce.number().optional(),
      yearEnd: z.coerce.number().optional(),
      page: z.coerce.number().min(1).default(1),
      pageSize: z.coerce.number().min(1).max(100).default(20),
    }),
  },
);
