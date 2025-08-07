import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

const JudgeProgress = () => {
  const data = [
    {
      name: "Completed Reviews",
      data: [12, 18, 25, 20, 30, 28, 24, 35, 40],
    },
    {
      name: "Pending Reviews",
      data: [8, 5, 3, 5, 2, 4, 6, 3, 1],
    },
    {
      name: "Total Assigned",
      data: [20, 23, 28, 25, 32, 32, 30, 38, 41],
    },
  ];

  return (
    <Chart
      options={{
        chart: {
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            borderRadius: 4,
          },
        },
        colors: COLORS,
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [
            "Round 1",
            "Round 2",
            "Round 3",
            "Round 4",
            "Round 5",
            "Round 6",
            "Round 7",
            "Round 8",
            "Round 9",
          ],
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} applications`,
          },
        },
        legend: {
          position: "top",
        },
      }}
      series={data}
      height={300}
      type="bar"
    />
  );
};

export default JudgeProgress;
