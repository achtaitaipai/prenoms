import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { rankingKeys } from "./ranking.keys";

type RankingParams = {
  sex?: 1 | 2;
  yearStart?: number;
  yearEnd?: number;
  page: number;
  pageSize: number;
};

async function fetchRanking(params: RankingParams) {
  const { data, error } = await api.ranking.get({
    query: params,
  });
  if (error) throw error;
  return data;
}

export function useRankingQuery(params: RankingParams) {
  return useQuery({
    queryKey: rankingKeys.list(params),
    queryFn: () => fetchRanking(params),
  });
}
