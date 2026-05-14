export type TierOrdinal = 1 | 2 | 3 | 4 | 5 | null;

export type AtmosAlbum = {
  title: string;
  releaseYear: number | null;
  sourceService: string | null;
  sourceUrls: string[];
  confidence: number | null;
  notes: string | null;
};

export type AtmosResearchStatus = "pending" | "researched" | "inconclusive";

export type ArtistRecord = {
  id: number;
  artist: string;
  identity: {
    artistType: string | null;
    primaryGenre: string | null;
    secondaryGenre: string | null;
    country: string | null;
    countryMarket: string | null;
    language: string | null;
    cluster: string | null;
    activeStatus: string | null;
    yearsActive: string | null;
  };
  tier: {
    stars: string | null;
    ordinal: TierOrdinal;
    label: string | null;
    qualifierNote: string | null;
    compositeScore: number | null;
  };
  streaming: {
    spotifyMonthlyListeners: number | null;
    spotifyFollowers: number | null;
    spotifyUrl: string | null;
    listenerConfidence: number | null;
    followerConfidence: number | null;
    topTracks: Array<{ name: string; streams: number | null }>;
    estimatedCatalogStreams: number | null;
  };
  social: {
    instagramHandle: string | null;
    instagramFollowers: number | null;
    xHandle: string | null;
    xFollowers: number | null;
    facebookPage: string | null;
    facebookFollowers: number | null;
    totalReach: number | null;
    verifiedStatus: string | null;
  };
  live: {
    latestTourName: string | null;
    latestTourYears: string | null;
    tourGrossUsd: number | null;
    ticketsSold: number | null;
    showsCount: number | null;
    avgGrossPerShow: number | null;
    venueScale: string | null;
    festivalHeadliner: string | null;
    bandsintownFollowers: number | null;
    upcomingShowsCount: number | null;
  };
  sales: {
    riaaAlbumCertUnits: number | null;
    riaaSingleCertUnits: number | null;
    riaaTotalUnits: number | null;
    riaaConfidence: number | null;
    bpiCertifications: string | null;
    bpiConfidence: number | null;
    claimedGlobalSales: number | null;
    globalSalesConfidence: number | null;
    highestCertifiedAlbum: string | null;
  };
  heat: {
    majorPress2024To2026: string | null;
    awardsLast3Years: string | null;
    culturalMoment: string | null;
    activeTouring2025To2026: string | null;
    score: number | null;
  };
  atmos: {
    status: AtmosResearchStatus;
    hasAtmosAlbum: boolean | null;
    albums: AtmosAlbum[];
    researchedAt: string | null;
    notes: string | null;
  };
  normalized: {
    spotifyScore: number | null;
    socialScore: number | null;
    tourScore: number | null;
    riaaScore: number | null;
  };
  qa: {
    confidenceRating: number | null;
    missingDataFlags: string[];
    disambiguationIssue: string | null;
    sourceSnapshotDate: string | null;
    dataSourceNames: string[];
    notes: string | null;
    consistencyWarnings: string[];
    completenessScore: number;
  };
};

export type MetricKey =
  | "spotifyMonthlyListeners"
  | "spotifyFollowers"
  | "socialReach"
  | "catalogStreams"
  | "riaaTotalUnits"
  | "tourGrossUsd"
  | "compositeScore"
  | "heatScore"
  | "none";

export type FilterState = {
  query: string;
  tier: string;
  cluster: string;
  venueScale: string;
  confidence: string;
  missingFlag: string;
  activeTouring: boolean;
  showIncomplete: boolean;
  hasWarnings: boolean;
};

export type SummaryStats = {
  totalArtistCount: number;
  tierCounts: Record<string, number>;
  genreClusterCounts: Record<string, number>;
  venueScaleCounts: Record<string, number>;
  confidenceDistribution: Record<string, number>;
  averageConfidence: number | null;
  averageCompositeScore: number | null;
  heatScoreDistribution: Record<string, number>;
  missingnessCounts: Record<string, { available: number; missing: number }>;
  topArtists: Record<string, Array<{ id: number; artist: string; tier: number | null; value: number }>>;
  consistencyWarningCount: number;
};

export type DataHealth = {
  snapshotDate: string;
  sourceTabs: string[];
  dataQualityNote: string;
  missingnessCounts: Record<string, { available: number; missing: number }>;
  consistencyWarnings: Array<{ id: number; artist: string; message: string }>;
  disambiguationIssues: Array<{ id: number; artist: string; issue: string | null }>;
  parser: {
    rowCounts: Record<string, number>;
    kimiRound2?: {
      available: boolean;
      filesRead: number;
      updateRows: number;
      appliedUpdates: number;
      skippedUpdates: number;
      unsupportedUpdates: number;
      updatedArtists: number;
      supportedFields: Record<string, number>;
      unsupportedFields: Record<string, number>;
    };
    manualArtistAdditions?: {
      available: boolean;
      rowCounts: Record<string, number>;
    };
    generatedAt: string;
  };
};
