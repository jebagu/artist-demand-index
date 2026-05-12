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
          title="Top Streaming Footprint"
          description="Top 10 only, ranked by Spotify monthly listeners. This is a current platform footprint signal, not a full-roster ranking or lifetime catalog measure."
          artists={artists}
          value={(artist) => artist.streaming.spotifyMonthlyListeners}
          format={formatCount}
          onSelect={onSelect}
          limit={10}
        />
        <Leaderboard
          title="Top Social Reach"
          description="Top 10 only, ranked by known Instagram, X/Twitter, and Facebook reach. Missing platforms are not inferred."
          artists={artists}
          value={(artist) => artist.social.totalReach}
          format={formatCount}
          onSelect={onSelect}
          limit={10}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartCard
          title="Social Platform Breakdown"
          description="Top 12 by total social reach, split across Instagram, X/Twitter, and Facebook. Missing platform counts are not treated as hidden followers."
        >
          <div className="space-y-3">
            {[...artists]
              .filter((artist) => artist.social.totalReach)
              .sort((a, b) => (b.social.totalReach ?? 0) - (a.social.totalReach ?? 0))
              .slice(0, 12)
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

      <AtmosResearchStatus artists={artists} />
    </section>
  );
}

function AtmosResearchStatus({ artists }: { artists: ArtistRecord[] }) {
  const pending = artists.filter((artist) => artist.atmos.status === "pending").length;
  const researched = artists.filter((artist) => artist.atmos.status === "researched").length;
  const inconclusive = artists.filter((artist) => artist.atmos.status === "inconclusive").length;
  const yes = artists.filter((artist) => artist.atmos.hasAtmosAlbum === true).length;
  const no = artists.filter((artist) => artist.atmos.hasAtmosAlbum === false).length;

  return (
    <ChartCard
      className="mt-6"
      title="Atmos Research Status"
      description="Album-level Dolby Atmos / Spatial Audio research is tracked separately from demand. Rows stay pending until a cited Yes, No, or inconclusive result is imported."
    >
      <div className="grid gap-3 md:grid-cols-5">
        <AtmosMetric label="Pending" value={pending} />
        <AtmosMetric label="Researched" value={researched} />
        <AtmosMetric label="Inconclusive" value={inconclusive} />
        <AtmosMetric label="Confirmed Yes" value={yes} />
        <AtmosMetric label="Confirmed No" value={no} />
      </div>
    </ChartCard>
  );
}

function AtmosMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{formatCount(value)}</div>
    </div>
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
