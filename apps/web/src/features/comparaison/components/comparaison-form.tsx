import { Button } from "@prenoms/ui/components/button";
import { Combobox } from "@prenoms/ui/components/combobox";
import { Label } from "@prenoms/ui/components/label";
import { ToggleGroup } from "@prenoms/ui/components/toggle-group";
import { type FormEvent, useState } from "react";
import { css } from "styled-system/css";

import { useFirstnameAutocomplete } from "@/hooks/use-firstname-autocomplete";

type ComparaisonFormValues = {
  firstname1: string;
  firstname2: string;
  sex1: 1 | 2 | undefined;
  sex2: 1 | 2 | undefined;
};

type ComparaisonFormProps = {
  defaultValues?: Partial<ComparaisonFormValues>;
  onCompare: (firstname1: string, firstname2: string, sex1?: 1 | 2, sex2?: 1 | 2) => void;
};

export function ComparaisonForm({ defaultValues, onCompare }: ComparaisonFormProps) {
  const [firstname1, setFirstname1] = useState(defaultValues?.firstname1 ?? "");
  const [firstname2, setFirstname2] = useState(defaultValues?.firstname2 ?? "");
  const [sex1, setSex1] = useState<1 | 2 | undefined>(defaultValues?.sex1);
  const [sex2, setSex2] = useState<1 | 2 | undefined>(defaultValues?.sex2);
  const auto1 = useFirstnameAutocomplete("national", firstname1);
  const auto2 = useFirstnameAutocomplete("national", firstname2);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const t1 = firstname1.trim();
    const t2 = firstname2.trim();
    if (!t1 || !t2) return;
    onCompare(t1, t2, sex1, sex2);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={css({ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "4" })}
    >
      <NameInput
        label="Prénom 1"
        placeholder="Jean"
        value={firstname1}
        onChange={setFirstname1}
        sex={sex1}
        onSexChange={setSex1}
        autocomplete={auto1}
      />
      <NameInput
        label="Prénom 2"
        placeholder="Marie"
        value={firstname2}
        onChange={setFirstname2}
        sex={sex2}
        onSexChange={setSex2}
        autocomplete={auto2}
      />
      <Button type="submit">Comparer</Button>
    </form>
  );
}

function NameInput({
  label,
  placeholder,
  value,
  onChange,
  sex,
  onSexChange,
  autocomplete,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  sex: 1 | 2 | undefined;
  onSexChange: (v: 1 | 2 | undefined) => void;
  autocomplete: ReturnType<typeof useFirstnameAutocomplete>;
}) {
  const { collection, hasSearched, isLoading } = autocomplete;
  return (
    <div className={css({ display: "grid", gap: "1.5" })}>
      <Label>{label}</Label>
      <Combobox.Root
        collection={collection}
        inputValue={value}
        onInputValueChange={(details) => onChange(details.inputValue)}
        onValueChange={(details) => {
          const val = details.items[0];
          if (val) onChange(String(val));
        }}
        allowCustomValue
        openOnClick={false}
        selectionBehavior="preserve"
        closeOnSelect
      >
        <Combobox.Control>
          <Combobox.Input placeholder={placeholder} />
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
              <div className={css({ px: "2", py: "2", fontSize: "xs", color: "muted.foreground" })}>
                {isLoading ? "Chargement…" : "Aucun résultat"}
              </div>
            )
          )}
        </Combobox.Content>
      </Combobox.Root>
      <ToggleGroup.Root
        value={[String(sex ?? "all")]}
        onValueChange={(e) =>
          onSexChange(e.value[0] === "all" ? undefined : (Number(e.value[0]) as 1 | 2))
        }
      >
        <ToggleGroup.Item value="all">Tous</ToggleGroup.Item>
        <ToggleGroup.Item value="1">M</ToggleGroup.Item>
        <ToggleGroup.Item value="2">F</ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  );
}
