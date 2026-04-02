import { db, nationalFirstnames } from "@prenoms/db";
import { and, countDistinct, desc, eq, gte, lte, sum } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";

export const classement = new Elysia().get(
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

    const [row] = await db
      .select({ total: countDistinct(nationalFirstnames.firstname) })
      .from(nationalFirstnames)
      .where(where);
    const totalCount = row?.total ?? 0;

    const totalPages = Math.ceil(totalCount / pageSize);

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

    return { page, pageSize, totalPages, data };
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
    response: z.object({
      page: z.number().int(),
      pageSize: z.number().int(),
      totalPages: z.number().int(),
      data: z.array(
        z.object({
          firstname: z.string(),
          total: z.number().int(),
        }),
      ),
    }),
  },
);
