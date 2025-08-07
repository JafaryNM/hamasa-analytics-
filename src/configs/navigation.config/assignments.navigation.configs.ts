import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import { ADMIN, JOURNALIST, SUPER_ADMIN } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";

const assignmentsNavigationConfig: NavigationTree[] = [
  {
    key: "Assignment",
    path: `/assignment`,
    title: "Assignments & Tasks",
    translateKey: "nav.award-management",
    icon: "products", // Must exist in your navigationIcon map
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
        key: "assigned",
        path: `/assign`,
        title: "Assigned Tasks",
        translateKey: "nav.award-management.assigned",
        icon: "products",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [JOURNALIST],
        meta: {
          description: {
            translateKey: "nav.award-management.assigned.description",
            label: "View tasks assigned to you",
          },
        },
        subMenu: [],
      },
      {
        key: "submit",
        path: `/submit`,
        title: "Submit Assignments",
        translateKey: "nav.award-management.submit",
        icon: "products",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [JOURNALIST],
        meta: {
          description: {
            translateKey: "nav.award-management.submit.description",
            label: "Upload and submit your work",
          },
        },
        subMenu: [],
      },
    ],
  },
];

export default assignmentsNavigationConfig;
