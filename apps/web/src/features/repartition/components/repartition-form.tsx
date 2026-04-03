import { MAX_YEAR, MIN_YEAR } from "@prenoms/config";
import { Button } from "@prenoms/ui/components/button";
import { Input } from "@prenoms/ui/components/input";
import { Label } from "@prenoms/ui/components/label";
import { Slider } from "@prenoms/ui/components/slider";
import { ToggleGroup } from "@prenoms/ui/components/toggle-group";
import { type FormEvent, useState } from "react";
import { css } from "styled-system/css";

export type RepartitionFormValues = {
  firstname: string;
  sex?: 1 | 2;
  yearStart: number;
  yearEnd: number;
};

type Props = {
  defaultValues?: Partial<RepartitionFormValues>;
  onSubmit: (values: RepartitionFormValues) => void;
};

export function RepartitionForm({ defaultValues, onSubmit }: Props) {
  const [firstname, setFirstname] = useState(defaultValues?.firstname ?? "");
  const [sex, setSex] = useState<1 | 2 | undefined>(defaultValues?.sex);
  const [years, setYears] = useState([
    defaultValues?.yearStart ?? MIN_YEAR,
    defaultValues?.yearEnd ?? MAX_YEAR,
  ]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = firstname.trim();
    if (!trimmed) return;
    onSubmit({
      firstname: trimmed,
      sex,
      yearStart: years[0]!,
      yearEnd: years[1]!,
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
      <div className={css({ display: "grid", gap: "1.5", width: "12rem" })}>
        <Slider.Root
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          value={years}
          onValueChange={(e) => setYears(e.value)}
        >
          <div className={css({ display: "flex", justifyContent: "space-between" })}>
            <Slider.Label>Période</Slider.Label>
            <Slider.ValueText>
              {years[0]} – {years[1]}
            </Slider.ValueText>
          </div>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0}>
              <Slider.HiddenInput name="yearStart" />
            </Slider.Thumb>
            <Slider.Thumb index={1}>
              <Slider.HiddenInput name="yearEnd" />
            </Slider.Thumb>
          </Slider.Control>
        </Slider.Root>
      </div>
      <Button type="submit">Rechercher</Button>
    </form>
  );
}
