import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { comparaisonKeys } from "./comparaison.keys";

async function fetchComparaison(
  firstname1: string,
  firstname2: string,
  sex1?: 1 | 2,
  sex2?: 1 | 2,
) {
  const { data, error } = await api.comparison.get({
    query: { firstname1, firstname2, sex1, sex2 },
  });
  if (error) throw error;
  return data;
}

export function useComparaisonQuery(
  firstname1: string,
  firstname2: string,
  sex1?: 1 | 2,
  sex2?: 1 | 2,
) {
  return useQuery({
    queryKey: comparaisonKeys.detail(firstname1, firstname2, sex1, sex2),
    queryFn: () => fetchComparaison(firstname1, firstname2, sex1, sex2),
    enabled: firstname1.length > 0 && firstname2.length > 0,
  });
}
