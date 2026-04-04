import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { Label } from "@prenoms/ui/components/label";
import { ToggleGroup } from "@prenoms/ui/components/toggle-group";
import { useMemo } from "react";
import { css } from "styled-system/css";

import { useBirthsPerYearQueries } from "@/features/evolutions/api/get-births-per-year";
import { useEvolutionQueries } from "@/features/evolutions/api/get-evolution";
import { EvolutionChart } from "@/features/evolutions/components/evolution-chart";
import { SearchForm } from "@/features/evolutions/components/search-form";
import {
  entryId,
  entryLabel,
  parseEntries,
  serializeEntries,
  type Entry,
} from "@/features/evolutions/types";

type Props = {
  firstname: string;
  sex?: 1 | 2;
  mode: "count" | "proportion";
  onModeChange: (mode: "count" | "proportion") => void;
  extraEntries?: string;
  onEntriesChange: (serialized: string) => void;
};

const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#ea580c"];

export function EvolutionBlock({
  firstname,
  sex,
  mode,
  onModeChange,
  extraEntries,
  onEntriesChange,
}: Props) {
  const mainEntry: Entry = useMemo(
    () => ({ id: entryId(firstname, sex), firstname, sex }),
    [firstname, sex],
  );

  const extras = useMemo(() => parseEntries(extraEntries ?? ""), [extraEntries]);
  const entries = useMemo(() => [mainEntry, ...extras], [mainEntry, extras]);

  const results = useEvolutionQueries(entries);

  const uniqueSexValues = useMemo(() => {
    const set = new Set<1 | 2 | undefined>(entries.map((e) => e.sex));
    return [...set];
  }, [entries]);

  const birthsQueries = useBirthsPerYearQueries(uniqueSexValues);

  const birthsPerYearBySex = useMemo(() => {
    const map = new Map<1 | 2 | undefined, Map<number, number>>();
    uniqueSexValues.forEach((s, i) => {
      const data = birthsQueries[i]?.data;
      if (data) {
        map.set(s, new Map(data.byYear.map((r) => [r.year, r.total])));
      }
    });
    return map;
  }, [uniqueSexValues, birthsQueries]);

  function addEntry(entry: Entry) {
    const next = [...extras, entry];
    onEntriesChange(serializeEntries(next));
  }

  function removeEntry(id: string) {
    const next = extras.filter((e) => e.id !== id);
    onEntriesChange(next.length ? serializeEntries(next) : "");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution</CardTitle>
      </CardHeader>
      <CardContent className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
        <div
          className={css({
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "4",
          })}
        >
          <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
            <Label>Affichage</Label>
            <ToggleGroup.Root
              value={[mode]}
              onValueChange={(e) => onModeChange(e.value[0] as "count" | "proportion")}
            >
              <ToggleGroup.Item value="count">Nombre</ToggleGroup.Item>
              <ToggleGroup.Item value="proportion">Proportion</ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
        </div>

        <SearchForm onAdd={addEntry} />

        {extras.length > 0 && (
          <div className={css({ display: "flex", flexWrap: "wrap", gap: "2" })}>
            {extras.map((entry, i) => (
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
                style={{ borderColor: COLORS[(i + 1) % COLORS.length] }}
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
                  onClick={() => removeEntry(entry.id)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <EvolutionChart
          entries={entries}
          results={results}
          mode={mode}
          birthsPerYearBySex={birthsPerYearBySex}
        />
      </CardContent>
    </Card>
  );
}
