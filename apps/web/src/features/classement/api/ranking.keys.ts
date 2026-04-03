export const rankingKeys = {
  all: ["national-ranking"] as const,
  list: (params: {
    sex?: 1 | 2;
    yearStart?: number;
    yearEnd?: number;
    page: number;
    pageSize: number;
  }) =>
    [
      "national-ranking",
      params.sex,
      params.yearStart,
      params.yearEnd,
      params.page,
      params.pageSize,
    ] as const,
  search: (params: {
    firstname: string;
    sex?: 1 | 2;
    yearStart?: number;
    yearEnd?: number;
    pageSize: number;
  }) =>
    [
      "national-ranking",
      "search",
      params.firstname,
      params.sex,
      params.yearStart,
      params.yearEnd,
      params.pageSize,
    ] as const,
};
