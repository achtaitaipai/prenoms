import { db, nationalFirstnames } from "@prenoms/db";
import { rankingQuerySchema, rankingSearchQuerySchema } from "@prenoms/validators";
import { and, asc, desc, eq, gte, lte, sql, sum } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";

function buildConditions(params: { sex?: number; yearStart?: number; yearEnd?: number }) {
  const conditions = [];
  if (params.sex !== undefined) {
    conditions.push(eq(nationalFirstnames.sex, params.sex));
  }
  if (params.yearStart !== undefined) {
    conditions.push(gte(nationalFirstnames.year, params.yearStart));
  }
  if (params.yearEnd !== undefined) {
    conditions.push(lte(nationalFirstnames.year, params.yearEnd));
  }
  return conditions.length > 0 ? and(...conditions) : undefined;
}

export const classement = new Elysia()
  .get(
    "/ranking",
    async ({ query }) => {
      const { sex, yearStart, yearEnd, page = 1, pageSize = 20 } = query;
      const where = buildConditions({ sex, yearStart, yearEnd });

      const [row] = await db
        .select({ total: sql<number>`count(distinct ${nationalFirstnames.firstname})` })
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
        .orderBy(desc(sum(nationalFirstnames.count)), asc(nationalFirstnames.firstname))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      return { page, pageSize, totalPages, data };
    },
    {
      query: rankingQuerySchema,
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
  )
  .get(
    "/ranking/search",
    async ({ query }) => {
      const { firstname, sex, yearStart, yearEnd, pageSize } = query;
      const uppercased = firstname.toUpperCase();
      const where = buildConditions({ sex, yearStart, yearEnd });

      const [nameRow] = await db
        .select({
          total: sum(nationalFirstnames.count).mapWith(Number),
        })
        .from(nationalFirstnames)
        .where(and(eq(nationalFirstnames.firstname, uppercased), where));

      if (!nameRow?.total) {
        return null;
      }

      // Count firstnames with a strictly higher total → rank = count + 1
      const sexCond = sex !== undefined ? sql`and sex = ${sex}` : sql``;
      const yearStartCond = yearStart !== undefined ? sql`and year >= ${yearStart}` : sql``;
      const yearEndCond = yearEnd !== undefined ? sql`and year <= ${yearEnd}` : sql``;

      const rankResult = await db.get<{ count: number }>(sql`
        select count(*) as count from (
          select firstname, sum(count) as total
          from national_firstnames
          where 1=1 ${sexCond} ${yearStartCond} ${yearEndCond}
          group by firstname
          having total > ${nameRow.total}
            or (total = ${nameRow.total} and firstname < ${uppercased})
        )
      `);

      const rank = (rankResult?.count ?? 0) + 1;
      const page = Math.ceil(rank / pageSize);

      return { firstname: uppercased, total: nameRow.total, rank, page };
    },
    {
      query: rankingSearchQuerySchema,
    },
  );
