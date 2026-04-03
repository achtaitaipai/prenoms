import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { container } from "styled-system/patterns";

import { useRankingQuery } from "@/features/classement/api/get-ranking";
import { RankingFilters } from "@/features/classement/components/ranking-filters";
import { RankingPagination } from "@/features/classement/components/ranking-pagination";
import { RankingTable } from "@/features/classement/components/ranking-table";

type RankingSearch = {
  sex?: 1 | 2;
  yearStart?: number;
  yearEnd?: number;
  page?: number;
};

export const Route = createFileRoute("/classement")({
  component: RankingComponent,
  validateSearch: (search: Record<string, unknown>): RankingSearch => {
    const sex = Number(search.sex);
    const yearStart = Number(search.yearStart);
    const yearEnd = Number(search.yearEnd);
    const page = Number(search.page);
    return {
      sex: sex === 1 || sex === 2 ? sex : undefined,
      yearStart: Number.isFinite(yearStart) ? yearStart : undefined,
      yearEnd: Number.isFinite(yearEnd) ? yearEnd : undefined,
      page: Number.isInteger(page) && page >= 1 ? page : undefined,
    };
  },
});

const pageContainer = container({
  w: "full",
  display: "flex",
  flexDirection: "column",
  gap: "6",
  px: "4",
  py: "6",
});

function RankingComponent() {
  const { sex, yearStart, yearEnd, page: searchPage } = Route.useSearch();
  const navigate = useNavigate();
  const page = searchPage ?? 1;
  const pageSize = 20;

  const { data, isLoading } = useRankingQuery({ sex, yearStart, yearEnd, page, pageSize });

  function handleFilter(filters: { sex?: 1 | 2; yearStart: number; yearEnd: number }) {
    navigate({
      to: ".",
      search: { ...filters, page: undefined },
    });
  }

  function handlePageChange(newPage: number) {
    navigate({
      to: ".",
      search: (prev: RankingSearch) => ({ ...prev, page: newPage }),
    });
  }

  return (
    <div className={pageContainer}>
      <Card>
        <CardHeader>
          <CardTitle>Classement national</CardTitle>
        </CardHeader>
        <CardContent>
          <RankingFilters onFilter={handleFilter} defaultValues={{ sex, yearStart, yearEnd }} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className={css({ pt: "6" })}>
          {isLoading && <p className={css({ color: "muted.foreground" })}>Chargement...</p>}
          {data && (
            <div className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
              <RankingTable data={data.data} page={data.page} pageSize={data.pageSize} />
              <RankingPagination
                page={data.page}
                totalPages={data.totalPages}
                pageSize={data.pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
