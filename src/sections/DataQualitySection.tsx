import type { ArtistRecord, DataHealth, SummaryStats } from "../types";
import { ChartCard } from "../components/ChartCard";
import { TierBadge } from "../components/TierBadge";
import { formatCount } from "../lib/format";
import { defaultArtistSort } from "../lib/filters";

type DataQualitySectionProps = {
  artists: ArtistRecord[];
  summary: SummaryStats;
  health: DataHealth;
  onSelect: (artist: ArtistRecord) => void;
};

const matrixColumns = [
  ["Spotify monthly listeners", (artist: ArtistRecord) => artist.streaming.spotifyMonthlyListeners !== null],
  ["Followers", (artist: ArtistRecord) => artist.streaming.spotifyFollowers !== null],
  ["Social", (artist: ArtistRecord) => artist.social.totalReach !== null],
  ["Tour", (artist: ArtistRecord) => artist.live.tourGrossUsd !== null],
  ["RIAA", (artist: ArtistRecord) => artist.sales.riaaTotalUnits !== null],
  ["Catalog", (artist: ArtistRecord) => artist.streaming.estimatedCatalogStreams !== null],
  ["Bandsintown", (artist: ArtistRecord) => artist.live.bandsintownFollowers !== null],
  ["Heat", (artist: ArtistRecord) => artist.heat.score !== null],
  ["QA", (artist: ArtistRecord) => artist.qa.confidenceRating !== null]
] as const;

export function DataQualitySection({ artists, summary, health, onSelect }: DataQualitySectionProps) {
  const confidenceRows = [5, 4, 3, 2, 1].map((value) => ({
    value,
    count: summary.confidenceDistribution[String(value)] ?? 0
  }));
  const maxConfidence = Math.max(...confidenceRows.map((row) => row.count), 1);
  const matrixRows = [...artists].sort(defaultArtistSort).slice(0, 90);

  return (
    <section id="quality" className="scroll-mt-32">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-mint">Data quality</p>
        <h2 className="text-3xl font-semibold text-white">Trust, missingness, and inconsistencies are visible by design</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <ChartCard
          title="Confidence Distribution"
          description="Confidence ratings come from the Sources & QA workbook tab. They describe how trustworthy the collected public data is for each artist, not how strong the artist is. Low confidence should push users to verify source notes before making booking decisions."
        >
          <div className="space-y-3">
            {confidenceRows.map((row) => (
              <div key={row.value} className="grid grid-cols-[80px_1fr_auto] items-center gap-3 text-sm">
                <span className="text-slate-300">{row.value}/5</span>
                <span className="h-2 rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-mint" style={{ width: `${(row.count / maxConfidence) * 100}%` }} />
                </span>
                <span className="font-semibold text-white">{row.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Missingness Summary"
          description="Unknown is not zero. Missing Spotify, social, latest tour gross, certification, or catalog data means the public research pass did not capture a usable value. Low confidence should be treated as a warning about source quality, not as a weak artist signal."
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {Object.entries(summary.missingnessCounts).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <div className="text-xs uppercase tracking-[0.14em] text-slate-500">{labelFor(key)}</div>
                <div className="mt-2 text-2xl font-semibold text-white">{formatCount(value.available)}</div>
                <div className="text-xs text-slate-400">{formatCount(value.missing)} missing</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            This dashboard is strongest as a directional demand map. It is not a booking database. Before outreach, verify current social counts, touring availability, routing, guarantee expectations, and agent contacts.
          </p>
        </ChartCard>
      </div>

      <KimiImportPanel artists={artists} health={health} summary={summary} />

      <ChartCard
        className="mt-6"
        title="Missingness Matrix"
        description="Rows are sorted by tier, confidence, then artist. Filled marks mean the metric is present in the generated dashboard data. Empty marks mean the value is unknown or unusable, not that the artist has zero activity."
      >
        <div className="overflow-x-auto">
          <table className="min-w-[850px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-slate-500">
                <th className="py-3 pr-4">Artist</th>
                <th className="py-3 pr-4">Tier</th>
                {matrixColumns.map(([label]) => (
                  <th key={label} className="px-2 py-3 text-center">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((artist) => (
                <tr key={artist.id} className="border-b border-white/5">
                  <td className="py-2 pr-4">
                    <button type="button" onClick={() => onSelect(artist)} className="font-medium text-white hover:text-mint">
                      {artist.artist}
                    </button>
                  </td>
                  <td className="py-2 pr-4">
                    <TierBadge ordinal={artist.tier.ordinal} compact />
                  </td>
                  {matrixColumns.map(([label, getter]) => (
                    <td key={label} className="px-2 py-2 text-center">
                      <span
                        className={`inline-block h-3 w-3 rounded-sm ${getter(artist) ? "bg-mint" : "border border-coral/50 bg-coral/10"}`}
                        aria-label={getter(artist) ? "present" : "missing"}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {artists.length > matrixRows.length ? <p className="mt-3 text-xs text-slate-500">Showing first {matrixRows.length} rows.</p> : null}
      </ChartCard>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Consistency Warnings" description="Detail-tab values are used for raw footprint charts when master or normalization values disagree.">
          <details open className="text-sm">
            <summary className="cursor-pointer text-slate-100">{health.consistencyWarnings.length} warnings</summary>
            <div className="mt-3 max-h-[360px] space-y-2 overflow-y-auto pr-2">
              {health.consistencyWarnings.map((warning, index) => (
                <button
                  key={`${warning.id}-${index}`}
                  type="button"
                  onClick={() => {
                    const artist = artists.find((item) => item.id === warning.id);
                    if (artist) onSelect(artist);
                  }}
                  className="block w-full rounded-md border border-white/10 bg-white/[0.04] p-3 text-left text-slate-300 hover:border-coral/40"
                >
                  <span className="font-semibold text-white">{warning.artist}</span>: {warning.message}
                </button>
              ))}
            </div>
          </details>
        </ChartCard>

        <ChartCard title="Disambiguation Issues" description="Identity caveats from Sources & QA.">
          <div className="max-h-[360px] space-y-2 overflow-y-auto pr-2">
            {health.disambiguationIssues.length ? (
              health.disambiguationIssues.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => {
                    const artist = artists.find((item) => item.id === issue.id);
                    if (artist) onSelect(artist);
                  }}
                  className="block w-full rounded-md border border-white/10 bg-white/[0.04] p-3 text-left text-sm text-slate-300 hover:border-mint/40"
                >
                  <span className="font-semibold text-white">{issue.artist}</span>: {issue.issue}
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-400">No disambiguation issues in the current filtered view.</p>
            )}
          </div>
        </ChartCard>
      </div>
    </section>
  );
}

function labelFor(key: string): string {
  const labels: Record<string, string> = {
    spotifyMonthlyListeners: "Spotify monthly listeners",
    socialReach: "Total social reach",
    tourGrossUsd: "Latest public tour gross",
    catalogStreams: "Estimated lifetime catalog streams",
    bandsintownFollowers: "Bandsintown followers"
  };
  if (labels[key]) return labels[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .replace("Usd", "USD");
}

function KimiImportPanel({ artists, health, summary }: { artists: ArtistRecord[]; health: DataHealth; summary: SummaryStats }) {
  const kimi = health.parser.kimiRound2;
  if (!kimi?.available) return null;

  const remainingFollowers = artists.filter((artist) => artist.streaming.spotifyFollowers === null);
  const remainingSocial = artists.filter((artist) => artist.social.totalReach === null);
  const remainingCatalog = artists.filter((artist) => artist.streaming.estimatedCatalogStreams === null);
  const supportedFields = Object.entries(kimi.supportedFields).sort((a, b) => b[1] - a[1]);
  const unsupportedFields = Object.entries(kimi.unsupportedFields).sort((a, b) => b[1] - a[1]);

  return (
    <ChartCard
      className="mt-6"
      title="Kimi Round 2 Import"
      description="The dashboard is now using supported values from the latest Kimi research package. Unsupported fields are preserved in data/kimi/round2 and need explicit schema support before they affect charts."
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <ImportMetric label="Applied values" value={formatCount(kimi.appliedUpdates)} detail={`${formatCount(kimi.updatedArtists)} artists updated`} />
        <ImportMetric label="Research rows" value={formatCount(kimi.updateRows)} detail={`${formatCount(kimi.filesRead)} priority files read`} />
        <ImportMetric label="Remaining followers" value={formatCount(remainingFollowers.length)} detail="After round 2" />
        <ImportMetric label="Remaining social" value={formatCount(remainingSocial.length)} detail="Missing total reach" />
        <ImportMetric label="Remaining catalog" value={formatCount(remainingCatalog.length)} detail="Missing catalog streams" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Supported imported fields</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {supportedFields.map(([field, count]) => (
              <span key={field} className="rounded-md border border-mint/20 bg-mint/10 px-2.5 py-1 text-xs text-mint">
                {field}: {count}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Still unsupported by schema</h3>
          <div className="mt-3 flex max-h-32 flex-wrap gap-2 overflow-y-auto pr-1">
            {unsupportedFields.slice(0, 14).map(([field, count]) => (
              <span key={field} className="rounded-md border border-amber/20 bg-amber/10 px-2.5 py-1 text-xs text-amber">
                {field}: {count}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-400">
            Includes live performance prose, certification subfields, and programming identity fields. They are archived but not charted yet.
          </p>
        </div>
      </div>

      <details className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
        <summary className="cursor-pointer font-medium text-slate-100">Remaining Spotify follower gaps</summary>
        <div className="mt-3 flex flex-wrap gap-2">
          {remainingFollowers.map((artist) => (
            <span key={artist.id} className="rounded-md bg-white/8 px-2.5 py-1 text-xs text-slate-300">
              {artist.artist}
            </span>
          ))}
        </div>
      </details>

      <p className="mt-4 text-xs text-slate-500">
        Current available social reach: {formatCount(summary.missingnessCounts.socialReach.available)} of {formatCount(summary.totalArtistCount)} artists.
      </p>
    </ChartCard>
  );
}

function ImportMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      <div className="text-xs text-slate-400">{detail}</div>
    </div>
  );
}
