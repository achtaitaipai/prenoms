import { z } from "zod";

export const sexSchema = z.coerce
  .number()
  .pipe(z.union([z.literal(1), z.literal(2)]))
  .optional();

export const yearStartSchema = z.coerce.number().optional();
export const yearEndSchema = z.coerce.number().optional();
export const pageSchema = z.coerce.number().min(1).default(1);
export const pageSizeSchema = z.coerce.number().min(1).max(100).default(20);
export const firstnameSchema = z.string().min(1);
