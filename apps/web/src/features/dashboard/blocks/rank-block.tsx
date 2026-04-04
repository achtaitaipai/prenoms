import { MAX_YEAR, MIN_YEAR } from "@prenoms/config";
import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { Slider } from "@prenoms/ui/components/slider";
import { RANKING_PAGE_SIZE } from "@prenoms/validators";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";

import { useRankSearchQuery } from "@/features/classement/api/get-rank-search";
import { useRankingQuery } from "@/features/classement/api/get-ranking";
import { RankingPagination } from "@/features/classement/components/ranking-pagination";
import { RankingTable } from "@/features/classement/components/ranking-table";

type Props = {
  firstname: string;
  sex?: 1 | 2;
  yearStart: number;
  yearEnd: number;
  onSettingsChange: (settings: { rank_yearStart?: number; rank_yearEnd?: number }) => void;
};

export function RankBlock({ firstname, sex, yearStart, yearEnd, onSettingsChange }: Props) {
  const [years, setYears] = useState([yearStart, yearEnd]);
  const [page, setPage] = useState(1);

  // Sync local slider state when props change (e.g. navigation)
  useEffect(() => {
    setYears([yearStart, yearEnd]);
  }, [yearStart, yearEnd]);

  const rankSearch = useRankSearchQuery({
    firstname,
    sex,
    yearStart: years[0],
    yearEnd: years[1],
    pageSize: RANKING_PAGE_SIZE,
  });

  const { data, isLoading } = useRankingQuery({
    sex,
    yearStart: years[0],
    yearEnd: years[1],
    page,
    pageSize: RANKING_PAGE_SIZE,
  });

  // Auto-navigate to the page containing the current firstname
  useEffect(() => {
    if (rankSearch.data?.page) {
      setPage(rankSearch.data.page);
    }
  }, [rankSearch.data?.page]);

  function handleYearCommit(values: number[]) {
    setPage(1);
    onSettingsChange({
      rank_yearStart: values[0],
      rank_yearEnd: values[1],
    });
  }

  return (
    <Card className={css({ h: "full", overflow: "hidden" })}>
      <CardHeader>
        <CardTitle>Classement</CardTitle>
      </CardHeader>
      <CardContent
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "4",
          flex: 1,
          minHeight: 0,
        })}
      >
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

        {isLoading && (
          <p className={css({ color: "muted.foreground", fontSize: "sm" })}>Chargement...</p>
        )}

        {data && (
          <div className={css({ flex: 1, minHeight: 0, overflowY: "auto" })}>
            <RankingTable
              data={data.data}
              page={data.page}
              pageSize={data.pageSize}
              sex={sex}
              highlightedFirstname={rankSearch.data?.firstname}
            />
          </div>
        )}
        {data && (
          <RankingPagination
            page={data.page}
            totalPages={data.totalPages}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
