import { DASHBOARDS_PREFIX_PATH } from "@/constants/route.constant";
import { NAV_ITEM_TYPE_ITEM } from "@/constants/navigation.constant";
import { ADMIN, JOURNALIST, USER } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";

const dashboardsNavigationConfig: NavigationTree[] = [
  {
    key: "dashboard.user",
    path: `${DASHBOARDS_PREFIX_PATH}`,
    title: "Dashboard",
    translateKey: "nav.dashboard.applicants",
    icon: "dashboard",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
  // {
  //   key: "dashboard.judge",
  //   path: `${DASHBOARDS_PREFIX_PATH}/judge`,
  //   title: "Judge Dashboard",
  //   translateKey: "nav.dashboard.judge",
  //   icon: "dashboard",
  //   type: NAV_ITEM_TYPE_ITEM,
  //   authority: [],
  //   subMenu: [],
  // },
  // {
  //   key: "dashboard.application",
  //   path: `${DASHBOARDS_PREFIX_PATH}/admin-application`,
  //   title: "Admin Dashboard Application",
  //   translateKey: "nav.dashboard.admin",
  //   icon: "dashboard",
  //   type: NAV_ITEM_TYPE_ITEM,
  //   authority: [],
  //   subMenu: [],
  // },
  // {
  //   key: "dashboard.admin",
  //   path: `${DASHBOARDS_PREFIX_PATH}/admin`,
  //   title: "Admin Dashboard",
  //   translateKey: "nav.dashboard.admin",
  //   icon: "dashboard",
  //   type: NAV_ITEM_TYPE_ITEM,
  //   authority: [],
  //   subMenu: [],
  // },
];

export default dashboardsNavigationConfig;
