import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import { ADMIN, SUPER_ADMIN } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";
import { AWARD_REPORT_PATH } from "@/constants/route.constant";

const awardReportNavigationConfig: NavigationTree[] = [
  {
    key: "cohort-report",
    path: ``,
    title: "Cohort Report",
    translateKey: "nav.awardReport.title",
    icon: "graph",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [SUPER_ADMIN, ADMIN],
    meta: {
      horizontalMenu: {
        layout: "columns",
        columns: 3,
      },
    },
    subMenu: [
      {
        key: "overall-reports",
        path: `${AWARD_REPORT_PATH}/overall`,
        title: "Overall Reports",
        translateKey: "nav.awardReport.overall",
        icon: "chartLineUp",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.awardReport.overallDescription",
            label: "View overall award reports",
          },
        },
        subMenu: [],
      },
    ],
  },
];

export default awardReportNavigationConfig;
