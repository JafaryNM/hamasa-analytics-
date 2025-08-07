import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

const DashedLineChart = () => {
  const data = [
    {
      name: "Applications Submitted",
      data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
    },
    {
      name: "Applications Reviewed",
      data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
    },
  ];

  const options = {
    chart: { type: "line", zoom: { enabled: false } },
    colors: COLORS,
    stroke: { width: [3, 3], curve: "straight", dashArray: [0, 5] },
    dataLabels: { enabled: false },
    markers: { size: 0 },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} Applications`,
      },
    },
    legend: { position: "top" },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h4 className="mb-2 font-semibold text-gray-700">
        Application Trends (Monthly)
      </h4>
      <Chart options={options} series={data} type="line" height={300} />
    </div>
  );
};

export default DashedLineChart;
