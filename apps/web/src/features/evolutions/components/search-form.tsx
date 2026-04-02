import { Button } from "@prenoms/ui/components/button";
import { Input } from "@prenoms/ui/components/input";
import { Label } from "@prenoms/ui/components/label";
import { type FormEvent, useState } from "react";
import { css } from "styled-system/css";

import type { Entry } from "../types";

type SearchFormProps = {
  onAdd: (entry: Entry) => void;
};

export function SearchForm({ onAdd }: SearchFormProps) {
  const [firstname, setFirstname] = useState("");
  const [sex, setSex] = useState<1 | 2 | undefined>();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = firstname.trim();
    if (!trimmed) return;
    onAdd({ id: `${trimmed}-${sex ?? "all"}`, firstname: trimmed, sex });
    setFirstname("");
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
      <Button type="submit">Ajouter</Button>
    </form>
  );
}
