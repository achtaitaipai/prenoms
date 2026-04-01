import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

type RankingParams = {
  sex?: 1 | 2;
  yearStart?: number;
  yearEnd?: number;
  page: number;
  pageSize: number;
};

async function fetchRanking(params: RankingParams) {
  const { data, error } = await api.national.ranking.get({
    query: params,
  });
  if (error) throw error;
  return data;
}

export function useRankingQuery(params: RankingParams) {
  return useQuery({
    queryKey: [
      "national-ranking",
      params.sex,
      params.yearStart,
      params.yearEnd,
      params.page,
      params.pageSize,
    ],
    queryFn: () => fetchRanking(params),
  });
}
