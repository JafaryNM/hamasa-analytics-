export type GenderCount = {
  gender: string;
  count: string;
};

export type MonthlyCount = {
  year: string;
  month: string;
  month_number: string;
  count: string;
};

export type AdminReportData = {
  allUsers: string;
  allAdmins: string;
  allJournalists: string;
  allJournalistsByGender: GenderCount[];
  allJudges: string;
  allJudgesByGender: GenderCount[];
  allRegions: string;
  allDistricts: string;
  allMediaChannels: string;
  monthlyJournalistCount: MonthlyCount[];
  success: boolean;
};
