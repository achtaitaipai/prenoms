import { useState } from "react";

import { REGION_PATHS, VIEWBOX } from "./region-paths";

type RegionData = {
  region: string;
  count: number;
  percent: number;
};

type Props = {
  data: RegionData[];
};

function getColor(percent: number, maxPercent: number) {
  if (maxPercent === 0) return "hsl(210 80% 90%)";
  const ratio = percent / maxPercent;
  const lightness = 90 - ratio * 50;
  return `hsl(210 80% ${lightness}%)`;
}

export function RegionMap({ data }: Props) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    count: number;
    percent: number;
  } | null>(null);

  const dataMap = new Map(data.map((d) => [d.region, d]));
  const maxPercent = Math.max(...data.map((d) => d.percent), 0);

  return (
    <div className="relative">
      <svg viewBox={VIEWBOX} xmlns="http://www.w3.org/2000/svg" className="w-full">
        {Object.entries(REGION_PATHS).map(([code, { name, d }]) => {
          const regionData = dataMap.get(code);
          const percent = regionData?.percent ?? 0;
          return (
            <path
              key={code}
              d={d}
              fill={getColor(percent, maxPercent)}
              stroke="currentColor"
              strokeWidth={0.5}
              className="cursor-pointer opacity-80 transition-opacity hover:opacity-100"
              onMouseMove={(e) => {
                const rect = e.currentTarget.closest("svg")!.getBoundingClientRect();
                setTooltip({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top - 10,
                  name,
                  count: regionData?.count ?? 0,
                  percent,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}
      </svg>
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
        >
          <p className="font-medium">{tooltip.name}</p>
          <p>
            {tooltip.count.toLocaleString("fr-FR")} ({tooltip.percent}%)
          </p>
        </div>
      )}
    </div>
  );
}
