import { similairesSearchSchema } from "@prenoms/validators";
import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { container } from "styled-system/patterns";

import { useSimilairesQuery } from "@/features/similaires/api/get-similaires";
import { SimilairesForm } from "@/features/similaires/components/similaires-form";

export const Route = createFileRoute("/similaires")({
  component: SimilairesComponent,
  validateSearch: (search: Record<string, unknown>) => similairesSearchSchema.parse(search),
});

const pageContainer = container({
  w: "full",
  display: "flex",
  flexDirection: "column",
  gap: "6",
  px: "4",
  py: "6",
});

function SimilairesComponent() {
  const { firstname = "", sourceSex, targetSex } = Route.useSearch();
  const navigate = useNavigate();

  const { data, isLoading } = useSimilairesQuery(firstname, sourceSex, targetSex);

  function handleSearch(f: string, ss?: 1 | 2, ts?: 1 | 2) {
    navigate({
      to: ".",
      search: {
        firstname: f,
        ...(ss ? { sourceSex: ss } : {}),
        ...(ts ? { targetSex: ts } : {}),
      },
    });
  }

  return (
    <div className={pageContainer}>
      <Card>
        <CardHeader>
          <CardTitle>Similaires</CardTitle>
        </CardHeader>
        <CardContent>
          <SimilairesForm
            defaultValues={{ firstname, sourceSex, targetSex }}
            onSearch={handleSearch}
          />
        </CardContent>
      </Card>

      {isLoading && <p className={css({ color: "muted.foreground" })}>Chargement...</p>}

      {data && data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={css({ fontSize: "base" })}>
              Prénoms similaires à {firstname}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={css({ display: "grid", gap: "2" })}>
              {data.map((item, i) => (
                <div
                  key={item.firstname}
                  className={css({
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: "2",
                    px: "3",
                    rounded: "md",
                    bg: "muted",
                  })}
                >
                  <span>
                    <span className={css({ color: "muted.foreground", fontSize: "sm", mr: "2" })}>
                      {i + 1}.
                    </span>
                    {item.firstname.charAt(0) + item.firstname.slice(1).toLowerCase()}
                  </span>
                  <span className={css({ fontWeight: "bold", fontSize: "sm" })}>
                    {formatSimilarity(item.correlation)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data && data.length === 0 && (
        <p className={css({ color: "muted.foreground" })}>Aucun résultat</p>
      )}
    </div>
  );
}

function formatSimilarity(r: number) {
  const pct = Math.round(((r + 1) / 2) * 100);
  return `${pct} %`;
}
