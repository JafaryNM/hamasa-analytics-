// components/LeadPerfomance.tsx

import React from "react";
import Chart from "react-apexcharts";
import Card from "@/components/ui/Card";
import { COLORS } from "@/constants/chart.constant";
import type { ApexOptions } from "apexcharts";
import { useAuth } from "@/auth";

export type LeadPerformanceProps = {
  data: {
    categories: string[];
    counts: number[];
  };
};

const LeadPerformance = ({ data }: LeadPerformanceProps) => {
  const total = data.counts.reduce((a, b) => a + b, 0);
  const { user } = useAuth();

  const chartOptions: ApexOptions = {
    labels: data.categories,
    colors: [COLORS[0], COLORS[1], COLORS[2]],
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} Applicants`,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h4>
          `{" "}
          <span className="text-blue-500 text-xl font-semibold">
            {user.firstName}'s
          </span>{" "}
          Applications By Categories`
        </h4>
      </div>

      {total === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No applicant data available.
        </div>
      ) : (
        <div className="mt-6">
          <Chart
            options={chartOptions}
            series={data.counts}
            type="pie"
            height={300}
          />
          <div className="flex flex-col gap-4 mt-4">
            {data.categories.map((category, index) => (
              <div
                key={category + index}
                className="flex items-center justify-between border-b pb-2"
              >
                <span className="font-medium">{category}</span>
                <span className="font-bold">
                  {data.counts[index]} Applications
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default LeadPerformance;
