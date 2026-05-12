import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";

type RawRow = Record<string, unknown>;

type WarningRecord = {
  artist: string;
  field: string;
  sourceTabValue: number;
  comparisonValue: number;
  usedValue: number;
  comparisonSource: string;
};

const root = process.cwd();
const workbookPath = path.join(root, "data/raw/sonic_sphere_artist_demand.xlsx");
const atmosResearchPath = path.join(root, "data/raw/atmos_album_research.json");
const generatedDir = path.join(root, "src/data/generated");

const sheetNames = {
  master: "Artist Master",
  streaming: "Streaming Detail",
  social: "Social Media",
  live: "Live & Touring",
  sales: "Sales & RIAA",
  catalog: "Catalog Info",
  genre: "Genre Classification",
  heat: "Heat Check",
  normalization: "Normalization",
  qa: "Sources & QA"
};

if (!fs.existsSync(workbookPath)) {
  throw new Error(`Missing workbook: ${workbookPath}`);
}

const workbook = XLSX.readFile(workbookPath, {
  cellDates: false,
  raw: true,
  dense: true
});

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\$/g, " usd ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function compactKey(value: string): string {
  return normalizeKey(value).replace(/\s+/g, "");
}

function cleanCell(value: unknown): unknown {
  if (value === undefined || value === null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^(n\/a|na|none|null|unknown)$/i.test(trimmed)) return null;
    return trimmed;
  }
  return value;
}

function isBlank(value: unknown): boolean {
  return cleanCell(value) === null;
}

function sheetToRows(name: string): RawRow[] {
  const sheet = workbook.Sheets[name];
  if (!sheet) {
    throw new Error(`Missing workbook sheet: ${name}`);
  }

  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: null,
    blankrows: false,
    raw: true
  });

  const firstColumnBlankish =
    matrix.length > 0 &&
    matrix.filter((row) => isBlank(row[0])).length / matrix.length > 0.65;
  const normalizedRows = firstColumnBlankish ? matrix.map((row) => row.slice(1)) : matrix;

  const headerIndex = normalizedRows.findIndex((row, index) => {
    if (index > 6) return false;
    const normalized = row.map((cell) => normalizeKey(String(cell ?? "")));
    return normalized.includes("id") && normalized.some((cell) => cell === "artist" || cell === "artist name");
  });

  const effectiveHeaderIndex = headerIndex >= 0 ? headerIndex : Math.min(1, normalizedRows.length - 1);
  const headers = normalizedRows[effectiveHeaderIndex].map((cell, index) => {
    const label = String(cleanCell(cell) ?? `Column ${index + 1}`).trim();
    return label || `Column ${index + 1}`;
  });

  const seen = new Map<string, number>();
  const uniqueHeaders = headers.map((header) => {
    const count = seen.get(header) ?? 0;
    seen.set(header, count + 1);
    return count === 0 ? header : `${header} ${count + 1}`;
  });

  return normalizedRows
    .slice(effectiveHeaderIndex + 1)
    .map((row) => {
      const record: RawRow = {};
      uniqueHeaders.forEach((header, index) => {
        record[header] = cleanCell(row[index]);
      });
      return record;
    })
    .filter((record) => Object.values(record).some((value) => !isBlank(value)));
}

function aliases(...values: string[]): Set<string> {
  return new Set(values.flatMap((value) => [normalizeKey(value), compactKey(value)]));
}

function valueOf(row: RawRow | undefined, names: string[]): unknown {
  if (!row) return null;
  const desired = aliases(...names);
  for (const [key, value] of Object.entries(row)) {
    if (desired.has(normalizeKey(key)) || desired.has(compactKey(key))) {
      return cleanCell(value);
    }
  }

  const desiredCompact = names.map(compactKey);
  for (const [key, value] of Object.entries(row)) {
    const keyCompact = compactKey(key);
    if (
      desiredCompact.some(
        (name) =>
          (name.length >= 4 && keyCompact.length >= 4 && keyCompact.includes(name)) ||
          (name.length >= 5 && keyCompact.length >= 5 && name.includes(keyCompact))
      )
    ) {
      return cleanCell(value);
    }
  }

  return null;
}

function asString(value: unknown): string | null {
  const clean = cleanCell(value);
  if (clean === null) return null;
  return String(clean).trim();
}

function asNumber(value: unknown, options: { zeroAsUnknown?: boolean } = {}): number | null {
  const clean = cleanCell(value);
  if (clean === null) return null;
  if (typeof clean === "number") {
    if (options.zeroAsUnknown && clean === 0) return null;
    return Number.isFinite(clean) ? clean : null;
  }

  let text = String(clean).trim();
  if (!text) return null;
  let multiplier = 1;
  const suffix = text.match(/([0-9.]+)\s*([bmk])\b/i);
  if (suffix) {
    const unit = suffix[2].toLowerCase();
    if (unit === "b") multiplier = 1_000_000_000;
    if (unit === "m") multiplier = 1_000_000;
    if (unit === "k") multiplier = 1_000;
  }

  text = text.replace(/[,$%]/g, "").replace(/\b(usd|streams|listeners|followers|units|shows|tickets)\b/gi, "");
  const match = text.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]) * multiplier;
  if (!Number.isFinite(parsed)) return null;
  if (options.zeroAsUnknown && parsed === 0) return null;
  return parsed;
}

function asBoolean(value: unknown): boolean | null {
  const clean = cleanCell(value);
  if (clean === null) return null;
  if (typeof clean === "boolean") return clean;
  if (typeof clean === "number") {
    if (clean === 1) return true;
    if (clean === 0) return false;
  }
  const text = String(clean).trim().toLowerCase();
  if (["yes", "y", "true", "1"].includes(text)) return true;
  if (["no", "n", "false", "0"].includes(text)) return false;
  return null;
}

function asStringList(value: unknown): string[] {
  const clean = cleanCell(value);
  if (clean === null) return [];
  if (Array.isArray(clean)) {
    return clean.map((item) => asString(item)).filter((item): item is string => Boolean(item));
  }
  return String(clean)
    .split(/\s*(?:\n|;|\|)\s*/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitList(value: unknown): string[] {
  const text = asString(value);
  if (!text) return [];
  return text
    .split(/\s*(?:;|\||\n|,(?=\s*[A-Z0-9]))\s*/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeMissingDataFlag(flag: string): string {
  return flag.replace(/\bSpotify ML\b/g, "Spotify monthly listeners");
}

function getId(row: RawRow | undefined): number | null {
  return asNumber(valueOf(row, ["ID", "Artist ID"])) ?? null;
}

function getArtist(row: RawRow | undefined): string | null {
  return asString(valueOf(row, ["Artist", "Artist Name", "Name"]));
}

function joinKey(row: RawRow): string | null {
  const id = getId(row);
  if (id !== null) return `id:${id}`;
  const artist = getArtist(row);
  return artist ? `artist:${normalizeKey(artist)}` : null;
}

function mapByKey(rows: RawRow[]): Map<string, RawRow> {
  const map = new Map<string, RawRow>();
  rows.forEach((row) => {
    const key = joinKey(row);
    if (key) map.set(key, row);
  });
  return map;
}

function loadAtmosResearch(): Map<string, RawRow> {
  const map = new Map<string, RawRow>();
  if (!fs.existsSync(atmosResearchPath)) return map;

  const raw = JSON.parse(fs.readFileSync(atmosResearchPath, "utf8"));
  const entries: RawRow[] = Array.isArray(raw) ? raw : Array.isArray(raw?.artists) ? raw.artists : [];

  entries.forEach((entry) => {
    const id = asNumber(valueOf(entry, ["ID", "Artist ID", "id"]));
    const artist = asString(valueOf(entry, ["Artist", "Artist Name", "artist"]));
    if (id !== null) map.set(`id:${id}`, entry);
    if (artist) map.set(`artist:${normalizeKey(artist)}`, entry);
  });

  return map;
}

function rowFor(map: Map<string, RawRow>, base: RawRow): RawRow | undefined {
  const id = getId(base);
  const artist = getArtist(base);
  return (
    (id !== null ? map.get(`id:${id}`) : undefined) ??
    (artist ? map.get(`artist:${normalizeKey(artist)}`) : undefined)
  );
}

function atmosFor(id: number, artist: string, map: Map<string, RawRow>) {
  const row = map.get(`id:${id}`) ?? map.get(`artist:${normalizeKey(artist)}`);
  if (!row) {
    return {
      status: "pending" as const,
      hasAtmosAlbum: null,
      albums: [],
      researchedAt: null,
      notes: null
    };
  }

  const hasAtmosAlbum = asBoolean(valueOf(row, ["Has Atmos Album", "hasAtmosAlbum", "has_atmos_album", "Atmos Album"]));
  const rawAlbums = valueOf(row, ["Albums", "Atmos Albums", "atmosAlbums", "atmos_albums"]);
  const albums = Array.isArray(rawAlbums)
    ? rawAlbums.map((album) => ({
        title: asString(valueOf(album as RawRow, ["Title", "Album Title", "title"])) ?? "",
        releaseYear: asNumber(valueOf(album as RawRow, ["Release Year", "Year", "releaseYear", "release_year"])),
        sourceService: asString(valueOf(album as RawRow, ["Source Service", "Service", "Platform", "sourceService", "source_service"])),
        sourceUrls: asStringList(valueOf(album as RawRow, ["Source URLs", "Source URL", "sourceUrls", "source_urls", "sourceUrl", "source_url"])),
        confidence: asNumber(valueOf(album as RawRow, ["Confidence", "confidence"])),
        notes: asString(valueOf(album as RawRow, ["Notes", "notes"]))
      }))
    : [];

  return {
    status: hasAtmosAlbum === null ? ("pending" as const) : ("researched" as const),
    hasAtmosAlbum,
    albums,
    researchedAt: asString(valueOf(row, ["Researched At", "researchedAt", "researched_at", "Snapshot Date"])),
    notes: asString(valueOf(row, ["Notes", "notes"]))
  };
}

function parseTier(value: unknown): { stars: string | null; ordinal: 1 | 2 | 3 | 4 | 5 | null; label: string | null } {
  const text = asString(value);
  if (!text) return { stars: null, ordinal: null, label: "N/A" };
  if (/n\/a|insufficient/i.test(text)) return { stars: "N/A", ordinal: null, label: "N/A" };
  const starCount = (text.match(/★/g) ?? []).length;
  const numeric = starCount || Number(text.match(/[1-5]/)?.[0] ?? 0);
  const ordinal = numeric >= 1 && numeric <= 5 ? (numeric as 1 | 2 | 3 | 4 | 5) : null;
  return {
    stars: ordinal ? "★".repeat(ordinal) : text,
    ordinal,
    label: ordinal ? `${ordinal}-star` : text
  };
}

function topTracks(streaming: RawRow | undefined, catalog: RawRow | undefined) {
  const source = streaming ?? catalog;
  const candidates = [
    ["Top Track 1", "Top Song 1", "Track 1", "Top 1 Track Name"],
    ["Top Track 2", "Top Song 2", "Track 2", "Top 2 Track Name"],
    ["Top Track 3", "Top Song 3", "Track 3", "Top 3 Track Name"]
  ];
  return candidates
    .map((names, index) => ({
      name: asString(valueOf(source, names)),
      streams: asNumber(
        valueOf(source, [
          `Top Track ${index + 1} Streams`,
          `Top Song ${index + 1} Streams`,
          `Track ${index + 1} Streams`,
          `Top Track ${index + 1} Stream Count`,
          `Top ${index + 1} Streams`
        ])
      )
    }))
    .filter((track) => track.name);
}

function consistencyWarnings(
  artist: string,
  live: RawRow | undefined,
  sales: RawRow | undefined,
  normalization: RawRow | undefined,
  master: RawRow | undefined
): WarningRecord[] {
  const checks = [
    {
      field: "Latest public tour gross",
      used: asNumber(valueOf(live, ["Tour Gross USD", "Latest Tour Gross", "Tour Gross"]), { zeroAsUnknown: true }),
      compare: [
        ["Normalization", asNumber(valueOf(normalization, ["Tour Gross", "Tour Gross USD"]), { zeroAsUnknown: true })],
        ["Artist Master", asNumber(valueOf(master, ["Tour Gross", "Tour Gross USD"]), { zeroAsUnknown: true })]
      ] as const
    },
    {
      field: "Lifetime RIAA units",
      used: asNumber(valueOf(sales, ["RIAA Total Units", "RIAA Units", "Total RIAA Units"])),
      compare: [
        ["Normalization", asNumber(valueOf(normalization, ["RIAA Units", "RIAA Total Units", "Total RIAA Units"]))],
        ["Artist Master", asNumber(valueOf(master, ["RIAA Units", "RIAA Total Units", "Total RIAA Units"]))]
      ] as const
    }
  ];

  return checks.flatMap((check) => {
    if (check.used === null) return [];
    return check.compare
      .filter(([, compared]) => compared !== null)
      .filter(([, compared]) => {
        const diff = Math.abs((compared as number) - check.used!);
        return diff > Math.max(1, Math.abs(check.used!) * 0.05);
      })
      .map(([comparisonSource, compared]) => ({
        artist,
        field: check.field,
        sourceTabValue: check.used!,
        comparisonValue: compared as number,
        usedValue: check.used!,
        comparisonSource
      }));
  });
}

function countBy<T extends string | number | null>(items: T[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = item === null || item === "" ? "N/A" : String(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function average(values: Array<number | null>): number | null {
  const actual = values.filter((value): value is number => value !== null && Number.isFinite(value));
  if (!actual.length) return null;
  return actual.reduce((sum, value) => sum + value, 0) / actual.length;
}

function topBy<T extends { artist: string; id: number; tier: { ordinal: number | null } }>(
  artists: T[],
  key: (artist: T) => number | null,
  limit = 15
) {
  return artists
    .map((artist) => ({ id: artist.id, artist: artist.artist, tier: artist.tier.ordinal, value: key(artist) }))
    .filter((item): item is { id: number; artist: string; tier: number | null; value: number } => item.value !== null)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

const rows = Object.fromEntries(
  Object.entries(sheetNames).map(([key, sheetName]) => [key, sheetToRows(sheetName)])
) as Record<keyof typeof sheetNames, RawRow[]>;

const maps = Object.fromEntries(Object.entries(rows).map(([key, value]) => [key, mapByKey(value)])) as Record<
  keyof typeof rows,
  Map<string, RawRow>
>;
const atmosResearch = loadAtmosResearch();

const baseRows = rows.master.length ? rows.master : rows.normalization;

const artists = baseRows.map((master, index) => {
  const streaming = rowFor(maps.streaming, master);
  const social = rowFor(maps.social, master);
  const live = rowFor(maps.live, master);
  const sales = rowFor(maps.sales, master);
  const catalog = rowFor(maps.catalog, master);
  const genre = rowFor(maps.genre, master);
  const heat = rowFor(maps.heat, master);
  const normalization = rowFor(maps.normalization, master);
  const qa = rowFor(maps.qa, master);

  const id = getId(master) ?? getId(normalization) ?? index + 1;
  const artist = getArtist(master) ?? getArtist(normalization) ?? `Unknown Artist ${id}`;
  const tier = parseTier(valueOf(normalization, ["Demand Tier", "Tier", "Star Rating"]));
  const warnings = consistencyWarnings(artist, live, sales, normalization, master);

  const record = {
    id,
    artist,
    identity: {
      artistType: asString(valueOf(master, ["Artist Type", "Type"])),
      primaryGenre:
        asString(valueOf(genre, ["Primary Genre"])) ?? asString(valueOf(master, ["Primary Genre", "Genre"])),
      secondaryGenre:
        asString(valueOf(genre, ["Secondary Genre"])) ?? asString(valueOf(master, ["Secondary Genre"])),
      country: asString(valueOf(master, ["Country", "Origin Country"])),
      countryMarket:
        asString(valueOf(genre, ["Country Market", "Country/Market", "Market"])) ??
        asString(valueOf(master, ["Country Market", "Country/Market", "Market"])),
      language: asString(valueOf(master, ["Language", "Primary Language"])),
      cluster: asString(valueOf(genre, ["Cluster", "Genre Cluster", "Sonic Sphere Cluster"])),
      activeStatus: asString(valueOf(master, ["Active Status", "Status"])),
      yearsActive: asString(valueOf(master, ["Years Active", "Active Years"]))
    },
    tier: {
      ...tier,
      qualifierNote: asString(valueOf(normalization, ["Qualifier Note", "Tier Qualifier", "Note"])),
      compositeScore: asNumber(valueOf(normalization, ["Composite Score", "Demand Score"]))
    },
    streaming: {
      spotifyMonthlyListeners: asNumber(valueOf(streaming, ["Spotify Monthly Listeners", "Monthly Listeners"])),
      spotifyFollowers: asNumber(valueOf(streaming, ["Spotify Followers", "Followers"])),
      spotifyUrl: asString(valueOf(streaming, ["Spotify URL", "Spotify Artist URL", "URL"])),
      listenerConfidence: asNumber(valueOf(streaming, ["Listener Confidence", "Listeners Confidence", "Monthly Listener Confidence"])),
      followerConfidence: asNumber(valueOf(streaming, ["Follower Confidence", "Followers Confidence", "Spotify Follower Confidence"])),
      topTracks: topTracks(streaming, catalog),
      estimatedCatalogStreams:
        asNumber(valueOf(catalog, ["Estimated Catalog Streams", "Estimated Total Catalog Streams", "Catalog Streams"])) ??
        asNumber(valueOf(streaming, ["Estimated Catalog Streams", "Estimated Total Catalog Streams", "Catalog Streams"]))
    },
    social: {
      instagramHandle: asString(valueOf(social, ["Instagram Handle", "Instagram"])),
      instagramFollowers: asNumber(valueOf(social, ["Instagram Followers", "IG Followers"])),
      xHandle: asString(valueOf(social, ["X Handle", "Twitter Handle", "X/Twitter Handle"])),
      xFollowers: asNumber(valueOf(social, ["X Followers", "Twitter Followers"])),
      facebookPage: asString(valueOf(social, ["Facebook Page", "Facebook"])),
      facebookFollowers: asNumber(valueOf(social, ["Facebook Followers"])),
      totalReach: asNumber(valueOf(social, ["Total Reach", "Total Social Reach", "Social Total"])),
      verifiedStatus: asString(valueOf(social, ["Verified Status", "Verified"]))
    },
    live: {
      latestTourName: asString(valueOf(live, ["Latest Tour Name", "Tour Name"])),
      latestTourYears: asString(valueOf(live, ["Latest Tour Years", "Tour Years", "Years"])),
      tourGrossUsd: asNumber(valueOf(live, ["Tour Gross USD", "Latest Tour Gross", "Tour Gross"]), {
        zeroAsUnknown: true
      }),
      ticketsSold: asNumber(valueOf(live, ["Tickets Sold", "Ticket Sales"])),
      showsCount: asNumber(valueOf(live, ["Shows Count", "Show Count", "Shows"])),
      avgGrossPerShow: asNumber(valueOf(live, ["Avg Gross Per Show", "Avg Gross/Show", "Average Gross Per Show"])),
      venueScale: asString(valueOf(live, ["Venue Scale", "Venue Tier"])),
      festivalHeadliner: asString(valueOf(live, ["Festival Headliner", "Festival Headliner Status"])),
      bandsintownFollowers: asNumber(valueOf(live, ["Bandsintown Followers", "Bands In Town Followers"])),
      upcomingShowsCount: asNumber(valueOf(live, ["Upcoming Shows Count", "Upcoming Shows"]))
    },
    sales: {
      riaaAlbumCertUnits: asNumber(valueOf(sales, ["RIAA Album Cert Units", "RIAA Album Certs", "RIAA Album Units"])),
      riaaSingleCertUnits: asNumber(valueOf(sales, ["RIAA Single Cert Units", "RIAA Single Certs", "RIAA Single Units"])),
      riaaTotalUnits: asNumber(valueOf(sales, ["RIAA Total Units", "RIAA Units", "Total RIAA Units"])),
      riaaConfidence: asNumber(valueOf(sales, ["RIAA Confidence", "Certification Confidence"])),
      bpiCertifications: asString(valueOf(sales, ["BPI Certifications", "BPI"])),
      bpiConfidence: asNumber(valueOf(sales, ["BPI Confidence"])),
      claimedGlobalSales: asNumber(valueOf(sales, ["Claimed Global Sales", "Global Sales"])),
      globalSalesConfidence: asNumber(valueOf(sales, ["Global Sales Confidence"])),
      highestCertifiedAlbum: asString(valueOf(sales, ["Highest Certified Album", "Top Certified Album"]))
    },
    heat: {
      majorPress2024To2026: asString(valueOf(heat, ["Major Press 2024 To 2026", "Major Press 2024-2026"])),
      awardsLast3Years: asString(valueOf(heat, ["Awards Last 3 Years", "Recent Awards"])),
      culturalMoment: asString(valueOf(heat, ["Cultural Moment", "Cultural Heat"])),
      activeTouring2025To2026: asString(valueOf(heat, ["Active Touring 2025 To 2026", "Active Touring 2025-2026"])),
      score: asNumber(valueOf(heat, ["Heat Score", "Score"]))
    },
    atmos: atmosFor(id, artist, atmosResearch),
    normalized: {
      spotifyScore: asNumber(valueOf(normalization, ["Spotify Score", "Streaming Score", "Spotify ML Log Norm 0-100"])),
      socialScore: asNumber(valueOf(normalization, ["Social Score", "Social Followers Log Norm 0-100"])),
      tourScore: asNumber(valueOf(normalization, ["Tour Score", "Live Score", "Tour Gross Log Norm 0-100"])),
      riaaScore: asNumber(valueOf(normalization, ["RIAA Score", "Sales Score", "RIAA Units Log Norm 0-100"]))
    },
    qa: {
      confidenceRating: asNumber(valueOf(qa, ["Confidence Rating", "Confidence", "QA Confidence"])),
      missingDataFlags: splitList(valueOf(qa, ["Missing Data Flags", "Missing Flags", "Data Gaps"])).map(normalizeMissingDataFlag),
      disambiguationIssue: asString(valueOf(qa, ["Disambiguation Issue", "Disambiguation"])),
      sourceSnapshotDate: asString(valueOf(qa, ["Source Snapshot Date", "Snapshot Date"])) ?? "2026-05-12",
      dataSourceNames: splitList(valueOf(qa, ["Data Source Names", "Sources", "Source Families"])),
      notes: asString(valueOf(qa, ["Notes", "QA Notes"])),
      consistencyWarnings: warnings.map(
        (warning) =>
          `${warning.field}: ${warning.comparisonSource} differs from detail tab; dashboard uses detail-tab value.`
      ),
      completenessScore: 0
    }
  };

  const majorFields = [
    record.streaming.spotifyMonthlyListeners,
    record.streaming.spotifyFollowers,
    record.social.totalReach,
    record.live.tourGrossUsd,
    record.sales.riaaTotalUnits,
    record.streaming.estimatedCatalogStreams,
    record.heat.score,
    record.qa.confidenceRating,
    record.tier.compositeScore
  ];
  record.qa.completenessScore = Math.round(
    (majorFields.filter((value) => value !== null).length / majorFields.length) * 100
  );

  return record;
});

const allWarnings = artists.flatMap((artist) =>
  artist.qa.consistencyWarnings.map((message) => ({
    artist: artist.artist,
    message
  }))
);

const missingnessCounts = {
  spotifyMonthlyListeners: {
    available: artists.filter((artist) => artist.streaming.spotifyMonthlyListeners !== null).length,
    missing: artists.filter((artist) => artist.streaming.spotifyMonthlyListeners === null).length
  },
  socialReach: {
    available: artists.filter((artist) => artist.social.totalReach !== null).length,
    missing: artists.filter((artist) => artist.social.totalReach === null).length
  },
  tourGrossUsd: {
    available: artists.filter((artist) => artist.live.tourGrossUsd !== null).length,
    missing: artists.filter((artist) => artist.live.tourGrossUsd === null).length
  },
  catalogStreams: {
    available: artists.filter((artist) => artist.streaming.estimatedCatalogStreams !== null).length,
    missing: artists.filter((artist) => artist.streaming.estimatedCatalogStreams === null).length
  },
  bandsintownFollowers: {
    available: artists.filter((artist) => artist.live.bandsintownFollowers !== null).length,
    missing: artists.filter((artist) => artist.live.bandsintownFollowers === null).length
  }
};

const heatScores = artists.map((artist) => artist.heat.score).filter((value): value is number => value !== null);
const summaryStats = {
  totalArtistCount: artists.length,
  tierCounts: countBy(artists.map((artist) => artist.tier.ordinal)),
  genreClusterCounts: countBy(artists.map((artist) => artist.identity.cluster)),
  venueScaleCounts: countBy(artists.map((artist) => artist.live.venueScale)),
  confidenceDistribution: countBy(artists.map((artist) => artist.qa.confidenceRating)),
  averageConfidence: average(artists.map((artist) => artist.qa.confidenceRating)),
  averageCompositeScore: average(artists.map((artist) => artist.tier.compositeScore)),
  heatScoreDistribution: {
    low: heatScores.filter((score) => score < 35).length,
    medium: heatScores.filter((score) => score >= 35 && score < 70).length,
    high: heatScores.filter((score) => score >= 70).length
  },
  missingnessCounts,
  topArtists: {
    spotifyMonthlyListeners: topBy(artists, (artist) => artist.streaming.spotifyMonthlyListeners),
    spotifyFollowers: topBy(artists, (artist) => artist.streaming.spotifyFollowers),
    socialReach: topBy(artists, (artist) => artist.social.totalReach),
    tourGrossUsd: topBy(artists, (artist) => artist.live.tourGrossUsd),
    riaaTotalUnits: topBy(artists, (artist) => artist.sales.riaaTotalUnits),
    catalogStreams: topBy(artists, (artist) => artist.streaming.estimatedCatalogStreams),
    heatScore: topBy(artists, (artist) => artist.heat.score)
  },
  consistencyWarningCount: allWarnings.length
};

const dataHealth = {
  snapshotDate: "2026-05-12",
  sourceTabs: Object.values(sheetNames),
  dataQualityNote:
    "Research snapshot from May 12, 2026. Values are directional and include missing or low-confidence fields. Raw footprint charts use source detail tabs; model tier and composite use the original normalization tab. Tour gross is latest public tour gross, while catalog streams and RIAA units are lifetime-style signals.",
  missingnessCounts,
  consistencyWarnings: artists.flatMap((artist) =>
    artist.qa.consistencyWarnings.map((message) => ({ id: artist.id, artist: artist.artist, message }))
  ),
  disambiguationIssues: artists
    .filter((artist) => artist.qa.disambiguationIssue)
    .map((artist) => ({ id: artist.id, artist: artist.artist, issue: artist.qa.disambiguationIssue })),
  parser: {
    rowCounts: Object.fromEntries(Object.entries(rows).map(([key, value]) => [key, value.length])),
    generatedAt: new Date().toISOString()
  }
};

fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(path.join(generatedDir, "artists.json"), `${JSON.stringify(artists, null, 2)}\n`);
fs.writeFileSync(path.join(generatedDir, "summaryStats.json"), `${JSON.stringify(summaryStats, null, 2)}\n`);
fs.writeFileSync(path.join(generatedDir, "dataHealth.json"), `${JSON.stringify(dataHealth, null, 2)}\n`);

console.log(`Prepared ${artists.length} artist records.`);
console.log(`Consistency warnings: ${summaryStats.consistencyWarningCount}`);
