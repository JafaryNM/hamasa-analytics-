import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

const MediaChannelPieChart = () => {
  const series = [10, 5, 3]; // Radio, TV, Online
  const options = {
    labels: ["Radio", "TV", "Online"],
    colors: COLORS,
    legend: { position: "bottom" },
  };

  return (
    <div>
      <Chart options={options} series={series} type="pie" height={300} />
    </div>
  );
};

export default MediaChannelPieChart;
