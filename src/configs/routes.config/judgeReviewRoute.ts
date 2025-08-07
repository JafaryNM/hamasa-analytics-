import { ADMIN, JUDGE, SUPER_ADMIN } from "@/constants/roles.constant";
import { REVIEW_REPORT_PATH } from "@/constants/route.constant";
import { lazy } from "react";
import type { Routes } from "@/@types/routes";

const judgeReviewAddReview = lazy(
  () => import("@/views/report/judgeReviewAdd")
);

const judgeReviewReport = lazy(
  () => import("@/views/report/judgeReviewReport")
);

const judgeResults = lazy(() => import("@/views/report/JudgeResults"));

const judgeReviewRoute: Routes = [
  {
    key: "reviewReportAdd",
    path: `${REVIEW_REPORT_PATH}/add`,
    component: judgeReviewAddReview,
    authority: [SUPER_ADMIN, JUDGE],
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "reviewReport",
    path: `${REVIEW_REPORT_PATH}`,
    component: judgeReviewReport,
    authority: [SUPER_ADMIN, JUDGE],
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "judgeResults",
    path: `${REVIEW_REPORT_PATH}/results`,
    component: judgeResults,
    authority: [SUPER_ADMIN, JUDGE],
    meta: {
      pageContainerType: "contained",
    },
  },
];

export default judgeReviewRoute;
