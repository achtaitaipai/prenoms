import { MIN_YEAR, MAX_YEAR, SIMILAR_MIN_TOTAL, SIMILAR_TOP_N } from "@prenoms/config";
import { db, nationalFirstnames, similarFirstnames, getTotalBirths } from "@prenoms/db";
import { movingAverage, pearson } from "@prenoms/functions";
import { sql, sum, eq } from "drizzle-orm";

const BATCH_SIZE = 1000;
const YEAR_COUNT = MAX_YEAR - MIN_YEAR + 1;

// Get all firstnames with total births >= MIN_TOTAL
async function getFirstnames() {
  const rows = await db
    .select({
      firstname: nationalFirstnames.firstname,
      total: sum(nationalFirstnames.count).mapWith(Number),
    })
    .from(nationalFirstnames)
    .groupBy(nationalFirstnames.firstname);

  return rows.filter((r) => r.total >= SIMILAR_MIN_TOTAL).map((r) => r.firstname);
}

// Compute proportions for a name given a precomputed birthMap
function buildProportions(nameRows: Map<number, number>, birthMap: Map<number, number>) {
  const proportions: number[] = [];
  for (let i = 0; i < YEAR_COUNT; i++) {
    const year = MIN_YEAR + i;
    const count = nameRows.get(year) ?? 0;
    const total = birthMap.get(year) ?? 0;
    proportions.push(total > 0 ? count / total : 0);
  }
  return proportions;
}

// Fetch all name counts grouped by year for a sex filter
async function fetchAllNameCounts(sex: number | undefined) {
  const conditions = sex !== undefined ? eq(nationalFirstnames.sex, sex) : undefined;
  const rows = await db
    .select({
      firstname: nationalFirstnames.firstname,
      year: nationalFirstnames.year,
      count: sum(nationalFirstnames.count).mapWith(Number),
    })
    .from(nationalFirstnames)
    .where(conditions)
    .groupBy(nationalFirstnames.firstname, nationalFirstnames.year);

  const map = new Map<string, Map<number, number>>();
  for (const r of rows) {
    let yearMap = map.get(r.firstname);
    if (!yearMap) {
      yearMap = new Map();
      map.set(r.firstname, yearMap);
    }
    yearMap.set(r.year, r.count);
  }
  return map;
}

// Compute total births per firstname for a sex filter
async function fetchTotalByName(sex: number | undefined) {
  const conditions = sex !== undefined ? eq(nationalFirstnames.sex, sex) : undefined;
  const rows = await db
    .select({
      firstname: nationalFirstnames.firstname,
      total: sum(nationalFirstnames.count).mapWith(Number),
    })
    .from(nationalFirstnames)
    .where(conditions)
    .groupBy(nationalFirstnames.firstname);

  const map = new Map<string, number>();
  for (const r of rows) {
    map.set(r.firstname, r.total);
  }
  return map;
}

type SexFilter = number | undefined; // undefined = all, 1 = M, 2 = F

function sexToValue(sex: SexFilter): number {
  return sex ?? 0;
}

function sexLabel(sex: SexFilter): string {
  return sex === undefined ? "all" : sex === 1 ? "M" : "F";
}

// Build smoothed proportions map for a given sex filter
async function buildSmoothedMap(firstnames: string[], sex: SexFilter) {
  const [birthMap, allCounts] = await Promise.all([getTotalBirths(sex), fetchAllNameCounts(sex)]);
  const smoothed = new Map<string, number[]>();
  for (const name of firstnames) {
    const yearMap = allCounts.get(name) ?? new Map();
    const props = buildProportions(yearMap, birthMap);
    smoothed.set(name, movingAverage(props));
  }
  return smoothed;
}

type Variant = { sourceSex: SexFilter; targetSex: SexFilter };

const SEX_FILTERS: SexFilter[] = [undefined, 1, 2];
const VARIANTS: Variant[] = SEX_FILTERS.flatMap((s) =>
  SEX_FILTERS.map((t) => ({ sourceSex: s, targetSex: t })),
);

async function seedVariant(
  firstnames: string[],
  variant: Variant,
  smoothedMaps: Map<SexFilter, Map<string, number[]>>,
  totalMaps: Map<SexFilter, Map<string, number>>,
) {
  const { sourceSex, targetSex } = variant;
  const label = `${sexLabel(sourceSex)}→${sexLabel(targetSex)}`;
  console.log(`\nComputing similarities for ${label}...`);

  const sourceSmoothed = smoothedMaps.get(sourceSex)!;
  const targetSmoothed = smoothedMaps.get(targetSex)!;
  const targetTotals = totalMaps.get(targetSex)!;

  const sourceNames = firstnames.filter((n) => sourceSmoothed.has(n));
  const targetNames = firstnames.filter((n) => targetSmoothed.has(n));

  console.log(`  ${sourceNames.length} source, ${targetNames.length} target names`);

  const rows: {
    firstname: string;
    similarFirstname: string;
    correlation: number;
    sourceSex: number;
    targetSex: number;
    rank: number;
  }[] = [];

  // When source and target sex are the same, use symmetry optimization
  const symmetric = sourceSex === targetSex;

  if (symmetric) {
    const topMap = new Map<string, { name: string; corr: number }[]>();
    for (const name of sourceNames) {
      topMap.set(name, []);
    }

    for (let i = 0; i < sourceNames.length; i++) {
      const nameA = sourceNames[i]!;
      const smoothA = sourceSmoothed.get(nameA)!;

      for (let j = i + 1; j < sourceNames.length; j++) {
        const nameB = sourceNames[j]!;
        const smoothB = sourceSmoothed.get(nameB)!;
        const corr = pearson(smoothA, smoothB);

        const topA = topMap.get(nameA)!;
        if (topA.length < SIMILAR_TOP_N || corr > topA[topA.length - 1]!.corr) {
          topA.push({ name: nameB, corr });
          topA.sort(
            (a, b) =>
              b.corr - a.corr || (targetTotals.get(b.name) ?? 0) - (targetTotals.get(a.name) ?? 0),
          );
          if (topA.length > SIMILAR_TOP_N) topA.length = SIMILAR_TOP_N;
        }

        const topB = topMap.get(nameB)!;
        if (topB.length < SIMILAR_TOP_N || corr > topB[topB.length - 1]!.corr) {
          topB.push({ name: nameA, corr });
          topB.sort(
            (a, b) =>
              b.corr - a.corr || (targetTotals.get(b.name) ?? 0) - (targetTotals.get(a.name) ?? 0),
          );
          if (topB.length > SIMILAR_TOP_N) topB.length = SIMILAR_TOP_N;
        }
      }

      if (i % 500 === 0 && i > 0) {
        console.log(`  ${i} / ${sourceNames.length}`);
      }
    }

    for (const [name, top] of topMap) {
      for (let r = 0; r < top.length; r++) {
        rows.push({
          firstname: name,
          similarFirstname: top[r]!.name,
          correlation: Math.round(top[r]!.corr * 10000) / 10000,
          sourceSex: sexToValue(sourceSex),
          targetSex: sexToValue(targetSex),
          rank: r + 1,
        });
      }
    }
  } else {
    // Asymmetric: for each source, compare against all targets
    for (let i = 0; i < sourceNames.length; i++) {
      const nameA = sourceNames[i]!;
      const smoothA = sourceSmoothed.get(nameA)!;
      const top: { name: string; corr: number }[] = [];

      for (const nameB of targetNames) {
        if (nameB === nameA) continue;
        const smoothB = targetSmoothed.get(nameB)!;
        const corr = pearson(smoothA, smoothB);

        if (top.length < SIMILAR_TOP_N || corr > top[top.length - 1]!.corr) {
          top.push({ name: nameB, corr });
          top.sort(
            (a, b) =>
              b.corr - a.corr || (targetTotals.get(b.name) ?? 0) - (targetTotals.get(a.name) ?? 0),
          );
          if (top.length > SIMILAR_TOP_N) top.length = SIMILAR_TOP_N;
        }
      }

      for (let r = 0; r < top.length; r++) {
        rows.push({
          firstname: nameA,
          similarFirstname: top[r]!.name,
          correlation: Math.round(top[r]!.corr * 10000) / 10000,
          sourceSex: sexToValue(sourceSex),
          targetSex: sexToValue(targetSex),
          rank: r + 1,
        });
      }

      if (i % 500 === 0 && i > 0) {
        console.log(`  ${i} / ${sourceNames.length}`);
      }
    }
  }

  // Batch insert
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    await db.insert(similarFirstnames).values(batch);
  }

  console.log(`  Inserted ${rows.length} rows for ${label}`);
}

// Main
const firstnames = await getFirstnames();
console.log(`Found ${firstnames.length} firstnames with >= ${SIMILAR_MIN_TOTAL} total births`);

await db.run(sql`DELETE FROM similar_firstnames`);

// Precompute smoothed proportions and totals for each sex filter
console.log("Precomputing smoothed proportions...");
const smoothedMaps = new Map<SexFilter, Map<string, number[]>>();
const totalMaps = new Map<SexFilter, Map<string, number>>();

for (const sex of SEX_FILTERS) {
  const [smoothed, totals] = await Promise.all([
    buildSmoothedMap(firstnames, sex),
    fetchTotalByName(sex),
  ]);
  smoothedMaps.set(sex, smoothed);
  totalMaps.set(sex, totals);
}

for (const variant of VARIANTS) {
  await seedVariant(firstnames, variant, smoothedMaps, totalMaps);
}

console.log("\nDone.");
