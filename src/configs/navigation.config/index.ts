import dashboardsNavigationConfig from "./dashboards.navigation.config";
import conceptsNavigationConfig from "./concepts.navigation.config";
import authNavigationConfig from "./auth.navigation.config";
import adminNavigationConfig from "./admin.navigation.config";
import type { NavigationTree } from "@/@types/navigation";
import applicationNavConfig from "./applications.navigation.config";
import settingsNavigationConfig from "./settings.navigation.config";
import userManagementNavigationConfig from "./user-management.navigation.config";
import judgeManagementNavigationConfig from "./judge-management.navigation.config";
import awardReportNavigationConfig from "./award-report.naviigation.config";
import judgeReviewNavigationConfig from "./judge-review-report.config";
import mentorshipNavigationConfig from "./mentership.navigation.config";
import assignmentsNavigationConfig from "./projects.navigation.config";
import progressNavigationConfig from "./progress.navigation.config";
import learningNavigationConfig from "./learning.navigation.config";
import projectsNavigationConfig from "./projects.navigation.config";
import projectsReportNavigationConfig from "./project-report.navigation.config";
import requestNavigationConfig from "./request.navigation.config";
//import applicationNavigationConfig from "./applications.navigation.config";

const navigationConfig: NavigationTree[] = [
  ...dashboardsNavigationConfig,
  ...projectsNavigationConfig,
  ...projectsReportNavigationConfig,
  ...requestNavigationConfig,
  ...settingsNavigationConfig,
];

export default navigationConfig;
