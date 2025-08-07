import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Card from "@/components/ui/Card";
import { COLORS } from "@/constants/chart.constant";

// Register pie chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

type JudgeMediaChannelChartProps = {
  data: {
    labels: string[];
    counts: number[];
  };
};

const JudgeMediaChannelChart = ({ data }: JudgeMediaChannelChartProps) => {
  const total = data.counts.reduce((sum, count) => sum + count, 0);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Applications",
        data: data.counts,
        backgroundColor: COLORS.slice(0, data.labels.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label;
            const value = context.parsed;
            return `${label}: ${value} Applications`;
          },
        },
      },
    },
  };

  return (
    <Card>
      {total === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No media channel data available.
        </div>
      ) : (
        <>
          <div style={{ height: 300 }}>
            <Pie data={chartData} options={options} />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {data.labels.map((label, index) => (
              <div
                key={label + index}
                className="flex justify-between border-b pb-2"
              >
                <span className="text-sm">{label}</span>
                <span className="font-semibold">
                  {data.counts[index]} Applications
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default JudgeMediaChannelChart;
