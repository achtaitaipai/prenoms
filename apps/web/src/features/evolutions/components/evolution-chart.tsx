import type { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { fetchEvolution } from "../api/get-evolution";
import type { Entry } from "../types";
import { entryLabel } from "../types";

const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#ea580c"];

type EvolutionChartProps = {
  entries: Entry[];
  results: UseQueryResult<Awaited<ReturnType<typeof fetchEvolution>>>[];
  mode: "count" | "proportion";
  birthsPerYearBySex: Map<1 | 2 | undefined, Map<number, number>>;
};

export function EvolutionChart({
  entries,
  results,
  mode,
  birthsPerYearBySex,
}: EvolutionChartProps) {
  const chartData = useMemo(() => {
    const yearMap = new Map<number, Record<string, number>>();

    entries.forEach((entry, i) => {
      const data = results[i]?.data;
      if (!data) return;
      const label = entryLabel(entry);
      const birthsMap = birthsPerYearBySex.get(entry.sex);
      for (const row of data.byYear) {
        const existing = yearMap.get(row.year) ?? { year: row.year };
        if (mode === "proportion" && birthsMap) {
          const total = birthsMap.get(row.year) ?? 0;
          existing[label] = total > 0 ? (row.count / total) * 100 : 0;
        } else {
          existing[label] = row.count;
        }
        yearMap.set(row.year, existing);
      }
    });

    return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
  }, [entries, results, mode, birthsPerYearBySex]);

  const labels = entries.map((e) => entryLabel(e));

  if (chartData.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={mode === "proportion" ? (v) => `${v}%` : undefined} />
        <Tooltip
          labelStyle={{ color: "var(--colors-popover-foreground)" }}
          contentStyle={{
            backgroundColor: "var(--colors-popover)",
            borderColor: "var(--colors-border)",
          }}
          formatter={
            mode === "proportion"
              ? (value) => `${Number(value).toFixed(2)}%`
              : (value) => Number(value).toLocaleString("fr-FR")
          }
        />
        <Legend />
        {labels.map((label, i) => (
          <Area
            key={label}
            type="monotone"
            dataKey={label}
            stroke={COLORS[i % COLORS.length]}
            fill={COLORS[i % COLORS.length]}
            fillOpacity={0.1}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
