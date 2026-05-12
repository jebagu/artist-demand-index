import type { ArtistRecord, SummaryStats } from "../types";
import { ChartCard } from "../components/ChartCard";
import { TierBadge } from "../components/TierBadge";
import { formatCount } from "../lib/format";
import { tierColor } from "../lib/tier";

type OnlineFootprintSectionProps = {
  artists: ArtistRecord[];
  summary: SummaryStats;
  onSelect: (artist: ArtistRecord) => void;
};

export function OnlineFootprintSection({ artists, summary, onSelect }: OnlineFootprintSectionProps) {
  return (
    <section id="online" className="scroll-mt-32">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-mint">Online footprint</p>
        <h2 className="text-3xl font-semibold text-white">Actual streaming and social reach</h2>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Leaderboard
          title="Streaming Leaderboard"
          description="This ranks artists by Spotify monthly listeners from the Streaming Detail workbook tab. Monthly listeners are a current platform footprint signal, not lifetime catalog consumption. Missing listener values are excluded rather than plotted as zero."
          artists={artists}
          value={(artist) => artist.streaming.spotifyMonthlyListeners}
          format={formatCount}
          onSelect={onSelect}
        />
        <Leaderboard
          title="Social Reach Leaderboard"
          description="This ranks artists by total social reach from the Social Media workbook tab. Total social reach is the sum of available Instagram followers, X/Twitter followers, and Facebook followers. If one platform is missing, the dashboard does not infer it from the other platforms, so the total is only the known public follower count."
          artists={artists}
          value={(artist) => artist.social.totalReach}
          format={formatCount}
          onSelect={onSelect}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartCard
          title="Social Platform Breakdown"
          description="This chart shows the top 25 artists by total social reach and splits each total across Instagram, X/Twitter, and Facebook. The bar segments are based only on platform counts present in the Social Media tab. Missing platform counts are not treated as hidden followers; they simply do not contribute to the total."
        >
          <div className="space-y-3">
            {[...artists]
              .filter((artist) => artist.social.totalReach)
              .sort((a, b) => (b.social.totalReach ?? 0) - (a.social.totalReach ?? 0))
              .slice(0, 25)
              .map((artist) => {
                const total = artist.social.totalReach ?? 1;
                const instagram = ((artist.social.instagramFollowers ?? 0) / total) * 100;
                const x = ((artist.social.xFollowers ?? 0) / total) * 100;
                const facebook = ((artist.social.facebookFollowers ?? 0) / total) * 100;
                return (
                  <button
                    key={artist.id}
                    type="button"
                    onClick={() => onSelect(artist)}
                    className="grid w-full grid-cols-[minmax(115px,190px)_1fr_auto] items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3 text-left hover:border-mint/40 focus:outline-none focus:ring-2 focus:ring-mint/30"
                  >
                    <span>
                      <span className="block truncate text-sm font-medium text-white">{artist.artist}</span>
                      <span className="text-xs text-slate-500">{artist.social.verifiedStatus ?? "Verification unknown"}</span>
                    </span>
                    <span className="flex h-3 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                      <span className="bg-mint" style={{ width: `${instagram}%` }} />
                      <span className="bg-sky" style={{ width: `${x}%` }} />
                      <span className="bg-amber" style={{ width: `${facebook}%` }} />
                    </span>
                    <span className="text-sm font-semibold text-white">{formatCount(total)}</span>
                  </button>
                );
              })}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-slate-400">
            <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-mint" />Instagram</span>
            <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-sky" />X</span>
            <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-amber" />Facebook</span>
          </div>
        </ChartCard>

        <ChartCard
          title="Listener vs Follower Ratio"
          description="This ratio compares Spotify monthly listeners with Spotify followers from the Streaming Detail tab. It is a directional signal for artists with unusually high current listening relative to their follower base. Artists missing either value are excluded from the ratio rather than treated as zero."
        >
          <div className="space-y-3">
            {[...artists]
              .filter((artist) => artist.streaming.spotifyMonthlyListeners && artist.streaming.spotifyFollowers)
              .map((artist) => ({
                artist,
                ratio: (artist.streaming.spotifyMonthlyListeners ?? 0) / Math.max(1, artist.streaming.spotifyFollowers ?? 1)
              }))
              .sort((a, b) => b.ratio - a.ratio)
              .slice(0, 14)
              .map(({ artist, ratio }) => (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => onSelect(artist)}
                  className="flex w-full items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-left hover:border-mint/40"
                >
                  <span className="truncate text-sm text-white">{artist.artist}</span>
                  <span className="text-sm font-semibold text-mint">{ratio.toFixed(1)}x</span>
                </button>
              ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Social reach available for {formatCount(summary.missingnessCounts.socialReach?.available)} of {formatCount(summary.totalArtistCount)} artists.
          </p>
        </ChartCard>
      </div>

      <div className="mt-6">
        <Leaderboard
          title="Catalog Depth"
          description="This ranks estimated lifetime catalog streams from the Catalog Info or Streaming Detail workbook data. It is meant to show durable catalog strength across an artist's body of work, not just current monthly listening. Because it is an estimate, use it as a relative signal and confirm any high-stakes booking assumptions against the original source notes."
          artists={artists}
          value={(artist) => artist.streaming.estimatedCatalogStreams}
          format={formatCount}
          onSelect={onSelect}
          limit={20}
        />
      </div>
    </section>
  );
}

function Leaderboard({
  title,
  description,
  artists,
  value,
  format,
  onSelect,
  limit = 15
}: {
  title: string;
  description: string;
  artists: ArtistRecord[];
  value: (artist: ArtistRecord) => number | null;
  format: (value: number | null) => string;
  onSelect: (artist: ArtistRecord) => void;
  limit?: number;
}) {
  const rows = [...artists]
    .filter((artist) => value(artist) !== null)
    .sort((a, b) => (value(b) ?? 0) - (value(a) ?? 0))
    .slice(0, limit);
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
              className="grid w-full grid-cols-[minmax(115px,220px)_1fr_auto] items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-left hover:border-mint/40 focus:outline-none focus:ring-2 focus:ring-mint/30"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-white">{artist.artist}</span>
                <TierBadge ordinal={artist.tier.ordinal} compact />
              </span>
              <span className="h-2 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${(current / max) * 100}%`, background: tierColor(artist.tier.ordinal) }}
                />
              </span>
              <span className="text-sm font-semibold text-white">{format(current)}</span>
            </button>
          );
        })}
      </div>
    </ChartCard>
  );
}
