import { X } from "lucide-react";
import type { ArtistRecord } from "../types";
import { ChartCard } from "../components/ChartCard";
import { ConfidenceBadge } from "../components/ConfidenceBadge";
import { MissingDataBadge } from "../components/MissingDataBadge";
import { TierBadge } from "../components/TierBadge";
import { formatCount, formatMoney, formatScore } from "../lib/format";
import { defaultArtistSort } from "../lib/filters";

type CompareSectionProps = {
  artists: ArtistRecord[];
  selected: ArtistRecord[];
  onAdd: (artist: ArtistRecord) => void;
  onRemove: (id: number) => void;
  onSelect: (artist: ArtistRecord) => void;
};

const dimensions = [
  ["Spotify", "spotifyScore"],
  ["Social", "socialScore"],
  ["Tour", "tourScore"],
  ["RIAA", "riaaScore"]
] as const;

export function CompareSection({ artists, selected, onAdd, onRemove, onSelect }: CompareSectionProps) {
  const sorted = [...artists].sort(defaultArtistSort);
  const highlights = getHighlights(selected);

  return (
    <section id="compare" className="scroll-mt-32">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-mint">Artist detail and compare</p>
        <h2 className="text-3xl font-semibold text-white">Compare up to five artists without inventing a new score</h2>
      </div>

      <ChartCard
        title="Compare Mode"
        description="Compare mode uses the workbook normalized dimensions and the same raw metrics shown elsewhere in the dashboard. Spotify monthly listeners and social reach are current footprint signals; latest public tour gross is not lifetime touring revenue. Catalog streams and RIAA units are lifetime-style catalog and certification signals."
      >
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end">
          <label className="block flex-1 text-sm">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Add artist</span>
            <select
              value=""
              onChange={(event) => {
                const artist = artists.find((item) => item.id === Number(event.target.value));
                if (artist) onAdd(artist);
              }}
              disabled={selected.length >= 5}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-slate-100 outline-none focus:border-mint focus:ring-2 focus:ring-mint/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select artist...</option>
              {sorted.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.artist}
                </option>
              ))}
            </select>
          </label>
          <p className="text-sm text-slate-400">{selected.length}/5 selected</p>
        </div>

        {selected.length ? (
          <>
            <div className="grid gap-4 xl:grid-cols-5">
              {selected.map((artist) => (
                <article key={artist.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <button type="button" onClick={() => onSelect(artist)} className="text-left">
                      <h3 className="text-lg font-semibold text-white">{artist.artist}</h3>
                      <p className="text-xs text-slate-500">{artist.identity.cluster ?? "Unknown cluster"}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(artist.id)}
                      className="rounded-md border border-white/10 p-1.5 text-slate-400 hover:border-coral/40 hover:text-white"
                      aria-label={`Remove ${artist.artist} from compare`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <TierBadge ordinal={artist.tier.ordinal} />
                    <ConfidenceBadge value={artist.qa.confidenceRating} />
                    <MissingDataBadge flags={artist.qa.missingDataFlags} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Metric label="Composite" value={formatScore(artist.tier.compositeScore)} />
                    <Metric label="Spotify monthly listeners" value={formatCount(artist.streaming.spotifyMonthlyListeners)} />
                    <Metric label="Social reach" value={formatCount(artist.social.totalReach)} />
                    <Metric label="Latest tour gross" value={formatMoney(artist.live.tourGrossUsd)} />
                    <Metric label="Lifetime RIAA units" value={formatCount(artist.sales.riaaTotalUnits)} />
                    <Metric label="Lifetime catalog streams" value={formatCount(artist.streaming.estimatedCatalogStreams)} />
                  </div>
                  <div className="mt-4 space-y-3">
                    {dimensions.map(([label, key]) => {
                      const value = artist.normalized[key];
                      return (
                        <div key={label}>
                          <div className="mb-1 flex justify-between text-xs text-slate-500">
                            <span>{label}</span>
                            <span>{formatScore(value)}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-mint" style={{ width: `${Math.max(0, Math.min(value ?? 0, 100))}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
            {highlights.length ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {highlights.map((highlight) => (
                  <div key={highlight.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                    <div className="text-xs uppercase tracking-[0.14em] text-slate-500">{highlight.label}</div>
                    <div className="mt-1 text-sm font-semibold text-white">{highlight.artist}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-sm text-slate-300">
            Select artists here or add them from any artist drawer.
          </div>
        )}
      </ChartCard>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-black/15 p-2">
      <div className="text-[10px] font-medium leading-tight text-slate-500">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function getHighlights(selected: ArtistRecord[]) {
  if (selected.length < 2) return [];
  const by = (label: string, getter: (artist: ArtistRecord) => number | null) => {
    const winner = [...selected].sort((a, b) => (getter(b) ?? -1) - (getter(a) ?? -1))[0];
    return winner ? { label, artist: winner.artist } : null;
  };
  return [
    by("Highest streaming", (artist) => artist.streaming.spotifyMonthlyListeners),
    by("Highest social", (artist) => artist.social.totalReach),
    by("Highest live gross", (artist) => artist.live.tourGrossUsd),
    by("Best confidence", (artist) => artist.qa.confidenceRating),
    by("Most incomplete", (artist) => 100 - artist.qa.completenessScore)
  ].filter((item): item is { label: string; artist: string } => Boolean(item));
}
