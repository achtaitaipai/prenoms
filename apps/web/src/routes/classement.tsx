import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useRankingQuery } from "@/features/ranking/api/get-ranking";
import { RankingFilters } from "@/features/ranking/components/ranking-filters";
import { RankingPagination } from "@/features/ranking/components/ranking-pagination";
import { RankingTable } from "@/features/ranking/components/ranking-table";

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

function RankingComponent() {
  const { sex, yearStart, yearEnd, page: searchPage } = Route.useSearch();
  const navigate = useNavigate();
  const page = searchPage ?? 1;
  const pageSize = 20;

  const { data, isLoading } = useRankingQuery({ sex, yearStart, yearEnd, page, pageSize });

  function handleFilter(filters: { sex?: 1 | 2; yearStart?: number; yearEnd?: number }) {
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
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Classement national</CardTitle>
        </CardHeader>
        <CardContent>
          <RankingFilters onFilter={handleFilter} defaultValues={{ sex, yearStart, yearEnd }} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Chargement...</p>}
          {data && (
            <div className="space-y-4">
              <RankingTable data={data.data} page={data.page} pageSize={data.pageSize} />
              <RankingPagination
                page={data.page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
