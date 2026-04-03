import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { similairesKeys } from "./similaires.keys";

async function fetchSimilaires(firstname: string, sourceSex?: 1 | 2, targetSex?: 1 | 2) {
  const { data, error } = await api.similaires.get({
    query: { firstname, sourceSex, targetSex },
  });
  if (error) throw error;
  return data;
}

export function useSimilairesQuery(firstname: string, sourceSex?: 1 | 2, targetSex?: 1 | 2) {
  return useQuery({
    queryKey: similairesKeys.detail(firstname, sourceSex, targetSex),
    queryFn: () => fetchSimilaires(firstname, sourceSex, targetSex),
    enabled: firstname.length > 0,
  });
}
