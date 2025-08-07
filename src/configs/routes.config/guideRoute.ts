import { lazy } from "react";
import {
  APPLICATION_PREFIX_PATH,
  GUIDE_PREFIX_PATH,
} from "@/constants/route.constant";
import type { Routes } from "@/@types/routes";

const guideRoute: Routes = [
  {
    key: "guide.documentation",
    path: `${APPLICATION_PREFIX_PATH}/apply`,
    component: lazy(() => import("@/views/accounts/Settings")),
    authority: [],
    meta: {
      pageBackgroundType: "plain",
      pageContainerType: "contained",
    },
  },
];

export default guideRoute;
