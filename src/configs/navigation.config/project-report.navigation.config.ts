import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import { ADMIN, JOURNALIST, SUPER_ADMIN } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";
import {
  AWARD_REPORT_PATH,
  PROJECTS_PREFIX_PATH,
  REVIEW_REPORT_PATH,
} from "@/constants/route.constant";

const projectsReportNavigationConfig: NavigationTree[] = [
  {
    key: "ProjectsReport",
    path: `${AWARD_REPORT_PATH}`,
    title: "Report",
    translateKey: "nav.report.projects",
    icon: "graph",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
];

export default projectsReportNavigationConfig;
