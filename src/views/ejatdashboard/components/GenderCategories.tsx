import React, { useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Chart as ChartRefType } from "chart.js";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const GenderPieChart = ({
  data,
}: {
  data: { gender: string; count: string }[];
}) => {
  const chartRef = useRef<ChartRefType>(null);

  const labels = data.map((item) => item.gender);
  const counts = data.map((item) => Number(item.count));

  const backgroundColors = ["#1E90FF", "#FF69B4", "#FFD700"];

  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: backgroundColors.slice(0, counts.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false as const,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
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
          label: (context: any) => {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const value = context.raw;
            const percent = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percent}%)`;
          },
        },
      },
    },
  };

  const handleDownload = () => {
    if (!chartRef.current) return;
    const url = chartRef.current.toBase64Image();
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.click();
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Download Button */}
      <button
        onClick={handleDownload}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          padding: "6px 12px",
          backgroundColor: "#1E90FF",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        Download PNG
      </button>

      {/* Pie Chart */}
      <div style={{ height: 350 }}>
        <Pie ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default GenderPieChart;
