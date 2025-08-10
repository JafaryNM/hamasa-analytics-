import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import { ADMIN, SUPER_ADMIN } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";
import { SETTINGS_PATH } from "@/constants/route.constant";

const settingsNavigationConfig: NavigationTree[] = [
  {
    key: "settings-management",
    path: "",
    title: "Settings",
    translateKey: "nav.settings",
    icon: "accountSettings",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [],
    meta: {
      horizontalMenu: {
        layout: "columns",
        columns: 4,
      },
    },
    subMenu: [
      {
        key: "colaborates",
        path: `${SETTINGS_PATH}/categories`,
        title: "Collaborators",
        translateKey: "nav.settings-anagement.categories",
        icon: "user",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        meta: {
          description: {
            translateKey: "nav.settings-anagement.Categories",
            label: "Categories",
          },
        },
        subMenu: [],
      },
      {
        key: "Help",
        path: `${SETTINGS_PATH}/criterias`,
        title: "Help",
        translateKey: "nav.settings-anagement.criterias",
        icon: "criterias",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        meta: {
          description: {
            translateKey: "nav.settings-anagement.Criterias",
            label: "Criterias",
          },
        },
        subMenu: [],
      },
      {
        key: "Profile",
        path: `${SETTINGS_PATH}/expertises`,
        title: "Profile",
        translateKey: "nav.settings-anagement.Expertises",
        icon: "expertises",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        meta: {
          description: {
            translateKey: "nav.settings-anagement.Expertises",
            label: "Expertises",
          },
        },
        subMenu: [],
      },
      {
        key: "education-levels",
        path: `${SETTINGS_PATH}/education-levels`,
        title: "Education Levels",
        translateKey: "nav.settings-anagement.EducationLevels",
        icon: "educationLevels",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.settings-anagement.EducationLevels",
            label: "Education Levels",
          },
        },
        subMenu: [],
      },
      {
        key: "media-channels",
        path: `${SETTINGS_PATH}/media-channels`,
        title: "Media Type",
        translateKey: "nav.settings-anagement.MediaChannels",
        icon: "mediaChannels",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.settings-anagement.MediaChannels",
            label: "Media Type",
          },
        },
        subMenu: [],
      },
      {
        key: "organizations",
        path: `${SETTINGS_PATH}/organizations`,
        title: "Media Outlet",
        translateKey: "nav.settings-anagement.Organizations",
        icon: "organizations",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.settings-anagement.Organizations",
            label: "Media Outlet",
          },
        },
        subMenu: [],
      },
      {
        key: "occupations",
        path: `${SETTINGS_PATH}/occupations`,
        title: "Occupations",
        translateKey: "nav.settings-anagement.Occupations",
        icon: "occupations",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.settings-anagement.Occupations",
            label: "Occupations",
          },
        },
        subMenu: [],
      },
      {
        key: "regions",
        path: `${SETTINGS_PATH}/regions`,
        title: "Regions",
        translateKey: "nav.settings-anagement.Regions",
        icon: "regions",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.settings-anagement.Regions",
            label: "Regions",
          },
        },
        subMenu: [],
      },
      {
        key: "districts",
        path: `${SETTINGS_PATH}/districts`,
        title: "Districts",
        translateKey: "nav.settings-anagement.Districts",
        icon: "districts",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPER_ADMIN, ADMIN],
        meta: {
          description: {
            translateKey: "nav.settings-anagement.Districts",
            label: "Districts",
          },
        },
        subMenu: [],
      },
    ],
  },
];

export default settingsNavigationConfig;
