import { ADMIN, JUDGE, SUPER_ADMIN } from "@/constants/roles.constant";
import {
  REQUEST_PREFIX_PATH,
  REVIEW_REPORT_PATH,
} from "@/constants/route.constant";
import { lazy } from "react";
import type { Routes } from "@/@types/routes";

const requestFeatures = lazy(() => import("@/views/features/Request"));

const requestRoute: Routes = [
  {
    key: "request",
    path: `${REQUEST_PREFIX_PATH}/`,
    component: requestFeatures,
    authority: [],
    meta: {
      pageContainerType: "contained",
    },
  },
];

export default requestRoute;
