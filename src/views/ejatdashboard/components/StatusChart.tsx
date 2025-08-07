import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

const StatusPieChart = () => {
  const series = [60, 25, 10, 5];
  const options = {
    colors: COLORS,
    labels: ["Approved", "Pending", "Rejected", "Draft"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h4 className="mb-2 font-semibold text-gray-700">
        Application Status Overview
      </h4>
      <Chart options={options} series={series} type="pie" height={300} />
    </div>
  );
};

export default StatusPieChart;
