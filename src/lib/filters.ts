import type { ArtistRecord, FilterState } from "../types";

export const defaultFilters: FilterState = {
  query: "",
  tier: "all",
  cluster: "all",
  venueScale: "all",
  confidence: "all",
  missingFlag: "all",
  activeTouring: false,
  showIncomplete: true,
  hasWarnings: false
};

export function filterArtists(artists: ArtistRecord[], filters: FilterState): ArtistRecord[] {
  const query = filters.query.trim().toLowerCase();
  return artists.filter((artist) => {
    if (query) {
      const haystack = [
        artist.artist,
        artist.identity.primaryGenre,
        artist.identity.cluster,
        artist.identity.countryMarket,
        artist.tier.qualifierNote
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (filters.tier !== "all" && String(artist.tier.ordinal ?? "N/A") !== filters.tier) return false;
    if (filters.cluster !== "all" && artist.identity.cluster !== filters.cluster) return false;
    if (filters.venueScale !== "all" && artist.live.venueScale !== filters.venueScale) return false;
    if (filters.confidence !== "all" && String(artist.qa.confidenceRating ?? "N/A") !== filters.confidence) return false;
    if (filters.missingFlag !== "all" && !artist.qa.missingDataFlags.includes(filters.missingFlag)) return false;
    if (filters.activeTouring && !/yes|active|tour/i.test(artist.heat.activeTouring2025To2026 ?? "")) return false;
    if (!filters.showIncomplete && artist.qa.missingDataFlags.length > 0) return false;
    if (filters.hasWarnings && artist.qa.consistencyWarnings.length === 0) return false;
    return true;
  });
}

export function uniqueSorted(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b));
}

export function defaultArtistSort(a: ArtistRecord, b: ArtistRecord): number {
  const tierDiff = (b.tier.ordinal ?? 0) - (a.tier.ordinal ?? 0);
  if (tierDiff !== 0) return tierDiff;
  const scoreDiff = (b.tier.compositeScore ?? -1) - (a.tier.compositeScore ?? -1);
  if (scoreDiff !== 0) return scoreDiff;
  const listenerDiff = (b.streaming.spotifyMonthlyListeners ?? -1) - (a.streaming.spotifyMonthlyListeners ?? -1);
  if (listenerDiff !== 0) return listenerDiff;
  return a.artist.localeCompare(b.artist);
}
