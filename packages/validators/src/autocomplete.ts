import { z } from "zod";

export const autocompleteQuerySchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().max(50).default(20),
});
