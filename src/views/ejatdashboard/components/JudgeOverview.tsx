import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import classNames from "@/utils/classNames";
import { Link } from "react-router-dom";
import {
  TbProgressBolt,
  TbCheck,
  TbClockHour4,
  TbLayers,
} from "react-icons/tb";
import type { ReactNode } from "react";
import StatisticCard from "./StaticCard";

type JudgeStats = {
  assignedApplications: number;
  completedReviews: number;
  pendingReviews: number;
  roundsPresent: number;
};

const JudgeOverview = () => {
  const [data, setData] = useState<JudgeStats>({
    assignedApplications: 0,
    completedReviews: 0,
    pendingReviews: 0,
    roundsPresent: 0,
  });

  useEffect(() => {
    const dummyStats: JudgeStats = {
      assignedApplications: 20,
      completedReviews: 12,
      pendingReviews: 8,
      roundsPresent: 3,
    };

    setTimeout(() => {
      setData(dummyStats);
    }, 500);
  }, []);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h4>Judge Dashboard Overview</h4>
        <Link to="/judge/applications">
          <Button asElement="div" size="sm">
            View Applications
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 rounded-2xl mt-4">
        <StatisticCard
          title="Assigned Applications"
          className="bg-sky-100 dark:bg-opacity-75"
          value={data.assignedApplications}
          icon={<TbProgressBolt />}
        />
        <StatisticCard
          title="Completed Reviews"
          className="bg-emerald-100 dark:bg-opacity-75"
          value={data.completedReviews}
          icon={<TbCheck />}
        />
        <StatisticCard
          title="Pending Reviews"
          className="bg-yellow-100 dark:bg-opacity-75"
          value={data.pendingReviews}
          icon={<TbClockHour4 />}
        />
        <StatisticCard
          title="Rounds Present"
          className="bg-indigo-100 dark:bg-opacity-75"
          value={data.roundsPresent}
          icon={<TbClockHour4 />}
        />
      </div>
    </Card>
  );
};

export default JudgeOverview;
