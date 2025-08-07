// import { CONCEPTS_PREFIX_PATH } from "@/constants/route.constant";
import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import { ADMIN, SUPER_ADMIN } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";
import { AWARD_MANAGEMENT_PATH } from "@/constants/route.constant";

const awardManagementNavigationConfig: NavigationTree[] = [
  {
    key: "Fellowship-management",
    path: `${AWARD_MANAGEMENT_PATH}`,
    title: "Fellowship Management",
    translateKey: "nav.award-management",
    icon: "tournament",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [SUPER_ADMIN, ADMIN],
    meta: {
      horizontalMenu: {
        layout: "columns",
        columns: 4,
      },
    },
    subMenu: [
      {
        key: "corhots",
        path: `${AWARD_MANAGEMENT_PATH}/awards`,
        title: "Cohorts",
        translateKey: "nav.award-management.awards",
        icon: "products",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.award-management.awards",
            label: "Awards",
          },
        },
        subMenu: [],
      },
    ],
  },
];

export default awardManagementNavigationConfig;
