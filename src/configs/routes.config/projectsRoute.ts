import { lazy } from "react";
import {
  CONCEPTS_PREFIX_PATH,
  PROJECTS_PREFIX_PATH,
} from "@/constants/route.constant";
import {} from "@/constants/roles.constant";
import type { Routes } from "@/@types/routes";
import ProjectsPage from "@/views/projects/project";

const projects = lazy(() => import("@/views/projects/project"));
const projectsAdd = lazy(() => import("@/views/projects/CreateProject"));

const projectsRoute: Routes = [
  {
    key: "project.all",
    path: `${PROJECTS_PREFIX_PATH}`,
    component: projects,
    authority: [],
  },

  {
    key: "project.add",
    path: `${PROJECTS_PREFIX_PATH}/add`,
    component: projectsAdd,
    authority: [],
  },
];

export default projectsRoute;
