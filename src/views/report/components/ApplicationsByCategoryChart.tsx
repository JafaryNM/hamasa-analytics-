import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@/components/ui";
import { useRef } from "react";
import { TbFileDownload, TbFileSpreadsheet } from "react-icons/tb";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ApplicationsByCategoryChart = () => {
  const chartRef = useRef<any>(null);

  const handleDownloadImage = () => {
    const chart = chartRef.current;
    if (chart) {
      const link = document.createElement("a");
      link.href = chart.toBase64Image("image/png");
      link.download = "applications-by-category-chart.png";
      link.click();
    }
  };

  const handleDownloadExcel = () => {
    const csvContent = [
      "Category,Applications",
      "Business,120",
      "Health,90",
      "Environment,70",
      "Education,50",
      "Technology,40",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "applications-by-category.csv";
    link.click();
  };

  const data = {
    labels: ["Business", "Health", "Environment", "Education", "Technology"],
    datasets: [
      {
        label: "Applications",
        data: [120, 90, 70, 50, 40],
        backgroundColor: [
          "#37AFE3", // Business
          "#569ff7", // Health
          "#82ca9d", // Environment
          "#ffc658", // Education
          "#ff7f50", // Technology
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y} Applications`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Categories",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
        },
        title: {
          display: true,
          text: "Number of Applications",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-semibold">Applications by Category</h4>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="solid"
            icon={<TbFileDownload />}
            onClick={handleDownloadImage}
          >
            PNG
          </Button>

          <Button
            size="sm"
            variant="solid"
            icon={<TbFileSpreadsheet />}
            onClick={handleDownloadExcel}
          >
            Excel
          </Button>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div style={{ width: 600, height: 400 }}>
          <Bar data={data} options={options} ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default ApplicationsByCategoryChart;
