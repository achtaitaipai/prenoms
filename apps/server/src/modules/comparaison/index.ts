import { SIMILARITY_PEARSON_WEIGHT, SIMILARITY_NOTORIETY_WEIGHT } from "@prenoms/config";
import { getProportions, getMaxTotalBirths, getTotalBirthsForName } from "@prenoms/db";
import { movingAverage, pearson, notorietyScore, similarityScore } from "@prenoms/functions";
import { comparaisonQuerySchema } from "@prenoms/validators";
import { Elysia } from "elysia";
import { z } from "zod";

export const comparaison = new Elysia().get(
  "/comparison",
  async ({ query }) => {
    const { firstname1, firstname2, sex1, sex2 } = query;

    const [props1, props2, total1, total2, maxTotal] = await Promise.all([
      getProportions(firstname1, sex1),
      getProportions(firstname2, sex2),
      getTotalBirthsForName(firstname1, sex1),
      getTotalBirthsForName(firstname2, sex2),
      getMaxTotalBirths(undefined),
    ]);

    const smoothed1 = movingAverage(props1);
    const smoothed2 = movingAverage(props2);
    const corr = pearson(smoothed1, smoothed2);
    const not1 = notorietyScore(total1, maxTotal);
    const not2 = notorietyScore(total2, maxTotal);
    const combinedNotoriety = Math.sqrt(not1 * not2);
    const correlation =
      Math.round(
        similarityScore(
          corr,
          combinedNotoriety,
          SIMILARITY_PEARSON_WEIGHT,
          SIMILARITY_NOTORIETY_WEIGHT,
        ) * 10000,
      ) / 10000;

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
