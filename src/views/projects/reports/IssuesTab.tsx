import React, { useMemo } from "react";
import Chart from "react-apexcharts";

type IssueItem = {
  label: string;
  count: number;
};

const SAMPLE_ISSUES: IssueItem[] = [
  { label: "Non-consensual sharing of intimate images (NCII)", count: 120 },
  { label: "Gender-based hate speech or derogatory slurs", count: 100 },
  { label: "Online stalking and harassment", count: 170 },
  { label: "Threats of sexual or physical violence", count: 89 },
  { label: "Impersonation or fake profiles to harm reputation", count: 67 },
];

export default function IssuesTab({
  issues = SAMPLE_ISSUES,
  height = 300,
}: {
  issues?: IssueItem[];
  height?: number;
}) {
  const categories = useMemo(() => issues.map((i) => i.label), [issues]);
  const series = useMemo(
    () => [{ name: "Reports", data: issues.map((i) => i.count) }],
    [issues]
  );

  if (!issues.length) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground text-center">
        No issue data available.
      </div>
    );
  }

  return (
    <Chart
      type="bar"
      height={height}
      series={series}
      options={{
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "60%",
          },
        },
        colors: ["#764295"], // ✅ All bars use this purple color
        dataLabels: { enabled: false },
        xaxis: {
          categories,
          axisBorder: { show: false },
          labels: { trim: true },
        },
        yaxis: {
          labels: { maxWidth: 320 },
        },
        grid: { strokeDashArray: 4 },
        tooltip: {
          y: { formatter: (v: number) => `${v}` },
        },
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
        legend: { show: false },
        title: {
          text: "Top 5 Issues Across All Thematic Areas",
          align: "center",
          style: { fontSize: "14px", fontWeight: 600 },
        },
      }}
    />
  );
}
