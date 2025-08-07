import { lazy } from "react";
import { USER_MANAGEMENT_PATH } from "@/constants/route.constant";
// import { ADMIN, SUPER_ADMIN, JUDGE, JOURNALIST } from '@/constants/roles.constant'
import type { Routes } from "@/@types/routes";
import { ADMIN, SUPER_ADMIN } from "@/constants/roles.constant";

// Lazy load dashboard components
const Admins = lazy(() => import("@/views/user-management/Admins"));
const AdminDetails = lazy(() => import("@/views/user-management/AdminDetails"));
const Judges = lazy(() => import("@/views/user-management/Judges"));
const JudgeDetails = lazy(() => import("@/views/user-management/JudgeDetails"));
const Journalists = lazy(() => import("@/views/user-management/Journalists"));
const JournalistDetails = lazy(
  () => import("@/views/user-management/JournalistDetails")
);

const userManagementRoute: Routes = [
  {
    key: "admins",
    path: `${USER_MANAGEMENT_PATH}/admins`,
    component: Admins,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "admin-details",
    path: `${USER_MANAGEMENT_PATH}/admins/details/:uuid`,
    component: AdminDetails,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "judges",
    path: `${USER_MANAGEMENT_PATH}/judges`,
    component: Judges,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "judge-details",
    path: `${USER_MANAGEMENT_PATH}/judges/details/:uuid`,
    component: JudgeDetails,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "journalist",
    path: `${USER_MANAGEMENT_PATH}/journalist`,
    component: Journalists,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "journalist-details",
    path: `${USER_MANAGEMENT_PATH}/journalists/details/:uuid`,
    component: JournalistDetails,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
];

export default userManagementRoute;
