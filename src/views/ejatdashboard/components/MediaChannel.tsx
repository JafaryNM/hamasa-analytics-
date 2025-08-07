import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

const MediaChannelPieChart = () => {
  const series = [12, 4, 2]; // Example: Radio, TV, Online

  const options = {
    colors: COLORS,
    labels: ["Radio", "TV", "Online"],
    legend: {
      position: "bottom",
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h4 className="mb-2 font-semibold text-gray-700">Media Channel Types</h4>
      <Chart options={options} series={series} type="pie" height={300} />
    </div>
  );
};

export default MediaChannelPieChart;
