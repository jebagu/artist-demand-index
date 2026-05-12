import { useState } from "react";
import type { ArtistRecord, SummaryStats } from "../types";
import { ChartCard } from "../components/ChartCard";
import { TierBadge } from "../components/TierBadge";
import { ConfidenceBadge } from "../components/ConfidenceBadge";
import { MissingDataBadge } from "../components/MissingDataBadge";
import { formatCount, formatScore } from "../lib/format";
import { defaultArtistSort } from "../lib/filters";
import { tierBg, tierColor, tierKey, tierMeta, tierOrder } from "../lib/tier";

type TierBookingSectionProps = {
  artists: ArtistRecord[];
  summary: SummaryStats;
  onSelect: (artist: ArtistRecord) => void;
};

export function TierBookingSection({ artists, summary, onSelect }: TierBookingSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const ranked = [...artists].sort(compositeScoreSort).slice(0, showAll ? artists.length : 50);

  return (
    <section id="tiers" className="scroll-mt-32">
      <div className="mb-5 flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-mint">Tier and booking fit</p>
        <h2 className="text-3xl font-semibold text-white">What each tier means operationally</h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {tierOrder.map((tier) => {
          const key = tierKey(tier);
          const tierArtists = artists.filter((artist) => artist.tier.ordinal === tier).sort(defaultArtistSort);
          const medianSpotify = median(tierArtists.map((artist) => artist.streaming.spotifyMonthlyListeners));
          const lowConfidence = tierArtists.filter((artist) => (artist.qa.confidenceRating ?? 0) <= 2).length;
          return (
            <article key={key} className="rounded-lg border border-white/10 bg-panel/86 p-5" style={{ background: tierBg(tier) }}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <TierBadge ordinal={tier} />
                <span className="text-2xl font-semibold text-white">{summary.tierCounts[key] ?? 0}</span>
              </div>
              <p className="min-h-[72px] text-sm leading-6 text-slate-200">{tierMeta[key].meaning}</p>
              <dl className="mt-4 grid gap-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Median Spotify monthly listeners</dt>
                  <dd className="text-white">{formatCount(medianSpotify)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Common venue</dt>
                  <dd className="text-right text-white">{commonValue(tierArtists.map((artist) => artist.live.venueScale)) ?? "Unknown"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Low-confidence profiles</dt>
                  <dd className={lowConfidence ? "text-amber" : "text-mint"}>{lowConfidence}</dd>
                </div>
              </dl>
              <div className="mt-4 space-y-2">
                {tierArtists.slice(0, 5).map((artist) => (
                  <button
                    key={artist.id}
                    type="button"
                    onClick={() => onSelect(artist)}
                    className="flex w-full items-center justify-between gap-3 rounded-md bg-black/15 px-3 py-2 text-left text-sm transition hover:bg-black/25 focus:outline-none focus:ring-2 focus:ring-mint/30"
                  >
                    <span className="truncate text-white">{artist.artist}</span>
                    <span className="text-slate-300">{formatScore(artist.tier.compositeScore)}</span>
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <ChartCard
        className="mt-6"
        title="Composite Score Ranking"
        description="This ranking uses the composite score already present in the workbook normalization tab. The dashboard does not create a new score or change the workbook formula. The workbook score combines log-normalized Spotify monthly listeners, social followers, latest public tour gross, and lifetime RIAA units, then weights them as Spotify 35%, social 25%, tour 25%, and RIAA 15%."
      >
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-mint/40 hover:text-white"
          >
            {showAll ? "Show top 50" : "Show all"}
          </button>
        </div>
        <div className="space-y-2">
          {ranked.map((artist) => (
            <button
              key={artist.id}
              type="button"
              onClick={() => onSelect(artist)}
              className="grid w-full grid-cols-[minmax(120px,240px)_1fr_auto] items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition hover:border-mint/40 focus:outline-none focus:ring-2 focus:ring-mint/30"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-white">{artist.artist}</span>
                <span className="block truncate text-xs text-slate-500">{artist.identity.cluster ?? "Unknown cluster"}</span>
              </span>
              <span className="h-2 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${Math.max(2, artist.tier.compositeScore ?? 0)}%`,
                    background: tierColor(artist.tier.ordinal)
                  }}
                />
              </span>
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{formatScore(artist.tier.compositeScore)}</span>
                <ConfidenceBadge value={artist.qa.confidenceRating} />
                <span className="hidden sm:inline">
                  <MissingDataBadge flags={artist.qa.missingDataFlags} />
                </span>
              </span>
            </button>
          ))}
        </div>
      </ChartCard>
    </section>
  );
}

function median(values: Array<number | null>): number | null {
  const actual = values.filter((value): value is number => value !== null).sort((a, b) => a - b);
  if (!actual.length) return null;
  const middle = Math.floor(actual.length / 2);
  return actual.length % 2 ? actual[middle] : (actual[middle - 1] + actual[middle]) / 2;
}

function commonValue(values: Array<string | null>): string | null {
  const counts = new Map<string, number>();
  values.filter(Boolean).forEach((value) => counts.set(value!, (counts.get(value!) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function compositeScoreSort(a: ArtistRecord, b: ArtistRecord): number {
  const scoreDiff = (b.tier.compositeScore ?? -1) - (a.tier.compositeScore ?? -1);
  if (scoreDiff !== 0) return scoreDiff;
  return defaultArtistSort(a, b);
}
