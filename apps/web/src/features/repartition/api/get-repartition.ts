import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { repartitionKeys } from "./repartition.keys";

export type RepartitionParams = {
  firstname: string;
  sex?: 1 | 2;
  yearStart?: number;
  yearEnd?: number;
};

async function fetchRepartition(params: RepartitionParams) {
  const { data, error } = await api.repartition.get({
    query: params,
  });
  if (error) throw error;
  return data;
}

export function useRepartitionQuery(params: RepartitionParams | null) {
  return useQuery({
    queryKey: repartitionKeys.detail({
      firstname: params?.firstname,
      sex: params?.sex,
      yearStart: params?.yearStart,
      yearEnd: params?.yearEnd,
    }),
    queryFn: () => fetchRepartition(params!),
    enabled: !!params?.firstname,
  });
}
