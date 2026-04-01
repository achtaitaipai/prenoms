import {
  db,
  insertNationalFirstnameSchema,
  nationalFirstnames,
} from "@prenoms/db";
import { sql } from "drizzle-orm";
import { z } from "zod";

const CSV_PATH = new URL("../data/prenoms-2024-nat.csv", import.meta.url);
const BATCH_SIZE = 1000;

const rowSchema = insertNationalFirstnameSchema.extend({
  sex: z.coerce.number(),
  year: z.coerce.number(),
  count: z.coerce.number(),
});

const text = await Bun.file(CSV_PATH).text();
const lines = text.trim().split("\n");

let skipped = 0;
const rows = lines.slice(1).flatMap((line) => {
  const parts = line.split(";");
  const result = rowSchema.safeParse({
    sex: parts[0],
    firstname: parts[1],
    year: parts[2],
    count: parts[3],
  });
  if (!result.success) {
    skipped++;
    return [];
  }
  return [result.data];
});

console.log(`Seeding ${rows.length} rows (${skipped} skipped)...`);

await db.run(sql`DELETE FROM national_firstnames`);

for (let i = 0; i < rows.length; i += BATCH_SIZE) {
  const batch = rows.slice(i, i + BATCH_SIZE);
  await db.insert(nationalFirstnames).values(batch);
  console.log(`  ${Math.min(i + BATCH_SIZE, rows.length)} / ${rows.length}`);
}

console.log("Done.");
