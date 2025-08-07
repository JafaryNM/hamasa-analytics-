import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

const JudgeCategoryChart = () => {
  return (
    <Chart
      options={{
        colors: COLORS,
        labels: [
          "News Reporting",
          "Feature Writing",
          "Photography",
          "Radio Program",
          "Online Content",
        ],
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
      }}
      series={[35, 25, 15, 10, 15]}
      height={300}
      type="pie"
    />
  );
};

export default JudgeCategoryChart;
