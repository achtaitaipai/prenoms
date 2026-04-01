import { Button } from "@prenoms/ui/components/button";
import { Input } from "@prenoms/ui/components/input";
import { Label } from "@prenoms/ui/components/label";
import { type FormEvent, useState } from "react";

type Filters = {
  sex?: 1 | 2;
  yearStart?: number;
  yearEnd?: number;
};

type RankingFiltersProps = {
  onFilter: (filters: Filters) => void;
};

export function RankingFilters({ onFilter }: RankingFiltersProps) {
  const [sex, setSex] = useState<1 | 2 | undefined>();
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onFilter({
      sex,
      yearStart: yearStart ? Number(yearStart) : undefined,
      yearEnd: yearEnd ? Number(yearEnd) : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
      <div className="grid gap-1.5">
        <Label>Sexe</Label>
        <div className="flex gap-1">
          {(
            [
              { label: "Tous", value: undefined },
              { label: "M", value: 1 },
              { label: "F", value: 2 },
            ] as const
          ).map((opt) => (
            <Button
              key={opt.label}
              type="button"
              variant={sex === opt.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSex(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="yearStart">Année début</Label>
        <Input
          id="yearStart"
          type="number"
          value={yearStart}
          onChange={(e) => setYearStart(e.target.value)}
          placeholder="1900"
          className="w-24"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="yearEnd">Année fin</Label>
        <Input
          id="yearEnd"
          type="number"
          value={yearEnd}
          onChange={(e) => setYearEnd(e.target.value)}
          placeholder="2024"
          className="w-24"
        />
      </div>
      <Button type="submit">Filtrer</Button>
    </form>
  );
}
