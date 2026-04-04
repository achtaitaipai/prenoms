import { Combobox } from "@prenoms/ui/components/combobox";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { css } from "styled-system/css";

import { useFirstnameAutocomplete } from "@/hooks/use-firstname-autocomplete";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const { collection, isLoading, hasSearched } = useFirstnameAutocomplete("national", input);

  function handleSelect(value: string) {
    setInput("");
    navigate({ to: "/$firstname", params: { firstname: value }, search: {} });
  }

  return (
    <div>
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          px: "2",
          py: "1",
          gap: "4",
        })}
      >
        <Link to="/" className={css({ fontSize: "lg", fontWeight: "bold", flexShrink: 0 })}>
          Prénoms
        </Link>

        <Combobox.Root
          collection={collection}
          inputValue={input}
          onInputValueChange={(details) => setInput(details.inputValue)}
          onValueChange={(details) => {
            const val = details.items[0];
            if (val) handleSelect(String(val));
          }}
          allowCustomValue
          openOnClick={false}
          selectionBehavior="preserve"
          closeOnSelect
          className={css({ flex: 1, maxWidth: "20rem" })}
        >
          <Combobox.Control>
            <Combobox.Input placeholder="Rechercher un prénom…" />
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

        <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
