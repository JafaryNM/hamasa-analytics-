import { lazy } from "react";
import { CONCEPTS_PREFIX_PATH } from "@/constants/route.constant";
import {} from "@/constants/roles.constant";
import type { Routes } from "@/@types/routes";

const mainSetting = lazy(() => import("@/views/accounts/Account"));
const updatePassword = lazy(
  () => import("@/views/accounts/components/SettingsSecurity")
);

// const journalistSetting = lazy(() => import("@/views/accounts/"));

// const adminSetting = lazy(() => import("@/views/accounts/Settings"));

// const judgeSetting = lazy(() => import("@/views/accounts/Settings"));

const conceptsRoute: Routes = [
  {
    key: "concepts.account.settings",
    path: `${CONCEPTS_PREFIX_PATH}/account/settings`,
    component: mainSetting,
    authority: [],
    meta: {
      header: {
        title: "Settings",
      },
      pageContainerType: "contained",
    },
  },

  {
    key: "concepts.account.updatePassword",
    path: `${CONCEPTS_PREFIX_PATH}/account/update-password`,
    component: updatePassword,
    authority: [],
    meta: {
      header: {
        title: "Update Password",
      },
      pageContainerType: "contained",
    },
  },
];

export default conceptsRoute;
