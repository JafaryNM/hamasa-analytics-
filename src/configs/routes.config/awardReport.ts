import { ADMIN, SUPER_ADMIN } from "@/constants/roles.constant";
import { AWARD_REPORT_PATH } from "@/constants/route.constant";
import { lazy } from "react";
import type { Routes } from "@/@types/routes";

const AwardReportOverall = lazy(() => import("@/views/report/OverallReport"));

const awardReportRoute: Routes = [
  {
    key: "awardReportOverall",
    path: `${AWARD_REPORT_PATH}/overall`,
    component: AwardReportOverall,
    authority: [SUPER_ADMIN, ADMIN],
    meta: {
      pageContainerType: "contained",
    },
  },
];

export default awardReportRoute;
