import React from "react";
import classNames from "@/utils/classNames";
import type { ReactNode } from "react";

type StatisticCardProps = {
  title: string;
  icon: ReactNode;
  className: string;
  value: number;
};

const StatisticCard = ({
  title,
  className,
  icon,
  value,
}: StatisticCardProps) => {
  return (
    <div
      className={classNames(
        "rounded-2xl p-4 flex flex-col justify-center",
        className
      )}
    >
      <div className="flex justify-between items-center relative">
        <div>
          <div className="mb-4 text-white font-bold">{title}</div>
          <h1 className="mb-1 text-white text-2xl">{value}</h1>
        </div>
        <div className="flex items-center justify-center h-12 w-12 bg-gray-900 text-white rounded-full text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatisticCard;
