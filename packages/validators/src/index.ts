import { z } from "zod";

// --- Base field schemas ---

export const sexSchema = z.coerce
  .number()
  .pipe(z.union([z.literal(1), z.literal(2)]))
  .optional();

export const yearStartSchema = z.coerce.number().optional();
export const yearEndSchema = z.coerce.number().optional();
export const pageSchema = z.coerce.number().min(1).default(1);
export const pageSizeSchema = z.coerce.number().min(1).max(100).default(20);
export const firstnameSchema = z.string().min(1);

// --- Composed query schemas ---

export const rankingQuerySchema = z.object({
  sex: sexSchema,
  yearStart: yearStartSchema,
  yearEnd: yearEndSchema,
  page: pageSchema,
  pageSize: pageSizeSchema,
});

export const rankingSearchParamsSchema = z.object({
  sex: sexSchema,
  yearStart: yearStartSchema,
  yearEnd: yearEndSchema,
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).optional(),
});

export const rankingSearchQuerySchema = z.object({
  firstname: firstnameSchema,
  sex: sexSchema,
  yearStart: yearStartSchema,
  yearEnd: yearEndSchema,
  pageSize: pageSizeSchema,
});

export const repartitionQuerySchema = z.object({
  firstname: firstnameSchema,
  sex: sexSchema,
  yearStart: yearStartSchema,
  yearEnd: yearEndSchema,
});

export const repartitionSearchSchema = repartitionQuerySchema.extend({
  firstname: z.string().optional(),
});

export const evolutionQuerySchema = z.object({
  firstname: firstnameSchema,
  sex: sexSchema,
});

export const birthsPerYearQuerySchema = z.object({
  sex: sexSchema,
});

export const similarityQuerySchema = z.object({
  firstname1: firstnameSchema,
  firstname2: firstnameSchema,
  sex1: sexSchema,
  sex2: sexSchema,
});

export const similaritySearchSchema = z.object({
  firstname1: z.string().optional(),
  firstname2: z.string().optional(),
  sex1: sexSchema,
  sex2: sexSchema,
});

export const autocompleteQuerySchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().max(50).default(20),
});
