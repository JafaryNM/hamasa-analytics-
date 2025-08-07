import React, { useRef } from "react";
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
import { Chart as ChartRefType } from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const JournalistTrendChart = ({
  data,
}: {
  data: { month: string; count: string; year: string }[];
}) => {
  const chartRef = useRef<ChartRefType>(null);

  const labels = data.map((item) => `${item.month.trim()} ${item.year}`);
  const counts = data.map((item) => Number(item.count));
  const totalApplicants = counts.reduce((sum, val) => sum + val, 0);

  const backgroundColors = [
    "#1E88E5",
    "#43A047",
    "#FB8C00",
    "#8E24AA",
    "#00ACC1",
    "#F4511E",
    "#5E35B1",
    "#3949AB",
    "#00897B",
    "#D81B60",
    "#6D4C41",
    "#039BE5",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Applicants",
        data: counts,
        backgroundColor: backgroundColors.slice(0, counts.length),
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false as const,
    plugins: {
      title: {
        display: true,
        text: "",
        align: "start" as const,
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          title: () => `Total Applicants: ${totalApplicants}`,
          label: (context: any) => `${context.formattedValue} Applicants`,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Applicants",
        },
        beginAtZero: true,
      },
    },
  };

  const handleDownloadPNG = () => {
    if (!chartRef.current) return;
    const url = chartRef.current.toBase64Image();
    const link = document.createElement("a");
    link.href = url;
    link.download = "applicants_chart.png";
    link.click();
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Download Button (top-right) */}
      <button
        onClick={handleDownloadPNG}
        style={{
          position: "absolute",
          top: 0,
          right: 10,
          padding: "6px 12px",
          backgroundColor: "#1E88E5",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        Download PNG
      </button>

      {/* Chart */}
      <div style={{ height: 450 }}>
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default JournalistTrendChart;
