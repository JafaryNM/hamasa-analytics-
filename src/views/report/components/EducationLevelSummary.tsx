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

const EducationLevelSummaryChart = () => {
  const chartRef = useRef<any>(null);

  const handleDownloadImage = () => {
    const chart = chartRef.current;
    if (chart) {
      const link = document.createElement("a");
      link.href = chart.toBase64Image("image/png");
      link.download = "education-level-summary-chart.png";
      link.click();
    }
  };

  const handleDownloadExcel = () => {
    const csvContent = [
      "Education Level,Applicants",
      "Primary,30",
      "Secondary,100",
      "Diploma,80",
      "Bachelor's Degree,120",
      "Master's Degree,40",
      "PhD,10",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "education-level-summary.csv";
    link.click();
  };

  const data = {
    labels: [
      "Primary",
      "Secondary",
      "Diploma",
      "Bachelor's Degree",
      "Master's Degree",
      "PhD",
    ],
    datasets: [
      {
        label: "Applicants",
        data: [30, 100, 80, 120, 40, 10],
        backgroundColor: [
          "#37AFE3",
          "#569ff7",
          "#82ca9d",
          "#ffc658",
          "#ff7f50",
          "#d0ed57",
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
            return `${context.dataset.label}: ${context.parsed.y} Applicants`;
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
          text: "Education Level",
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
          text: "Number of Applicants",
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
        <h4 className="text-xl font-semibold">Summary of Education Levels</h4>

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
        <div style={{ width: 700, height: 400 }}>
          <Bar data={data} options={options} ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default EducationLevelSummaryChart;
