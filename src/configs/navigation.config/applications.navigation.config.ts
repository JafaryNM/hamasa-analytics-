import { APPLICATION_PREFIX_PATH } from "@/constants/route.constant";
import {
  NAV_ITEM_TYPE_TITLE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import { ADMIN, JOURNALIST, USER } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";
import JournalistAccount from "@/views/accounts/JournalistAccount";

const applicationNavigationConfig: NavigationTree[] = [
  {
    key: "Application",
    path: "",
    title: "Applications",
    translateKey: "",
    icon: "guide",
    type: NAV_ITEM_TYPE_TITLE,
    authority: [JOURNALIST],
    subMenu: [
      {
        key: "guide.documentation",
        path: `${APPLICATION_PREFIX_PATH}/all`,
        title: "Applications",
        translateKey: "nav.aplication.documentation",
        icon: "documentation",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [JOURNALIST, ADMIN],

        subMenu: [],
      },
    ],
  },
];

export default applicationNavigationConfig;
