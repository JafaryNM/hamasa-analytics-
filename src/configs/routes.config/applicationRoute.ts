import { lazy } from "react";
import { APPLICATION_PREFIX_PATH } from "@/constants/route.constant";
// import { ADMIN, SUPER_ADMIN, JUDGE, JOURNALIST } from '@/constants/roles.constant'
import type { Routes } from "@/@types/routes";
import { JOURNALIST } from "@/constants/roles.constant";

// Lazy load dashboard components
const ApplicationForm = lazy(
  () => import("@/views/applications/ApplicationForm")
);
const ApplicationFormRegistration = lazy(
  () => import("@/views/applications/ApplicationForm")
);
const ApplicationList = lazy(() => import("@/views/applications/Application"));
const ApplicationDetail = lazy(
  () => import("@/views/applications/applicationDetail")
);
const applicationRoute: Routes = [
  {
    key: "apply",
    path: `${APPLICATION_PREFIX_PATH}/apply`,
    component: ApplicationForm,
    authority: [JOURNALIST], // Only jornalist can access
    meta: {
      pageContainerType: "contained",
    },
  },

  {
    key: "resumeApplication",
    path: `${APPLICATION_PREFIX_PATH}/apply/:uuid`,
    component: ApplicationForm,
    authority: [JOURNALIST],
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "applyAll",
    path: `${APPLICATION_PREFIX_PATH}/all`,
    component: ApplicationList,
    authority: [JOURNALIST], // Only jornalist can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "applyFormRegistration",
    path: `${APPLICATION_PREFIX_PATH}/apply/registration`,
    component: ApplicationFormRegistration,
    authority: [JOURNALIST], // Only jornalist can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "applicationDetail",
    path: `${APPLICATION_PREFIX_PATH}/details/:uuid`,
    component: ApplicationDetail,
    authority: [JOURNALIST], // Only jornalist can access
    meta: {
      pageContainerType: "contained",
    },
  },
];

export default applicationRoute;
