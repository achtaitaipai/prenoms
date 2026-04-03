export const evolutionKeys = {
  all: ["evolution"] as const,
  detail: (firstname: string, sex?: 1 | 2) => ["evolution", firstname, sex] as const,
  birthsPerYear: (sex?: 1 | 2) => ["births-per-year", sex] as const,
};
