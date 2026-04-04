import { ToggleGroup } from "@prenoms/ui/components/toggle-group";
import { dashboardSearchSchema } from "@prenoms/validators";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { css } from "styled-system/css";
import { container } from "styled-system/patterns";

import { ComparaisonBlock } from "@/features/dashboard/blocks/comparaison-block";
import { EvolutionBlock } from "@/features/dashboard/blocks/evolution-block";
import { RankBlock } from "@/features/dashboard/blocks/rank-block";
import { RepartitionBlock } from "@/features/dashboard/blocks/repartition-block";
import { SimilairesBlock } from "@/features/dashboard/blocks/similaires-block";
import { toTitleCase } from "@/lib/format";

export const Route = createFileRoute("/$firstname")({
  component: DashboardComponent,
  validateSearch: (search) => dashboardSearchSchema.parse(search),
});

const pageContainer = container({
  w: "full",
  display: "flex",
  flexDirection: "column",
  gap: "6",
  px: "4",
  py: "6",
});

function DashboardComponent() {
  const { firstname } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const updateSearch = useCallback(
    (patch: Record<string, unknown>) => {
      navigate({
        to: ".",
        params: { firstname },
        search: (prev) => ({ ...prev, ...patch }),
      });
    },
    [navigate, firstname],
  );

  return (
    <div className={pageContainer}>
      <div className={css({ display: "flex", alignItems: "center", gap: "4", flexWrap: "wrap" })}>
        <h1 className={css({ fontSize: "3xl", fontWeight: "bold" })}>{toTitleCase(firstname)}</h1>
        <ToggleGroup.Root
          value={[String(search.sex ?? "all")]}
          onValueChange={(e) =>
            updateSearch({ sex: e.value[0] === "all" ? undefined : Number(e.value[0]) })
          }
        >
          <ToggleGroup.Item value="all">Tous</ToggleGroup.Item>
          <ToggleGroup.Item value="1">M</ToggleGroup.Item>
          <ToggleGroup.Item value="2">F</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      <div
        className={css({
          display: "grid",
          gap: "6",
          gridTemplateColumns: { base: "1fr", md: "repeat(6, 1fr)" },
          gridTemplateAreas: {
            base: `"evo" "sim" "rank" "rep" "cmp"`,
            md: `"evo evo evo evo sim sim" "rank rank rank rep rep rep" "cmp cmp cmp cmp cmp cmp"`,
          },
        })}
      >
        <div className={css({ gridArea: "evo", minHeight: 0 })}>
          <EvolutionBlock
            firstname={firstname}
            sex={search.sex}
            mode={search.evo_mode ?? "count"}
            onModeChange={(mode) => updateSearch({ evo_mode: mode })}
            extraEntries={search.evo_entries}
            onEntriesChange={(e) => updateSearch({ evo_entries: e || undefined })}
          />
        </div>

        <div className={css({ gridArea: "sim", minHeight: 0, position: "relative" })}>
          <div className={css({ position: { md: "absolute" }, inset: { md: 0 } })}>
            <SimilairesBlock
              firstname={firstname}
              sex={search.sex}
              targetSex={search.sim_targetSex}
              onTargetSexChange={(targetSex) => updateSearch({ sim_targetSex: targetSex })}
            />
          </div>
        </div>

        <div className={css({ gridArea: "rank", minHeight: 0, position: "relative" })}>
          <div className={css({ position: { md: "absolute" }, inset: { md: 0 } })}>
            <RankBlock
              firstname={firstname}
              sex={search.sex}
              yearStart={search.rank_yearStart}
              yearEnd={search.rank_yearEnd}
              page={search.rank_page}
              onSettingsChange={(s) => updateSearch(s)}
            />
          </div>
        </div>

        <div className={css({ gridArea: "cmp", minHeight: 0 })}>
          <ComparaisonBlock
            firstname={firstname}
            sex={search.sex}
            cmpFirstname={search.cmp_firstname}
            cmpSex={search.cmp_sex}
            onSettingsChange={(s) => updateSearch(s)}
          />
        </div>

        <div className={css({ gridArea: "rep", minHeight: 0 })}>
          <RepartitionBlock
            firstname={firstname}
            sex={search.sex}
            yearStart={search.rep_yearStart}
            yearEnd={search.rep_yearEnd}
            onSettingsChange={(s) => updateSearch(s)}
          />
        </div>
      </div>
    </div>
  );
}
