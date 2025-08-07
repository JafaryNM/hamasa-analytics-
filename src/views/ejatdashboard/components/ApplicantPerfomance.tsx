// components/ApplicantPerfomance.tsx

import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Segment from "@/components/ui/Segment";
import ApexChart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";

export type ApplicantPerformanceProps = {
  data: {
    submissions: number[];
    shortlisted: number[];
    approved: number[];
    pending: number[];
    label: string[];
  };
};

const ApplicantPerformance = ({ data }: ApplicantPerformanceProps) => {
  const [category, setCategory] = useState("all");

  const series = useMemo(() => {
    const submissionsSeries = {
      name: "Submissions",
      type: "column",
      data: data.submissions,
      color: COLORS[1],
    };

    const shortlistedSeries = {
      name: "Shortlisted",
      type: "line",
      data: data.shortlisted,
      color: COLORS[2],
    };

    const approvedSeries = {
      name: "Approved",
      type: "line",
      data: data.approved,
      color: COLORS[3],
    };

    const pendingSeries = {
      name: "Pending",
      type: "column",
      data: data.pending,
      color: COLORS[4],
    };

    if (category === "all") {
      return [
        submissionsSeries,
        shortlistedSeries,
        approvedSeries,
        pendingSeries,
      ];
    }

    if (category === "submissions") return [submissionsSeries];
    if (category === "shortlisted") return [shortlistedSeries];
    if (category === "approved") return [approvedSeries];
    if (category === "pending") return [pendingSeries];

    return [];
  }, [category, data]);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">
          Applicant Performance Insights
        </h4>
        <Segment
          className="gap-1"
          value={category}
          size="sm"
          onChange={(val) => setCategory(val as string)}
        >
          <Segment.Item value="all">All</Segment.Item>
          <Segment.Item value="submissions">Submissions</Segment.Item>
          <Segment.Item value="shortlisted">Shortlisted</Segment.Item>
          <Segment.Item value="approved">Approved</Segment.Item>
          <Segment.Item value="pending">Pending</Segment.Item>
        </Segment>
      </div>
      <div className="mt-6">
        <ApexChart
          options={{
            chart: {
              type: "line",
              zoom: { enabled: false },
              toolbar: { show: false },
            },
            legend: { show: true, position: "bottom" },
            stroke: {
              width: category === "all" ? [2, 2, 2, 2] : 2,
              curve: "smooth",
              lineCap: "round",
            },
            tooltip: {
              shared: true,
              intersect: false,
              y: { formatter: (val) => `${val} applicants` },
            },
            labels: data.label,
            yaxis: { title: { text: "Number of Applicants" } },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "35px",
                borderRadius: 4,
              },
            },
          }}
          series={series}
          height={450}
        />
      </div>
    </Card>
  );
};

export default ApplicantPerformance;
