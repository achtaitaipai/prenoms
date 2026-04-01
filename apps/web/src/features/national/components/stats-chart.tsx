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

import type { Entry, StatsResponse } from "../types";
import { entryLabel } from "../types";

const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#ea580c"];

type StatsChartProps = {
  entries: Entry[];
  results: UseQueryResult<StatsResponse>[];
};

export function StatsChart({ entries, results }: StatsChartProps) {
  const chartData = useMemo(() => {
    const yearMap = new Map<number, Record<string, number>>();

    entries.forEach((entry, i) => {
      const data = results[i]?.data;
      if (!data) return;
      const label = entryLabel(entry);
      for (const row of data.byYear) {
        const existing = yearMap.get(row.year) ?? { year: row.year };
        existing[label] = row.count;
        yearMap.set(row.year, existing);
      }
    });

    return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
  }, [entries, results]);

  const labels = entries.map((e) => entryLabel(e));

  if (chartData.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
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
