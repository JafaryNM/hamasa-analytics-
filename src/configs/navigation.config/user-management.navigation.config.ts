// import { CONCEPTS_PREFIX_PATH } from "@/constants/route.constant";
import {
  NAV_ITEM_TYPE_TITLE,
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import { ADMIN, SUPER_ADMIN, USER } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";
import { USER_MANAGEMENT_PATH } from "@/constants/route.constant";

const userManagementNavigationConfig: NavigationTree[] = [
  {
    key: "user-management",
    path: "",
    title: "User Management",
    translateKey: "nav.user-anagement",
    icon: "customers",
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
        translateKey: "nav.settingsManagement.Admins",
        icon: "admins",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.settingsManagement.Admins",
            label: "Admins",
          },
        },
        subMenu: [],
      },
      {
        key: "judges",
        path: `${USER_MANAGEMENT_PATH}/judges`,
        title: "Judges",
        translateKey: "nav.settingsManagement.Judges",
        icon: "judges",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.settingsManagement.Judges",
            label: "Judges",
          },
        },
        subMenu: [],
      },
      {
        key: "journalist",
        path: `${USER_MANAGEMENT_PATH}/journalist`,
        title: "Journalists",
        translateKey: "nav.settingsManagement.Journalists",
        icon: "journalists",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.settingsManagement.Journalists",
            label: "Journalists",
          },
        },
        subMenu: [],
      },
    ],
  },
];

export default userManagementNavigationConfig;
