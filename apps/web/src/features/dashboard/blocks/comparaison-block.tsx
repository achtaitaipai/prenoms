import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { Combobox } from "@prenoms/ui/components/combobox";
import { PencilIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { css } from "styled-system/css";

import { pickDefault } from "@prenoms/validators";

import { useComparaisonQuery } from "@/features/comparaison/api/get-comparaison";
import { useFirstnameAutocomplete } from "@/hooks/use-firstname-autocomplete";
import { SEX_LABELS, formatSimilarity, toTitleCase } from "@/lib/format";

type Props = {
  firstname: string;
  sex?: 1 | 2;
  cmpFirstname?: string;
  cmpSex?: 1 | 2;
  onSettingsChange: (settings: { cmp_firstname?: string; cmp_sex?: 1 | 2 }) => void;
};

export function ComparaisonBlock({
  firstname,
  sex,
  cmpFirstname,
  cmpSex,
  onSettingsChange,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const onSettingsChangeRef = useRef(onSettingsChange);
  onSettingsChangeRef.current = onSettingsChange;
  const { collection, hasSearched, isLoading } = useFirstnameAutocomplete("national", input);

  const { data } = useComparaisonQuery(firstname, cmpFirstname ?? "", sex, cmpSex);

  useEffect(() => {
    if (!cmpFirstname) {
      onSettingsChangeRef.current({ cmp_firstname: pickDefault(firstname) });
    }
  }, [firstname, cmpFirstname]);

  useEffect(() => {
    if (editing) {
      // Small delay to let Combobox mount, then focus
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [editing]);

  function handleSelect(value: string) {
    onSettingsChange({ cmp_firstname: value, cmp_sex: cmpSex });
    setInput("");
    setEditing(false);
  }

  const pct = data ? formatSimilarity(data.correlation) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison</CardTitle>
      </CardHeader>
      <CardContent className={css({ display: "flex", flexDirection: "column", gap: "6" })}>
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6",
            flexDirection: { base: "column", md: "row" },
          })}
        >
          {/* Left name */}
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1",
              px: "6",
              py: "4",
              bg: "muted",
              rounded: "lg",
              minWidth: "8rem",
            })}
          >
            <span className={css({ fontSize: "xl", fontWeight: "bold" })}>
              {toTitleCase(firstname)}
            </span>
            {sex && (
              <span className={css({ fontSize: "xs", color: "muted.foreground" })}>
                {SEX_LABELS[sex]}
              </span>
            )}
          </div>

          {/* Center score */}
          <div className={css({ display: "flex", flexDirection: "column", alignItems: "center" })}>
            {pct !== null ? (
              <>
                <span
                  className={css({ fontSize: "4xl", fontWeight: "bold", lineHeight: "1" })}
                  style={{
                    color:
                      pct >= 70
                        ? "var(--colors-chart-1)"
                        : pct >= 40
                          ? "var(--colors-chart-3)"
                          : "var(--colors-chart-5)",
                  }}
                >
                  {pct} %
                </span>
                <span className={css({ fontSize: "xs", color: "muted.foreground", mt: "1" })}>
                  similarité
                </span>
              </>
            ) : (
              <span className={css({ fontSize: "sm", color: "muted.foreground" })}>vs</span>
            )}
          </div>

          {/* Right name — editable with autocomplete */}
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1",
              px: "6",
              py: "4",
              bg: "muted",
              rounded: "lg",
              minWidth: "8rem",
            })}
          >
            {editing ? (
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
              >
                <Combobox.Control>
                  <Combobox.Input ref={inputRef} placeholder="Prénom…" />
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
                        className={css({
                          px: "2",
                          py: "2",
                          fontSize: "xs",
                          color: "muted.foreground",
                        })}
                      >
                        {isLoading ? "Chargement…" : "Aucun résultat"}
                      </div>
                    )
                  )}
                </Combobox.Content>
              </Combobox.Root>
            ) : (
              <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                <span className={css({ fontSize: "xl", fontWeight: "bold" })}>
                  {cmpFirstname ? toTitleCase(cmpFirstname) : "…"}
                </span>
                <button
                  type="button"
                  className={css({
                    cursor: "pointer",
                    color: "muted.foreground",
                    _hover: { color: "foreground" },
                    transition: "color",
                  })}
                  onClick={() => {
                    setInput("");
                    setEditing(true);
                  }}
                >
                  <PencilIcon size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
