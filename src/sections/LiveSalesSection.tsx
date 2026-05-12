import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { ArtistRecord, SummaryStats } from "../types";
import { ChartCard } from "../components/ChartCard";
import { TierBadge } from "../components/TierBadge";
import { formatCount, formatMoney } from "../lib/format";
import { positiveDomain } from "../lib/scales";
import { tierColor } from "../lib/tier";

type LiveSalesSectionProps = {
  artists: ArtistRecord[];
  summary: SummaryStats;
  onSelect: (artist: ArtistRecord) => void;
};

export function LiveSalesSection({ artists, summary, onSelect }: LiveSalesSectionProps) {
  const tourRows = artists.filter((artist) => artist.live.tourGrossUsd && artist.streaming.spotifyMonthlyListeners);
  const venueRows = Object.entries(summary.venueScaleCounts)
    .filter(([label]) => label !== "N/A")
    .sort((a, b) => b[1] - a[1]);
  const maxVenue = Math.max(...venueRows.map(([, count]) => count), 1);

  return (
    <section id="live-sales" className="scroll-mt-32">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-mint">Live and sales</p>
        <h2 className="text-3xl font-semibold text-white">Separating online attention from market proof</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RankedList
          title="Public Tour Gross Leaderboard"
          description={`This ranks artists by the latest public tour gross captured in the Live & Touring workbook tab. It is not lifetime touring revenue. The value usually reflects the named latest tour and year range when those fields are available; ${formatCount(summary.missingnessCounts.tourGrossUsd?.available)} artists currently have usable public tour gross.`}
          artists={artists}
          value={(artist) => artist.live.tourGrossUsd}
          format={formatMoney}
          detail={(artist) => tourDetail(artist)}
          onSelect={onSelect}
        />
        <RankedList
          title="RIAA Units Leaderboard"
          description="This ranks artists by lifetime RIAA certified units from the Sales & RIAA workbook tab. The value is a certification and sales signal, not Spotify or catalog streaming footprint. Because certification coverage varies by market and artist type, missing or low values should be read alongside the QA confidence fields."
          artists={artists}
          value={(artist) => artist.sales.riaaTotalUnits}
          format={formatCount}
          onSelect={onSelect}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ChartCard
          title="Venue Scale Distribution"
          description="Venue scale comes from the Live & Touring workbook tab and is used as booking-fit context. It summarizes the venue tier associated with each artist rather than calculating demand on its own. The chart respects the global filters, so it changes with genre, tier, and confidence selections."
        >
          <div className="space-y-3">
            {venueRows.map(([label, count]) => (
              <div key={label} className="grid grid-cols-[minmax(120px,210px)_1fr_auto] items-center gap-3 text-sm">
                <span className="truncate text-slate-200">{label}</span>
                <span className="h-2 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-sky" style={{ width: `${(count / maxVenue) * 100}%` }} />
                </span>
                <span className="font-semibold text-white">{count}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Touring Versus Streaming Matrix"
          description="This matrix compares Spotify monthly listeners with latest public tour gross, both log scaled. It helps separate current online attention from proven live-market revenue. Artists missing tour gross are excluded from the plot and counted in the data-quality section instead of being plotted as zero."
        >
          <div className="h-[420px]" role="img" aria-label="Tour gross versus Spotify monthly listeners scatter plot.">
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 24, right: 28, bottom: 30, left: 16 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis
                  dataKey="x"
                  type="number"
                  scale="log"
                  domain={positiveDomain(tourRows.map((artist) => artist.streaming.spotifyMonthlyListeners ?? 0))}
                  tickFormatter={formatCount}
                  stroke="#94A3B8"
                />
                <YAxis
                  dataKey="y"
                  type="number"
                  scale="log"
                  domain={positiveDomain(tourRows.map((artist) => artist.live.tourGrossUsd ?? 0))}
                  tickFormatter={formatMoney}
                  stroke="#94A3B8"
                  width={78}
                />
                <Tooltip content={<TourTooltip />} />
                <Scatter
                  data={tourRows.map((artist) => ({
                    x: artist.streaming.spotifyMonthlyListeners,
                    y: artist.live.tourGrossUsd,
                    artist
                  }))}
                  onClick={(point) => {
                    const payload = point as { artist?: ArtistRecord };
                    if (payload.artist) onSelect(payload.artist);
                  }}
                  cursor="pointer"
                >
                  {tourRows.map((artist) => (
                    <Cell key={artist.id} fill={tierColor(artist.tier.ordinal)} stroke={tierColor(artist.tier.ordinal)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}

function RankedList({
  title,
  description,
  artists,
  value,
  format,
  detail,
  onSelect
}: {
  title: string;
  description: string;
  artists: ArtistRecord[];
  value: (artist: ArtistRecord) => number | null;
  format: (value: number | null) => string;
  detail?: (artist: ArtistRecord) => string | null;
  onSelect: (artist: ArtistRecord) => void;
}) {
  const rows = [...artists]
    .filter((artist) => value(artist) !== null)
    .sort((a, b) => (value(b) ?? 0) - (value(a) ?? 0))
    .slice(0, 14);
  const max = Math.max(...rows.map((artist) => value(artist) ?? 0), 1);

  return (
    <ChartCard title={title} description={description}>
      <div className="space-y-3">
        {rows.map((artist) => {
          const current = value(artist) ?? 0;
          return (
            <button
              key={artist.id}
              type="button"
              onClick={() => onSelect(artist)}
              className="grid w-full grid-cols-[minmax(120px,220px)_1fr_auto] items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-left hover:border-mint/40"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-white">{artist.artist}</span>
                {detail?.(artist) ? (
                  <span className="block truncate text-xs text-slate-500">{detail(artist)}</span>
                ) : (
                  <TierBadge ordinal={artist.tier.ordinal} compact />
                )}
              </span>
              <span className="h-2 overflow-hidden rounded-full bg-white/10">
                <span className="block h-full rounded-full bg-amber" style={{ width: `${(current / max) * 100}%` }} />
              </span>
              <span className="text-sm font-semibold text-white">{format(current)}</span>
            </button>
          );
        })}
      </div>
    </ChartCard>
  );
}

function tourDetail(artist: ArtistRecord): string | null {
  if (!artist.live.latestTourName && !artist.live.latestTourYears) return null;
  return [artist.live.latestTourName, artist.live.latestTourYears].filter(Boolean).join(" · ");
}

function TourTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { artist: ArtistRecord } }> }) {
  if (!active || !payload?.length) return null;
  const artist = payload[0].payload.artist;
  return (
    <div className="rounded-lg border border-white/10 bg-panel p-4 text-sm shadow-glow">
      <div className="font-semibold text-white">{artist.artist}</div>
      <div className="mt-2 text-slate-300">Spotify monthly listeners: {formatCount(artist.streaming.spotifyMonthlyListeners)}</div>
      <div className="text-slate-300">Latest public tour gross: {formatMoney(artist.live.tourGrossUsd)}</div>
      <div className="text-slate-300">Latest tour: {tourDetail(artist) ?? "Unknown"}</div>
      <div className="text-slate-300">Tier: {artist.tier.label ?? "N/A"}</div>
    </div>
  );
}
