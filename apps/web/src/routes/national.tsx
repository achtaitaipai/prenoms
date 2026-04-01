import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useStatsQueries } from "@/features/national/api/get-stats";
import { SearchForm } from "@/features/national/components/search-form";
import { StatsChart } from "@/features/national/components/stats-chart";
import { entryLabel, parseEntries, serializeEntries, type Entry } from "@/features/national/types";

type NationalSearch = {
  e?: string;
};

export const Route = createFileRoute("/national")({
  component: NationalComponent,
  validateSearch: (search: Record<string, unknown>): NationalSearch => ({
    e: typeof search.e === "string" ? search.e : undefined,
  }),
});

function NationalComponent() {
  const { e } = Route.useSearch();
  const navigate = useNavigate();
  const entries = parseEntries(e ?? "");
  const results = useStatsQueries(entries);

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
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Statistiques nationales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchForm onAdd={addEntry} />

          {entries.length > 0 && <EntryTags entries={entries} onRemove={removeEntry} />}
        </CardContent>
      </Card>

      {isLoading && <p className="text-muted-foreground">Chargement...</p>}

      <Card>
        <CardContent className="pt-6">
          <StatsChart entries={entries} results={results} />
        </CardContent>
      </Card>
    </div>
  );
}

const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#ea580c"];

function EntryTags({ entries, onRemove }: { entries: Entry[]; onRemove: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {entries.map((entry, i) => (
        <span
          key={entry.id}
          className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
          style={{ borderColor: COLORS[i % COLORS.length] }}
        >
          {entryLabel(entry)}
          <button
            type="button"
            className="ml-1 cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => onRemove(entry.id)}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
