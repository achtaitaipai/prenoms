import { MAX_YEAR, MIN_YEAR } from "@prenoms/config";
import { db, nationalFirstnames } from "@prenoms/db";
import { similarityQuerySchema } from "@prenoms/validators";
import { and, asc, eq, sum } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";

const YEAR_COUNT = MAX_YEAR - MIN_YEAR + 1;
const WINDOW = 2; // ±2 years → 5-year moving average

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

function movingAverage(data: number[]): number[] {
  return data.map((_, i) => {
    let sum = 0;
    let count = 0;
    for (let j = Math.max(0, i - WINDOW); j <= Math.min(data.length - 1, i + WINDOW); j++) {
      sum += data[j] ?? 0;
      count++;
    }
    return sum / count;
  });
}

function pearson(x: number[], y: number[]): number {
  const n = x.length;
  const meanX = x.reduce((s, v) => s + v, 0) / n;
  const meanY = y.reduce((s, v) => s + v, 0) / n;

  let num = 0;
  let denomX = 0;
  let denomY = 0;
  for (let i = 0; i < n; i++) {
    const dx = (x[i] ?? 0) - meanX;
    const dy = (y[i] ?? 0) - meanY;
    num += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const denom = Math.sqrt(denomX * denomY);
  return denom === 0 ? 0 : num / denom;
}

export const similarite = new Elysia().get(
  "/similarity",
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
    query: similarityQuerySchema,
    response: z.object({
      firstname1: z.string(),
      firstname2: z.string(),
      correlation: z.number(),
    }),
  },
);
