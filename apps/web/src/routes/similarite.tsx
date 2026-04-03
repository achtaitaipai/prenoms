import { similaritySearchSchema } from "@prenoms/validators";
import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { container } from "styled-system/patterns";

import { useSimilarityQuery } from "@/features/similarite/api/get-similarity";
import { SimilarityForm } from "@/features/similarite/components/similarity-form";

export const Route = createFileRoute("/similarite")({
  component: SimilariteComponent,
  validateSearch: (search: Record<string, unknown>) => similaritySearchSchema.parse(search),
});

const pageContainer = container({
  w: "full",
  display: "flex",
  flexDirection: "column",
  gap: "6",
  px: "4",
  py: "6",
});

function SimilariteComponent() {
  const { firstname1 = "", firstname2 = "", sex1, sex2 } = Route.useSearch();
  const navigate = useNavigate();

  const { data, isLoading } = useSimilarityQuery(firstname1, firstname2, sex1, sex2);

  function handleCompare(f1: string, f2: string, s1?: 1 | 2, s2?: 1 | 2) {
    navigate({
      to: ".",
      search: {
        firstname1: f1,
        firstname2: f2,
        ...(s1 ? { sex1: s1 } : {}),
        ...(s2 ? { sex2: s2 } : {}),
      },
    });
  }

  return (
    <div className={pageContainer}>
      <Card>
        <CardHeader>
          <CardTitle>Similarité</CardTitle>
        </CardHeader>
        <CardContent>
          <SimilarityForm defaultValues={{ firstname1, firstname2, sex1, sex2 }} onCompare={handleCompare} />
        </CardContent>
      </Card>

      {isLoading && <p className={css({ color: "muted.foreground" })}>Chargement...</p>}

      {data && (
        <Card>
          <CardContent className={css({ pt: "6", textAlign: "center" })}>
            <p className={css({ fontSize: "sm", color: "muted.foreground" })}>
              Similarité entre <strong>{data.firstname1}</strong> et{" "}
              <strong>{data.firstname2}</strong>
            </p>
            <p className={css({ fontSize: "4xl", fontWeight: "bold", mt: "2" })}>
              {formatSimilarity(data.correlation)}
            </p>
            <p className={css({ fontSize: "xs", color: "muted.foreground", mt: "1" })}>
              {interpretSimilarity(data.correlation)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function formatSimilarity(r: number) {
  const pct = Math.round(((r + 1) / 2) * 100);
  return `${pct} %`;
}

function interpretSimilarity(r: number) {
  const pct = ((r + 1) / 2) * 100;
  if (pct >= 90) return "Évolutions très similaires";
  if (pct >= 70) return "Évolutions similaires";
  if (pct >= 50) return "Évolutions peu liées";
  if (pct >= 30) return "Évolutions assez différentes";
  return "Évolutions opposées";
}
