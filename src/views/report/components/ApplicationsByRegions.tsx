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

const ApplicationsByRegionChart = () => {
  const chartRef = useRef<any>(null);

  const handleDownloadImage = () => {
    const chart = chartRef.current;
    if (chart) {
      const link = document.createElement("a");
      link.href = chart.toBase64Image("image/png");
      link.download = "applications-by-region-chart.png";
      link.click();
    }
  };

  const handleDownloadExcel = () => {
    const csvContent = [
      "Region,Applications",
      "Dar es Salaam,400",
      "Arusha,250",
      "Mwanza,200",
      "Dodoma,150",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "applications-by-region.csv";
    link.click();
  };

  const data = {
    labels: ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma"],
    datasets: [
      {
        label: "Applications",
        data: [400, 250, 200, 150],
        backgroundColor: [
          "#37AFE3", // Dar es Salaam
          "#569ff7", // Arusha
          "#82ca9d", // Mwanza
          "#ffc658", // Dodoma
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
          text: "Regions",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50,
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
        <h4 className="text-xl font-semibold">Applications by Region</h4>

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

export default ApplicationsByRegionChart;
