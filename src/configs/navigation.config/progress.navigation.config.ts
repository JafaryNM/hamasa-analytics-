import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import { ADMIN, JOURNALIST, SUPER_ADMIN } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";

const progressNavigationConfig: NavigationTree[] = [
  {
    key: "Progress",
    path: `/progress`,
    title: "Progress & Evaluations",
    translateKey: "nav.award-management",
    icon: "projects", // Must exist in your navigationIcon map
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [JOURNALIST],
    meta: {
      horizontalMenu: {
        layout: "columns",
        columns: 4,
      },
    },
    subMenu: [
      {
        key: "self",
        path: `/self-assesment`,
        title: "Self-assessment reports",
        translateKey: "nav.award-management.assigned",
        icon: "products",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [JOURNALIST],
        meta: {
          description: {
            translateKey: "nav.award-management.assigned.description",
            label: "View self report",
          },
        },
        subMenu: [],
      },
      {
        key: "Evaluation",
        path: `/evalution`,
        title: "Mentor evaluations",
        translateKey: "nav.award-management.submit",
        icon: "products",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [JOURNALIST],
        meta: {
          description: {
            translateKey: "nav.award-management.submit.description",
            label: "Monitor & Evaluation",
          },
        },
        subMenu: [],
      },
    ],
  },
];

export default progressNavigationConfig;
