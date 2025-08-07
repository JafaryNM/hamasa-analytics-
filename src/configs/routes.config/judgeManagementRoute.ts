import { lazy } from "react";
import { JUDGE_MANAGEMENT_PATH } from "@/constants/route.constant";
import { ADMIN, JUDGE, SUPER_ADMIN } from "@/constants/roles.constant";
import type { Routes } from "@/@types/routes";

// Lazy load judge management components
const JudgeAwards = lazy(() => import("@/views/judge-management/JudgeAwards"));
const JudgeAwardEvaluations = lazy(
  () => import("@/views/judge-management/JudgeAwardEvaluations")
);
const JudgeEvaluationsApplication = lazy(
  () => import("@/views/judge-management/JudgeEvaluationsApplication")
);

const OverallEvalutionsApplications = lazy(
  () => import("@/views/judge-management/JudgeOverallEvaluations")
);

const JudgeReviewResult = lazy(
  () => import("@/views/judge-management/JudgeReviewResults")
);

const judgeManagementRoute: Routes = [
  {
    key: "judge-awards",
    path: `${JUDGE_MANAGEMENT_PATH}/awards`,
    component: JudgeAwards,
    authority: [JUDGE],
    meta: {
      pageContainerType: "contained",
    },
  },

  {
    key: "overall-awards",
    path: `${JUDGE_MANAGEMENT_PATH}/overall`,
    component: OverallEvalutionsApplications,
    authority: [JUDGE],
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "judge-award-evaluations",
    path: `${JUDGE_MANAGEMENT_PATH}/awards/evaluations/:uuid`,
    component: JudgeAwardEvaluations,
    authority: [JUDGE],
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "judge-evaluations-application",
    path: `${JUDGE_MANAGEMENT_PATH}/awards/evaluations/:uuid/application/:applicationUuid`,
    component: JudgeEvaluationsApplication,
    authority: [JUDGE],
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "judge-reviews-results",
    path: `${JUDGE_MANAGEMENT_PATH}/reviews-results`,
    component: JudgeReviewResult,
    authority: [SUPER_ADMIN, ADMIN],
    meta: {
      pageContainerType: "contained",
    },
  },
];

export default judgeManagementRoute;
