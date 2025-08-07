import {
  CONCEPTS_PREFIX_PATH,
  DASHBOARDS_PREFIX_PATH,
} from "@/constants/route.constant";
import {
  NAV_ITEM_TYPE_TITLE,
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import { ADMIN, USER } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";

const conceptsNavigationConfig: NavigationTree[] = [
  {
    key: "account",
    path: "",
    title: "",
    translateKey: "",
    icon: "",
    type: NAV_ITEM_TYPE_TITLE,
    authority: [],
    meta: {
      horizontalMenu: {
        layout: "columns",
        columns: 4,
      },
    },
    subMenu: [
      {
        key: "account",
        path: "",
        title: "Account",
        translateKey: "nav.conceptsAccount.account",
        icon: "account",
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        meta: {
          description: {
            translateKey: "nav.conceptsAccount.accountDesc",
            label: "Account settings and info",
          },
        },
        subMenu: [
          {
            key: "concepts.account.settings",
            path: `${CONCEPTS_PREFIX_PATH}/account/settings`,
            title: "Settings",
            translateKey: "nav.conceptsAccount.settings",
            icon: "accountSettings",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            meta: {
              description: {
                translateKey: "nav.conceptsAccount.settingsDesc",
                label: "Configure your settings",
              },
            },
            subMenu: [],
          },
        ],
      },
    ],
  },
];

export default conceptsNavigationConfig;
