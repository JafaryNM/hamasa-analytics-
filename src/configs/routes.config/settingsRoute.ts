import { lazy } from "react";
import { SETTINGS_PATH } from "@/constants/route.constant";
// import { ADMIN, SUPER_ADMIN, JUDGE, JOURNALIST } from '@/constants/roles.constant'
import type { Routes } from "@/@types/routes";
import { ADMIN, SUPER_ADMIN } from "@/constants/roles.constant";

// Lazy load dashboard components
const MediaChannels = lazy(() => import("@/views/settings/MediaChannels"));
const EducationLevels = lazy(() => import("@/views/settings/EducationLevels"));
const Expertises = lazy(() => import("@/views/settings/Expertises"));
const Categories = lazy(() => import("@/views/settings/Categories"));
const Criterias = lazy(() => import("@/views/settings/Criterias"));
const Occupations = lazy(() => import("@/views/settings/Occupations"));
const Organizations = lazy(() => import("@/views/settings/Organizations"));
const Regions = lazy(() => import("@/views/settings/Regions"));
const Districts = lazy(() => import("@/views/settings/Districts"));

const settingsRoute: Routes = [
  {
    key: "categories",
    path: `${SETTINGS_PATH}/categories`,
    component: Categories,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "criterias",
    path: `${SETTINGS_PATH}/criterias`,
    component: Criterias,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "expertises",
    path: `${SETTINGS_PATH}/expertises`,
    component: Expertises,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "education-levels",
    path: `${SETTINGS_PATH}/education-levels`,
    component: EducationLevels,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "media-channels",
    path: `${SETTINGS_PATH}/media-channels`,
    component: MediaChannels,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "occupations",
    path: `${SETTINGS_PATH}/occupations`,
    component: Occupations,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "organizations",
    path: `${SETTINGS_PATH}/organizations`,
    component: Organizations,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "regions",
    path: `${SETTINGS_PATH}/regions`,
    component: Regions,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
  {
    key: "districts",
    path: `${SETTINGS_PATH}/districts`,
    component: Districts,
    authority: [SUPER_ADMIN, ADMIN], // Only admin users can access
    meta: {
      pageContainerType: "contained",
    },
  },
];

export default settingsRoute;
