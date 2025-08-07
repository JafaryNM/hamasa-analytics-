import { lazy } from "react";
import { DASHBOARDS_PREFIX_PATH } from "@/constants/route.constant";
import { ADMIN, USER, JUDGE, JOURNALIST } from "@/constants/roles.constant"; // Ensure these roles exist
import type { Routes } from "@/@types/routes";

// Lazy load dashboard components
const AdminDashboard = lazy(() => import("@/views/ejatdashboard/Dashboard"));

const dashboardsRoute: Routes = [
  {
    key: "dashboard",
    path: `${DASHBOARDS_PREFIX_PATH}`,
    component: AdminDashboard,
    authority: [], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
];

export default dashboardsRoute;
