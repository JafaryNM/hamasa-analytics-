import { lazy } from "react";
import { AWARD_MANAGEMENT_PATH } from "@/constants/route.constant";
import { ADMIN, JUDGE, SUPER_ADMIN } from "@/constants/roles.constant";
import type { Routes } from "@/@types/routes";

// Lazy load dashboard components
const Awards = lazy(() => import("@/views/award-management/Awards"));
const AwardDetails = lazy(
  () => import("@/views/award-management/AwardDetails")
);
const AwardEvaluations = lazy(
  () => import("@/views/award-management/AwardEvaluations")
);
const AwardEvaluationsApplication = lazy(
  () => import("@/views/award-management/AwardEvaluationsApplication")
);

const awardManagementRoute: Routes = [
  {
    key: "awards",
    path: `${AWARD_MANAGEMENT_PATH}/awards`,
    component: Awards,
    authority: [SUPER_ADMIN, ADMIN, JUDGE], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "award-details",
    path: `${AWARD_MANAGEMENT_PATH}/awards/details/:uuid`,
    component: AwardDetails,
    authority: [SUPER_ADMIN, ADMIN, JUDGE], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "award-evaluations",
    path: `${AWARD_MANAGEMENT_PATH}/awards/evaluations/:uuid`,
    component: AwardEvaluations,
    authority: [SUPER_ADMIN, ADMIN, JUDGE], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "award-evaluations-application",
    path: `${AWARD_MANAGEMENT_PATH}/awards/evaluations/:uuid/application/:applicationUuid`,
    component: AwardEvaluationsApplication,
    authority: [SUPER_ADMIN, ADMIN, JUDGE], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
];

export default awardManagementRoute;
