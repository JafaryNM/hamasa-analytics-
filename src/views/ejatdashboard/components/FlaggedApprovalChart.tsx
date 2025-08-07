import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

const SimpleDonut = () => {
  const series = [92, 8]; // Approved vs Flagged content

  const options = {
    labels: ["Approved", "Flagged"],
    colors: [COLORS[0], "#EF4444"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => "100%",
            },
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h4 className="font-semibold mb-2 text-gray-800">Content Moderation</h4>
      <Chart options={options} series={series} type="donut" height={300} />
    </div>
  );
};

export default SimpleDonut;
