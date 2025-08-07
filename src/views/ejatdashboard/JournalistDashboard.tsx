import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "@/components/ui";
import KpiSummary from "./components/ApplicantSummary";
import ApplicantPerformance from "./components/ApplicantPerfomance";
import LeadPerformance from "./components/LeadPerfomance";
import {
  APPLICATION_PREFIX_PATH,
  CONCEPTS_PREFIX_PATH,
} from "@/constants/route.constant";
import { useAuth } from "@/auth";
import journalistService from "@/services/journalistService";
import { Journalist } from "@/@types/jornalist";
import Alert from "@/components/ui/Alert";
import awardService from "@/services/awardService";
import { Award } from "@/@types/award";
import { CanceledError } from "axios";
import journalistReportService from "@/services/journalistReportService";
import Select from "@/components/ui/Select";
import GenderDistributionPie from "./components/GenderDistributionPie";
import CohortPerformance from "./components/CohortPerfomance";

const friendlyFieldNames: Record<string, string> = {
  profilePicUrl: "Profile Picture is required",
  firstName: "First Name is required",
  middleName: "Middle Name is required",
  lastName: "Last Name is required",
  birthDate: "Date of Birth is required",
  phone: "Phone Number is required",
  email: "Email Address is required",
  gender: "Gender is required",
  region: "Region is required",
  district: "District is required",
  startDate: "Start Date is required",
  endDate: "End Date is required",
  organization: "Organization is required",
  occupation: "Occupation is required",
};

const requiredFields: string[] = Object.keys(friendlyFieldNames);
const isNamedObject = (
  value: unknown
): value is { uuid: string; name: string } => {
  return (
    typeof value === "object" &&
    value !== null &&
    "uuid" in value &&
    "name" in value &&
    typeof (value as Record<string, unknown>).uuid === "string" &&
    typeof (value as Record<string, unknown>).name === "string"
  );
};

const getMissingFields = (data: Partial<Journalist>): string[] => {
  if (!data) return [];

  return requiredFields.filter((field) => {
    const value = data[field as keyof Journalist];

    if (["region", "district", "organization", "occupation"].includes(field)) {
      return !isNamedObject(value) || value.uuid === "" || value.name === "";
    }
    return value === null || value === undefined || value === "";
  });
};

const isProfileComplete = (data: Partial<Journalist>): boolean => {
  return getMissingFields(data).length === 0;
};

function JournalistDashboard() {
  const navigate = useNavigate();
  const [journalist, setJournalist] = useState<Journalist>();
  const [isLoading, setIsLoading] = useState(true);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [awardList, setAwardList] = useState<Award[]>([]);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const { user } = useAuth();
  useEffect(() => {
    const { request, cancel } = awardService.list<Award>(
      {
        page: 1,
        perPage: 100000,
      },
      "/published"
    );
    request
      .then((res) => {
        const awards = res.data.data;
        setAwardList(awards);

        if (awards.length === 0 || !user?.uuid) {
          setIsLoading(false);
          return;
        }

        // ✅ Select the first award and fetch report
        const defaultAward = awards[0];
        setSelectedAward(defaultAward);

        journalistReportService
          .show(defaultAward.uuid)
          .request.then((res) => {
            if (res.data?.success) {
              setReportData(res.data);
            }
          })
          .catch((err) => {
            console.error("Failed to fetch report:", err);
          });

        // ✅ Fetch journalist profile
        const { request: journalistReq, cancel: cancelJournalist } =
          journalistService.listByItem(user.uuid, {});
        journalistReq
          .then((res) => {
            const data = res.data.data;
            setJournalist(data);
            const missing = getMissingFields(data);
            setMissingFields(missing);
            setIsLoading(false);
          })
          .catch((err) => {
            if (err.name !== "CanceledError") {
              console.error("Error fetching data", err);
            }
            setIsLoading(false);
          });

        return () => cancelJournalist();
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.error("Error fetching award:", error);
        setIsLoading(false);
      });

    return () => cancel();
  }, [user]);

  const handleReportSubmit = () => {
    if (!selectedAward) return;

    setIsSubmitting(true);
    journalistReportService
      .show(selectedAward.uuid)
      .request.then((res) => {
        console.log(res.data);
        if (res.data?.success) {
          setReportData(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch report:", err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleApplyClick = () => {
    navigate(`${APPLICATION_PREFIX_PATH}/apply`);
  };

  const handleCompleteProfileClick = () => {
    navigate(`${CONCEPTS_PREFIX_PATH}/account/settings`);
  };

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <div className="bg-white p-4 rounded shadow">Loading...</div>
      ) : (
        <>
          {awardList.length === 0 ? (
            <Alert showIcon type="danger" title="No Awards Available">
              There are currently no published awards to apply for.
            </Alert>
          ) : !isProfileComplete(journalist ?? {}) ? (
            <Alert showIcon type="danger" className="mb-4">
              <div className="text-sm">
                <p className="font-semibold mb-1">
                  You must complete the following required fields before
                  applying:
                </p>
                <ul className="list-disc list-inside text-red-700">
                  {missingFields.map((field) => (
                    <li key={field}>{friendlyFieldNames[field] || field}</li>
                  ))}
                </ul>
                <div className="mt-3">
                  <Button variant="solid" onClick={handleCompleteProfileClick}>
                    Complete Profile
                  </Button>
                </div>
              </div>
            </Alert>
          ) : (
            <Card className="p-4">
              <div className="flex items-center justify-between w-full">
                <h4 className="text-lg font-semibold">
                  <span className="text-blue-500 font-bold text-xl">
                    {user.firstName}
                  </span>
                  &nbsp; You're ready to apply,{" "}
                </h4>
                <Button
                  variant="solid"
                  onClick={handleApplyClick}
                  className="ml-4 whitespace-nowrap"
                >
                  Apply For Fellowship
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">
                {`Select Cohorts' Year to See Your Report!`}
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
                  {isSubmitting ? "Searching..." : "Filter"}
                </Button>
              </div>
            </div>
          </Card>

          {reportData && (
            <KpiSummary
              data={{
                totalApplicants: {
                  value: parseInt(reportData.allApplications),
                  growShrink: 0,
                },
                approved: {
                  value: parseInt(reportData.approvedApplications),
                  growShrink: 0,
                },
                rejected: {
                  value: parseInt(reportData.rejectedApplications),
                  growShrink: 0,
                },
              }}
            />
          )}

          <div className="grid grid-cols-1 xl:grid-cols-1 gap-y-4 xl:gap-x-4">
            {/* <Card>
              <div className="col-span-1 xl:col-span-2">
                <div className="flex items-center justify-between">
                  <h4>Gender Application Distribution</h4>
                </div>
                {reportData?.allApplicantByGender && (
                  <GenderDistributionPie
                    male={parseInt(
                      reportData.allApplicantByGender.find(
                        (g: any) => g.gender === "Male"
                      )?.count || "0"
                    )}
                    female={parseInt(
                      reportData.allApplicantByGender.find(
                        (g: any) => g.gender === "Female"
                      )?.count || "0"
                    )}
                  />
                )}
              </div>
            </Card> */}
            {/* 
            {reportData?.applicationsByCategory && (
              <div className="col-span-1">
                <LeadPerformance
                  data={{
                    categories: reportData.applicationsByCategory.map(
                      (item) => item.name
                    ),
                    counts: reportData.applicationsByCategory.map((item) =>
                      parseInt(item.count)
                    ),
                  }}
                />
              </div>
            )} */}

            <div className="col-span-1">
              <Card>
                <CohortPerformance
                  data={{
                    cohort: ["2025", "2024", "2023"],
                    pending: [45, 30, 39], // dummy value
                    selected: [30, 30, 38], // dummy value
                    rejected: [25, 8, 8], // dummy value
                  }}
                />
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default JournalistDashboard;
