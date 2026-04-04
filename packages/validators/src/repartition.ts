import { z } from "zod";

import { firstnameSchema, sexSchema, yearEndSchema, yearStartSchema } from "./base";

export const repartitionQuerySchema = z.object({
  firstname: firstnameSchema,
  sex: sexSchema,
  yearStart: yearStartSchema,
  yearEnd: yearEndSchema,
});

export const repartitionSearchSchema = repartitionQuerySchema.extend({
  firstname: z.string().optional(),
});
