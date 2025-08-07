import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "@/components/ui";
import Select from "@/components/ui/Select";
import LeadPerformance from "./components/LeadPerfomance";
import MediaChannelChart from "./components/MediaChannelChart";
import { Award } from "@/@types/award";
import { useAuth } from "@/auth";
import awardService from "@/services/awardService";
import Alert from "@/components/ui/Alert";
import { TbUsers, TbChecklist, TbRepeat, TbBrandDocker } from "react-icons/tb";
import { CanceledError } from "axios";
import StatisticCard from "./components/StaticCard";
import JudgeCategoryChart from "./components/JudgeCategoriesChart";
import JudgeMediaChannelChart from "./components/JudgeMediaChannel";

function JudgeDashboard() {
  const { user } = useAuth();
  const [awardList, setAwardList] = useState<Award[]>([]);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const { request, cancel } = awardService.list<Award>(
      { page: 1, perPage: 1000 },
      "/published"
    );

    request
      .then((res) => {
        const awards = res.data.data;
        setAwardList(awards);
        if (awards.length > 0) {
          const defaultAward = awards[0];
          setSelectedAward(defaultAward);
          fetchJudgeReport(defaultAward.uuid);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (!(err instanceof CanceledError)) {
          console.error("Failed to fetch awards:", err);
        }
        setIsLoading(false);
      });

    return () => cancel();
  }, []);

  const fetchJudgeReport = (awardUuid: string) => {
    setIsSubmitting(true);

    // ✅ Dummy data structure
    setTimeout(() => {
      const dummyReport = {
        allApplications: 5,
        reviewedApplications: 2,
        roundsCount: 1,
        applicationsByCategory: [
          { category: "Print Journalism", count: 2 },
          { category: "Radio Journalism", count: 1 },
          { category: "Online Journalism", count: 2 },
        ],
        applicationsByMediaChannel: [
          { name: "ITV", count: 3 },
          { name: "Star TV", count: 1 },
          { name: "Azam Media", count: 1 },
        ],
      };

      setReportData(dummyReport);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleAwardChange = (option: any) => {
    const found = awardList.find((a) => a.uuid === option?.value);
    if (found) {
      setSelectedAward(found);
    }
  };

  console.log(user.uuid);

  const handleReportSubmit = () => {
    if (selectedAward) {
      fetchJudgeReport(selectedAward.uuid);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <div className="bg-white p-4 rounded shadow">Loading...</div>
      ) : awardList.length === 0 ? (
        <Alert showIcon type="danger" title="No Awards Available">
          There are currently no published awards for judging.
        </Alert>
      ) : (
        <>
          {/* Award Selector */}
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">
                <span className="text-blue-500">{user.firstName}, </span>
                Select an Award to View Key Metrics`
              </h4>
              <div className="flex gap-4 items-center">
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
                    onChange={handleAwardChange}
                  />
                </div>
                <Button
                  variant="solid"
                  disabled={!selectedAward || isSubmitting}
                  onClick={handleReportSubmit}
                >
                  {isSubmitting ? "Fetching..." : "View Report"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Statistics Summary Cards */}
          {reportData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatisticCard
                title="Total Applications"
                value={reportData.allApplications || 0}
                icon={<TbBrandDocker />}
                className="bg-purple-300"
              />
              <StatisticCard
                title="Reviewed Applications"
                value={reportData.reviewedApplications || 0}
                icon={<TbChecklist />}
                className="bg-green-300"
              />
              <StatisticCard
                title="Rounds Present"
                value={reportData.roundsCount || 0}
                icon={<TbRepeat />}
                className="bg-pink-300"
              />
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-4">
            {reportData?.applicationsByCategory && (
              <JudgeCategoryChart
                data={{
                  categories: reportData.applicationsByCategory.map(
                    (item: any) => item.category
                  ),
                  counts: reportData.applicationsByCategory.map((item: any) =>
                    parseInt(item.count)
                  ),
                }}
              />
            )}

            {reportData?.applicationsByMediaChannel && (
              <Card>
                <h4 className="mb-4 font-semibold">
                  Applications Assessed by Media Type
                </h4>
                <JudgeMediaChannelChart
                  data={{
                    labels: reportData.applicationsByMediaChannel.map(
                      (item: any) => item.name
                    ),
                    counts: reportData.applicationsByMediaChannel.map(
                      (item: any) => parseInt(item.count)
                    ),
                  }}
                />
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default JudgeDashboard;
