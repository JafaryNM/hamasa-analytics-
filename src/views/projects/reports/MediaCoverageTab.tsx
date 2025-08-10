import { useMemo } from "react";

type Channel =
  | "Newspapers"
  | "TV"
  | "Radio"
  | "Social Media"
  | "Blogs/Platforms";
type MediaStat = { channel: Channel; count: number };
type ThematicRow = { area: string; byChannel: Record<Channel, number> };

function numberToK(n: number) {
  if (typeof n !== "number" || Number.isNaN(n)) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

export function MediaCoverageTab({
  mediaCoverage = [],
  thematicAreas = [],
  totalMedia = 0,
}: {
  mediaCoverage?: MediaStat[];
  thematicAreas?: ThematicRow[];
  totalMedia?: number;
}) {
  const safeMedia = Array.isArray(mediaCoverage) ? mediaCoverage : [];
  const safeThematic = Array.isArray(thematicAreas) ? thematicAreas : [];

  const top3 = useMemo(() => safeThematic.slice(0, 3), [safeThematic]);

  const maxChannel = useMemo(() => {
    // Guard empty arrays so Math.max(...[]) isn't called
    if (!safeMedia.length) return 0;
    const max = Math.max(...safeMedia.map((m) => m.count ?? 0));
    return Number.isFinite(max) ? max : 0;
  }, [safeMedia]);

  return (
    <div className="space-y-6">
      <div className="my-6 py-6">
        <h2 className="text-xl font-semibold mb-2">Media Coverage</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Total Media Products: <strong>{numberToK(totalMedia)}</strong>
        </p>

        {!safeMedia.length ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            No media coverage data to display.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            {safeMedia.map((m) => {
              const widthPct =
                maxChannel > 0
                  ? Math.min(100, (m.count / maxChannel) * 100)
                  : 0;
              return (
                <div key={m.channel} className="rounded-xl border p-4">
                  <div className="text-xs text-muted-foreground">
                    {m.channel}
                  </div>
                  <div className="text-2xl font-semibold">
                    {numberToK(m.count)}
                  </div>

                  <div className="mt-2 h-2 w-full rounded bg-muted">
                    <div
                      className="h-2 rounded bg-primary"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Thematic snapshot inside Media tab */}
    </div>
  );
}
