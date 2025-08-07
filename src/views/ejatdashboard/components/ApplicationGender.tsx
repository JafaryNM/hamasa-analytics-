import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Props interface
interface ApplicationByGenderChartProps {
  data: {
    years: string[];
    male: number[];
    female: number[];
  };
}

// Functional component
const ApplicationByGenderChart: React.FC<ApplicationByGenderChartProps> = ({
  data,
}) => {
  // Dataset
  const chartData = {
    labels: data.years,
    datasets: [
      {
        label: "Male",
        data: data.male,
        backgroundColor: "#1E88E5", // Blue
        barThickness: 20, // Fixed bar width
      },
      {
        label: "Female",
        data: data.female,
        backgroundColor: "#E91E63", // Pink
        barThickness: 20,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        stacked: false, // Not stacked
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  // Render
  return (
    <div className="p-4">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ApplicationByGenderChart;
