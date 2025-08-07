import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Button } from "@/components/ui";
import { useRef } from "react";
import { TbFileDownload, TbFileSpreadsheet } from "react-icons/tb";

ChartJS.register(ArcElement, Tooltip, Legend);

const SingleVsGroupApplicantsChart = () => {
  const chartRef = useRef<any>(null);

  const handleDownloadImage = () => {
    const chart = chartRef.current;
    if (chart) {
      const link = document.createElement("a");
      link.href = chart.toBase64Image("image/png");
      link.download = "single-vs-group-applicants-chart.png";
      link.click();
    }
  };

  const handleDownloadExcel = () => {
    const csvContent = ["Type,Applicants", "Single,180", "Group,70"].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "single-vs-group-applicants.csv";
    link.click();
  };

  const data = {
    labels: ["Single Applicants", "Group Applicants"],
    datasets: [
      {
        label: "Applicants",
        data: [180, 70], // Dummy values: 180 single, 70 group
        backgroundColor: ["#37AFE3", "#82ca9d"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
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
        <h4 className="text-xl font-semibold">Applicants: Single vs Group</h4>

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
          <Pie data={data} options={options} ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default SingleVsGroupApplicantsChart;
