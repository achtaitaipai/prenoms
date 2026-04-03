export const autocompleteKeys = {
  all: ["autocomplete"] as const,
  search: (scope: "national" | "regional", q: string) => ["autocomplete", scope, q] as const,
};
