import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

type Props = {
  male: number;
  female: number;
  other?: number;
};

const GenderDistributionPie = ({ male, female, other = 0 }: Props) => {
  const labels = ["Male", "Female"];
  const series = [male, female];

  // Optionally include "Other" if > 0
  if (other > 0) {
    labels.push("Other");
    series.push(other);
  }

  return (
    <Chart
      options={{
        colors: COLORS,
        labels,
        legend: {
          position: "bottom",
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 250,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      }}
      series={series}
      height={300}
      type="pie"
    />
  );
};

export default GenderDistributionPie;
