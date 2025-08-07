import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Button } from "@/components/ui";
import { useRef } from "react";
import { TbFileDownload, TbFileSpreadsheet } from "react-icons/tb";

ChartJS.register(ArcElement, Tooltip, Legend);

const AverageAgeDistributionChart = () => {
  const chartRef = useRef<any>(null);

  const handleDownloadImage = () => {
    const chart = chartRef.current;
    if (chart) {
      const link = document.createElement("a");
      link.href = chart.toBase64Image("image/png");
      link.download = "average-age-distribution-chart.png";
      link.click();
    }
  };

  const handleDownloadExcel = () => {
    const csvContent = [
      "Age Range,Applicants",
      "18-25,50",
      "26-35,120",
      "36-45,70",
      "46-60,30",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "average-age-distribution.csv";
    link.click();
  };

  const data = {
    labels: ["18-25", "26-35", "36-45", "46-60"],
    datasets: [
      {
        label: "Applicants",
        data: [50, 120, 70, 30],
        backgroundColor: ["#37AFE3", "#569ff7", "#82ca9d", "#ffc658"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "60%", // Makes it a nice donut instead of full pie
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed} Applicants`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-semibold">Average Age Distribution</h4>

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
        <div style={{ width: 400, height: 400 }}>
          <Doughnut data={data} options={options} ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default AverageAgeDistributionChart;
