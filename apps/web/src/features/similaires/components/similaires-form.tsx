import { Button } from "@prenoms/ui/components/button";
import { Combobox } from "@prenoms/ui/components/combobox";
import { Label } from "@prenoms/ui/components/label";
import { ToggleGroup } from "@prenoms/ui/components/toggle-group";
import { type FormEvent, useState } from "react";
import { css } from "styled-system/css";

import { useFirstnameAutocomplete } from "@/hooks/use-firstname-autocomplete";

type SimilairesFormProps = {
  defaultValues?: { firstname?: string; sourceSex?: 1 | 2; targetSex?: 1 | 2 };
  onSearch: (firstname: string, sourceSex?: 1 | 2, targetSex?: 1 | 2) => void;
};

export function SimilairesForm({ defaultValues, onSearch }: SimilairesFormProps) {
  const [firstname, setFirstname] = useState(defaultValues?.firstname ?? "");
  const [sourceSex, setSourceSex] = useState<1 | 2 | undefined>(defaultValues?.sourceSex);
  const [targetSex, setTargetSex] = useState<1 | 2 | undefined>(defaultValues?.targetSex);
  const { collection, hasSearched, isLoading } = useFirstnameAutocomplete("similar", firstname);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const t = firstname.trim();
    if (!t) return;
    onSearch(t, sourceSex, targetSex);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={css({ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "4" })}
    >
      <div className={css({ display: "grid", gap: "1.5" })}>
        <Label>Prénom</Label>
        <Combobox.Root
          collection={collection}
          inputValue={firstname}
          onInputValueChange={(details) => setFirstname(details.inputValue)}
          onValueChange={(details) => {
            const val = details.items[0];
            if (val) setFirstname(String(val));
          }}
          allowCustomValue
          openOnClick={false}
          selectionBehavior="preserve"
          closeOnSelect
        >
          <Combobox.Control>
            <Combobox.Input placeholder="Jean" />
          </Combobox.Control>
          <Combobox.Content>
            {collection.items.length > 0 ? (
              <div
                className={css({
                  opacity: isLoading ? 0.5 : 1,
                  transition: "opacity token(durations.fast)",
                })}
              >
                {collection.items.map((item) => (
                  <Combobox.Item key={String(item)} item={item}>
                    <Combobox.ItemText>{String(item)}</Combobox.ItemText>
                  </Combobox.Item>
                ))}
              </div>
            ) : (
              (isLoading || hasSearched) && (
                <div
                  className={css({ px: "2", py: "2", fontSize: "xs", color: "muted.foreground" })}
                >
                  {isLoading ? "Chargement…" : "Aucun résultat"}
                </div>
              )
            )}
          </Combobox.Content>
        </Combobox.Root>
      </div>
      <div className={css({ display: "grid", gap: "1.5" })}>
        <Label>Sexe du prénom</Label>
        <ToggleGroup.Root
          value={[String(sourceSex ?? "all")]}
          onValueChange={(e) =>
            setSourceSex(e.value[0] === "all" ? undefined : (Number(e.value[0]) as 1 | 2))
          }
        >
          <ToggleGroup.Item value="all">Tous</ToggleGroup.Item>
          <ToggleGroup.Item value="1">M</ToggleGroup.Item>
          <ToggleGroup.Item value="2">F</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <div className={css({ display: "grid", gap: "1.5" })}>
        <Label>Sexe des résultats</Label>
        <ToggleGroup.Root
          value={[String(targetSex ?? "all")]}
          onValueChange={(e) =>
            setTargetSex(e.value[0] === "all" ? undefined : (Number(e.value[0]) as 1 | 2))
          }
        >
          <ToggleGroup.Item value="all">Tous</ToggleGroup.Item>
          <ToggleGroup.Item value="1">M</ToggleGroup.Item>
          <ToggleGroup.Item value="2">F</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <Button type="submit">Rechercher</Button>
    </form>
  );
}
