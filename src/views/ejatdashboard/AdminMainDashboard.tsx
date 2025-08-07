import React from "react";
import {
  TbUsers,
  TbFileAi,
  TbLocation,
  TbBuilding,
  TbPointer,
} from "react-icons/tb";
import { Card } from "@/components/ui";
import StatisticCard from "./components/StaticCard";
import GenderPieChart from "./components/GenderCategories";
import JournalistTrendChart from "./components/JournalistTrendChart";
import useAdminReports from "@/hooks/useAdminReports";
import { GiPositionMarker } from "react-icons/gi";
import ApplicationByGenderChart from "./components/ApplicationGender";

const AdminMainDashboard = () => {
  const { data, isLoading } = useAdminReports();
  console.log(data);

  const stats = {
    totalJournalists: Number(data?.allJournalists || 0),
    totalUsers: Number(data?.allUsers || 0),
    totalMediaChannel: Number(data?.allMediaChannels || 0),
    totalRegions: Number(data?.allRegions || 0),
    totalJudges: Number(data?.allJudges || 0),
    totalDistricts: Number(data?.allDistricts || 0),
  };

  return (
    <div className="space-y-10 px-4 pb-10 md:px-6 xl:px-8">
      {/* System Summary Cards */}
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <h4 className="text-xl font-bold text-gray-800">
            System Overview & Key Metrics
          </h4>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-4 gap-5">
            <StatisticCard
              title="Journalists"
              className="bg-blue-500"
              value={stats.totalJournalists}
              icon={<TbUsers />}
            />
            <StatisticCard
              title="System Users"
              className="bg-blue-500"
              value={stats.totalUsers}
              icon={<TbUsers />}
            />
            <StatisticCard
              title="Media Outlets"
              className="bg-blue-500"
              value={stats.totalMediaChannel}
              icon={<TbBuilding />}
            />
            <StatisticCard
              title=" Regions"
              className="bg-blue-500"
              value={stats.totalRegions}
              icon={<GiPositionMarker />}
            />
            <StatisticCard
              title="Judges"
              className="bg-blue-500"
              value={stats.totalJudges}
              icon={<TbUsers />}
            />
            <StatisticCard
              title="Districts"
              className="bg-blue-500"
              value={stats.totalDistricts}
              icon={<TbBuilding />}
            />
          </div>
        )}
      </Card>

      {/* Chart Section */}
      {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card className="min-h-[300px]">
          <h4 className="text-xl font-bold text-gray-800">
            Gender Distribution Among Users
          </h4>
          <GenderPieChart data={data?.allJournalistsByGender ?? []} />
        </Card>
      </div> */}

      {/* Line Chart */}
      <Card className="min-h-[300px]">
        <h4 className="text-xl font-bold text-gray-800">
          Monthly Award Applications Comparison (Year-over-Year)
        </h4>
        {/* <JournalistTrendChart data={data?.monthlyJournalistCount ?? []} /> */}

        <ApplicationByGenderChart
          data={{
            years: ["2022", "2023", "2024"],
            male: [120, 150, 180],
            female: [100, 140, 160],
          }}
        />
      </Card>
    </div>
  );
};

export default AdminMainDashboard;
