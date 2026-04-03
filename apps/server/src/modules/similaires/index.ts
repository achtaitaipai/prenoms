import { db, similarFirstnames } from "@prenoms/db";
import { similairesQuerySchema } from "@prenoms/validators";
import { and, asc, eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";

export const similaires = new Elysia().get(
  "/similaires",
  async ({ query }) => {
    const { firstname, sourceSex, targetSex } = query;
    const sourceSexValue = sourceSex ?? 0;
    const targetSexValue = targetSex ?? 0;

    const rows = await db
      .select({
        firstname: similarFirstnames.similarFirstname,
        correlation: similarFirstnames.correlation,
      })
      .from(similarFirstnames)
      .where(
        and(
          eq(similarFirstnames.firstname, firstname.toUpperCase()),
          eq(similarFirstnames.sourceSex, sourceSexValue),
          eq(similarFirstnames.targetSex, targetSexValue),
        ),
      )
      .orderBy(asc(similarFirstnames.rank));

    return rows;
  },
  {
    query: similairesQuerySchema,
    response: z.array(
      z.object({
        firstname: z.string(),
        correlation: z.number(),
      }),
    ),
  },
);
