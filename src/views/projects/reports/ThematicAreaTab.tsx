// src/views/reports/ThematicAreaTab.tsx
import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

type Channel =
  | "Newspapers"
  | "TV"
  | "Radio"
  | "Social Media"
  | "Blogs/Platforms";

type ThematicRow = {
  area: string;
  byChannel: Record<Channel, number>;
};

function numberToK(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

const CHANNEL_ORDER: Channel[] = [
  "Newspapers",
  "TV",
  "Radio",
  "Social Media",
  "Blogs/Platforms",
];

export default function ThematicAreaTab({
  thematicAreas,
  height = 360,
  title = "Thematic Areas Coverage by Media Type",
}: {
  thematicAreas: ThematicRow[];
  height?: number;
  title?: string;
}) {
  const categories = useMemo(
    () => thematicAreas.map((t) => t.area),
    [thematicAreas]
  );

  const series = useMemo(
    () =>
      CHANNEL_ORDER.map((ch, idx) => ({
        name: ch,
        data: thematicAreas.map((t) => t.byChannel[ch] ?? 0),
        color: COLORS[idx % COLORS.length],
      })),
    [thematicAreas]
  );

  if (!thematicAreas?.length) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground text-center">
        No thematic data available.
      </div>
    );
  }

  return (
    <Chart
      type="bar"
      height={height}
      series={series as any}
      options={{
        chart: {
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            dataLabels: { position: "top" },
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -12,
          formatter: (val: number) => (val ? `${val}` : ""),
          style: { fontSize: "11px" },
        },
        stroke: { show: true, width: 1, colors: ["#fff"] },
        xaxis: {
          categories,
          labels: { trim: true },
          axisBorder: { show: false },
        },
        yaxis: {
          min: 0,
          labels: { formatter: (v: number) => numberToK(v) },
          title: {
            text: "Number of Media Products",
            style: { fontSize: "12px" },
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "center",
          markers: { radius: 12 },
        },
        grid: { strokeDashArray: 4 },
        tooltip: {
          shared: true,
          intersect: false,
          y: { formatter: (v: number) => (v != null ? `${v}` : "") },
        },
        title: {
          text: title,
          align: "center",
          style: { fontSize: "14px", fontWeight: 600 },
        },
      }}
    />
  );
}
