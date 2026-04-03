import { Button } from "@prenoms/ui/components/button";
import { Combobox } from "@prenoms/ui/components/combobox";
import { Loader, Search, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import { css } from "styled-system/css";

import { useFirstnameAutocomplete } from "@/hooks/use-firstname-autocomplete";

type SearchInputProps = {
  onSearch: (value: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  error?: string | null;
  resultInfo?: string | null;
};

export function SearchInput({ onSearch, onClear, isLoading, error, resultInfo }: SearchInputProps) {
  const [inputValue, setInputValue] = useState("");
  const {
    collection,
    hasSearched,
    isLoading: autocompleteLoading,
  } = useFirstnameAutocomplete("national", inputValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  }

  function handleClear() {
    setInputValue("");
    onClear();
  }

  return (
    <div className={css({ maxWidth: "20rem" })}>
      <form
        role="search"
        onSubmit={handleSubmit}
        className={css({ display: "flex", alignItems: "center" })}
      >
        <Combobox.Root
          collection={collection}
          inputValue={inputValue}
          onInputValueChange={(details) => setInputValue(details.inputValue)}
          onValueChange={(details) => {
            const val = details.items[0];
            if (val) {
              setInputValue(String(val));
              onSearch(String(val));
            }
          }}
          allowCustomValue
          openOnClick={false}
          selectionBehavior="preserve"
          closeOnSelect
          className={css({ flex: "1", gap: "0" })}
        >
          <Combobox.Control>
            <Combobox.Input
              placeholder="Rechercher un prénom…"
              aria-label="Rechercher un prénom"
              className={css({
                borderRightRadius: "0",
                borderRight: "none",
                pr: inputValue ? "8" : "2.5",
              })}
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Effacer"
                className={css({
                  position: "absolute",
                  right: "2",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "muted.foreground",
                  cursor: "pointer",
                  _hover: { color: "foreground" },
                  transition: "color token(durations.fast)",
                })}
              >
                <X size={14} />
              </button>
            )}
          </Combobox.Control>
          <Combobox.Content>
            {collection.items.length > 0 ? (
              <div
                className={css({
                  opacity: autocompleteLoading ? 0.5 : 1,
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
              (autocompleteLoading || hasSearched) && (
                <div
                  className={css({ px: "2", py: "2", fontSize: "xs", color: "muted.foreground" })}
                >
                  {autocompleteLoading ? "Chargement…" : "Aucun résultat"}
                </div>
              )
            )}
          </Combobox.Content>
        </Combobox.Root>
        <Button
          type="submit"
          variant="outline"
          size="icon"
          aria-label="Rechercher"
          className={css({ borderLeftRadius: "0", flexShrink: "0" })}
        >
          {isLoading ? (
            <Loader size={16} className={css({ animation: "spin" })} />
          ) : (
            <Search size={16} />
          )}
        </Button>
      </form>
      {error && <p className={css({ color: "destructive", fontSize: "xs", mt: "1.5" })}>{error}</p>}
      {resultInfo && (
        <p className={css({ color: "muted.foreground", fontSize: "xs", mt: "1.5" })}>
          {resultInfo}
        </p>
      )}
    </div>
  );
}
