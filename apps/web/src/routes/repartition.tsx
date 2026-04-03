import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { repartitionSearchSchema } from "@prenoms/validators";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { container } from "styled-system/patterns";

import { useRepartitionQuery } from "@/features/repartition/api/get-repartition";
import {
  RepartitionForm,
  type RepartitionFormValues,
} from "@/features/repartition/components/repartition-form";
import { RegionMap } from "@/features/repartition/components/region-map";

export const Route = createFileRoute("/repartition")({
  component: RepartitionComponent,
  validateSearch: (search) => repartitionSearchSchema.parse(search),
});

const pageContainer = container({
  w: "full",
  display: "flex",
  flexDirection: "column",
  gap: "6",
  px: "4",
  py: "6",
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
    <div className={pageContainer}>
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

      {isLoading && <p className={css({ color: "muted.foreground" })}>Chargement...</p>}

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
