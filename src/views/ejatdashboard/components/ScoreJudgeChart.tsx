import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

const ScoreJudgeChart = () => {
  return (
    <Chart
      options={{
        colors: COLORS,
        labels: [
          "Scores 1-3",
          "Scores 4-5",
          "Scores 6-7",
          "Scores 8-9",
          "Scores 10",
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
      series={[5, 12, 20, 25, 8]}
      height={300}
      type="donut"
    />
  );
};

export default ScoreJudgeChart;
