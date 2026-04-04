import { MAX_YEAR, MIN_YEAR } from "@prenoms/config";
import { z } from "zod";

import { sexSchema, yearEndSchema, yearStartSchema } from "./base";

export const dashboardSearchSchema = z.object({
  sex: sexSchema,
  evo_mode: z.enum(["count", "proportion"]).optional(),
  evo_entries: z.string().optional(),
  rep_yearStart: yearStartSchema,
  rep_yearEnd: yearEndSchema,
  sim_targetSex: sexSchema,
  rank_yearStart: yearStartSchema,
  rank_yearEnd: yearEndSchema,
  cmp_firstname: z.string().optional(),
  cmp_sex: sexSchema,
});

export type DashboardSearch = z.infer<typeof dashboardSearchSchema>;

export const dashboardSearchDefaults = {
  rep_yearStart: MIN_YEAR,
  rep_yearEnd: MAX_YEAR,
  rank_yearStart: MIN_YEAR,
  rank_yearEnd: MAX_YEAR,
} as const;

export function resolveDashboardSearch(search: DashboardSearch) {
  return {
    ...search,
    rep_yearStart: search.rep_yearStart ?? MIN_YEAR,
    rep_yearEnd: search.rep_yearEnd ?? MAX_YEAR,
    rank_yearStart: search.rank_yearStart ?? MIN_YEAR,
    rank_yearEnd: search.rank_yearEnd ?? MAX_YEAR,
  };
}
