import React, { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import Select from "@/components/ui/Select";
import awardService from "@/services/awardService";
import { Award } from "@/@types/award";
import { CanceledError } from "axios";
import GenderChart from "./components/GenderChart";
import ApplicationsByRegionChart from "./components/ApplicationsByRegions";
import ApplicationsByCategoryChart from "./components/ApplicationsByCategoryChart";
import SingleVsGroupApplicantsChart from "./components/SingeVsGroupApplications";
import EducationLevelSummaryChart from "./components/EducationLevelSummary";
import ApplicationsByMediaTypeChart from "./components/ApplicationByMediaChart";
import ApplicationsByMediaHouseChart from "./components/ApplicationByMediaHouseChart";
import AverageAgeDistributionChart from "./components/AvarageAgeDistributionChart";
import TopApplicantsTable from "./components/TotalApplicantTable";
import StatisticCard from "../ejatdashboard/components/StaticCard";
import { TbCheck, TbFileDescription, TbUser, TbX } from "react-icons/tb";

function OverallReport() {
  const [awardList, setAwardList] = useState<Award[]>([]);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { request, cancel } = awardService.list<Award>(
      { page: 1, perPage: 100000 },
      "/published"
    );

    request
      .then((res) => {
        setAwardList(res.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!(error instanceof CanceledError)) {
          console.error("Error fetching awards", error);
          setIsLoading(false);
        }
      });

    return () => cancel();
  }, []);

  const handleReportSubmit = () => {
    if (!selectedAward) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setReportData({
        totalApplicants: 800,
        approvedApplications: 550,
        rejectedApplications: 250,
        regionApplications: [
          { region: "Dar es Salaam", applications: 400 },
          { region: "Arusha", applications: 250 },
          { region: "Mwanza", applications: 200 },
          { region: "Dodoma", applications: 150 },
        ],
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      {isLoading ? (
        <div className="bg-white p-4 rounded shadow">Loading...</div>
      ) : (
        <>
          <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h4 className="text-lg font-semibold">
              Select Award to View Report
            </h4>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-64">
                <Select
                  placeholder="Select Award"
                  options={awardList.map((award) => ({
                    value: award.uuid,
                    label: award.title,
                  }))}
                  value={
                    selectedAward
                      ? {
                          value: selectedAward.uuid,
                          label: selectedAward.title,
                        }
                      : null
                  }
                  onChange={(option) => {
                    const found = awardList.find(
                      (a) => a.uuid === option?.value
                    );
                    setSelectedAward(found || null);
                  }}
                />
              </div>
              <Button
                variant="solid"
                disabled={!selectedAward || isSubmitting}
                onClick={handleReportSubmit}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>

          {reportData && (
            <div className="flex flex-col gap-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatisticCard
                  title="Total Applicantion"
                  className="bg-blue-500 dark:bg-opacity-75"
                  value={reportData.totalApplicants}
                  icon={<TbUser />}
                />
                <StatisticCard
                  title="Total Applicants"
                  className="bg-blue-500 dark:bg-opacity-75"
                  value={reportData.totalApplicants}
                  icon={<TbFileDescription />}
                />
                <StatisticCard
                  title="Approved Applications"
                  className="bg-blue-500 dark:bg-opacity-75"
                  value={reportData.approvedApplications}
                  icon={<TbCheck />}
                />
                <StatisticCard
                  title="Rejected Applications"
                  className="bg-blue-500 dark:bg-opacity-75"
                  value={reportData.rejectedApplications}
                  icon={<TbX />}
                />
              </div>

              {/* Charts */}
              <Card className="p-4">
                <GenderChart />
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Card className="p-4">
                  <ApplicationsByRegionChart />
                </Card>
                <Card className="p-4">
                  <ApplicationsByCategoryChart />
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Card className="p-4">
                  <SingleVsGroupApplicantsChart />
                </Card>
                <Card className="p-4">
                  <EducationLevelSummaryChart />
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Card className="p-4">
                  <ApplicationsByMediaTypeChart />
                </Card>
                <Card className="p-4">
                  <ApplicationsByMediaHouseChart />
                </Card>
              </div>

              <Card className="p-4">
                <AverageAgeDistributionChart />
              </Card>

              <Card className="p-4">
                <TopApplicantsTable />
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OverallReport;
