import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export type RepartitionParams = {
  firstname: string;
  sex?: 1 | 2;
  yearStart?: number;
  yearEnd?: number;
};

async function fetchRepartition(params: RepartitionParams) {
  const { data, error } = await api.national.repartition.get({
    query: params,
  });
  if (error) throw error;
  return data;
}

export function useRepartitionQuery(params: RepartitionParams | null) {
  return useQuery({
    queryKey: ["repartition", params?.firstname, params?.sex, params?.yearStart, params?.yearEnd],
    queryFn: () => fetchRepartition(params!),
    enabled: !!params?.firstname,
  });
}
