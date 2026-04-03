import { useQueries } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { evolutionKeys } from "./evolution.keys";

async function fetchBirthsPerYear(sex?: 1 | 2) {
  const { data, error } = await api["births-per-year"].get({
    query: { sex },
  });
  if (error) throw error;
  return data;
}

export type BirthsPerYearData = Awaited<ReturnType<typeof fetchBirthsPerYear>>;

export function useBirthsPerYearQueries(sexValues: (1 | 2 | undefined)[]) {
  return useQueries({
    queries: sexValues.map((sex) => ({
      queryKey: evolutionKeys.birthsPerYear(sex),
      queryFn: () => fetchBirthsPerYear(sex),
      staleTime: Number.POSITIVE_INFINITY,
    })),
  });
}
