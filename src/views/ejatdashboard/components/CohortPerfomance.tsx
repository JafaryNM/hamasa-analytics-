import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

// Register chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

// Define props interface
interface CohortPerformanceProps {
  data: {
    cohort: string[];
    pending: number[];
    selected: number[];
    rejected: number[];
  };
}

// Component definition
const CohortPerformance: React.FC<CohortPerformanceProps> = ({ data }) => {
  const chartData = {
    labels: data.cohort,
    datasets: [
      {
        label: "Pending",
        data: data.pending,
        backgroundColor: "#FB8C00", // orange
        barThickness: 20, // Fixed bar width
      },
      {
        label: "Selected",
        data: data.selected,
        backgroundColor: "#43A047", // green
        barThickness: 20,
      },
      {
        label: "Rejected",
        data: data.rejected,
        backgroundColor: "#E53935", // red
        barThickness: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      x: {
        stacked: false, // Bars side-by-side
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20, // Optional: control y-axis steps
        },
      },
    },
  };

  return (
    <div className="p-4">
      <h4 className="text-lg font-semibold mb-4">
        Cohorts Performance by Year
      </h4>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CohortPerformance;
