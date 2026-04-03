import { MAX_YEAR, MIN_YEAR } from "@prenoms/config";
import { and, asc, eq, sum } from "drizzle-orm";
import { db } from "../index";
import { nationalFirstnames } from "../schema";

const YEAR_COUNT = MAX_YEAR - MIN_YEAR + 1;

export async function getTotalBirths(sex: number | undefined) {
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

export async function getProportions(firstname: string, sex: number | undefined) {
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

export async function getProportionsWithBirthMap(
  firstname: string,
  sex: number | undefined,
  birthMap: Map<number, number>,
) {
  const conditions = [eq(nationalFirstnames.firstname, firstname.toUpperCase())];
  if (sex !== undefined) conditions.push(eq(nationalFirstnames.sex, sex));

  const nameRows = await db
    .select({
      year: nationalFirstnames.year,
      count: sum(nationalFirstnames.count).mapWith(Number),
    })
    .from(nationalFirstnames)
    .where(and(...conditions))
    .groupBy(nationalFirstnames.year)
    .orderBy(asc(nationalFirstnames.year));

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
