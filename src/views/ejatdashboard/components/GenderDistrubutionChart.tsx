import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

const GenderPieChart = () => {
  const series = [35, 15, 2]; // Male, Female, Other
  const options = {
    labels: ["Male", "Female", "Other"],
    colors: COLORS,
    legend: { position: "bottom" },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h4 className="font-semibold mb-2">Gender Distribution</h4>
      <Chart options={options} series={series} type="donut" height={300} />
    </div>
  );
};

export default GenderPieChart;
