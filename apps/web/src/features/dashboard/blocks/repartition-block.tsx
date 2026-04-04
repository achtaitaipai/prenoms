import { MAX_YEAR, MIN_YEAR } from "@prenoms/config";
import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { Slider } from "@prenoms/ui/components/slider";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";

import { useRepartitionQuery } from "@/features/repartition/api/get-repartition";
import { RegionMap } from "@/features/repartition/components/region-map";

type Props = {
  firstname: string;
  sex?: 1 | 2;
  yearStart: number;
  yearEnd: number;
  onSettingsChange: (settings: { rep_yearStart?: number; rep_yearEnd?: number }) => void;
};

export function RepartitionBlock({ firstname, sex, yearStart, yearEnd, onSettingsChange }: Props) {
  const [years, setYears] = useState([yearStart, yearEnd]);

  // Sync local slider state when props change (e.g. navigation)
  useEffect(() => {
    setYears([yearStart, yearEnd]);
  }, [yearStart, yearEnd]);

  const { data } = useRepartitionQuery({ firstname, sex, yearStart: years[0], yearEnd: years[1] });

  function handleYearCommit(values: number[]) {
    onSettingsChange({ rep_yearStart: values[0], rep_yearEnd: values[1] });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition</CardTitle>
      </CardHeader>
      <CardContent className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
        <Slider.Root
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          value={years}
          onValueChange={(e) => setYears(e.value)}
          onValueChangeEnd={(e) => handleYearCommit(e.value)}
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
              <Slider.HiddenInput />
            </Slider.Thumb>
            <Slider.Thumb index={1}>
              <Slider.HiddenInput />
            </Slider.Thumb>
          </Slider.Control>
        </Slider.Root>
        {data && <RegionMap data={data.data} />}
      </CardContent>
    </Card>
  );
}
