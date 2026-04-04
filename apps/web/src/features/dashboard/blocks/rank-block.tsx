import { MAX_YEAR, MIN_YEAR } from "@prenoms/config";
import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { Slider } from "@prenoms/ui/components/slider";
import { useEffect, useRef, useState } from "react";
import { css } from "styled-system/css";

import { useRankSearchQuery } from "@/features/classement/api/get-rank-search";
import { useRankingQuery } from "@/features/classement/api/get-ranking";
import { RankingPagination } from "@/features/classement/components/ranking-pagination";
import { RankingTable } from "@/features/classement/components/ranking-table";

type Props = {
  firstname: string;
  sex?: 1 | 2;
  yearStart?: number;
  yearEnd?: number;
  page?: number;
  onSettingsChange: (settings: {
    rank_yearStart?: number;
    rank_yearEnd?: number;
    rank_page?: number;
  }) => void;
};

const PAGE_SIZE = 12;

export function RankBlock({ firstname, sex, yearStart, yearEnd, page, onSettingsChange }: Props) {
  const [years, setYears] = useState([yearStart ?? MIN_YEAR, yearEnd ?? MAX_YEAR]);
  const currentPage = page ?? 1;
  const onSettingsChangeRef = useRef(onSettingsChange);
  onSettingsChangeRef.current = onSettingsChange;

  // Sync local slider state when props change (e.g. navigation)
  useEffect(() => {
    setYears([yearStart ?? MIN_YEAR, yearEnd ?? MAX_YEAR]);
  }, [yearStart, yearEnd]);

  const rankSearch = useRankSearchQuery({
    firstname,
    sex,
    yearStart: years[0],
    yearEnd: years[1],
    pageSize: PAGE_SIZE,
  });

  const { data, isLoading } = useRankingQuery({
    sex,
    yearStart: years[0],
    yearEnd: years[1],
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    if (rankSearch.data?.page && rankSearch.data.page !== currentPage && !page) {
      onSettingsChangeRef.current({
        rank_yearStart: years[0],
        rank_yearEnd: years[1],
        rank_page: rankSearch.data.page,
      });
    }
  }, [rankSearch.data?.page, currentPage, page, years]);

  function handleYearCommit(values: number[]) {
    onSettingsChange({
      rank_yearStart: values[0],
      rank_yearEnd: values[1],
      rank_page: undefined,
    });
  }

  function handlePageChange(newPage: number) {
    onSettingsChange({
      rank_yearStart: years[0],
      rank_yearEnd: years[1],
      rank_page: newPage,
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
            onPageChange={handlePageChange}
          />
        )}
      </CardContent>
    </Card>
  );
}
