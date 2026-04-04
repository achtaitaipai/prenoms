import { z } from "zod";

import {
  firstnameSchema,
  pageSchema,
  pageSizeSchema,
  sexSchema,
  yearEndSchema,
  yearStartSchema,
} from "./base";

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
