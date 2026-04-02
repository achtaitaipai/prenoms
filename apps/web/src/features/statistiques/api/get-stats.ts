import { useQueries } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Entry } from "../types";

export async function fetchStats(firstname: string, sex?: 1 | 2) {
  const { data, error } = await api.national.stats.get({
    query: { firstname, sex },
  });
  if (error) throw error;
  return data;
}

export function useStatsQueries(entries: Entry[]) {
  return useQueries({
    queries: entries.map((entry) => ({
      queryKey: ["national-stats", entry.firstname, entry.sex],
      queryFn: () => fetchStats(entry.firstname, entry.sex),
    })),
  });
}
