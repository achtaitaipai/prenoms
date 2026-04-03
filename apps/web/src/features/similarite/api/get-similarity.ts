import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { similarityKeys } from "./similarity.keys";

async function fetchSimilarity(
  firstname1: string,
  firstname2: string,
  sex1?: 1 | 2,
  sex2?: 1 | 2,
) {
  const { data, error } = await api.similarity.get({
    query: { firstname1, firstname2, sex1, sex2 },
  });
  if (error) throw error;
  return data;
}

export function useSimilarityQuery(
  firstname1: string,
  firstname2: string,
  sex1?: 1 | 2,
  sex2?: 1 | 2,
) {
  return useQuery({
    queryKey: similarityKeys.detail(firstname1, firstname2, sex1, sex2),
    queryFn: () => fetchSimilarity(firstname1, firstname2, sex1, sex2),
    enabled: firstname1.length > 0 && firstname2.length > 0,
  });
}
