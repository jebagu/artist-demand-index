# Codex build spec: Artist Demand Index

## Objective

Create a beautiful, static, interactive web interface for the Sonic Sphere artist demand dataset. The app should help teammates answer four questions quickly:

1. Which artists sit in each demand tier?
2. What is each artist's real online and market footprint across streaming, social, live, sales, catalog, and cultural heat?
3. Which artists are outliers or surprisingly strong/weak by dimension?
4. Where is the data trustworthy, incomplete, or potentially inconsistent?

This should feel like an executive research dashboard, not a spreadsheet viewer. Keep it clean, fast, and polished. Do not reproduce the workbook layout directly. Use the workbook as source data, then reorganize it into a curated analytical experience.

The app should be static and GitHub Pages compatible. No backend. No external APIs at runtime.

## Recommended stack

Use this stack unless there is a strong reason not to:

- Vite
- React
- TypeScript
- Tailwind CSS
- Recharts for charts
- `xlsx` for parsing the Excel workbook in a build-time data-prep script
- `d3-scale` and `d3-array` where Recharts needs help with log scaling, extents, or medians
- `lucide-react` for subtle icons
- `clsx` for class composition
- Fuse.js for artist search
- Optional: TanStack Table only if the sortable artist table becomes cumbersome

Keep the app client-side and simple. The only build-time data transform should be a script that reads the Excel workbook and writes generated JSON.

## Input files

Expect the repo to contain the uploaded zip contents under something like:

```txt
data/raw/plan.md
data/raw/sonic_sphere_artist_demand.xlsx
data/raw/sonic_sphere_research_summary.md
data/raw/research/batch_01_artists_001_020.md
data/raw/research/batch_02_artists_021_040.md
data/raw/research/batch_03_artists_041_060.md
data/raw/research/batch_04_artists_061_080.md
data/raw/research/batch_05_artists_081_100.md
data/raw/research/batch_06_artists_101_119.md
```

Primary source of truth: `sonic_sphere_artist_demand.xlsx`.

Use `sonic_sphere_research_summary.md` for narrative context only. Do not hard-code its tables as the data source. The batch markdown files are optional for v1. They can be linked or searched later, but the first build should focus on the workbook.

Workbook tabs found:

- Cover
- Artist Master
- Streaming Detail
- Social Media
- Live & Touring
- Sales & RIAA
- Catalog Info
- Genre Classification
- Heat Check
- Normalization
- Sources & QA

Expected record count: 119 artists.

## Important data note

Do not flatten the workbook blindly.

Some raw columns in `Artist Master` and `Normalization` appear to mix up tour gross and RIAA units for several major artists. Examples observed: Taylor Swift, Beyonce, Lady Gaga, Kendrick Lamar, Future, Madonna, Nine Inch Nails, RAYE, Fred Again. For user-facing raw footprint metrics, prefer the detail tabs:

- Streaming metrics from `Streaming Detail`
- Social metrics from `Social Media`
- Live metrics from `Live & Touring`
- Sales and certification metrics from `Sales & RIAA`
- Catalog metrics from `Catalog Info` and `Streaming Detail`
- Genre and market fields from `Genre Classification`
- Heat fields from `Heat Check`
- Confidence, source snapshot, missing flags, and disambiguation from `Sources & QA`
- Existing normalized scores, composite score, demand tier, and qualifier note from `Normalization`

Use `Normalization` for the existing model outputs, especially `Composite Score`, `Demand Tier`, and `Qualifier Note`. Do not use its raw `Tour Gross` or `RIAA Units` columns for factual chart labels if the relevant detail tab has a value.

Add a visible data-quality note in the app:

> Research snapshot from May 12, 2026. Values are directional and include missing or low-confidence fields. Raw footprint charts use source detail tabs; model tier and composite use the original normalization tab.

## Build-time data pipeline

Create a script:

```txt
scripts/prepare-data.ts
```

The script should:

1. Read `data/raw/sonic_sphere_artist_demand.xlsx`.
2. Parse each workbook tab.
3. Remove the blank leading column present in most sheets.
4. Use row 2 as the header row where applicable.
5. Join sheets by `ID`. Fallback to normalized artist name only if an ID is missing.
6. Trim strings.
7. Convert numeric-looking values into numbers.
8. Convert blank, `N/A`, `None`, and empty cells into `null` unless the source field semantically means "none verified."
9. Preserve zero only when it is meaningful. In this dataset, `0` for tour gross often means unknown, not a literal zero-dollar tour. For RIAA, `0` may mean no public certification, but should still be shown with confidence context.
10. Generate:
    - `src/data/generated/artists.json`
    - `src/data/generated/dataHealth.json`
    - `src/data/generated/summaryStats.json`

The generated artist object should look conceptually like this:

```ts
type ArtistRecord = {
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
    ordinal: 1 | 2 | 3 | 4 | 5 | null;
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
}
```

The data-prep script should also create `summaryStats.json` with:

- Total artist count
- Tier counts
- Genre cluster counts
- Venue scale counts
- Confidence distribution
- Heat score distribution
- Missingness counts by major metric
- Top artists by each major raw dimension
- Consistency warning count

Expected current summary values from the uploaded workbook:

- Total artists: 119
- Demand tiers:
  - 32 five-star artists
  - 23 four-star artists
  - 46 three-star artists
  - 5 two-star artists
  - 11 one-star artists
  - 2 N/A artists
- Largest genre clusters:
  - Pop/R&B: 18
  - Pop Electronic: 18
  - Avant-Garde/Sound Art: 17
  - House/Techno: 14
  - Electronic/IDM: 11
  - Classic Rock: 10
- Confidence distribution:
  - 7 artists at confidence 5
  - 23 at confidence 4
  - 39 at confidence 3
  - 41 at confidence 2
  - 9 at confidence 1
  - Average confidence around 2.82 out of 5
- Missingness from the current detail tabs:
  - Spotify monthly listeners available for 110 of 119
  - Social total available for 63 of 119
  - Public tour gross available for 10 of 119
  - Catalog stream estimate available for 71 of 119
  - Bandsintown followers available for 4 of 119
- Data-health warnings:
  - Generate a warning when raw tour/RIAA values disagree across tabs.
  - Observed current discrepancy count is about 18 across tour/RIAA comparisons.

## Core product structure

Build a single-page dashboard with anchored sections. A multi-page router is not necessary unless it makes the implementation easier.

Suggested sections:

1. Overview
2. Footprint Explorer
3. Tier and Booking Fit
4. Artist Detail and Compare
5. Data Quality
6. Methodology

Use sticky top navigation with section links, global search, and a concise filter row.

## Visual design direction

Make it premium, calm, and analytical.

Use a dark or near-black background with clean cards, subtle borders, and restrained accent colors. Avoid a neon nightclub look. Suggested feel: research intelligence dashboard for music programming.

Good visual characteristics:

- System or Inter-style sans font
- Large readable numbers
- Strong typographic hierarchy
- Generous whitespace
- Rounded but not bubbly cards
- High-contrast labels
- Subtle gridlines
- Colorblind-safe tier palette
- Clear hover states and focus states
- Minimal decorative animation

Do not use pie charts for anything with more than three categories. Prefer horizontal bars, stacked bars, strip plots, scatter plots, and small multiples.

## Data visualization principles

Use these rules throughout:

1. Use raw metrics for factual footprint.
2. Use normalized 0 to 100 scores only for cross-dimension comparison.
3. Use log scales for counts that span orders of magnitude.
4. Never plot missing values as zero.
5. Always indicate data confidence and missingness in tooltips.
6. Sort charts by the most meaningful metric, not alphabetically.
7. Label outliers directly where possible.
8. Use consistent number formatting:
   - `115M` for counts
   - `$2.08B` for tour gross
   - `96.2` for normalized/composite scores
   - `Unknown` for missing data
9. Distinguish "no public data found" from "measured zero."
10. Keep chart legends close to the visualization and avoid overloaded colors.

## Overview section

Goal: give teammates the answer in the first 30 seconds.

Components:

- Hero title: `Artist Demand Index`
- Subtitle: `119 artists across streaming, social, live, sales, catalog, and cultural heat. Snapshot: May 12, 2026.`
- KPI cards:
  - Total artists: 119
  - Five-star: 32
  - Four-star: 23
  - Three-star: 46
  - Median or average confidence: around 2.82/5
  - Artists with usable social reach: 63
  - Artists with public tour gross: 10
- Tier distribution horizontal bar, ordered from five-star to N/A.
- "What this means" insight cards.

Use this initial narrative copy, adjusted only if generated data changes:

> The roster splits into two useful pools: a commercial headliner pool with global streaming, social, and touring footprint, and a Sonic Sphere specialty pool of electronic, ambient, sound-art, and experimental artists. The largest bucket is three-star club or niche festival candidates, while 32 artists are currently modeled as five-star stadium or arena-level names.

> The online footprint is highly skewed. A small number of global stars dominate social reach and streaming, so all footprint charts should use log scaling and show smaller artists without flattening them.

> Data quality is part of the story. Many artists lack public tour gross, social, or certification data. Treat tiers as directional and use the QA panel before making booking decisions.

## Footprint Explorer section

This should be the main interactive analytical view.

Controls:

- Search by artist
- Filter by tier
- Filter by Sonic Sphere genre cluster
- Filter by venue scale
- Filter by confidence rating
- Filter by missing-data flags
- Toggle active touring 2025 to 2026
- Toggle "show incomplete records"
- Axis selectors:
  - X axis options: Spotify monthly listeners, Spotify followers, social reach, catalog streams, RIAA units, tour gross, composite score
  - Y axis options: same
  - Size options: tour gross, catalog streams, composite score, heat score, none
- Scale toggle: log or linear, default log for raw counts

Default chart:

- Scatter plot
- X: Spotify monthly listeners, log scale
- Y: social total reach, log scale
- Point color: demand tier
- Point size: public tour gross from `Live & Touring`, log scaled
- Point opacity or ring: confidence rating
- Tooltip:
  - Artist
  - Tier and qualifier
  - Spotify monthly listeners
  - Social total reach
  - Tour gross
  - RIAA units
  - Heat score
  - Confidence rating
  - Missing flags
  - Source snapshot date

Do not place artists with missing X or Y values at zero. Add a small "hidden by missing data" count under the chart and a button to list them.

Add labels for the most important visible outliers, for example the top 8 by selected metric or current sort.

## Tier and Booking Fit section

Goal: make tiers understandable and actionable.

Components:

- Tier cards for five-star through one-star/N/A.
- Each card includes:
  - Count
  - Plain-English booking meaning
  - Top 5 artists by composite score within tier
  - Common venue scale
  - Median Spotify monthly listeners where data exists
  - Data-confidence warning if confidence is low

Suggested tier meanings:

- Five-star: Stadium or arena headliner, major cultural visibility, significant online footprint.
- Four-star: Theater or festival headliner, strong but not always arena-level.
- Three-star: Club, mid-size, or niche festival candidate. Useful for targeted programming.
- Two-star: Small venue or rising artist. Treat as emerging or narrow audience.
- One-star: Niche, emerging, or non-commercial. Often sound/visual art or experimental programming.
- N/A: insufficient identification or data.

Add a ranked bar or strip chart:

- Y: artist
- X: composite score
- Group by tier
- Color by tier
- Badge each row with confidence rating and missing flags
- Default to top 50, with option to show all

## Online Footprint section

Goal: show the actual footprint online rather than only tiers.

Visuals:

1. Streaming leaderboard
   - Horizontal bar chart of top Spotify monthly listeners.
   - Current leaders from the workbook include The Weeknd, Lady Gaga, Taylor Swift, Billie Eilish, Kendrick Lamar, Lana Del Rey, Travis Scott, Miley Cyrus, SZA, and Beyonce.
   - Use raw Spotify monthly listeners from `Streaming Detail`.

2. Social reach leaderboard
   - Horizontal bar chart of total social reach.
   - Current leaders include Beyonce, Taylor Swift, Miley Cyrus, Lady Gaga, Cardi B, Billie Eilish, Travis Scott, Halsey, Kendrick Lamar, and Madonna.
   - Use social totals from `Social Media`.

3. Social platform breakdown
   - Stacked horizontal bars for Instagram, X, and Facebook.
   - Top 25 by total social reach.
   - Include a "verified" badge where present.

4. Catalog depth
   - Bar chart by estimated total catalog streams.
   - Optional secondary view for top track streams.
   - This helps distinguish current viral footprint from durable catalog strength.

5. Listener versus follower ratio
   - Scatter or ranked list showing artists with unusually high monthly listeners compared with Spotify followers.
   - Use this carefully, as missing follower data is common.
   - Label it as directional.

## Live and Sales section

Goal: separate online attention from live-market and certification footprint.

Visuals:

1. Public tour gross leaderboard
   - Use `Live & Touring` detail tab only.
   - Current leaders by detail tab:
     - Taylor Swift: about $2.08B
     - Beyonce: about $579M
     - Lady Gaga: about $419.5M
     - Kendrick Lamar: about $369.6M
     - Madonna: about $227.2M
   - Show a note that only about 10 artists have usable public tour gross in the current dataset.

2. Venue scale distribution
   - Horizontal bar chart by venue scale.
   - Filterable by tier and cluster.

3. RIAA units leaderboard
   - Use `Sales & RIAA` detail tab only.
   - Current leaders include The Beatles, Beyonce, Future, The Weeknd, Billie Eilish, Cardi B, Halsey, Pink Floyd, Madonna, Steve Miller Band, Taylor Swift, Kendrick Lamar, Lady Gaga, and Miley Cyrus.
   - Make it clear that RIAA units are certification/sales data, not online footprint.

4. Touring versus streaming matrix
   - X: Spotify monthly listeners
   - Y: public tour gross
   - Both log scale
   - Color by tier
   - Missing tour gross should be excluded from the plot and counted separately.

## Genre and programming section

Goal: make the dataset useful for Sonic Sphere programming, not just celebrity ranking.

Visuals:

1. Genre cluster distribution
   - Horizontal bar chart of Sonic Sphere genre clusters.
   - Current largest clusters include Pop/R&B, Pop Electronic, Avant-Garde/Sound Art, House/Techno, Electronic/IDM, and Classic Rock.

2. Tier mix by genre cluster
   - Stacked bar chart.
   - X or Y: genre cluster
   - Stack: demand tier
   - This shows which clusters are commercially strong versus specialist.

3. Programming lanes
   - Create four cards:
     - Commercial Headliners
     - Festival/Theater Draws
     - Club and Electronic Specialists
     - Sound/Visual Art and Institutional Programming
   - Each card lists representative artists and explains the programming use case.

Suggested copy:

> Sonic Sphere should not read the dataset as one ranked booking list. It is more useful as a portfolio: global names for commercial draw, electronic and ambient artists for immersive fit, and sound/visual artists for institutional or gallery programming.

## Artist detail drawer

Every chart point, bar, or row should open an artist detail drawer.

Drawer contents:

- Artist name
- Tier stars, composite score, qualifier note
- Confidence rating and missing flags
- Identity: type, genre, country/market, cluster, active status
- Key footprint cards:
  - Spotify monthly listeners
  - Spotify followers
  - Social reach
  - Tour gross
  - RIAA total units
  - Catalog streams
  - Heat score
- Dimension comparison:
  - Small bar chart of normalized Spotify, social, tour, and RIAA scores
  - Use normalized fields from `Normalization`
- Top tracks:
  - Track name and streams
- Live:
  - Latest tour name, years, venue scale, avg gross, tickets sold, shows
- Heat:
  - Major press, awards, cultural moment, active touring
- QA:
  - Source snapshot date
  - Disambiguation issue
  - Data sources
  - Consistency warnings
- Link:
  - Spotify URL, if available

Add a short generated interpretation based on tier and dimensions. Examples:

- For a high-tier artist with high tour and social footprint: "Major commercial draw. Best used as a headline or halo booking."
- For an artist with strong streaming but missing tour data: "Streaming footprint is strong, but live-market data is incomplete. Verify with agent or promoter before using as a booking proxy."
- For sound/visual artists: "Likely stronger as a curated Sonic Sphere or institutional program than as a ticket-demand headliner."

## Compare mode

Allow selecting up to five artists for comparison.

Comparison visuals:

- Normalized dimension bars for Spotify, social, tour, and RIAA
- Raw metric cards in a compact grid
- Tier and confidence badges
- Missing-data badges
- Optional "difference highlights" such as:
  - Highest streaming footprint
  - Highest social footprint
  - Highest live gross
  - Best confidence rating
  - Most incomplete profile

Do not compute a new "Star Power" or "Desire" score. Use the existing composite and tier from the workbook only.

## Data Quality section

This section is important, not optional.

Components:

1. Data confidence distribution
   - Bar chart of confidence ratings 1 through 5.

2. Missingness matrix
   - Rows: artists
   - Columns: Spotify ML, Spotify followers, social, tour gross, RIAA, catalog streams, Bandsintown, heat, source QA
   - Use simple filled/empty marks.
   - Sort by tier first, then confidence.

3. Missingness summary cards
   - Spotify monthly listeners available for 110 of 119
   - Social total available for 63 of 119
   - Public tour gross available for 10 of 119
   - Catalog stream estimates available for 71 of 119
   - Bandsintown followers available for 4 of 119

4. Consistency warnings
   - List artist records where raw values disagree across tabs.
   - Show field, source tab value, normalization/master value, and which value the app uses.
   - This should be collapsible, but visible enough to build trust.

5. Disambiguation issues
   - Pull from `Sources & QA`.
   - Examples include multiple Spotify profiles, solo versus band identities, deceased or inactive artists, and unidentified records.

Suggested data-quality copy:

> This dashboard is strongest as a directional demand map. It is not a booking database. Before outreach, verify current social counts, touring availability, routing, guarantee expectations, and agent contacts.

## Methodology section

Keep this concise.

Include:

- Snapshot date: May 12, 2026
- Source families: Spotify, Kworb.net, Instagram, X/Twitter, Facebook, Bandsintown, RIAA, BPI, Billboard, Pollstar, Wikipedia, Chartmetric
- Normalization method from the research summary:
  - Log transform: `log10(raw_value + 1)`
  - Percentile rank to 0 to 100
  - Original composite weighting: Spotify 35 percent, social 25 percent, tour 25 percent, RIAA 15 percent
- Important caveat:
  - The app does not create a new score. It visualizes the existing workbook score and raw detail-tab data.
- Explain missing values:
  - Unknown is not zero.
  - Low confidence should be treated as a warning, not as a weak artist.

## Filtering behavior

Global filters should affect every chart and list unless the component explicitly says otherwise.

Filters:

- Tier
- Qualifier note
- Genre cluster
- Venue scale
- Country/market
- Confidence rating
- Heat score
- Active touring 2025 to 2026
- Has public tour gross
- Has social reach
- Has Spotify monthly listeners
- Has consistency warnings
- Missing-data flag contains X

Show active filter chips and a clear-all button.

## Sorting behavior

Default sort:

1. Demand tier descending
2. Composite score descending
3. Spotify monthly listeners descending
4. Artist name ascending

Allow sorting by:

- Composite score
- Spotify monthly listeners
- Spotify followers
- Social total reach
- Public tour gross
- RIAA total units
- Catalog streams
- Heat score
- Confidence rating
- Completeness score
- Artist name

## Number and label formatting

Create central formatters:

- `formatCount(115000000) -> "115M"`
- `formatMoney(2077618000) -> "$2.08B"`
- `formatScore(96.233) -> "96.2"`
- `formatNullable(null) -> "Unknown"`

Use consistent formatting in cards, tooltips, tables, and chart axes.

For log scales, tooltips should always show the original raw value, not the transformed value.

## File structure

Create a clean structure like:

```txt
package.json
vite.config.ts
index.html
tailwind.config.js
postcss.config.js
tsconfig.json

data/raw/
  sonic_sphere_artist_demand.xlsx
  sonic_sphere_research_summary.md
  plan.md
  research/

scripts/
  prepare-data.ts
  validate-data.ts

src/
  main.tsx
  App.tsx
  styles/globals.css
  data/generated/artists.json
  data/generated/summaryStats.json
  data/generated/dataHealth.json
  types.ts

  lib/
    format.ts
    filters.ts
    metrics.ts
    scales.ts
    tier.ts
    search.ts

  components/
    Layout.tsx
    Header.tsx
    FilterBar.tsx
    KpiCard.tsx
    TierBadge.tsx
    ConfidenceBadge.tsx
    MissingDataBadge.tsx
    ChartCard.tsx
    ArtistDrawer.tsx

  sections/
    OverviewSection.tsx
    FootprintExplorerSection.tsx
    TierBookingSection.tsx
    OnlineFootprintSection.tsx
    LiveSalesSection.tsx
    GenreProgrammingSection.tsx
    CompareSection.tsx
    DataQualitySection.tsx
    MethodologySection.tsx
```

## Package scripts

Add scripts similar to:

```json
{
  "scripts": {
    "dev": "npm run prepare:data && vite",
    "prepare:data": "tsx scripts/prepare-data.ts",
    "validate:data": "tsx scripts/validate-data.ts",
    "build": "npm run prepare:data && npm run validate:data && vite build",
    "preview": "vite preview"
  }
}
```

Use `tsx` for TypeScript scripts if helpful.

## Data validation rules

`validate-data.ts` should check:

- 119 artists loaded
- No duplicate IDs
- No blank artist names
- Tier ordinal is 1 to 5 or null
- Composite score is 0 to 100 or null
- Normalized dimension scores are 0 to 100 or null
- Numeric fields are non-negative
- Detail-tab tour gross is used for live charts
- Detail-tab RIAA units are used for sales charts
- Required generated files exist
- Tier counts are computed and exported
- Consistency warnings are generated when conflicting raw values exist

Validation should warn, not necessarily fail, on expected data gaps. It should fail on parser errors, duplicate IDs, or missing generated JSON.

## GitHub Pages deployment

Make the app deployable to GitHub Pages.

Add `vite.config.ts` with a configurable base path:

```ts
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? "/",
  plugins: [react()]
});
```

Add a README section explaining:

1. Put workbook in `data/raw/`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Run `npm run build`.
5. Deploy `dist/` to GitHub Pages.

Optional GitHub Action:

- On push to `main`
- Install dependencies
- Run `npm run build`
- Upload `dist`
- Deploy Pages

## Accessibility and usability requirements

- All chart controls must be keyboard reachable.
- Use visible focus rings.
- Tooltips should not be the only place important data exists.
- Use high-contrast text.
- Tables/lists should have accessible labels.
- Give charts short descriptions for screen readers.
- Do not rely on color alone to communicate tier or confidence.
- Make the site usable on mobile, even if the scatter plot becomes simplified.

Mobile behavior:

- Stack KPI cards.
- Replace large scatter controls with collapsible controls.
- Make artist detail drawer full-screen.
- Keep charts horizontally scrollable only where unavoidable.

## Performance requirements

This dataset is small. The app should feel instant.

- Parse Excel only at build time, not in the browser.
- Use generated JSON at runtime.
- Memoize filtered artist lists.
- Avoid rendering all tooltip-heavy chart labels by default.
- Do not import the raw markdown research files into the main bundle unless needed.

## Acceptance criteria

The finished dashboard should meet these criteria:

1. `npm run build` passes.
2. Dashboard loads from generated JSON without a backend.
3. It shows 119 artists.
4. Tier counts match the generated data.
5. The first screen clearly communicates tier distribution, major takeaways, and data caveats.
6. Users can search for an artist and open a detailed profile.
7. Users can filter by tier, cluster, venue scale, confidence, and missing-data status.
8. Users can see actual online footprint through raw Spotify and social metrics.
9. Users can compare artists using normalized dimension bars and raw metric cards.
10. Missing data is never displayed as zero.
11. Public tour gross charts use `Live & Touring`, not `Normalization`.
12. RIAA charts use `Sales & RIAA`, not `Normalization`.
13. Data quality issues are visible and not hidden.
14. The visual design is clean, readable, and polished.
15. The app is deployable to GitHub Pages.

## Suggested first Codex prompt

Use this prompt when starting the implementation:

```txt
Build a Vite React TypeScript dashboard from the Sonic Sphere artist demand workbook in data/raw/sonic_sphere_artist_demand.xlsx.

Follow CODEX_DASHBOARD_BUILD_SPEC.md exactly. Build a static GitHub Pages compatible app. Create a build-time data-prep script that parses the 11 workbook tabs, joins records by ID, writes generated JSON, validates the data, and then renders an interactive dashboard.

Use source detail tabs for raw footprint metrics: Streaming Detail for Spotify, Social Media for social reach, Live & Touring for tour gross, Sales & RIAA for certification units, Genre Classification for clusters, Heat Check for cultural heat, Sources & QA for confidence and missingness. Use Normalization only for existing normalized scores, composite score, demand tier, and qualifier note.

Do not calculate a new Star Power or Desire score. Use the existing composite and tier. Make missing data and confidence highly visible. The interface should be clean, premium, and readable, with log-scale scatter plots, ranked bars, tier cards, artist detail drawers, compare mode, and a data-quality section.
```
