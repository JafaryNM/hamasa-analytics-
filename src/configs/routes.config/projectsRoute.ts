// src/configs/routes/projects.route.ts
import { lazy } from "react";
import { PROJECTS_PREFIX_PATH } from "@/constants/route.constant";
import type { Routes } from "@/@types/routes";

// Lazy pages
const ProjectsList = lazy(() => import("@/views/projects/project"));
const ProjectCreate = lazy(() => import("@/views/projects/CreateProject"));
const ProjectDetails = lazy(() => import("@/views/projects/ProjectDetails")); // <-- fix

const projectsRoute: Routes = [
  {
    key: "project.all",
    path: `${PROJECTS_PREFIX_PATH}`, // e.g. "/projects"
    component: ProjectsList,
    authority: [],
  },
  {
    key: "project.add",
    path: `${PROJECTS_PREFIX_PATH}/add`,
    component: ProjectCreate,
    authority: [],
  },
  {
    key: "project.details",
    path: `${PROJECTS_PREFIX_PATH}/details/:uuid`, // <-- dynamic segment
    component: ProjectDetails,
    authority: [],
  },
  //   {
  //     key: "project.edit",
  //     path: `${PROJECTS_PREFIX_PATH}/edit/:uuid`,
  //     component: ProjectEdit,
  //     authority: [],
  //   },
];

export default projectsRoute;
