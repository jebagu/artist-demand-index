import type { ArtistRecord, SummaryStats } from "../types";
import { ChartCard } from "../components/ChartCard";
import { TierBadge } from "../components/TierBadge";
import { defaultArtistSort } from "../lib/filters";
import { tierColor, tierOrder } from "../lib/tier";

type GenreProgrammingSectionProps = {
  artists: ArtistRecord[];
  summary: SummaryStats;
  onSelect: (artist: ArtistRecord) => void;
};

const lanes = [
  {
    title: "Commercial Headliners",
    match: (artist: ArtistRecord) => (artist.tier.ordinal ?? 0) >= 5,
    copy: "Global names for commercial draw, sponsorship gravity, and broad-market visibility."
  },
  {
    title: "Festival/Theater Draws",
    match: (artist: ArtistRecord) => artist.tier.ordinal === 4,
    copy: "Strong but more selective draw, often better for theater, festival, or special-event packages."
  },
  {
    title: "Club and Electronic Specialists",
    match: (artist: ArtistRecord) => /house|techno|electronic|idm|ambient|downtempo/i.test(artist.identity.cluster ?? ""),
    copy: "Immersive-fit artists with club, electronic, or niche-festival utility."
  },
  {
    title: "Sound/Visual Art and Institutional Programming",
    match: (artist: ArtistRecord) => /sound|avant|visual|art/i.test(artist.identity.cluster ?? ""),
    copy: "Curatorial and institutional programs where fit matters more than mass ticket-demand signal."
  }
];

export function GenreProgrammingSection({ artists, summary, onSelect }: GenreProgrammingSectionProps) {
  const clusters = Object.entries(summary.genreClusterCounts).sort((a, b) => b[1] - a[1]);
  const maxCluster = Math.max(...clusters.map(([, count]) => count), 1);

  return (
    <section id="genres" className="scroll-mt-32">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-mint">Genre and programming</p>
        <h2 className="text-3xl font-semibold text-white">Use the dataset as a portfolio, not a single ranked list</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Genre Cluster Distribution"
          description="This counts artists by the Sonic Sphere genre cluster assigned in the Genre Classification workbook tab. It reflects the current filtered artist set, so search and filters can change the cluster mix. The chart is a programming lens, not a demand score."
        >
          <div className="space-y-3">
            {clusters.map(([cluster, count]) => (
              <div key={cluster} className="grid grid-cols-[minmax(130px,230px)_1fr_auto] items-center gap-3 text-sm">
                <span className="truncate text-slate-200">{cluster}</span>
                <span className="h-2 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-mint" style={{ width: `${(count / maxCluster) * 100}%` }} />
                </span>
                <span className="font-semibold text-white">{count}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Tier Mix by Genre Cluster"
          description="This stacks workbook demand tiers inside each genre cluster. It shows where a cluster contains commercial headliners versus more specialist or curatorial candidates. The tier mix uses existing workbook tiers and does not recalculate fit by genre."
        >
          <div className="space-y-4">
            {clusters.slice(0, 12).map(([cluster]) => {
              const rows = artists.filter((artist) => artist.identity.cluster === cluster);
              const total = Math.max(rows.length, 1);
              return (
                <div key={cluster}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="truncate text-slate-200">{cluster}</span>
                    <span className="text-slate-500">{rows.length}</span>
                  </div>
                  <div className="flex h-3 overflow-hidden rounded-full bg-white/10">
                    {tierOrder.map((tier) => {
                      const count = rows.filter((artist) => artist.tier.ordinal === tier).length;
                      return (
                        <span
                          key={String(tier)}
                          title={`${tier ?? "N/A"}: ${count}`}
                          style={{ width: `${(count / total) * 100}%`, background: tierColor(tier) }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-4">
        {lanes.map((lane) => {
          const laneArtists = artists.filter(lane.match).sort(defaultArtistSort).slice(0, 6);
          return (
            <article key={lane.title} className="rounded-lg border border-white/10 bg-panel/86 p-5">
              <h3 className="text-lg font-semibold text-white">{lane.title}</h3>
              <p className="mt-2 min-h-[96px] text-sm leading-6 text-slate-300">{lane.copy}</p>
              <div className="mt-4 space-y-2">
                {laneArtists.map((artist) => (
                  <button
                    key={artist.id}
                    type="button"
                    onClick={() => onSelect(artist)}
                    className="flex w-full items-center justify-between gap-2 rounded-md bg-white/[0.04] px-3 py-2 text-left hover:bg-white/[0.08]"
                  >
                    <span className="truncate text-sm text-white">{artist.artist}</span>
                    <TierBadge ordinal={artist.tier.ordinal} compact />
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-200">
        Sonic Sphere should not read the dataset as one ranked booking list. It is more useful as a portfolio: global names for commercial draw, electronic and ambient artists for immersive fit, and sound/visual artists for institutional or gallery programming.
      </p>
    </section>
  );
}
