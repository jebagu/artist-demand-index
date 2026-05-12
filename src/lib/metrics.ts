import type { ArtistRecord, MetricKey } from "../types";
import { formatCount, formatMoney, formatScore } from "./format";

export type MetricDefinition = {
  key: MetricKey;
  label: string;
  shortLabel: string;
  formatter: (value: number | null | undefined) => string;
  raw: boolean;
};

export const metricDefinitions: MetricDefinition[] = [
  {
    key: "spotifyMonthlyListeners",
    label: "Spotify monthly listeners",
    shortLabel: "Spotify monthly listeners",
    formatter: formatCount,
    raw: true
  },
  { key: "spotifyFollowers", label: "Spotify followers", shortLabel: "Spotify followers", formatter: formatCount, raw: true },
  { key: "socialReach", label: "Total social reach", shortLabel: "Social reach", formatter: formatCount, raw: true },
  { key: "catalogStreams", label: "Estimated lifetime catalog streams", shortLabel: "Lifetime catalog streams", formatter: formatCount, raw: true },
  { key: "riaaTotalUnits", label: "Lifetime RIAA certified units", shortLabel: "Lifetime RIAA units", formatter: formatCount, raw: true },
  { key: "tourGrossUsd", label: "Latest public tour gross", shortLabel: "Latest tour gross", formatter: formatMoney, raw: true },
  { key: "compositeScore", label: "Composite score", shortLabel: "Composite", formatter: formatScore, raw: false },
  { key: "heatScore", label: "Heat score", shortLabel: "Heat", formatter: formatScore, raw: false },
  { key: "none", label: "None", shortLabel: "None", formatter: () => "", raw: false }
];

export function getMetricDefinition(key: MetricKey): MetricDefinition {
  return metricDefinitions.find((metric) => metric.key === key) ?? metricDefinitions[0];
}

export function getMetricValue(artist: ArtistRecord, key: MetricKey): number | null {
  switch (key) {
    case "spotifyMonthlyListeners":
      return artist.streaming.spotifyMonthlyListeners;
    case "spotifyFollowers":
      return artist.streaming.spotifyFollowers;
    case "socialReach":
      return artist.social.totalReach;
    case "catalogStreams":
      return artist.streaming.estimatedCatalogStreams;
    case "riaaTotalUnits":
      return artist.sales.riaaTotalUnits;
    case "tourGrossUsd":
      return artist.live.tourGrossUsd;
    case "compositeScore":
      return artist.tier.compositeScore;
    case "heatScore":
      return artist.heat.score;
    case "none":
      return null;
  }
}

export const sortableMetrics = metricDefinitions.filter((metric) => metric.key !== "none");
