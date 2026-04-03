import { MAX_YEAR, MIN_YEAR } from "@prenoms/config";
import { db, nationalFirstnames } from "@prenoms/db";
import { movingAverage, pearson } from "@prenoms/functions";
import { comparaisonQuerySchema } from "@prenoms/validators";
import { and, asc, eq, sum } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";

const YEAR_COUNT = MAX_YEAR - MIN_YEAR + 1;

async function getTotalBirths(sex: number | undefined) {
  const condition = sex !== undefined ? eq(nationalFirstnames.sex, sex) : undefined;
  const rows = await db
    .select({
      year: nationalFirstnames.year,
      total: sum(nationalFirstnames.count).mapWith(Number),
    })
    .from(nationalFirstnames)
    .where(condition)
    .groupBy(nationalFirstnames.year)
    .orderBy(asc(nationalFirstnames.year));
  return new Map(rows.map((r) => [r.year, r.total]));
}

async function getProportions(firstname: string, sex: number | undefined) {
  const conditions = [eq(nationalFirstnames.firstname, firstname.toUpperCase())];
  if (sex !== undefined) conditions.push(eq(nationalFirstnames.sex, sex));

  const [nameRows, birthMap] = await Promise.all([
    db
      .select({
        year: nationalFirstnames.year,
        count: sum(nationalFirstnames.count).mapWith(Number),
      })
      .from(nationalFirstnames)
      .where(and(...conditions))
      .groupBy(nationalFirstnames.year)
      .orderBy(asc(nationalFirstnames.year)),
    getTotalBirths(sex),
  ]);

  const nameMap = new Map(nameRows.map((r) => [r.year, r.count]));

  const proportions: number[] = [];
  for (let i = 0; i < YEAR_COUNT; i++) {
    const year = MIN_YEAR + i;
    const count = nameMap.get(year) ?? 0;
    const total = birthMap.get(year) ?? 0;
    proportions.push(total > 0 ? count / total : 0);
  }
  return proportions;
}

export const comparaison = new Elysia().get(
  "/comparison",
  async ({ query }) => {
    const { firstname1, firstname2, sex1, sex2 } = query;

    const [props1, props2] = await Promise.all([
      getProportions(firstname1, sex1),
      getProportions(firstname2, sex2),
    ]);

    const smoothed1 = movingAverage(props1);
    const smoothed2 = movingAverage(props2);
    const correlation = Math.round(pearson(smoothed1, smoothed2) * 10000) / 10000;

    return {
      firstname1: firstname1.toUpperCase(),
      firstname2: firstname2.toUpperCase(),
      correlation,
    };
  },
  {
    query: comparaisonQuerySchema,
    response: z.object({
      firstname1: z.string(),
      firstname2: z.string(),
      correlation: z.number(),
    }),
  },
);
