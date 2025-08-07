import dashboardsNavigationConfig from "./dashboards.navigation.config";
import uiComponentNavigationConfig from "./ui-components.navigation.config";
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
import assignmentsNavigationConfig from "./assignments.navigation.configs";
import progressNavigationConfig from "./progress.navigation.config";
import learningNavigationConfig from "./learning.navigation.config";
//import applicationNavigationConfig from "./applications.navigation.config";

const navigationConfig: NavigationTree[] = [
  ...dashboardsNavigationConfig,
  ...judgeManagementNavigationConfig,
  ...applicationNavConfig,
  ...adminNavigationConfig,

  ...awardReportNavigationConfig,
  ...judgeReviewNavigationConfig,
  ...mentorshipNavigationConfig,
  ...assignmentsNavigationConfig,
  ...progressNavigationConfig,
  ...learningNavigationConfig,
  ...conceptsNavigationConfig,
];

export default navigationConfig;
