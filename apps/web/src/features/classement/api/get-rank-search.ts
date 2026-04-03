import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { rankingKeys } from "./ranking.keys";

type RankSearchParams = {
  firstname: string;
  sex?: 1 | 2;
  yearStart?: number;
  yearEnd?: number;
  pageSize: number;
};

async function fetchRankSearch(params: RankSearchParams) {
  const { data, error } = await api.ranking.search.get({
    query: params,
  });
  if (error) throw error;
  return data;
}

export function useRankSearchQuery(params: RankSearchParams | null) {
  return useQuery({
    queryKey: rankingKeys.search(params ?? { firstname: "", pageSize: 20 }),
    queryFn: () => fetchRankSearch(params!),
    enabled: !!params?.firstname,
  });
}
