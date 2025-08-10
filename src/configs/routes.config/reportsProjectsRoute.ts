import { ADMIN, SUPER_ADMIN } from "@/constants/roles.constant";
import { AWARD_REPORT_PATH } from "@/constants/route.constant";
import { lazy } from "react";
import type { Routes } from "@/@types/routes";
import ReportProject from "@/views/projects/ReportProject";

const reportsProjectOverall = lazy(
  () => import("@/views/projects/ReportProject")
);
const reportDetails = lazy(
  () => import("@/views/projects/reports/DetailReport")
);

const reportProjects: Routes = [
  {
    key: "reportOverall",
    path: `${AWARD_REPORT_PATH}/`,
    component: reportsProjectOverall,
    authority: [],
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "report.details",
    path: `${AWARD_REPORT_PATH}/details/:uuid`, // <-- dynamic segment
    component: reportDetails,
    authority: [],
  },
];

export default reportProjects;
