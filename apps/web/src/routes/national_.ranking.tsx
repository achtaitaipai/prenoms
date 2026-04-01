import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { useRankingQuery } from "@/features/ranking/api/get-ranking";
import { RankingFilters } from "@/features/ranking/components/ranking-filters";
import { RankingPagination } from "@/features/ranking/components/ranking-pagination";
import { RankingTable } from "@/features/ranking/components/ranking-table";

export const Route = createFileRoute("/national_/ranking")({
  component: RankingComponent,
});

function RankingComponent() {
  const [sex, setSex] = useState<1 | 2 | undefined>();
  const [yearStart, setYearStart] = useState<number | undefined>();
  const [yearEnd, setYearEnd] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useRankingQuery({ sex, yearStart, yearEnd, page, pageSize });

  function handleFilter(filters: { sex?: 1 | 2; yearStart?: number; yearEnd?: number }) {
    setSex(filters.sex);
    setYearStart(filters.yearStart);
    setYearEnd(filters.yearEnd);
    setPage(1);
  }

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Classement national</CardTitle>
        </CardHeader>
        <CardContent>
          <RankingFilters onFilter={handleFilter} />
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
                pageSize={data.pageSize}
                dataLength={data.data.length}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
