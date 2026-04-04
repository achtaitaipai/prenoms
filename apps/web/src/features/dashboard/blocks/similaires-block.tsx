import { Card, CardContent, CardHeader, CardTitle } from "@prenoms/ui/components/card";
import { Label } from "@prenoms/ui/components/label";
import { ToggleGroup } from "@prenoms/ui/components/toggle-group";
import { Link } from "@tanstack/react-router";
import { css } from "styled-system/css";

import { useSimilairesQuery } from "@/features/similaires/api/get-similaires";
import { formatSimilarity, toTitleCase } from "@/lib/format";

type Props = {
  firstname: string;
  sex?: 1 | 2;
  targetSex?: 1 | 2;
  onTargetSexChange: (targetSex?: 1 | 2) => void;
};

export function SimilairesBlock({ firstname, sex, targetSex, onTargetSexChange }: Props) {
  const { data } = useSimilairesQuery(firstname, sex, targetSex);

  return (
    <Card className={css({ h: "full", overflow: "hidden" })}>
      <CardHeader>
        <CardTitle>Similaires</CardTitle>
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
        <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
          <Label>Sexe cible</Label>
          <ToggleGroup.Root
            value={[String(targetSex ?? "all")]}
            onValueChange={(e) =>
              onTargetSexChange(e.value[0] === "all" ? undefined : (Number(e.value[0]) as 1 | 2))
            }
          >
            <ToggleGroup.Item value="all">Tous</ToggleGroup.Item>
            <ToggleGroup.Item value="1">M</ToggleGroup.Item>
            <ToggleGroup.Item value="2">F</ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>

        {data && data.length > 0 && (
          <div
            className={css({ display: "grid", gap: "1", flex: 1, minHeight: 0, overflowY: "auto" })}
          >
            {data.map((item, i) => (
              <Link
                key={item.firstname}
                to="/$firstname"
                params={{ firstname: item.firstname }}
                search={(prev) => ({ ...prev, sex: targetSex })}
                className={css({
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: "1.5",
                  px: "3",
                  rounded: "md",
                  bg: "muted",
                  textDecoration: "none",
                  color: "inherit",
                  _hover: { bg: "accent" },
                })}
              >
                <span>
                  <span className={css({ color: "muted.foreground", fontSize: "sm", mr: "2" })}>
                    {i + 1}.
                  </span>
                  {toTitleCase(item.firstname)}
                </span>
                <span className={css({ fontWeight: "bold", fontSize: "sm" })}>
                  {formatSimilarity(item.correlation)} %
                </span>
              </Link>
            ))}
          </div>
        )}

        {data && data.length === 0 && (
          <p className={css({ color: "muted.foreground", fontSize: "sm" })}>Aucun résultat</p>
        )}
      </CardContent>
    </Card>
  );
}
