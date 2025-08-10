// src/views/reports/HousesTab.tsx
import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

type HouseItem = {
  name: string;
  count: number;
};

const SAMPLE_HOUSES: HouseItem[] = [
  { name: "Mwananchi", count: 474 },
  { name: "ITV", count: 764 },
  { name: "Millard Ayo", count: 356 },
  { name: "Jambo Tv", count: 455 },
  { name: "Jamii Forums", count: 567 },
];

export default function HousesTab({
  houses = SAMPLE_HOUSES,
  height = 320,
  title = "Top 5 Media Houses",
}: {
  houses?: HouseItem[];
  height?: number;
  title?: string;
}) {
  const labels = useMemo(() => houses.map((h) => h.name), [houses]);
  const series = useMemo(() => houses.map((h) => h.count), [houses]);
  const total = useMemo(() => series.reduce((s, v) => s + v, 0), [series]);

  if (!houses.length) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground text-center">
        No media house data available.
      </div>
    );
  }

  return (
    <Chart
      type="donut"
      height={height}
      series={series}
      options={{
        labels,
        colors: COLORS,
        legend: {
          position: "right",
          formatter: (seriesName: string, opts) => {
            const value = series[opts.seriesIndex] ?? 0;
            return `${seriesName} — ${value}`;
          },
          markers: { radius: 10 },
        },
        dataLabels: {
          enabled: true,
          formatter: (val: number, opts?: any) => {
            const count = series[opts?.seriesIndex] ?? 0;
            return `${count} (${val.toFixed(1)}%)`;
          },
          style: { fontSize: "11px" },
          dropShadow: { enabled: false },
        },
        tooltip: {
          y: {
            formatter: (v: number, { seriesIndex }: any) => {
              const pct =
                total > 0 ? ((v / total) * 100).toFixed(1) + "%" : "0%";
              return `${v} • ${pct}`;
            },
          },
        },
        plotOptions: {
          pie: {
            donut: {
              size: "62%",
              labels: {
                show: true,
                name: { show: true, fontSize: "12px", offsetY: 8 },
                value: {
                  show: true,
                  fontSize: "16px",
                  fontWeight: 600,
                  formatter: (v: string) => v,
                },
                total: {
                  show: true,
                  label: "Total",
                  fontSize: "12px",
                  color: "#64748b",
                  formatter: () => String(total),
                },
              },
            },
          },
        },
        stroke: { width: 1 },
        grid: { padding: { right: 8 } },
        responsive: [
          {
            breakpoint: 768,
            options: {
              legend: { position: "bottom" },
            },
          },
        ],
        title: {
          text: title,
          align: "center",
          style: { fontSize: "14px", fontWeight: 600 },
        },
      }}
    />
  );
}
