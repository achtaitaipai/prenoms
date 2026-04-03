import { Button } from "@prenoms/ui/components/button";
import { Input } from "@prenoms/ui/components/input";
import { Label } from "@prenoms/ui/components/label";
import { ToggleGroup } from "@prenoms/ui/components/toggle-group";
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
        <ToggleGroup.Root
          value={[String(sex ?? "all")]}
          onValueChange={(e) =>
            setSex(e.value[0] === "all" ? undefined : (Number(e.value[0]) as 1 | 2))
          }
        >
          <ToggleGroup.Item value="all">Tous</ToggleGroup.Item>
          <ToggleGroup.Item value="1">M</ToggleGroup.Item>
          <ToggleGroup.Item value="2">F</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <Button type="submit">Ajouter</Button>
    </form>
  );
}
