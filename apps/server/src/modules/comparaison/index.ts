import { getProportions } from "@prenoms/db";
import { movingAverage, pearson } from "@prenoms/functions";
import { comparaisonQuerySchema } from "@prenoms/validators";
import { Elysia } from "elysia";
import { z } from "zod";

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
