// import { CONCEPTS_PREFIX_PATH } from "@/constants/route.constant";
import { NAV_ITEM_TYPE_TITLE } from "@/constants/navigation.constant";
import type { NavigationTree } from "@/@types/navigation";
import settingsNavigationConfig from "./settings.navigation.config";
import userManagementNavigationConfig from "./user-management.navigation.config";
import awardManagementNavigationConfig from "./award-management.navigation.config";
import { ADMIN, SUPER_ADMIN } from "@/constants/roles.constant";

const coreNavigationConfig: NavigationTree[] = [
  {
    key: "core-management",
    path: "",
    title: "",
    translateKey: "",
    icon: "people",
    type: NAV_ITEM_TYPE_TITLE,
    authority: [SUPER_ADMIN, ADMIN],
    meta: {
      horizontalMenu: {
        layout: "columns",
        columns: 4,
      },
    },
    subMenu: [
      ...awardManagementNavigationConfig,
      ...userManagementNavigationConfig,
      ...settingsNavigationConfig,
    ],
  },
];

export default coreNavigationConfig;
