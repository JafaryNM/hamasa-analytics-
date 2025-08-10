// src/views/journalists/JournalistDashboard.tsx
import React, { useMemo, useState, useCallback } from "react";
import Chart from "react-apexcharts";
import { COLORS } from "@/constants/chart.constant";
import Select from "@/components/ui/Select";
import CreatableSelect from "react-select/creatable";
import InteractiveMap from "./components/InteractiveMap";
import { Card } from "@/components/ui";
import StatisticCard from "./components/StaticCard";
import {
  TbPackageExport,
  TbPoint,
  TbProgress,
  TbTicket,
  TbUsers,
  TbVideo,
} from "react-icons/tb";

type SentimentCounts = { positive: number; negative: number; neutral: number };

type Project = {
  id: string;
  name: string;
  sentiments: SentimentCounts;
};

type Option = { value: string; label: string };

// --- Base dummy media monitoring data ---
const BASE_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "OGBV",
    sentiments: { positive: 132, negative: 47, neutral: 61 },
  },
  {
    id: "p2",
    name: "HealthCare Reform",
    sentiments: { positive: 88, negative: 96, neutral: 40 },
  },
  {
    id: "p3",
    name: "Education Policy",
    sentiments: { positive: 154, negative: 22, neutral: 73 },
  },
  {
    id: "p4",
    name: "Infrastructure",
    sentiments: { positive: 60, negative: 30, neutral: 90 },
  },
];

// ---------- utils: dates & seeded randomness ----------
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, days: number) => {
  const nd = new Date(d);
  nd.setDate(d.getDate() + days);
  return nd;
};
const clampDate = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

// seed from string
function hashStringToInt(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function seededRand(seed: number) {
  // simple LCG
  let x = seed % 2147483647 || 1;
  return () => {
    x = (x * 48271) % 2147483647;
    return (x & 2147483647) / 2147483647;
  };
}

// generate daily timeseries of sentiments between start & end (inclusive)
function generateDailySeries(
  projectId: string,
  start: Date,
  end: Date
): Array<{ x: string; positive: number; negative: number; neutral: number }> {
  const startDate = clampDate(start);
  const endDate = clampDate(end);
  const days =
    Math.max(
      0,
      Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000)
    ) + 1;

  const rnd = seededRand(
    hashStringToInt(projectId + toISO(startDate) + toISO(endDate))
  );

  // baseline so different projects have different volumes
  const base = 40 + Math.floor(rnd() * 60); // 40 - 99 per day total baseline

  const out: Array<{
    x: string;
    positive: number;
    negative: number;
    neutral: number;
  }> = [];
  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i);
    // add some weekly seasonality + noise
    const dayOfWeek = date.getDay(); // 0-6
    const seasonBoost =
      dayOfWeek === 1 || dayOfWeek === 3 ? 1.25 : dayOfWeek === 0 ? 0.8 : 1; // Mon/Wed higher, Sun lower
    const total = Math.max(
      5,
      Math.round(base * seasonBoost + (rnd() - 0.5) * 20) // noise +/-10
    );

    // split total into sentiments with some variability
    const pShare = 0.45 + (rnd() - 0.5) * 0.2; // 35%-55%
    const nShare = 0.25 + (rnd() - 0.5) * 0.15; // 17.5%-32.5%
    const pos = Math.max(0, Math.round(total * pShare));
    const neg = Math.max(0, Math.round(total * nShare));
    const neu = Math.max(0, total - pos - neg);

    out.push({
      x: date.toISOString(),
      positive: pos,
      negative: neg,
      neutral: neu,
    });
  }
  return out;
}

// group by ISO week (Mon-Sun); returns Monday of that week
function isoWeekStart(d: Date) {
  const copy = clampDate(d);
  const day = (copy.getDay() + 6) % 7; // Mon=0, Sun=6
  copy.setDate(copy.getDate() - day);
  return copy;
}
function groupWeekly(
  daily: Array<{
    x: string;
    positive: number;
    negative: number;
    neutral: number;
  }>
) {
  const map = new Map<
    string,
    { x: string; positive: number; negative: number; neutral: number }
  >();
  for (const row of daily) {
    const wk = isoWeekStart(new Date(row.x));
    const key = toISO(wk);
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        x: wk.toISOString(),
        positive: row.positive,
        negative: row.negative,
        neutral: row.neutral,
      });
    } else {
      existing.positive += row.positive;
      existing.negative += row.negative;
      existing.neutral += row.neutral;
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => +new Date(a.x) - +new Date(b.x)
  );
}

function formatPercent(n: number, total: number) {
  if (total === 0) return "0%";
  return `${Math.round((n / total) * 100)}%`;
}

// ---------- Pie (existing) ----------
const SentimentPie: React.FC<{ data: SentimentCounts }> = ({ data }) => {
  const series = useMemo(
    () => [data.positive, data.negative, data.neutral],
    [data]
  );

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: { type: "pie", toolbar: { show: false } },
      labels: ["Positive", "Negative", "Neutral"],
      colors: COLORS, // ensure at least 3 colors
      legend: { position: "bottom" },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${Math.round(val)}%`,
      },
      tooltip: { y: { formatter: (val: number) => `${val} posts` } },
      responsive: [
        {
          breakpoint: 640,
          options: { chart: { width: "100%" }, legend: { position: "bottom" } },
        },
      ],
    }),
    []
  );

  return <Chart options={options} series={series} type="pie" height={320} />;
};

const StatChip: React.FC<{ label: string; value: number; percent: string }> = ({
  label,
  value,
  percent,
}) => (
  <div className="rounded-2xl bg-primary-deep text-white border px-4 py-3 flex items-center justify-between">
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="text-right">
      <div className="text-lg font-semibold leading-tight">{value}</div>
      <div className="text-xs text-muted-foreground">{percent}</div>
    </div>
  </div>
);

// react-select custom styles to match your UI
const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: "0.5rem",
    padding: "2px 6px",
    borderColor: state.isFocused ? "#37AFE3" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 1px #37AFE3" : "none",
    "&:hover": { borderColor: "#37AFE3" },
    minHeight: "42px",
    backgroundColor: "var(--background, white)",
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "0.5rem",
    padding: "4px 0",
    zIndex: 20,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#37AFE3"
      : state.isFocused
        ? "#E0F2FE"
        : "transparent",
    color: state.isSelected ? "#fff" : "#111827",
    cursor: "pointer",
  }),
  placeholder: (base: any) => ({ ...base, color: "#9CA3AF" }),
  singleValue: (base: any) => ({ ...base, color: "#111827" }),
};

// ---------- Trend (new) ----------
type Granularity = "daily" | "weekly";

const SentimentTrend: React.FC<{
  projectId: string;
  startDate: string;
  endDate: string;
  granularity: Granularity;
}> = ({ projectId, startDate, endDate, granularity }) => {
  const daily = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(+start) || isNaN(+end) || start > end) return [];
    return generateDailySeries(projectId, start, end);
  }, [projectId, startDate, endDate]);

  const seriesData = useMemo(() => {
    const rows = granularity === "weekly" ? groupWeekly(daily) : daily;
    // Apex expects [timestamp, value]
    const positive = rows.map((r) => [new Date(r.x).getTime(), r.positive]);
    const negative = rows.map((r) => [new Date(r.x).getTime(), r.negative]);
    const neutral = rows.map((r) => [new Date(r.x).getTime(), r.neutral]);
    return { positive, negative, neutral };
  }, [daily, granularity]);

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: { type: "area", stacked: true, toolbar: { show: false } },
      colors: COLORS, // 3 colors
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: { type: "datetime" },
      yaxis: {
        labels: { formatter: (v) => `${Math.round(v)}` },
        title: { text: "Posts" },
      },
      legend: { position: "bottom" },
      tooltip: {
        shared: true,
        x: { format: granularity === "weekly" ? "dd MMM yyyy" : "dd MMM" },
      },
      fill: {
        type: "gradient",
        gradient: { opacityFrom: 0.35, opacityTo: 0.05 },
      },
    }),
    [granularity]
  );

  const series: ApexAxisChartSeries = useMemo(
    () => [
      { name: "Positive", data: seriesData.positive },
      { name: "Negative", data: seriesData.negative },
      { name: "Neutral", data: seriesData.neutral },
    ],
    [seriesData]
  );

  return <Chart options={options} series={series} type="area" height={340} />;
};

// ---------- Page ----------
const JournalistDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(BASE_PROJECTS);
  const [projectId, setProjectId] = useState<string>(BASE_PROJECTS[0].id);

  // default: last 30 days
  const todayISO = toISO(new Date());
  const last30ISO = toISO(addDays(new Date(), -29));
  const [startDate, setStartDate] = useState<string>(last30ISO);
  const [endDate, setEndDate] = useState<string>(todayISO);
  const [granularity, setGranularity] = useState<Granularity>("daily");

  const options: Option[] = useMemo(
    () => projects.map((p) => ({ value: p.id, label: p.name })),
    [projects]
  );
  const activeProject = useMemo(
    () => projects.find((p) => p.id === projectId)!,
    [projects, projectId]
  );
  const total = useMemo(() => {
    const s = activeProject.sentiments;
    return s.positive + s.negative + s.neutral;
  }, [activeProject]);

  // helper for new project with dummy data
  const genDummySentiment = useCallback((): SentimentCounts => {
    const rnd = seededRand(Date.now());
    const positive = Math.floor(rnd() * 160) + 20;
    const negative = Math.floor(rnd() * 110) + 10;
    const neutral = Math.floor(rnd() * 120) + 10;
    return { positive, negative, neutral };
  }, []);

  const handleSelectChange = (opt: Option | null) => {
    if (!opt) return;
    setProjectId(opt.value);
  };
  const handleCreate = (inputLabel: string) => {
    const id = `p_${Date.now()}`;
    const newProject: Project = {
      id,
      name: inputLabel,
      sentiments: genDummySentiment(),
    };
    setProjects((prev) => [...prev, newProject]);
    setProjectId(id);
  };

  const invalidRange = new Date(startDate) > new Date(endDate);

  return (
    <Card className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold"> Dashboard</h1>

        {/* Project selector (Creatable) */}
        <div className="flex items-center gap-2 w-full md:w-[420px]">
          <label className="text-sm text-muted-foreground shrink-0">
            Project
          </label>
          <div className="w-full">
            <Select
              componentAs={CreatableSelect}
              isClearable={false}
              placeholder="Select or create a project..."
              value={options.find((o) => o.value === projectId)}
              onChange={handleSelectChange as any}
              onCreateOption={handleCreate}
              options={options}
              styles={customStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
          </div>
        </div>
      </div>

      {/* Content */}

      <Card className="p-4 m-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-4 gap-5">
          <StatisticCard
            title="Active Project"
            className="bg-primary"
            value={1}
            icon={<TbPackageExport />}
          />
          <StatisticCard
            title="Completed Project"
            className="bg-primary"
            value={2}
            icon={<TbTicket />}
          />
          <StatisticCard
            title="Sources"
            className="bg-primary"
            value={47}
            icon={<TbProgress />}
          />
          <StatisticCard
            title="Media items"
            className="bg-primary"
            value={8742}
            icon={<TbVideo />}
          />
        </div>
      </Card>
      <Card className="p-4 m-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie chart */}
          <div className="lg:col-span-2 rounded-2xl border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">
                Sentiment Analysis • {activeProject.name}
              </h2>
              <span className="text-sm text-muted-foreground">
                Total: <span className="font-medium">{total}</span> posts
              </span>
            </div>
            <SentimentPie data={activeProject.sentiments} />
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Breakdown</h3>
            <StatChip
              label="Positive"
              value={activeProject.sentiments.positive}
              percent={formatPercent(activeProject.sentiments.positive, total)}
            />
            <StatChip
              label="Negative"
              value={activeProject.sentiments.negative}
              percent={formatPercent(activeProject.sentiments.negative, total)}
            />
            <StatChip
              label="Neutral"
              value={activeProject.sentiments.neutral}
              percent={formatPercent(activeProject.sentiments.neutral, total)}
            />
          </div>
        </div>
      </Card>

      {/* Trend Controls */}
      <Card className="p-4 m-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-end lg:justify-between">
          <h3 className="text-lg font-semibold">
            Trend • {activeProject.name}
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex flex-col">
              <label className="text-xs text-muted-foreground mb-1">
                Start date
              </label>
              <input
                type="date"
                className="border rounded-lg px-3 py-2"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-muted-foreground mb-1">
                End date
              </label>
              <input
                type="date"
                className="border rounded-lg px-3 py-2"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-muted-foreground mb-1">
                Granularity
              </label>
              <select
                className="border rounded-lg px-3 py-2"
                value={granularity}
                onChange={(e) => setGranularity(e.target.value as Granularity)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        </div>

        {invalidRange ? (
          <div className="text-red-600 text-sm">
            Start date cannot be after end date.
          </div>
        ) : (
          <SentimentTrend
            projectId={projectId}
            startDate={startDate}
            endDate={endDate}
            granularity={granularity}
          />
        )}
      </Card>

      <div>
        <InteractiveMap />
      </div>
    </Card>
  );
};

export default JournalistDashboard;
