import dashboardsRoute from "./dashboardsRoute";
import conceptsRoute from "./conceptsRoute";
import authRoute from "./authRoute";
import type { Routes } from "@/@types/routes";
import settingsRoute from "./settingsRoute";
import userManagementRoute from "./userManamentRoute";
import applicationRoute from "./applicationRoute";
import awardManagementRoute from "./awardManagementRoute";
import judgeManagementRoute from "./judgeManagementRoute";
import awardReportRoute from "./awardReport";
import judgeReviewRoute from "./judgeReviewRoute";
import projectsRoute from "./projectsRoute";
import reportProjects from "./reportsProjectsRoute";
import requestRoute from "./requestRoute";

export const publicRoutes: Routes = [...authRoute];

export const protectedRoutes: Routes = [
  ...dashboardsRoute,
  ...applicationRoute,
  ...conceptsRoute,
  ...judgeManagementRoute,
  ...awardManagementRoute,
  ...userManagementRoute,
  ...awardReportRoute,
  ...judgeReviewRoute,
  ...settingsRoute,
  ...projectsRoute,
  ...reportProjects,
  ...requestRoute,
];
