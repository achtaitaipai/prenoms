import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { autocompleteKeys } from "./autocomplete.keys";

async function fetchAutocomplete(scope: "national" | "regional", q: string) {
  const { data, error } = await api.autocomplete[scope].get({
    query: { q, limit: 20 },
  });
  if (error) throw error;
  return data;
}

export function useAutocompleteQuery(scope: "national" | "regional", q: string) {
  return useQuery({
    queryKey: autocompleteKeys.search(scope, q),
    queryFn: () => fetchAutocomplete(scope, q),
    enabled: q.length > 0,
  });
}
