import { z } from "zod";

import { firstnameSchema, sexSchema } from "./base";

export const similairesQuerySchema = z.object({
  firstname: firstnameSchema,
  sourceSex: sexSchema,
  targetSex: sexSchema,
});

export const similairesSearchSchema = z.object({
  firstname: z.string().optional(),
  sourceSex: sexSchema,
  targetSex: sexSchema,
});
