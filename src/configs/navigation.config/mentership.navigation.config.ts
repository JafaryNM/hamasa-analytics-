import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
  NAV_ITEM_TYPE_TITLE,
} from "@/constants/navigation.constant";
import { ADMIN, JOURNALIST, SUPER_ADMIN } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";
import { AWARD_REPORT_PATH } from "@/constants/route.constant";

const mentorshipNavigationConfig: NavigationTree[] = [
  {
    key: "Mentorship",
    path: "",
    title: "",
    translateKey: "",
    icon: "guide",
    type: NAV_ITEM_TYPE_TITLE,
    authority: [JOURNALIST],
    subMenu: [
      {
        key: "guide.documentation",
        path: `/mentorship`,
        title: "Mentorship Sessions",
        translateKey: "nav.aplication.documentation",
        icon: "customerList",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [JOURNALIST, ADMIN],

        subMenu: [],
      },
    ],
  },
];

export default mentorshipNavigationConfig;
