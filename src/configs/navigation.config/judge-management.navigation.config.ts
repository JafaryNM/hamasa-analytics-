import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import { JUDGE } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";
import { JUDGE_MANAGEMENT_PATH } from "@/constants/route.constant";

const judgeManagementNavigationConfig: NavigationTree[] = [
  {
    key: "judge-management",
    path: "",
    title: "Judge Management",
    translateKey: "nav.judge-management",
    icon: "judge",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [JUDGE],
    meta: {
      horizontalMenu: {
        layout: "columns",
        columns: 4,
      },
    },
    subMenu: [
      {
        key: "judge-awards",
        path: `${JUDGE_MANAGEMENT_PATH}/awards`,
        title: "Awards",
        translateKey: "nav.judge-management.applications",
        icon: "document",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [JUDGE],
        meta: {
          description: {
            translateKey: "nav.judge-management.applications",
            label: "Applications",
          },
        },
        subMenu: [],
      },
    ],
  },
];

export default judgeManagementNavigationConfig;
