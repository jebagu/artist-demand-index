import { useMemo, useState } from "react";
import artistsJson from "./data/generated/artists.json";
import dataHealthJson from "./data/generated/dataHealth.json";
import summaryStatsJson from "./data/generated/summaryStats.json";
import type { ArtistRecord, DataHealth, FilterState, SummaryStats } from "./types";
import { Layout } from "./components/Layout";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { ArtistDrawer } from "./components/ArtistDrawer";
import { OverviewSection } from "./sections/OverviewSection";
import { FootprintExplorerSection } from "./sections/FootprintExplorerSection";
import { TierBookingSection } from "./sections/TierBookingSection";
import { OnlineFootprintSection } from "./sections/OnlineFootprintSection";
import { LiveSalesSection } from "./sections/LiveSalesSection";
import { GenreProgrammingSection } from "./sections/GenreProgrammingSection";
import { CompareSection } from "./sections/CompareSection";
import { DataQualitySection } from "./sections/DataQualitySection";
import { MethodologySection } from "./sections/MethodologySection";
import { defaultArtistSort, defaultFilters, filterArtists } from "./lib/filters";
import { createArtistSearch } from "./lib/search";

const allArtists = artistsJson as ArtistRecord[];
const fullSummary = summaryStatsJson as SummaryStats;
const fullHealth = dataHealthJson as DataHealth;

export default function App() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedArtist, setSelectedArtist] = useState<ArtistRecord | null>(null);
  const [compareIds, setCompareIds] = useState<number[]>([]);

  const search = useMemo(() => createArtistSearch(allArtists), []);
  const filteredArtists = useMemo(() => {
    const query = filters.query.trim();
    const searchIds = query ? new Set(search.search(query).map((result) => result.item.id)) : null;
    const searchable = searchIds ? allArtists.filter((artist) => searchIds.has(artist.id)) : allArtists;
    return filterArtists(searchable, { ...filters, query: "" }).sort(defaultArtistSort);
  }, [filters, search]);

  const activeSummary = useMemo(() => makeSummary(filteredArtists, fullSummary), [filteredArtists]);
  const activeHealth = useMemo(() => makeHealth(filteredArtists, activeSummary, fullHealth), [activeSummary, filteredArtists]);
  const selectedCompare = compareIds
    .map((id) => allArtists.find((artist) => artist.id === id))
    .filter((artist): artist is ArtistRecord => Boolean(artist));

  const addCompare = (artist: ArtistRecord) => {
    setCompareIds((current) => {
      if (current.includes(artist.id)) return current;
      return [...current, artist.id].slice(0, 5);
    });
  };

  return (
    <Layout>
      <Header filters={filters} setFilters={setFilters} />
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 lg:px-6">
        <OverviewSection />
        <FilterBar artists={allArtists} filters={filters} setFilters={setFilters} visibleCount={filteredArtists.length} />
        <FootprintExplorerSection artists={filteredArtists} onSelect={setSelectedArtist} />
        <TierBookingSection artists={filteredArtists} summary={activeSummary} onSelect={setSelectedArtist} />
        <OnlineFootprintSection artists={filteredArtists} summary={activeSummary} onSelect={setSelectedArtist} />
        <LiveSalesSection artists={filteredArtists} summary={activeSummary} onSelect={setSelectedArtist} />
        <GenreProgrammingSection artists={filteredArtists} summary={activeSummary} onSelect={setSelectedArtist} />
        <CompareSection
          artists={allArtists}
          selected={selectedCompare}
          onAdd={addCompare}
          onRemove={(id) => setCompareIds((current) => current.filter((item) => item !== id))}
          onSelect={setSelectedArtist}
        />
        <DataQualitySection artists={filteredArtists} summary={activeSummary} health={activeHealth} onSelect={setSelectedArtist} />
        <MethodologySection health={fullHealth} />
      </main>
      <ArtistDrawer artist={selectedArtist} onClose={() => setSelectedArtist(null)} onCompare={addCompare} />
    </Layout>
  );
}

function makeSummary(artists: ArtistRecord[], fallback: SummaryStats): SummaryStats {
  const missingnessCounts = {
    spotifyMonthlyListeners: availability(artists, (artist) => artist.streaming.spotifyMonthlyListeners),
    socialReach: availability(artists, (artist) => artist.social.totalReach),
    tourGrossUsd: availability(artists, (artist) => artist.live.tourGrossUsd),
    catalogStreams: availability(artists, (artist) => artist.streaming.estimatedCatalogStreams),
    bandsintownFollowers: availability(artists, (artist) => artist.live.bandsintownFollowers)
  };

  return {
    ...fallback,
    totalArtistCount: artists.length,
    tierCounts: countBy(artists.map((artist) => artist.tier.ordinal ?? "N/A")),
    genreClusterCounts: countBy(artists.map((artist) => artist.identity.cluster ?? "N/A")),
    venueScaleCounts: countBy(artists.map((artist) => artist.live.venueScale ?? "N/A")),
    confidenceDistribution: countBy(artists.map((artist) => artist.qa.confidenceRating ?? "N/A")),
    averageConfidence: average(artists.map((artist) => artist.qa.confidenceRating)),
    averageCompositeScore: average(artists.map((artist) => artist.tier.compositeScore)),
    missingnessCounts,
    consistencyWarningCount: artists.reduce((sum, artist) => sum + artist.qa.consistencyWarnings.length, 0)
  };
}

function makeHealth(artists: ArtistRecord[], summary: SummaryStats, fallback: DataHealth): DataHealth {
  const ids = new Set(artists.map((artist) => artist.id));
  return {
    ...fallback,
    missingnessCounts: summary.missingnessCounts,
    consistencyWarnings: fallback.consistencyWarnings.filter((warning) => ids.has(warning.id)),
    disambiguationIssues: fallback.disambiguationIssues.filter((issue) => ids.has(issue.id))
  };
}

function availability(artists: ArtistRecord[], getter: (artist: ArtistRecord) => number | null) {
  const available = artists.filter((artist) => getter(artist) !== null).length;
  return { available, missing: artists.length - available };
}

function countBy(values: Array<string | number>) {
  return values.reduce<Record<string, number>>((acc, value) => {
    const key = String(value);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function average(values: Array<number | null>) {
  const actual = values.filter((value): value is number => value !== null);
  if (!actual.length) return null;
  return actual.reduce((sum, value) => sum + value, 0) / actual.length;
}
