import React from "react";
import Card from "@/components/ui/Card";
import GrowShrinkValue from "@/components/shared/GrowShrinkValue";
import classNames from "@/utils/classNames";
import { NumericFormat } from "react-number-format";
import { TbUsers, TbCheck, TbX } from "react-icons/tb";
import type { ReactNode } from "react";
import { IoDocumentsOutline } from "react-icons/io5";
import { MdCancel, MdOutlineVerifiedUser } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";

// KPI key types
type KPIKey = "totalApplicants" | "approved" | "rejected";

// Data shape
type ApplicantSummaryData = Partial<
  Record<KPIKey, { value: number; growShrink: number }>
>;

// Component props
type ApplicantSummaryProps = {
  data: ApplicantSummaryData;
};

// Summary segment props
type SummarySegmentProps = {
  title: string;
  value: string | number | ReactNode;
  growShrink: number;
  icon: ReactNode;
  iconClass: string;
  className?: string;
};

// Label mapping
const LABELS: Record<KPIKey, string> = {
  totalApplicants: "Total Applications",
  approved: "Approved Applications",
  rejected: "Rejected Applicationss",
};

// Icon mapping
const ICONS: Record<KPIKey, ReactNode> = {
  totalApplicants: <IoDocumentsOutline />,
  approved: <MdOutlineVerifiedUser />,
  rejected: <ImCancelCircle />,
};

// Icon color mapping
const COLORS: Record<KPIKey, string> = {
  totalApplicants: "bg-blue-200",
  approved: "bg-green-200",
  rejected: "bg-red-200",
};

// Single card component
const SummarySegment = ({
  title,
  value,
  growShrink,
  icon,
  iconClass,
  className,
}: SummarySegmentProps) => {
  return (
    <div className={classNames("flex flex-col gap-2 py-4 px-6", className)}>
      <div
        className={classNames(
          "flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 text-gray-900 rounded-full text-2xl",
          iconClass
        )}
      >
        {icon}
      </div>
      <div className="mt-4">
        <div className="mb-1 font-medium">{title}</div>
        <h3 className="mb-1 text-xl font-bold">{value}</h3>
      </div>
    </div>
  );
};

// Main summary component
const ApplicantSummary = ({ data }: ApplicantSummaryProps) => {
  const keys: KPIKey[] = ["totalApplicants", "approved", "rejected"];

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Applications Summary</h4>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {keys.map((key) => {
          const item = data[key];
          if (!item) return null;

          return (
            <SummarySegment
              key={key}
              title={LABELS[key]}
              value={
                <NumericFormat
                  displayType="text"
                  value={item.value}
                  thousandSeparator
                />
              }
              growShrink={item.growShrink}
              icon={ICONS[key]}
              iconClass={COLORS[key]}
              className="border-b md:border-b-0 border-gray-200 dark:border-gray-700"
            />
          );
        })}
      </div>
    </Card>
  );
};

export default ApplicantSummary;
