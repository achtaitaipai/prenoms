import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useRepartitionQuery } from "@/features/repartition/api/get-repartition";
import {
  RepartitionForm,
  type RepartitionFormValues,
} from "@/features/repartition/components/repartition-form";
import { RegionMap } from "@/features/repartition/components/region-map";

type RepartitionSearch = {
  firstname?: string;
  sex?: 1 | 2;
  yearStart?: number;
  yearEnd?: number;
};

export const Route = createFileRoute("/repartition")({
  component: RepartitionComponent,
  validateSearch: (search: Record<string, unknown>): RepartitionSearch => {
    const sex = Number(search.sex);
    const yearStart = Number(search.yearStart);
    const yearEnd = Number(search.yearEnd);
    return {
      firstname: typeof search.firstname === "string" ? search.firstname : undefined,
      sex: sex === 1 || sex === 2 ? sex : undefined,
      yearStart: Number.isFinite(yearStart) ? yearStart : undefined,
      yearEnd: Number.isFinite(yearEnd) ? yearEnd : undefined,
    };
  },
});

function RepartitionComponent() {
  const { firstname, sex, yearStart, yearEnd } = Route.useSearch();
  const navigate = useNavigate();

  const { data, isLoading } = useRepartitionQuery(
    firstname ? { firstname, sex, yearStart, yearEnd } : null,
  );

  function handleSubmit(values: RepartitionFormValues) {
    navigate({
      to: ".",
      search: {
        firstname: values.firstname,
        sex: values.sex,
        yearStart: values.yearStart,
        yearEnd: values.yearEnd,
      },
    });
  }

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Répartition régionale</CardTitle>
        </CardHeader>
        <CardContent>
          <RepartitionForm
            defaultValues={{ firstname, sex, yearStart, yearEnd }}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      {isLoading && <p className="text-muted-foreground">Chargement...</p>}

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>{data.firstname}</CardTitle>
          </CardHeader>
          <CardContent>
            <RegionMap data={data.data} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
