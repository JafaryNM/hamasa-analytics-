// src/views/monitoring/InteractiveMap.tsx
import React, { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { max } from "d3-array";
import tzRegions from "@/data/tz_admin1.json"; // <-- ensure file exists
import { Card } from "@/components/ui";

type RegionMetric = {
  region: string;
  harmful: number; // total harmful items
  categories?: {
    misinformation?: number;
    hateSpeech?: number;
    ogbv?: number;
    defamation?: number;
  };
};

// Map this to your real metrics later
const SAMPLE_DATA: RegionMetric[] = [
  {
    region: "Dar es Salaam",
    harmful: 182,
    categories: {
      misinformation: 60,
      hateSpeech: 52,
      ogbv: 38,
      defamation: 32,
    },
  },
  {
    region: "Arusha",
    harmful: 95,
    categories: {
      misinformation: 35,
      hateSpeech: 20,
      ogbv: 18,
      defamation: 22,
    },
  },
  {
    region: "Dodoma",
    harmful: 76,
    categories: {
      misinformation: 22,
      hateSpeech: 16,
      ogbv: 14,
      defamation: 24,
    },
  },
  {
    region: "Mwanza",
    harmful: 121,
    categories: {
      misinformation: 44,
      hateSpeech: 32,
      ogbv: 19,
      defamation: 26,
    },
  },
  {
    region: "Kilimanjaro",
    harmful: 64,
    categories: {
      misinformation: 21,
      hateSpeech: 16,
      ogbv: 10,
      defamation: 17,
    },
  },
  {
    region: "Mbeya",
    harmful: 58,
    categories: { misinformation: 18, hateSpeech: 14, ogbv: 9, defamation: 17 },
  },
  {
    region: "Tanga",
    harmful: 73,
    categories: {
      misinformation: 25,
      hateSpeech: 17,
      ogbv: 12,
      defamation: 19,
    },
  },
  {
    region: "Morogoro",
    harmful: 69,
    categories: {
      misinformation: 22,
      hateSpeech: 16,
      ogbv: 11,
      defamation: 20,
    },
  },
  {
    region: "Zanzibar Urban/West",
    harmful: 97,
    categories: {
      misinformation: 36,
      hateSpeech: 28,
      ogbv: 14,
      defamation: 19,
    },
  },
  {
    region: "Ruvuma",
    harmful: 40,
    categories: { misinformation: 13, hateSpeech: 10, ogbv: 7, defamation: 10 },
  },
  // … add more regions as needed to match your GeoJSON
];

const REGION_NAME_KEY = "NAME_1"; // change if your GeoJSON uses another key

// brand ramp (light -> dark). You can tweak colors to your palette.
const COLOR_STOPS = [
  "#f4e9f9",
  "#e4c9f1",
  "#d3a8e8",
  "#c288e0",
  "#b168d8",
  "#9f49d0",
  "#8b36b9",
  "#764295", // brand
];

const Tooltip: React.FC<{ content: React.ReactNode; x: number; y: number }> = ({
  content,
  x,
  y,
}) => (
  <div
    className="pointer-events-none fixed z-50 rounded-lg border bg-white px-3 py-2 text-sm shadow-lg"
    style={{ left: x + 12, top: y + 12 }}
  >
    {content}
  </div>
);

const InteractiveMap: React.FC = () => {
  const [hover, setHover] = useState<{
    name: string;
    metric?: RegionMetric;
  } | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const dataMap = useMemo(() => {
    const map = new Map<string, RegionMetric>();
    SAMPLE_DATA.forEach((d) => map.set(d.region.toLowerCase(), d));
    return map;
  }, []);

  const maxVal = useMemo(() => max(SAMPLE_DATA, (d) => d.harmful) || 0, []);
  const colorScale = useMemo(
    () =>
      scaleQuantize<string>()
        .domain([0, maxVal || 1])
        .range(COLOR_STOPS),
    [maxVal]
  );

  const legendSteps = COLOR_STOPS.length;
  const legendValues = useMemo(() => {
    const step = (maxVal || 1) / legendSteps;
    return new Array(legendSteps).fill(0).map((_, i) => Math.round(i * step));
  }, [maxVal, legendSteps]);

  return (
    <Card className="p-4 m-4">
      <div className="flex items-center justify-between my-4 p-2">
        <h2 className="text-xl font-semibold">
          Tanzania • Harmful Content Hotspots
        </h2>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          {COLOR_STOPS.map((c, idx) => (
            <div key={c} className="h-3 w-8" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex justify-between w-48 text-xs text-muted-foreground">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div
        className="relative rounded-2xl border p-3"
        onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 1800, center: [35.0, -6.2] }} // tuned for TZ
          width={800}
          height={600}
          className="w-full h-auto"
        >
          <Geographies geography={tzRegions as any}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = (
                  geo.properties?.[REGION_NAME_KEY] || ""
                ).toString();
                const metric = dataMap.get(name.toLowerCase());
                const value = metric?.harmful ?? 0;
                const fill = colorScale(value);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHover({ name, metric })}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      default: {
                        fill,
                        outline: "none",
                        stroke: "#ffffff",
                        strokeWidth: 0.8,
                      },
                      hover: {
                        fill,
                        outline: "none",
                        stroke: "#111827",
                        strokeWidth: 1.2,
                      },
                      pressed: { fill, outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Tooltip */}
        {hover && (
          <Tooltip
            x={cursor.x}
            y={cursor.y}
            content={
              <div className="space-y-1">
                <div className="font-medium">{hover.name}</div>
                <div className="text-xs text-muted-foreground">
                  Harmful content:{" "}
                  <span className="font-semibold text-gray-900">
                    {hover.metric?.harmful ?? 0}
                  </span>
                </div>
                {hover.metric?.categories && (
                  <div className="text-xs text-muted-foreground">
                    <div>
                      Misinformation:{" "}
                      <span className="text-gray-900">
                        {hover.metric.categories.misinformation ?? 0}
                      </span>
                    </div>
                    <div>
                      Hate Speech:{" "}
                      <span className="text-gray-900">
                        {hover.metric.categories.hateSpeech ?? 0}
                      </span>
                    </div>
                    <div>
                      OGBV:{" "}
                      <span className="text-gray-900">
                        {hover.metric.categories.ogbv ?? 0}
                      </span>
                    </div>
                    <div>
                      Defamation:{" "}
                      <span className="text-gray-900">
                        {hover.metric.categories.defamation ?? 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            }
          />
        )}
      </div>

      {/* Optional: numeric legend breaks */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {legendValues.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ background: COLOR_STOPS[i] }}
            />
            <span>
              {v}
              {i === legendValues.length - 1 ? "+" : ""}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default InteractiveMap;
