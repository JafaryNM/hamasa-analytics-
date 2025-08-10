import React from "react";
import { useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui";
import {
  TbArrowLeft,
  TbCalendar,
  TbWorld,
  TbMap,
  TbCategory,
  TbAlertTriangle,
  TbPlayerPlay,
  TbLink,
  TbHash,
  TbBookmark,
  TbShare3,
  TbDownload,
  TbUserCheck,
  TbActivityHeartbeat,
  TbMessageReport,
} from "react-icons/tb";

type ContentNature = "video" | "image" | "audio" | "article" | "pdf";
type IssueType =
  | "Defamatory Political Statement"
  | "Misinformation"
  | "Disinformation"
  | "Hate Speech"
  | "OGBV"
  | "Other";

type ContentDetailsData = {
  uuid?: string;
  issue: IssueType;
  title: string;
  description: string;
  contentNature: ContentNature;
  datePosted: string;
  source: { name: string; logoUrl?: string };
  thematicArea: string;
  monitoringLine: string;
  language: string;
  region: string;
  previewUrl?: string;
  analysisFromHamasaAI: string;
};

const Badge: React.FC<
  React.PropsWithChildren<{ tone?: "neutral" | "warn" | "info" | "success" }>
> = ({ tone = "neutral", children }) => {
  const tones = {
    neutral: "border bg-muted/40 text-foreground",
    warn: "border border-amber-300 bg-amber-50 text-amber-800",
    info: "border border-blue-300 bg-blue-50 text-blue-800",
    success: "border border-emerald-300 bg-emerald-50 text-emerald-800",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

const RowItem: React.FC<{
  label: string;
  icon?: React.ReactNode;
  value?: React.ReactNode;
}> = ({ label, icon, value }) => (
  <div className="rounded-xl border bg-white/60 p-4">
    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
    <div className="mt-1.5 flex items-center gap-2 text-sm font-medium">
      {icon}
      <span className="min-w-0 break-words">{value}</span>
    </div>
  </div>
);

// small helper: supports youtube.com & youtu.be
const toEmbed = (url?: string) => {
  if (!url) return undefined;
  if (url.includes("embed/")) return url;
  if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }
  return undefined;
};

const DetailReport: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();

  const content: ContentDetailsData = {
    uuid,
    issue: "Defamatory Political Statement",
    title:
      "“CHADEMA raising funds to buy Ebola and Mpox viruses to harm people” – Makalla alleges",
    description:
      "A televised segment reported allegations made by Makalla claiming that opposition party CHADEMA was collecting money to purchase Ebola and Mpox viruses to cause illness. The claim is unverified, inflammatory, and medically implausible.",
    contentNature: "video",
    datePosted: "2025-03-23",
    source: {
      name: "Millard Ayo",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg",
    },
    thematicArea: "Misinformation and Disinformation",
    monitoringLine:
      "Accusation without evidence targeting a political group; content may incite fear, mistrust, and political hostility.",
    language: "Swahili",
    region: "Simiyu",
    previewUrl: "https://youtu.be/gNS5cW7t1Q8",
    analysisFromHamasaAI:
      "The statement constitutes harmful political misinformation likely aimed at discrediting an opposition party. Such allegations, when aired without verification, can fuel public panic, erode trust in political institutions, and polarize society. The reference to dangerous diseases is a fear-mongering tactic. Milard Ayo broadcast of this claim without clear fact-checking may breach journalistic standards of accuracy and fairness.",
  };

  const issueTone: "warn" | "info" | "success" | "neutral" =
    content.issue === "Defamatory Political Statement" ? "warn" : "neutral";

  const embedUrl = toEmbed(content.previewUrl);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Sticky header with actions for better alignment */}
      <Card className="p-4 md:p-5 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={() => history.back()}>Back</Button>
            {content.uuid && (
              <Badge>
                <TbHash /> {content.uuid}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button className="bg-yellow-500 text-white hover:bg-yellow-400 hover:text-white">
              <TbShare3 className="mr-1.5" /> Share
            </Button>
            <Button className="bg-green-500 text-white hover:bg-green-400 hover:text-white">
              <TbActivityHeartbeat className="mr-1.5" /> Analyse with AI
            </Button>
            <Button className="bg-blue-500 text-white hover:bg-blue-400 hover:text-white">
              <TbDownload className="mr-1.5" /> Download
            </Button>
            <Button className="bg-orange-500 text-white hover:bg-orange-500 hover:text-white">
              <TbUserCheck className="mr-1.5" /> Assign
            </Button>
            <Button className="bg-purple-500 text-white hover:bg-purple-400 hover:text-white">
              <TbBookmark className="mr-1.5" /> Bookmark
            </Button>
          </div>
        </div>
      </Card>

      {/* Title + badges */}
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {content.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 py-4 my-4">
            <Badge tone={issueTone}>
              <TbAlertTriangle cla /> Issue: {content.issue}
            </Badge>
            <Badge tone="info">
              <TbCategory /> {content.thematicArea}
            </Badge>
            <Badge>
              <TbMessageReport /> Content Nature: {content.contentNature}
            </Badge>
          </div>
        </div>

        {/* Meta grid (perfectly aligned heights) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          <RowItem
            label="Date Posted"
            icon={<TbCalendar className="w- h-4 text-primary" />}
            value={content.datePosted}
          />
          <RowItem
            label="Language"
            icon={<TbWorld />}
            value={content.language}
          />
          <RowItem label="Region" icon={<TbMap />} value={content.region} />
          <RowItem
            label="Source"
            value={
              <div className="flex items-center gap-2">
                {content.source.logoUrl ? (
                  <img
                    src={content.source.logoUrl}
                    className="h-5 w-5 rounded-sm object-cover border"
                    alt={`${content.source.name} logo`}
                  />
                ) : (
                  <div className="h-5 w-5 rounded-sm border bg-muted/50" />
                )}
                <span>{content.source.name}</span>
              </div>
            }
          />
          <RowItem
            label="Preview Link"
            icon={<TbLink />}
            value={
              content.previewUrl ? (
                <a
                  className="underline underline-offset-2 hover:opacity-80 break-all"
                  href={content.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {content.previewUrl}
                </a>
              ) : (
                "—"
              )
            }
          />
        </div>
      </Card>

      {/* Collapsible sections = tighter UI */}
      <Card className="p-0 overflow-hidden">
        <details open className="group">
          <summary className="list-none cursor-pointer px-6 py-4 flex items-center gap-2 border-b">
            <TbPlayerPlay className="opacity-80" />
            <span className="text-base font-semibold">Story Description</span>
            <span className="ml-auto text-xs text-muted-foreground group-open:hidden">
              Show
            </span>
            <span className="ml-auto text-xs text-muted-foreground hidden group-open:block">
              Hide
            </span>
          </summary>
          <div className="px-6 py-4">
            <p className="text-[15px] leading-relaxed">{content.description}</p>
          </div>
        </details>

        <details open className="group">
          <summary className="list-none cursor-pointer px-6 py-4 flex items-center gap-2 border-b">
            <TbCategory className="opacity-80" />
            <span className="text-base font-semibold">Monitoring Line</span>
          </summary>
          <div className="px-6 py-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {content.monitoringLine}
            </p>
          </div>
        </details>

        <details open className="group">
          <summary className="list-none cursor-pointer px-6 py-4 flex items-center gap-2">
            <TbActivityHeartbeat className="opacity-80" />
            <span className="text-base font-semibold">
              Analysis from Hamasa AI
            </span>
          </summary>
          <div className="px-6 py-4">
            <p className="text-[15px] leading-relaxed">
              {content.analysisFromHamasaAI}
            </p>
          </div>
        </details>
      </Card>

      {/* Preview */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <TbPlayerPlay />
          <h3 className="text-base font-semibold">Content Preview</h3>
        </div>

        {content.contentNature === "video" && embedUrl ? (
          <div className="aspect-video w-full overflow-hidden rounded-xl border bg-black">
            <iframe
              className="h-full w-full"
              src={embedUrl}
              title="Video preview"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : content.previewUrl ? (
          <a
            href={content.previewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-primary underline underline-offset-2"
          >
            <TbLink /> Open preview
          </a>
        ) : (
          <div className="text-sm text-muted-foreground">
            No preview available.
          </div>
        )}
      </Card>
    </div>
  );
};

export default DetailReport;
