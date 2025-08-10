// src/views/reports/ReportProject.tsx
import React, { useMemo } from "react";
import Tabs from "@/components/ui/Tabs";
import { MediaCoverageTab } from "./reports/MediaCoverageTab";
import ThematicAreaTab from "./reports/ThematicAreaTab"; // <-- Chart.js version
import IssuesTab from "./reports/IssuesTab";
import HousesTab from "./reports/HousesTab";
import DetailTab from "./reports/DetailTab";

const { TabNav, TabList, TabContent } = Tabs;

/* Dummy data */
type Channel =
  | "Newspapers"
  | "TV"
  | "Radio"
  | "Social Media"
  | "Blogs/Platforms";

type MediaCoverageItem = {
  channel: Channel;
  count: number;
};

type ThematicRow = {
  area: string;
  byChannel: Record<Channel, number>;
};

const mediaCoverage: MediaCoverageItem[] = [
  { channel: "Newspapers", count: 100 },
  { channel: "TV", count: 100 },
  { channel: "Radio", count: 200 },
  { channel: "Social Media", count: 12000 },
  { channel: "Blogs/Platforms", count: 1000 },
];

const thematicAreas: ThematicRow[] = [
  {
    area: "Cyber Harassment",
    byChannel: {
      Newspapers: 20,
      TV: 35,
      Radio: 60,
      "Social Media": 4200,
      "Blogs/Platforms": 320,
    },
  },
  {
    area: "Hate Speech",
    byChannel: {
      Newspapers: 18,
      TV: 22,
      Radio: 40,
      "Social Media": 2800,
      "Blogs/Platforms": 210,
    },
  },
  {
    area: "Privacy Violations",
    byChannel: {
      Newspapers: 16,
      TV: 20,
      Radio: 38,
      "Social Media": 2600,
      "Blogs/Platforms": 180,
    },
  },
  {
    area: "Psychological Harm",
    byChannel: {
      Newspapers: 14,
      TV: 12,
      Radio: 28,
      "Social Media": 1400,
      "Blogs/Platforms": 120,
    },
  },
  {
    area: "Gender-Based Hate Speech",
    byChannel: {
      Newspapers: 32,
      TV: 11,
      Radio: 34,
      "Social Media": 1000,
      "Blogs/Platforms": 170,
    },
  },
];

export default function ReportProject() {
  const totalMedia = useMemo(
    () => mediaCoverage.reduce((sum, m) => sum + m.count, 0),
    []
  );

  return (
    <div className="p-4 space-y-4">
      <Tabs defaultValue="media">
        <TabList>
          <TabNav value="media">Media Coverage</TabNav>
          <TabNav value="issues">Top 5 Issues</TabNav>
          <TabNav value="houses">Top 5 Media Houses</TabNav>
          <TabNav value="detail">Detail Report</TabNav>
        </TabList>

        <div className="p-4 border rounded-md mt-4 bg-white">
          <TabContent value="media">
            <MediaCoverageTab
              mediaCoverage={mediaCoverage}
              thematicAreas={thematicAreas}
              totalMedia={totalMedia}
            />
            <ThematicAreaTab thematicAreas={thematicAreas} />
          </TabContent>

          <TabContent value="issues">
            <IssuesTab />
          </TabContent>
          <TabContent value="houses">
            <HousesTab />
          </TabContent>
          <TabContent value="detail">
            <DetailTab />
          </TabContent>
        </div>
      </Tabs>
    </div>
  );
}
