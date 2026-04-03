import { useListCollection } from "@prenoms/ui/components/combobox";
import { useEffect } from "react";
import { useAutocompleteQuery } from "../api/get-autocomplete";
import { useDebouncedValue } from "./use-debounced-value";

function toTitleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function useFirstnameAutocomplete(scope: "national" | "regional", inputValue: string) {
  const debouncedValue = useDebouncedValue(inputValue.trim(), 300);
  const { data, isFetching } = useAutocompleteQuery(scope, debouncedValue);

  const listCollection = useListCollection<string>({ initialItems: [] });

  useEffect(() => {
    listCollection.set((data ?? []).map(toTitleCase));
  }, [data]);

  const isStale = inputValue.trim() !== debouncedValue;

  return {
    collection: listCollection.collection,
    isLoading: isFetching || isStale,
    hasSearched: data !== undefined && debouncedValue.length > 0 && !isStale,
  };
}
