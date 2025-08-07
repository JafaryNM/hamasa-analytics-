import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "@/constants/navigation.constant";
import { JUDGE } from "@/constants/roles.constant";
import type { NavigationTree } from "@/@types/navigation";
import { REVIEW_REPORT_PATH } from "@/constants/route.constant";

const judgeReviewNavigationConfig: NavigationTree[] = [
  {
    key: "judgeReview",
    path: "",
    title: "Judge Review",
    translateKey: "nav.judgeReview.title",
    icon: "dashboardAnalytic",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [JUDGE],
    meta: {
      horizontalMenu: {
        layout: "columns",
        columns: 4,
      },
    },
    subMenu: [
      {
        key: "judgeReview.reports",
        path: `${REVIEW_REPORT_PATH}/add`,
        title: "Submit Review",
        translateKey: "nav.judgeReview.reports",
        icon: "fileCheck",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [JUDGE],
        meta: {
          description: {
            translateKey: "nav.judgeReview.reports.description",
            label: "List of submitted reviews",
          },
        },
        subMenu: [],
      },
    ],
  },
];

export default judgeReviewNavigationConfig;
