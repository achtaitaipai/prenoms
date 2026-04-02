import { Button } from "@prenoms/ui/components/button";
import { Input } from "@prenoms/ui/components/input";
import { Label } from "@prenoms/ui/components/label";
import { type FormEvent, useState } from "react";
import { css } from "styled-system/css";

export type RepartitionFormValues = {
  firstname: string;
  sex?: 1 | 2;
  yearStart?: number;
  yearEnd?: number;
};

type Props = {
  defaultValues?: Partial<RepartitionFormValues>;
  onSubmit: (values: RepartitionFormValues) => void;
};

export function RepartitionForm({ defaultValues, onSubmit }: Props) {
  const [firstname, setFirstname] = useState(defaultValues?.firstname ?? "");
  const [sex, setSex] = useState<1 | 2 | undefined>(defaultValues?.sex);
  const [yearStart, setYearStart] = useState(defaultValues?.yearStart?.toString() ?? "");
  const [yearEnd, setYearEnd] = useState(defaultValues?.yearEnd?.toString() ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = firstname.trim();
    if (!trimmed) return;
    onSubmit({
      firstname: trimmed,
      sex,
      yearStart: yearStart ? Number(yearStart) : undefined,
      yearEnd: yearEnd ? Number(yearEnd) : undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={css({ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "4" })}
    >
      <div className={css({ display: "grid", gap: "1.5" })}>
        <Label htmlFor="firstname">Prénom</Label>
        <Input
          id="firstname"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          placeholder="Jean"
        />
      </div>
      <div className={css({ display: "grid", gap: "1.5" })}>
        <Label>Sexe</Label>
        <div className={css({ display: "flex", gap: "1" })}>
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
      <div className={css({ display: "grid", gap: "1.5" })}>
        <Label htmlFor="yearStart">Début</Label>
        <Input
          id="yearStart"
          type="number"
          value={yearStart}
          onChange={(e) => setYearStart(e.target.value)}
          placeholder="1900"
          className={css({ width: "6rem" })}
        />
      </div>
      <div className={css({ display: "grid", gap: "1.5" })}>
        <Label htmlFor="yearEnd">Fin</Label>
        <Input
          id="yearEnd"
          type="number"
          value={yearEnd}
          onChange={(e) => setYearEnd(e.target.value)}
          placeholder="2024"
          className={css({ width: "6rem" })}
        />
      </div>
      <Button type="submit">Rechercher</Button>
    </form>
  );
}
