import { z } from "zod";

import { firstnameSchema, sexSchema } from "./base";

export const comparaisonQuerySchema = z.object({
  firstname1: firstnameSchema,
  firstname2: firstnameSchema,
  sex1: sexSchema,
  sex2: sexSchema,
});

export const comparaisonSearchSchema = z.object({
  firstname1: z.string().optional(),
  firstname2: z.string().optional(),
  sex1: sexSchema,
  sex2: sexSchema,
});
