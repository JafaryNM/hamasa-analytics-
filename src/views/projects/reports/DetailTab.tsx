// src/views/reports/DetailTab.tsx
import React, { useMemo, useState } from "react";
import { Table, Tag, Button, Space } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

type DetailRow = {
  key: string; // used as uuid in Explore route
  source: string;
  dateISO: string; // for sorting
  dateDisplay: string; // "05-Aug-25"
  thematicArea: string;
  sentiment: "Negative" | "Neutral" | "Positive";
  region: string;
  contentType: string;
};

const SAMPLE_ROWS: DetailRow[] = [
  {
    key: "1",
    source: "Millard Ayo",
    dateISO: "2025-08-05",
    dateDisplay: "05-Aug-25",
    thematicArea: "Disinformation",
    sentiment: "Negative",
    region: "National",
    contentType: "Social media post",
  },
  {
    key: "2",
    source: "ITV (TV)",
    dateISO: "2025-08-06",
    dateDisplay: "06-Aug-25",
    thematicArea: "Sexualized Online Violence",
    sentiment: "Negative",
    region: "Dar es Salaam",
    contentType: "TV news segment",
  },
  {
    key: "3",
    source: "Clouds FM",
    dateISO: "2025-08-07",
    dateDisplay: "07-Aug-25",
    thematicArea: "Gender-Based Hate Speech",
    sentiment: "Negative",
    region: "Arusha",
    contentType: "Radio talk show",
  },
  {
    key: "4",
    source: "Radio Free Africa",
    dateISO: "2025-08-08",
    dateDisplay: "08-Aug-25",
    thematicArea: "Privacy Violations & Digital Security",
    sentiment: "Negative",
    region: "Mwanza",
    contentType: "Radio interview",
  },
  {
    key: "5",
    source: "TBC Taifa",
    dateISO: "2025-08-09",
    dateDisplay: "09-Aug-25",
    thematicArea: "Psychological Harm & Social Exclusion",
    sentiment: "Negative",
    region: "National",
    contentType: "Radio news",
  },
  {
    key: "6",
    source: "Instagram",
    dateISO: "2025-08-09",
    dateDisplay: "09-Aug-25",
    thematicArea: "Gender-Based Hate Speech",
    sentiment: "Negative",
    region: "Zanzibar",
    contentType: "Social media story",
  },
  {
    key: "7",
    source: "Star TV",
    dateISO: "2025-08-10",
    dateDisplay: "10-Aug-25",
    thematicArea: "Cyber Harassment & Abuse",
    sentiment: "Negative",
    region: "Dodoma",
    contentType: "TV panel discussion",
  },
  {
    key: "8",
    source: "Wasafi TV",
    dateISO: "2025-08-10",
    dateDisplay: "10-Aug-25",
    thematicArea: "Sexualized Online Violence",
    sentiment: "Negative",
    region: "National",
    contentType: "TV entertainment show",
  },
  {
    key: "9",
    source: "East Africa Radio",
    dateISO: "2025-08-11",
    dateDisplay: "11-Aug-25",
    thematicArea: "Cyber Harassment & Abuse",
    sentiment: "Negative",
    region: "Morogoro",
    contentType: "Radio call-in program",
  },
  {
    key: "10",
    source: "Channel Ten",
    dateISO: "2025-08-11",
    dateDisplay: "11-Aug-25",
    thematicArea: "Gender-Based Hate Speech",
    sentiment: "Negative",
    region: "Mbeya",
    contentType: "TV current affairs program",
  },
  {
    key: "11",
    source: "YouTube",
    dateISO: "2025-08-12",
    dateDisplay: "12-Aug-25",
    thematicArea: "Sexualized Online Violence",
    sentiment: "Negative",
    region: "National",
    contentType: "Video commentary",
  },
  {
    key: "12",
    source: "Azam TV",
    dateISO: "2025-08-12",
    dateDisplay: "12-Aug-25",
    thematicArea: "Privacy Violations & Digital Security",
    sentiment: "Negative",
    region: "Kigoma",
    contentType: "TV investigative report",
  },
  {
    key: "13",
    source: "WhatsApp",
    dateISO: "2025-08-13",
    dateDisplay: "13-Aug-25",
    thematicArea: "Cyber Harassment & Abuse",
    sentiment: "Negative",
    region: "Kilimanjaro",
    contentType: "Shared screenshot (private data)",
  },
  {
    key: "14",
    source: "E-FM",
    dateISO: "2025-08-13",
    dateDisplay: "13-Aug-25",
    thematicArea: "Psychological Harm & Social Exclusion",
    sentiment: "Negative",
    region: "Singida",
    contentType: "Radio entertainment program",
  },
  {
    key: "15",
    source: "East Africa TV",
    dateISO: "2025-08-14",
    dateDisplay: "14-Aug-25",
    thematicArea: "Gender-Based Hate Speech",
    sentiment: "Negative",
    region: "Tanga",
    contentType: "TV youth program",
  },
];

export default function DetailTab({
  rows = SAMPLE_ROWS,
  onExplore,
}: {
  rows?: DetailRow[];
  onExplore?: (row: DetailRow) => void;
}) {
  const navigate = useNavigate();

  // track current page to compute S/N correctly across pages
  const [pageState, setPageState] = useState<{
    current: number;
    pageSize: number;
  }>({
    current: 1,
    pageSize: 10,
  });

  const sentimentColor = (s: DetailRow["sentiment"]) =>
    s === "Positive" ? "green" : s === "Neutral" ? "gold" : "red";

  const regions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.region))).sort(),
    [rows]
  );
  const sources = useMemo(
    () => Array.from(new Set(rows.map((r) => r.source))).sort(),
    [rows]
  );
  const thematics = useMemo(
    () => Array.from(new Set(rows.map((r) => r.thematicArea))).sort(),
    [rows]
  );

  const columns: ColumnsType<DetailRow> = [
    {
      title: "S/N",
      key: "sn",
      width: 80,
      fixed: "left",
      render: (_: unknown, __: DetailRow, index: number) =>
        (pageState.current - 1) * pageState.pageSize + index + 1,
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      filters: sources.map((s) => ({ text: s, value: s })),
      onFilter: (val, record) => record.source === val,
      sorter: (a, b) => a.source.localeCompare(b.source),
      width: 170,
    },
    {
      title: "Date posted",
      dataIndex: "dateDisplay",
      key: "date",
      sorter: (a, b) => dayjs(a.dateISO).valueOf() - dayjs(b.dateISO).valueOf(),
      defaultSortOrder: "descend",
      width: 140,
    },
    {
      title: "Thematic Area",
      dataIndex: "thematicArea",
      key: "thematicArea",
      filters: thematics.map((t) => ({ text: t, value: t })),
      onFilter: (val, record) => record.thematicArea === val,
      width: 260,
      ellipsis: true,
    },
    {
      title: "Sentiment",
      dataIndex: "sentiment",
      key: "sentiment",
      filters: [
        { text: "Negative", value: "Negative" },
        { text: "Neutral", value: "Neutral" },
        { text: "Positive", value: "Positive" },
      ],
      onFilter: (val, record) => record.sentiment === val,
      render: (s: DetailRow["sentiment"]) => (
        <Tag color={sentimentColor(s)}>{s}</Tag>
      ),
      width: 120,
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
      filters: regions.map((r) => ({ text: r, value: r })),
      onFilter: (val, record) => record.region === val,
      width: 160,
    },
    {
      title: "Content Type",
      dataIndex: "contentType",
      key: "contentType",
      width: 260,
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_: unknown, record: DetailRow) => (
        <Space>
          <Button
            size="small"
            className="bg-primary p-2 text-white hover:bg-primary hover:text-white"
            onClick={() => {
              if (onExplore) return onExplore(record);
              // default: navigate using the row key as uuid
              navigate(`/reports/details/${record.key}`);
            }}
          >
            Explore
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <Table<DetailRow>
        columns={columns}
        dataSource={rows}
        rowKey="key"
        pagination={{ pageSize: pageState.pageSize, showSizeChanger: true }}
        scroll={{ x: 1100 }}
        onChange={(
          pagination: TablePaginationConfig,
          _filters: Record<string, FilterValue | null>,
          _sorter: SorterResult<DetailRow> | SorterResult<DetailRow>[]
        ) => {
          setPageState({
            current: pagination.current ?? 1,
            pageSize: pagination.pageSize ?? 10,
          });
        }}
      />
    </div>
  );
}
