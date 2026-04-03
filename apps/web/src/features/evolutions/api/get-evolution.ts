import { useQueries } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Entry } from "../types";
import { evolutionKeys } from "./evolution.keys";

export async function fetchEvolution(firstname: string, sex?: 1 | 2) {
  const { data, error } = await api.evolution.get({
    query: { firstname, sex },
  });
  if (error) throw error;
  return data;
}

export function useEvolutionQueries(entries: Entry[]) {
  return useQueries({
    queries: entries.map((entry) => ({
      queryKey: evolutionKeys.detail(entry.firstname, entry.sex),
      queryFn: () => fetchEvolution(entry.firstname, entry.sex),
    })),
  });
}
