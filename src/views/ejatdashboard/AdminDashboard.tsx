import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import {
  TbFileDescription,
  TbCheck,
  TbX,
  TbUsers,
  TbAccessPointOff,
} from "react-icons/tb";
import StatisticCard from "./components/StaticCard";
import DashedLineChart from "./components/DashedLineChart";
import StatusPieChart from "./components/StatusChart";
import JudgePerformanceBarChart from "./components/JudgePerfomanceChart";
import GenderPieChart from "./components/GenderCategories";
import MediaChannelPieChart from "./components/MediaChannel";

type AdminStats = {
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  judgesActive: number;
  registeredJournalists: number;
  registeredMediaChannels: number;
  registeredRegions: number;
  registeredUsers: number;
};

const AdminDashboard = () => {
  const [data, setData] = useState<AdminStats>({
    totalApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    judgesActive: 0,
    registeredJournalists: 0,
    registeredMediaChannels: 0,
    registeredRegions: 0,
    registeredUsers: 0,
  });

  useEffect(() => {
    const dummyStats: AdminStats = {
      totalApplications: 120,
      approvedApplications: 85,
      rejectedApplications: 15,
      judgesActive: 6,
      registeredJournalists: 52,
      registeredMediaChannels: 18,
      registeredRegions: 24,
      registeredUsers: 49,
    };

    setTimeout(() => {
      setData(dummyStats);
    }, 500);
  }, []);

  return (
    <div className="space-y-8">
      {/* Statistic Cards */}
      <Card>
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-semibold">Admin Dashboard Overview</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          <StatisticCard
            title="Total Applications"
            className="bg-sky-100 dark:bg-opacity-75"
            value={data.totalApplications}
            icon={<TbFileDescription />}
          />
          <StatisticCard
            title="Approved for Judging"
            className="bg-blue-500 dark:bg-opacity-75"
            value={data.approvedApplications}
            icon={<TbCheck />}
          />
          <StatisticCard
            title="Rejected Applications"
            className="bg-blue-500 dark:bg-opacity-75"
            value={data.rejectedApplications}
            icon={<TbX />}
          />
          <StatisticCard
            title="Judges Active"
            className="bg-blue-500 dark:bg-opacity-75"
            value={data.judgesActive}
            icon={<TbUsers />}
          />
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DashedLineChart />
        <StatusPieChart />
      </div>

      <div>
        <JudgePerformanceBarChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
