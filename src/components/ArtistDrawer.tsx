import { ExternalLink, Plus, X } from "lucide-react";
import type { ReactNode } from "react";
import type { ArtistRecord } from "../types";
import { formatCount, formatMoney, formatNullable, formatScore } from "../lib/format";
import { TierBadge } from "./TierBadge";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { MissingDataBadge } from "./MissingDataBadge";

type ArtistDrawerProps = {
  artist: ArtistRecord | null;
  onClose: () => void;
  onCompare: (artist: ArtistRecord) => void;
};

export function ArtistDrawer({ artist, onClose, onCompare }: ArtistDrawerProps) {
  if (!artist) return null;

  const interpretation = getInterpretation(artist);
  const dimensions = [
    ["Spotify", artist.normalized.spotifyScore],
    ["Social", artist.normalized.socialScore],
    ["Tour", artist.normalized.tourScore],
    ["RIAA", artist.normalized.riaaScore]
  ] as const;

  return (
    <aside
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:left-auto lg:w-[520px]"
      role="dialog"
      aria-modal="true"
      aria-label={`${artist.artist} detail profile`}
    >
      <div className="ml-auto flex h-full w-full max-w-[560px] flex-col border-l border-white/10 bg-ink shadow-glow">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <TierBadge ordinal={artist.tier.ordinal} />
              <ConfidenceBadge value={artist.qa.confidenceRating} />
              <MissingDataBadge flags={artist.qa.missingDataFlags} />
            </div>
            <h2 className="text-2xl font-semibold text-white">{artist.artist}</h2>
            <p className="mt-1 text-sm text-slate-400">{formatNullable(artist.tier.qualifierNote)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/10 p-2 text-slate-300 transition hover:border-coral/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-coral/30"
            aria-label="Close artist drawer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <p className="rounded-lg border border-mint/20 bg-mint/10 p-4 text-sm leading-6 text-slate-100">{interpretation}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Metric label="Composite" value={formatScore(artist.tier.compositeScore)} />
            <Metric label="Spotify monthly listeners" value={formatCount(artist.streaming.spotifyMonthlyListeners)} />
            <Metric label="Spotify followers" value={formatCount(artist.streaming.spotifyFollowers)} />
            <Metric label="Total social reach" value={formatCount(artist.social.totalReach)} />
            <Metric label="Latest public tour gross" value={formatMoney(artist.live.tourGrossUsd)} />
            <Metric label="Lifetime RIAA certified units" value={formatCount(artist.sales.riaaTotalUnits)} />
            <Metric label="Estimated lifetime catalog streams" value={formatCount(artist.streaming.estimatedCatalogStreams)} />
          </div>

          <Section title="Identity">
            <InfoGrid
              rows={[
                ["Type", artist.identity.artistType],
                ["Genre", artist.identity.primaryGenre],
                ["Cluster", artist.identity.cluster],
                ["Country/market", artist.identity.countryMarket],
                ["Language", artist.identity.language],
                ["Years active", artist.identity.yearsActive]
              ]}
            />
          </Section>

          <Section title="Normalized dimension scores">
            <div className="space-y-3">
              {dimensions.map(([label, value]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs text-slate-400">
                    <span>{label}</span>
                    <span>{formatScore(value)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-mint" style={{ width: `${Math.max(0, Math.min(value ?? 0, 100))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Social platform reach">
            <InfoGrid
              rows={[
                ["Instagram followers", formatSocialPlatform(artist.social.instagramFollowers, artist.social.instagramHandle)],
                ["X/Twitter followers", formatSocialPlatform(artist.social.xFollowers, artist.social.xHandle)],
                ["Facebook followers", formatSocialPlatform(artist.social.facebookFollowers, artist.social.facebookPage)],
                ["Total social reach", formatCount(artist.social.totalReach)],
                ["Verified status", artist.social.verifiedStatus]
              ]}
            />
          </Section>

          <Section title="Top tracks">
            {artist.streaming.topTracks.length ? (
              <div className="space-y-2">
                {artist.streaming.topTracks.map((track) => (
                  <div key={track.name} className="flex justify-between gap-3 rounded-md bg-white/5 px-3 py-2 text-sm">
                    <span className="text-slate-100">{track.name}</span>
                    <span className="text-slate-400">{formatCount(track.streams)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Unknown</p>
            )}
          </Section>

          <Section title="Live and touring">
            <InfoGrid
              rows={[
                ["Latest tour", artist.live.latestTourName],
                ["Tour years", artist.live.latestTourYears],
                ["Latest public tour gross", formatMoney(artist.live.tourGrossUsd)],
                ["Venue scale", artist.live.venueScale],
                ["Avg gross/show", formatMoney(artist.live.avgGrossPerShow)],
                ["Tickets sold", formatCount(artist.live.ticketsSold)],
                ["Shows", formatCount(artist.live.showsCount)],
                ["Festival headliner", artist.live.festivalHeadliner]
              ]}
            />
          </Section>

          <Section title="Atmos albums">
            <AtmosAlbums artist={artist} />
          </Section>

          <Section title="Heat and QA">
            <InfoGrid
              rows={[
                ["Major press", artist.heat.majorPress2024To2026],
                ["Awards", artist.heat.awardsLast3Years],
                ["Cultural moment", artist.heat.culturalMoment],
                ["Active touring", artist.heat.activeTouring2025To2026],
                ["Snapshot", artist.qa.sourceSnapshotDate],
                ["Disambiguation", artist.qa.disambiguationIssue]
              ]}
            />
            {artist.qa.consistencyWarnings.length ? (
              <ul className="mt-3 space-y-2 text-sm text-coral">
                {artist.qa.consistencyWarnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            ) : null}
          </Section>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-white/10 p-5">
          <button
            type="button"
            onClick={() => onCompare(artist)}
            className="inline-flex items-center gap-2 rounded-md bg-mint px-4 py-2 text-sm font-semibold text-ink transition hover:bg-mint/90 focus:outline-none focus:ring-2 focus:ring-mint/40"
          >
            <Plus size={16} />
            Add to compare
          </button>
          {artist.streaming.spotifyUrl ? (
            <a
              href={artist.streaming.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-mint/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-mint/30"
            >
              <ExternalLink size={16} />
              Spotify
            </a>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel p-3">
      <div className="text-xs font-medium leading-tight text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</h3>
      {children}
    </section>
  );
}

function InfoGrid({ rows }: { rows: Array<[string, string | number | null | undefined]> }) {
  return (
    <dl className="grid gap-2 text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[130px_1fr] gap-3 rounded-md bg-white/5 px-3 py-2">
          <dt className="text-slate-500">{label}</dt>
          <dd className="text-slate-200">{formatNullable(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function AtmosAlbums({ artist }: { artist: ArtistRecord }) {
  if (artist.atmos.status === "pending") {
    return (
      <p className="rounded-md bg-white/5 px-3 py-2 text-sm leading-6 text-slate-300">
        Atmos research pending. This artist has not been confirmed Yes or No in the local Atmos research file yet.
      </p>
    );
  }

  const atmosStatus = artist.atmos.status === "inconclusive" ? "Inconclusive" : artist.atmos.hasAtmosAlbum ? "Yes" : "No";

  return (
    <div className="space-y-3">
      <InfoGrid rows={[["Has Atmos album", atmosStatus], ["Researched at", artist.atmos.researchedAt], ["Research notes", artist.atmos.notes]]} />
      {artist.atmos.albums.length ? (
        <div className="space-y-2">
          {artist.atmos.albums.map((album, index) => (
            <div key={`${album.title}-${index}`} className="rounded-md bg-white/5 px-3 py-3 text-sm">
              <div className="font-semibold text-white">
                {album.title}
                {album.releaseYear ? <span className="font-normal text-slate-400"> ({album.releaseYear})</span> : null}
              </div>
              <div className="mt-1 text-slate-400">
                Source: {formatNullable(album.sourceService)} · Confidence: {album.confidence ? `${album.confidence}/5` : "Unknown"}
              </div>
              {album.notes ? <div className="mt-1 leading-6 text-slate-300">{album.notes}</div> : null}
              {album.sourceUrls.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {album.sourceUrls.map((url, sourceIndex) => (
                    <a
                      key={`${url}-${sourceIndex}`}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-slate-300 hover:border-mint/40 hover:text-white"
                    >
                      <ExternalLink size={12} />
                      Source {sourceIndex + 1}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function formatSocialPlatform(followers: number | null, handle: string | null): string {
  if (followers === null && !handle) return "Unknown";
  if (followers === null) return `Unknown (${handle})`;
  return handle ? `${formatCount(followers)} (${handle})` : formatCount(followers);
}

function getInterpretation(artist: ArtistRecord): string {
  const tier = artist.tier.ordinal ?? 0;
  const hasTour = artist.live.tourGrossUsd !== null;
  const soundArt = /sound|ambient|avant|institutional|visual/i.test(
    `${artist.identity.cluster ?? ""} ${artist.identity.primaryGenre ?? ""}`
  );
  if (tier >= 5 && hasTour && (artist.social.totalReach ?? 0) > 10_000_000) {
    return "Major commercial draw. Best used as a headline or halo booking.";
  }
  if ((artist.streaming.spotifyMonthlyListeners ?? 0) > 5_000_000 && !hasTour) {
    return "Streaming footprint is strong, but live-market data is incomplete. Verify with agent or promoter before using it as a booking proxy.";
  }
  if (soundArt) {
    return "Likely stronger as a curated Sonic Sphere or institutional program than as a ticket-demand headliner.";
  }
  if (tier >= 4) return "Strong demand signal with enough footprint to support theater, festival, or high-visibility special programming.";
  return "Directional demand profile. Use the QA fields and live-market verification before making booking decisions.";
}
