import { z } from "zod";

import { firstnameSchema, sexSchema } from "./base";

export const evolutionQuerySchema = z.object({
  firstname: firstnameSchema,
  sex: sexSchema,
});

export const birthsPerYearQuerySchema = z.object({
  sex: sexSchema,
});
