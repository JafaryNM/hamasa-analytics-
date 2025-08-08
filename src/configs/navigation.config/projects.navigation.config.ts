import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import { ADMIN, JOURNALIST, SUPER_ADMIN } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";
import { PROJECTS_PREFIX_PATH } from "@/constants/route.constant";

const projectsNavigationConfig: NavigationTree[] = [
  {
    key: "Projects",
    path: `${PROJECTS_PREFIX_PATH}`,
    title: "Projects",
    translateKey: "nav.projects.projects",
    icon: "products",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
];

export default projectsNavigationConfig;
