import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { Label } from "@prenoms/ui/components/label";
import { ToggleGroup } from "@prenoms/ui/components/toggle-group";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { css } from "styled-system/css";
import { container } from "styled-system/patterns";

import { useBirthsPerYearQueries } from "@/features/evolutions/api/get-births-per-year";
import { useEvolutionQueries } from "@/features/evolutions/api/get-evolution";
import { EvolutionChart } from "@/features/evolutions/components/evolution-chart";
import { SearchForm } from "@/features/evolutions/components/search-form";
import {
  entryLabel,
  parseEntries,
  serializeEntries,
  type Entry,
} from "@/features/evolutions/types";

type EvolutionsSearch = {
  e?: string;
};

export const Route = createFileRoute("/evolutions")({
  component: EvolutionsComponent,
  validateSearch: (search: Record<string, unknown>): EvolutionsSearch => ({
    e: typeof search.e === "string" ? search.e : undefined,
  }),
});

const pageContainer = container({
  w: "full",
  display: "flex",
  flexDirection: "column",
  gap: "6",
  px: "4",
  py: "6",
});

function EvolutionsComponent() {
  const { e } = Route.useSearch();
  const navigate = useNavigate();
  const entries = parseEntries(e ?? "");
  const results = useEvolutionQueries(entries);
  const [mode, setMode] = useState<"count" | "proportion">("count");

  const uniqueSexValues = useMemo(() => {
    const set = new Set<1 | 2 | undefined>(entries.map((e) => e.sex));
    return [...set];
  }, [entries]);
  const birthsQueries = useBirthsPerYearQueries(uniqueSexValues);
  const birthsPerYearBySex = useMemo(() => {
    const map = new Map<1 | 2 | undefined, Map<number, number>>();
    uniqueSexValues.forEach((sex, i) => {
      const data = birthsQueries[i]?.data;
      if (data) {
        map.set(sex, new Map(data.byYear.map((r) => [r.year, r.total])));
      }
    });
    return map;
  }, [uniqueSexValues, birthsQueries]);

  const isLoading = results.some((r) => r.isLoading);

  function addEntry(entry: Entry) {
    const next = [...entries, entry];
    navigate({ to: ".", search: { e: serializeEntries(next) } });
  }

  function removeEntry(id: string) {
    const next = entries.filter((e) => e.id !== id);
    navigate({
      to: ".",
      search: next.length ? { e: serializeEntries(next) } : {},
    });
  }

  return (
    <div className={pageContainer}>
      <Card>
        <CardHeader>
          <CardTitle>Évolutions</CardTitle>
        </CardHeader>
        <CardContent className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
          <SearchForm onAdd={addEntry} />

          {entries.length > 0 && <EntryTags entries={entries} onRemove={removeEntry} />}
        </CardContent>
      </Card>

      {isLoading && <p className={css({ color: "muted.foreground" })}>Chargement...</p>}

      <Card>
        <CardContent
          className={css({ pt: "6", display: "flex", flexDirection: "column", gap: "4" })}
        >
          <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
            <Label>Affichage</Label>
            <ToggleGroup.Root
              value={[mode]}
              onValueChange={(e) => setMode(e.value[0] as "count" | "proportion")}
            >
              <ToggleGroup.Item value="count">Nombre</ToggleGroup.Item>
              <ToggleGroup.Item value="proportion">Proportion</ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
          <EvolutionChart
            entries={entries}
            results={results}
            mode={mode}
            birthsPerYearBySex={birthsPerYearBySex}
          />
        </CardContent>
      </Card>
    </div>
  );
}

const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#ea580c"];

function EntryTags({ entries, onRemove }: { entries: Entry[]; onRemove: (id: string) => void }) {
  return (
    <div className={css({ display: "flex", flexWrap: "wrap", gap: "2" })}>
      {entries.map((entry, i) => (
        <span
          key={entry.id}
          className={css({
            display: "inline-flex",
            alignItems: "center",
            gap: "1",
            rounded: "full",
            borderWidth: "1px",
            px: "3",
            py: "1",
            fontSize: "xs",
          })}
          style={{ borderColor: COLORS[i % COLORS.length] }}
        >
          {entryLabel(entry)}
          <button
            type="button"
            className={css({
              ml: "1",
              cursor: "pointer",
              color: "muted.foreground",
              _hover: { color: "foreground" },
            })}
            onClick={() => onRemove(entry.id)}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
