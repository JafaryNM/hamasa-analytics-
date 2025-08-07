// import { CONCEPTS_PREFIX_PATH } from "@/constants/route.constant";
import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import { ADMIN, SUPER_ADMIN } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";
import { USER_MANAGEMENT_PATH } from "@/constants/route.constant";

const userManagementNavigationConfig: NavigationTree[] = [
  {
    key: "user-management",
    path: "",
    title: "User Management",
    translateKey: "nav.user-management",
    icon: "people",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [SUPER_ADMIN],
    meta: {
      horizontalMenu: {
        layout: "columns",
        columns: 4,
      },
    },
    subMenu: [
      {
        key: "admins",
        path: `${USER_MANAGEMENT_PATH}/admins`,
        title: "Admins",
        translateKey: "nav.user-management.Admins",
        icon: "admins",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.user-management.Admins",
            label: "Admins",
          },
        },
        subMenu: [],
      },
      {
        key: "judges",
        path: `${USER_MANAGEMENT_PATH}/judges`,
        title: "Judges",
        translateKey: "nav.user-management.Judges",
        icon: "judges",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.user-management.Judges",
            label: "Judges",
          },
        },
        subMenu: [],
      },
      {
        key: "journalist",
        path: `${USER_MANAGEMENT_PATH}/journalist`,
        title: "Journalists",
        translateKey: "nav.user-management.Journalists",
        icon: "journalists",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.user-management.Journalists",
            label: "Journalists",
          },
        },
        subMenu: [],
      },
    ],
  },
];

export default userManagementNavigationConfig;
