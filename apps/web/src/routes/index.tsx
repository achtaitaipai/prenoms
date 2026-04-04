import { Button } from "@prenoms/ui/components/button";
import { Combobox } from "@prenoms/ui/components/combobox";
import { Label } from "@prenoms/ui/components/label";
import { ToggleGroup } from "@prenoms/ui/components/toggle-group";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { css } from "styled-system/css";
import { container } from "styled-system/patterns";

import { useFirstnameAutocomplete } from "@/hooks/use-firstname-autocomplete";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [sex, setSex] = useState<1 | 2 | undefined>();
  const { collection, hasSearched, isLoading } = useFirstnameAutocomplete("national", firstname);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = firstname.trim();
    if (!trimmed) return;
    navigate({
      to: "/$firstname",
      params: { firstname: trimmed },
      search: (prev) => ({ ...prev, sex }),
    });
  }

  function handleSelect(value: string) {
    setFirstname(value);
    navigate({
      to: "/$firstname",
      params: { firstname: value },
      search: (prev) => ({ ...prev, sex }),
    });
  }

  return (
    <div className={container({ w: "full", px: "4", py: "12" })}>
      <h1 className={css({ fontSize: "4xl", fontWeight: "bold", letterSpacing: "tight" })}>
        Prénoms de France
      </h1>
      <p className={css({ mt: "4", fontSize: "lg", color: "muted.foreground" })}>
        Explorez les prénoms attribués aux enfants nés en France entre 1900 et 2024.
      </p>

      <form
        onSubmit={handleSubmit}
        className={css({
          mt: "8",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: "4",
        })}
      >
        <div className={css({ display: "grid", gap: "1.5" })}>
          <Label>Prénom</Label>
          <Combobox.Root
            collection={collection}
            inputValue={firstname}
            onInputValueChange={(details) => setFirstname(details.inputValue)}
            onValueChange={(details) => {
              const val = details.items[0];
              if (val) handleSelect(String(val));
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

        <Button type="submit">Explorer</Button>
      </form>
    </div>
  );
}
