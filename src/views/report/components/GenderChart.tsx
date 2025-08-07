import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Button } from "@/components/ui";
import { useRef } from "react";
import { TbFileDownload, TbFileSpreadsheet, TbFile } from "react-icons/tb";

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderChart = () => {
  const chartRef = useRef<any>(null);

  const handleDownloadImage = () => {
    const chart = chartRef.current;
    if (chart) {
      const link = document.createElement("a");
      link.href = chart.toBase64Image("image/png");
      link.download = "gender-distribution-chart.png";
      link.click();
    }
  };

  const handleDownloadExcel = () => {
    // Simulate download Excel (fake for now)
    const blob = new Blob(
      ["Gender,Value\nMale,60\nFemale,35\nOther,3\nPrefer not to say,2"],
      { type: "text/csv;charset=utf-8;" }
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gender-distribution-chart.csv";
    link.click();
  };

  const data = {
    labels: ["Male", "Female", "Other", "Prefer not to say"],
    datasets: [
      {
        label: "Gender Distribution",
        data: [60, 35, 3, 2],
        backgroundColor: ["#37AFE3", "#569ff7", "#82ca9d", "#ffc658"],
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
    },
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-semibold">Gender Distribution</h4>

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

export default GenderChart;
