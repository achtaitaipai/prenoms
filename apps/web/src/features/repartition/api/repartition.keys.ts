export const repartitionKeys = {
  all: ["repartition"] as const,
  detail: (params: { firstname?: string; sex?: 1 | 2; yearStart?: number; yearEnd?: number }) =>
    ["repartition", params.firstname, params.sex, params.yearStart, params.yearEnd] as const,
};
