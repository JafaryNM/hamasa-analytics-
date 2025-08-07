import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Card from "@/components/ui/Card";
import { COLORS } from "@/constants/chart.constant";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type JudgeCategoryChartProps = {
  data: {
    categories: string[];
    counts: number[];
  };
};

const JudgeCategoryChart = ({ data }: JudgeCategoryChartProps) => {
  const total = data.counts.reduce((a, b) => a + b, 0);

  const chartData = {
    labels: data.categories,
    datasets: [
      {
        label: "Applications",
        data: data.counts,
        backgroundColor: COLORS.slice(0, data.categories.length),
        borderRadius: 6,
        barPercentage: 0.5,
        categoryPercentage: 0.6,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${context.parsed.y} Applications`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Categories" },
        ticks: { maxRotation: 45, minRotation: 0 },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Applications" },
      },
    },
  };

  return (
    <Card>
      <h4 className="mb-4 font-semibold">
        Applications Assessed per Award Category
      </h4>

      {total === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No applicant data available.
        </div>
      ) : (
        <>
          <div style={{ height: 260, paddingLeft: 8, paddingRight: 8 }}>
            <Bar data={chartData} options={options} />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {data.categories.map((category, index) => (
              <div
                key={category + index}
                className="flex justify-between border-b pb-2"
              >
                <span className="text-sm">{category}</span>
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

export default JudgeCategoryChart;
