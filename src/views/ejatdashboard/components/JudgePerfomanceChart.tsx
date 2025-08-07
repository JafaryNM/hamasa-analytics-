import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

const JudgePerformanceBarChart = () => {
  const data = [
    {
      name: "Applications Reviewed",
      data: [20, 30, 25, 35, 15],
    },
  ];

  const options = {
    colors: COLORS,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Judge A", "Judge B", "Judge C", "Judge D", "Judge E"],
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} Reviews`,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h4 className="mb-2 font-semibold text-gray-700">
        Judge Review Performance
      </h4>
      <Chart options={options} series={data} type="bar" height={300} />
    </div>
  );
};

export default JudgePerformanceBarChart;
