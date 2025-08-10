// src/views/projects/ProjectDetails.tsx
import React from "react";
import { useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { HiOutlineUser } from "react-icons/hi";
import {
  TbHash,
  TbCategory,
  TbCalendar,
  TbCalendarTime,
  TbCircleCheck,
  TbAlertTriangle,
  TbUsers,
  TbFileDescription,
  TbDatabase,
  TbChecks,
  TbCheck,
} from "react-icons/tb";
import { Button } from "@/components/ui";

type Status = "Active" | "In Review" | "Archived";

type ThematicArea = {
  title: string;
  description?: string;
  monitoringLines?: string[];
};

type ProjectDetailsData = {
  uuid?: string;
  title: string;
  description: string;
  category: string;
  status: Status;
  startDate: string;
  endDate: string;
  mediaItems?: number;
  collaborators: { id: number | string; name: string }[];
  thematicAreas: ThematicArea[];
  mediaSources: {
    radio: string[];
    tv: string[];
    newspapers: string[];
    digital: string[];
  };
  reportPrefs: {
    deliveryMethods: string[]; // multi-select
    reportPeriod: string; // single
    consultationPeriod: string; // single
  };
};

const SectionHeader: React.FC<
  React.PropsWithChildren<{ icon?: React.ReactNode; title: string }>
> = ({ icon, title, children }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      {icon && <span className="text-primary">{icon}</span>}
      <h3 className="text-base font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

const ProjectDetails: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();

  // === Mapped sample data from your message ===
  const project: ProjectDetailsData = {
    uuid,
    title: "Empowering Journalists for Informed Communities",
    description:
      "A media monitoring initiative tracking and analyzing instances of mis- and disinformation, hate speech, and online gender-based violence (OGBV) across digital and traditional platforms.",
    category: "Information Integrity",
    status: "Active",
    startDate: "2025-07-01",
    endDate: "2025-12-31",
    mediaItems: 124_568,
    collaborators: [
      { id: 1, name: "Sebastian Laschet" },
      { id: 2, name: "Ziada Omary" },
    ],
    thematicAreas: [
      {
        title: "Misinformation and Disinformation",
        description: "Tracking and analyzing false or misleading narratives.",
        monitoringLines: [
          "Does the content contain misinformation, disinformation, hate speech, or online gender-based violence (OGBV)?",
          "What is the specific harmful narrative, statement, or action identified in the content?",
          "Who or what group is being targeted, and through which platform or source was it published?",
        ],
      },
      {
        title: "Hate Speech",
        description:
          "Monitoring harmful and discriminatory language targeting individuals or groups.",
      },
      {
        title: "Online Gender-Based Violence (OGBV)",
        description:
          "Identifying and documenting gendered abuse, harassment, and threats online.",
      },
      {
        title: "Digital Rights & Online Safety",
        description: "Promoting a safe and inclusive digital space.",
      },
      {
        title: "Media Freedom & Accountability",
        description:
          "Supporting ethical reporting and responsible information dissemination.",
      },
    ],
    mediaSources: {
      radio: [
        "Bongo FM",
        "Wasafi FM",
        "Clouds FM",
        "E FM",
        "Radio One",
        "Radio Free Africa",
        "East Africa Radio",
        "Times FM",
      ],
      tv: [
        "ITV",
        "Clouds TV",
        "Star TV",
        "Wasafi TV",
        "TBC",
        "Channel Ten",
        "Azam Tv",
      ],
      newspapers: [
        "Mwananchi",
        "Habari Leo",
        "The Guardian",
        "Nipashe",
        "Raia Mwema",
      ],
      digital: [
        "Jamii forums",
        "Millard Ayo",
        "Jambo TV",
        "Global TV",
        "X",
        "Instagram",
        "Facebook",
        "Tiktok",
      ],
    },
    reportPrefs: {
      deliveryMethods: ["Through Dashboard", "Through E-mail"],
      reportPeriod: "Daily",
      consultationPeriod: "Once Per Month",
    },
  };
  // === end data ===

  const statusStyles =
    project.status === "Active"
      ? "text-green-700 bg-green-100 border-green-200"
      : project.status === "Archived"
        ? "text-red-700 bg-red-100 border-red-200"
        : "text-amber-700 bg-amber-100 border-amber-200";

  const StatusIcon =
    project.status === "Active"
      ? TbCircleCheck
      : project.status === "Archived"
        ? TbAlertTriangle
        : TbCalendarTime;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* ===== Header / Meta ===== */}
      <Card className="p-6 space-y-6">
        <Button className="my-4 bg-primary text-white hover:text-white">
          Back
        </Button>
        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {project.title}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {project.uuid && (
                <span className="inline-flex items-center gap-1.5">
                  <TbHash size={14} className="text-current" /> {project.uuid}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <TbCategory size={14} className="text-current" />{" "}
                {project.category}
              </span>
              {typeof project.mediaItems === "number" && (
                <span className="inline-flex items-center gap-1.5">
                  <TbDatabase size={14} className="text-current" />{" "}
                  {project.mediaItems.toLocaleString()} media items
                </span>
              )}
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 border px-3 py-1.5 rounded-full text-sm font-medium ${statusStyles}`}
            title="Project status"
          >
            <StatusIcon size={16} className="text-current" /> {project.status}
          </div>
        </div>

        {/* Meta stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-muted/10 p-4 space-y-1">
            <div className="text-xs text-muted-foreground">Start Date</div>
            <div className="flex items-center gap-2">
              <TbCalendar className="text-current" />
              <span className="font-medium">{project.startDate}</span>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/10 p-4 space-y-1">
            <div className="text-xs text-muted-foreground">End Date</div>
            <div className="flex items-center gap-2">
              <TbCalendar className="text-current" />
              <span className="font-medium">{project.endDate}</span>
            </div>
          </div>

          <div className="rounded-xl border bg-primary/5 p-4 space-y-1">
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="flex items-center gap-2">
              <StatusIcon className="text-primary" />
              <span className="font-medium">{project.status}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* ===== Basic Information ===== */}
      <Card className="p-6 space-y-5">
        <SectionHeader
          icon={<TbFileDescription size={18} />}
          title="Basic Information"
        >
          <div className="h-px bg-border" />
        </SectionHeader>

        <div className="space-y-5">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              Title of the Project
            </div>
            <div className="text-base font-semibold">{project.title}</div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              Project Description
            </div>
            <p className="leading-relaxed text-[15px]">{project.description}</p>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Category</div>
            <div className="text-base font-medium">{project.category}</div>
          </div>
        </div>
      </Card>

      {/* ===== Thematic Areas ===== */}
      <Card className="p-6 space-y-5">
        <SectionHeader
          icon={<TbFileDescription size={18} />}
          title="Thematic Areas"
        >
          <div className="h-px bg-border" />
        </SectionHeader>

        <div className="space-y-4">
          {project.thematicAreas.map((area, idx) => (
            <div
              key={idx}
              className="rounded-lg border p-4 bg-white/60 space-y-2"
            >
              <div className="text-[15px] font-semibold">{area.title}</div>
              {area.description && (
                <p className="text-sm text-muted-foreground">
                  {area.description}
                </p>
              )}

              {area.monitoringLines && area.monitoringLines.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="text-xs text-muted-foreground">
                    Monitoring Lines
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5">
                    {area.monitoringLines.map((q, i) => (
                      <li key={i} className="text-sm leading-relaxed">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* ===== Media Sources ===== */}
      <Card className="p-6 space-y-5">
        <SectionHeader icon={<TbDatabase size={18} />} title="Media Sources">
          <div className="h-px bg-border" />
        </SectionHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Radio</div>
            <div className="flex flex-wrap gap-2">
              {project.mediaSources.radio.map((r) => (
                <span
                  key={r}
                  className="text-xs px-2.5 py-1 rounded-full border bg-muted/40"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">TV</div>
            <div className="flex flex-wrap gap-2">
              {project.mediaSources.tv.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-1 rounded-full border bg-muted/40"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Newspapers</div>
            <div className="flex flex-wrap gap-2">
              {project.mediaSources.newspapers.map((n) => (
                <span
                  key={n}
                  className="text-xs px-2.5 py-1 rounded-full border bg-muted/40"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              Digital Platforms
            </div>
            <div className="flex flex-wrap gap-2">
              {project.mediaSources.digital.map((d) => (
                <span
                  key={d}
                  className="text-xs px-2.5 py-1 rounded-full border bg-muted/40"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ===== Report Preferences (with ticks) ===== */}
      <Card className="p-6 space-y-5">
        <SectionHeader icon={<TbChecks size={18} />} title="Report Preferences">
          <div className="h-px bg-border" />
        </SectionHeader>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2 md:col-span-1">
            <div className="text-xs text-muted-foreground">Delivery Method</div>
            <div className="flex flex-col gap-2">
              {project.reportPrefs.deliveryMethods.map((m) => (
                <div key={m} className="inline-flex items-center gap-2 text-sm">
                  <TbCheck className="text-green-600" /> {m}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:col-span-1">
            <div className="text-xs text-muted-foreground">
              Period of Receiving Report
            </div>
            <div className="inline-flex items-center gap-2 text-sm">
              <TbCheck className="text-green-600" />{" "}
              {project.reportPrefs.reportPeriod}
            </div>
          </div>

          <div className="space-y-2 md:col-span-1">
            <div className="text-xs text-muted-foreground">
              Consultation Period
            </div>
            <div className="inline-flex items-center gap-2 text-sm">
              <TbCheck className="text-green-600" />{" "}
              {project.reportPrefs.consultationPeriod}
            </div>
          </div>
        </div>
      </Card>

      {/* ===== Collaborators ===== */}
      <Card className="p-6 space-y-5">
        <SectionHeader icon={<TbUsers size={18} />} title="Collaborators">
          <div className="h-px bg-border" />
        </SectionHeader>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {project.collaborators.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-lg border p-3 bg-white shadow-sm"
            >
              <Avatar size="sm" icon={<HiOutlineUser />} />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  Collaborator
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="mt-4 justify-end">
            <Button className="bg-primary text-white hover:text-white ">
              Edit Project
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProjectDetails;
