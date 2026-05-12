# Missing Data Brief for Kimi Agent Swarm

Generated from `src/data/generated/artists.json` on 2026-05-12 after importing `data/kimi/round2/research/artist_updates_p*.json`.

## Kimi Round 2 Import Summary

```json
{
  "available": true,
  "filesRead": 7,
  "updateRows": 552,
  "appliedUpdates": 943,
  "skippedUpdates": 80,
  "unsupportedUpdates": 1202,
  "updatedArtists": 107,
  "supportedFields": {
    "streaming.spotifyFollowers": 47,
    "streaming.spotifyMonthlyListeners": 53,
    "streaming.spotifyUrl": 55,
    "social.instagramHandle": 90,
    "social.instagramFollowers": 83,
    "social.xHandle": 89,
    "social.xFollowers": 89,
    "social.facebookPage": 77,
    "social.facebookFollowers": 68,
    "social.totalReach": 92,
    "social.verifiedStatus": 72,
    "catalog.totalCatalogStreams": 43,
    "catalog.topTrackName": 43,
    "catalog.topTrackStreams": 42
  },
  "unsupportedFields": {
    "livePerformance.frequency": 113,
    "livePerformance.touringPackageDescription": 113,
    "sales.totalCertifications": 104,
    "releases.topAlbumSales": 54,
    "sales.ifpiBestAlbums": 5,
    "sales.riaaCertifications": 35,
    "sales.riaaDiamond": 19,
    "sales.riaaGold": 28,
    "sales.riaa100m": 17,
    "sales.riaaBestSellers": 12,
    "sales.ifpiBestArtists": 13,
    "sales.riaaLatinDiamond": 10,
    "sales.riaj": 1,
    "identity.programmingStyle": 113,
    "identity.genreLabels": 113,
    "identity.subGenre": 113,
    "identity.instrumentSounds": 113,
    "identity.mf": 113,
    "identity.descriptionShort": 113
  }
}
```

## Field Missingness Counts After Round 2

- `spotifyMonthlyListeners`: 3 missing
- `spotifyFollowers`: 6 missing
- `spotifyUrl`: 3 missing
- `instagramHandle`: 22 missing
- `instagramFollowers`: 25 missing
- `xHandle`: 23 missing
- `xFollowers`: 24 missing
- `facebookPage`: 34 missing
- `facebookFollowers`: 43 missing
- `totalSocialReach`: 21 missing
- `verifiedStatus`: 37 missing
- `tourGrossUsd`: 109 missing
- `latestTourName`: 51 missing
- `latestTourYears`: 56 missing
- `ticketsSold`: 110 missing
- `showsCount`: 108 missing
- `avgGrossPerShow`: 112 missing
- `venueScale`: 51 missing
- `festivalHeadliner`: 55 missing
- `bandsintownFollowers`: 115 missing
- `upcomingShowsCount`: 112 missing
- `estimatedCatalogStreams`: 29 missing
- `topTracks`: 29 missing
- `bpiCertifications`: 85 missing
- `highestCertifiedAlbum`: 83 missing
- `primaryGenre`: 1 missing
- `cluster`: 6 missing
- `countryMarket`: 2 missing
- `language`: 119 missing
- `yearsActive`: 119 missing

## Remaining Priority Categories

### Remaining Priority 1: Spotify followers

- Count: 6 artists
- Missing fields covered: `spotifyFollowers`
- Research note: These are unresolved after Kimi round 2. Most are visual/sound-art or ambiguous profiles; keep null unless a verifiable exact follower count exists.

| ID | Artist | Explicit missing data |
|---:|---|---|
| 23 | Christina Kubisch | `spotifyFollowers` |
| 24 | Christine Sun Kim | `spotifyFollowers` |
| 49 | Haroon Mirza | `spotifyFollowers` |
| 51 | Ian Dearden | `spotifyFollowers` |
| 95 | Samson Young | `spotifyFollowers` |
| 105 | Tarik Barri | `spotifyFollowers` |

### Remaining Priority 2: Social total reach and platform fields

- Count: 56 artists
- Missing fields covered: `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus`
- Research note: Fill only official/clearly attributable social accounts. totalSocialReach must be a sum of cited platform counts, not an estimate.

| ID | Artist | Explicit missing data |
|---:|---|---|
| 2 | AfroRack | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 3 | Air | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 10 | Bicep | `facebookFollowers` |
| 14 | Bonobo | `facebookPage`, `facebookFollowers` |
| 18 | Carl Craig | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 19 | Channel Tres | `instagramFollowers`, `verifiedStatus` |
| 22 | Christian Marclay | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 23 | Christina Kubisch | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 24 | Christine Sun Kim | `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 26 | Colin Benders | `facebookPage`, `facebookFollowers` |
| 28 | Dave Stewart | `facebookFollowers` |
| 29 | David Sheppard | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 33 | Eurythmics | `instagramHandle`, `instagramFollowers` |
| 39 | Four Tet | `facebookFollowers` |
| 41 | Future | `facebookFollowers` |
| 42 | Gold Panda | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 44 | Grandbrothers | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 45 | Grimes | `facebookFollowers` |
| 46 | Halina Rice | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 48 | Hania Rani | `instagramFollowers`, `verifiedStatus` |
| 49 | Haroon Mirza | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 50 | Holly Herndon | `facebookFollowers` |
| 51 | Ian Dearden | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 52 | Igor Levit | `facebookPage`, `facebookFollowers` |
| 56 | Jennifer Walshe | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 59 | Justin Gray | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 60 | Kaitlyn Aurelia Smith | `verifiedStatus` |
| 61 | Karlheinz Stockhausen | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 62 | Kelela | `facebookPage`, `facebookFollowers` |
| 63 | Kelly Lee Owens | `facebookPage`, `facebookFollowers` |
| 65 | Kiasmos | `verifiedStatus` |
| 68 | Lana Del Rey | `xFollowers` |
| 72 | Mat Dryhurst | `facebookPage`, `facebookFollowers` |
| 75 | Mike Oldfield | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 78 | Moderat | `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 79 | Monolake / Robert Henke | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 80 | Naomi Jon | `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 81 | Nicolas Jaar | `facebookPage`, `facebookFollowers` |
| 82 | Nils Frahm | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 83 | Nine Inch Nails | `instagramFollowers`, `facebookFollowers` |
| 85 | Photay | `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 90 | Rival Consoles | `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 91 | Robyn | `facebookFollowers` |
| 92 | Romy | `verifiedStatus` |
| 93 | Ryoji Ikeda | `facebookPage`, `facebookFollowers` |
| 95 | Samson Young | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 97 | Sofia Kourtesis | `verifiedStatus` |
| 104 | Talking Heads | `xHandle`, `xFollowers`, `verifiedStatus` |
| 105 | Tarik Barri | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 108 | Thom Yorke | `facebookFollowers` |
| 109 | Tipper | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 110 | Tourist | `totalSocialReach`, `instagramHandle`, `instagramFollowers`, `xHandle`, `xFollowers`, `facebookPage`, `facebookFollowers`, `verifiedStatus` |
| 113 | UNIIQU3 | `verifiedStatus` |
| 115 | Weval | `verifiedStatus` |
| 118 | Yīn Yīn | `xHandle`, `xFollowers`, `verifiedStatus` |
| 119 | yunè pinku | `verifiedStatus` |

### Remaining Priority 3: Spotify monthly listeners or URL

- Count: 3 artists
- Missing fields covered: `spotifyMonthlyListeners`, `spotifyUrl`
- Research note: Resolve identity first; do not use unrelated same-name profiles.

| ID | Artist | Explicit missing data |
|---:|---|---|
| 24 | Christine Sun Kim | `spotifyMonthlyListeners`, `spotifyUrl` |
| 95 | Samson Young | `spotifyMonthlyListeners`, `spotifyUrl` |
| 105 | Tarik Barri | `spotifyMonthlyListeners`, `spotifyUrl` |

### Remaining Priority 4: Live/touring metrics

- Count: 119 artists
- Missing fields covered: `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount`
- Research note: Kimi round 2 supplied performance descriptions, but not dashboard-schema gross/ticket/show/Bandsintown values. Import remains pending for these metrics.

| ID | Artist | Explicit missing data |
|---:|---|---|
| 1 | Acid Pauli | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 2 | AfroRack | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 3 | Air | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 4 | Alva Noto | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 5 | Aphex Twin | `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 6 | Arooj Aftab | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 7 | Bassnectar | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 8 | The Beatles | `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 9 | Beyoncé | `bandsintownFollowers`, `upcomingShowsCount` |
| 10 | Bicep | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 11 | Billie Eilish | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 12 | Björk | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 13 | Bob Dylan | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 14 | Bonobo | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 15 | Brian Eno | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 16 | Cardi B | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 17 | Caribou | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 18 | Carl Craig | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 19 | Channel Tres | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 20 | Charli XCX | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 21 | The Chemical Brothers | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 22 | Christian Marclay | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 23 | Christina Kubisch | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 24 | Christine Sun Kim | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 25 | Cigarettes After Sex | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 26 | Colin Benders | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 27 | DARKSIDE | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 28 | Dave Stewart | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 29 | David Sheppard | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 30 | deadmau5 | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `upcomingShowsCount` |
| 31 | DeLaurentis | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 32 | Ellie Goulding | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 33 | Eurythmics | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 34 | Excision | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 35 | Fatboy Slim | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 36 | FKA twigs | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 37 | Floating Points | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 38 | Flying Lotus | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 39 | Four Tet | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 40 | Fred Again | `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 41 | Future | `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 42 | Gold Panda | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 43 | Gorillaz | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 44 | Grandbrothers | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 45 | Grimes | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 46 | Halina Rice | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 47 | Halsey | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 48 | Hania Rani | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 49 | Haroon Mirza | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 50 | Holly Herndon | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 51 | Ian Dearden | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 52 | Igor Levit | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 53 | James Blake | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 54 | Jamie xx | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 55 | Janelle Monáe | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 56 | Jennifer Walshe | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 57 | Jon Hopkins | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 58 | Jorja Smith | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 59 | Justin Gray | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 60 | Kaitlyn Aurelia Smith | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 61 | Karlheinz Stockhausen | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 62 | Kelela | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 63 | Kelly Lee Owens | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 64 | Kendrick Lamar | `bandsintownFollowers`, `upcomingShowsCount` |
| 65 | Kiasmos | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 66 | Kraftwerk | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow` |
| 67 | Lady Gaga | `bandsintownFollowers`, `upcomingShowsCount` |
| 68 | Lana Del Rey | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 69 | Madame Gandhi | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 70 | Madonna | `bandsintownFollowers`, `upcomingShowsCount` |
| 71 | Maribou State | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 72 | Mat Dryhurst | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 73 | Max Cooper | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 74 | Mick Jagger | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 75 | Mike Oldfield | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 76 | Miley Cyrus | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 77 | Moby | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 78 | Moderat | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 79 | Monolake / Robert Henke | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 80 | Naomi Jon | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 81 | Nicolas Jaar | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 82 | Nils Frahm | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 83 | Nine Inch Nails | `showsCount`, `avgGrossPerShow`, `upcomingShowsCount` |
| 84 | Nitin Sawhney | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 85 | Photay | `tourGrossUsd`, `ticketsSold`, `avgGrossPerShow`, `bandsintownFollowers` |
| 86 | Pink Floyd | `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 87 | Portishead | `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 88 | Radiohead | `bandsintownFollowers`, `upcomingShowsCount` |
| 89 | RAYE | `bandsintownFollowers` |
| 90 | Rival Consoles | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 91 | Robyn | `tourGrossUsd`, `ticketsSold`, `avgGrossPerShow`, `bandsintownFollowers` |
| 92 | Romy | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 93 | Ryoji Ikeda | `tourGrossUsd`, `ticketsSold`, `avgGrossPerShow`, `bandsintownFollowers` |
| 94 | Sampha | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers` |
| 95 | Samson Young | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 96 | Skrillex | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 97 | Sofia Kourtesis | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 98 | Steve Miller Band | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 99 | Steve Reich | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 100 | Steven Wilson | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 101 | Stevie Nicks | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 102 | Suzanne Ciani | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 103 | SZA | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 104 | Talking Heads | `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 105 | Tarik Barri | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 106 | Tash Sultana | `tourGrossUsd`, `avgGrossPerShow` |
| 107 | Taylor Swift | `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 108 | Thom Yorke | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 109 | Tipper | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 110 | Tourist | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 111 | Tove Lo | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 112 | Travis Scott | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 113 | UNIIQU3 | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 114 | The Weeknd | `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `bandsintownFollowers`, `upcomingShowsCount` |
| 115 | Weval | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 116 | The xx | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 117 | Yaeji | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 118 | Yīn Yīn | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |
| 119 | yunè pinku | `latestTourName`, `latestTourYears`, `tourGrossUsd`, `ticketsSold`, `showsCount`, `avgGrossPerShow`, `venueScale`, `festivalHeadliner`, `bandsintownFollowers`, `upcomingShowsCount` |

### Remaining Priority 5: Catalog and top-track streams

- Count: 29 artists
- Missing fields covered: `estimatedCatalogStreams`, `topTracks`
- Research note: Kimi round 2 filled many rows. Remaining rows need reliable stream-count sources or explicit not_found_publicly.

| ID | Artist | Explicit missing data |
|---:|---|---|
| 7 | Bassnectar | `estimatedCatalogStreams`, `topTracks` |
| 22 | Christian Marclay | `estimatedCatalogStreams`, `topTracks` |
| 23 | Christina Kubisch | `estimatedCatalogStreams`, `topTracks` |
| 24 | Christine Sun Kim | `estimatedCatalogStreams`, `topTracks` |
| 26 | Colin Benders | `estimatedCatalogStreams`, `topTracks` |
| 29 | David Sheppard | `estimatedCatalogStreams`, `topTracks` |
| 31 | DeLaurentis | `estimatedCatalogStreams`, `topTracks` |
| 49 | Haroon Mirza | `estimatedCatalogStreams`, `topTracks` |
| 51 | Ian Dearden | `estimatedCatalogStreams`, `topTracks` |
| 56 | Jennifer Walshe | `estimatedCatalogStreams`, `topTracks` |
| 61 | Karlheinz Stockhausen | `estimatedCatalogStreams`, `topTracks` |
| 69 | Madame Gandhi | `estimatedCatalogStreams`, `topTracks` |
| 72 | Mat Dryhurst | `estimatedCatalogStreams`, `topTracks` |
| 74 | Mick Jagger | `estimatedCatalogStreams`, `topTracks` |
| 78 | Moderat | `estimatedCatalogStreams`, `topTracks` |
| 79 | Monolake / Robert Henke | `estimatedCatalogStreams`, `topTracks` |
| 80 | Naomi Jon | `estimatedCatalogStreams`, `topTracks` |
| 92 | Romy | `estimatedCatalogStreams`, `topTracks` |
| 95 | Samson Young | `estimatedCatalogStreams`, `topTracks` |
| 97 | Sofia Kourtesis | `estimatedCatalogStreams`, `topTracks` |
| 100 | Steven Wilson | `estimatedCatalogStreams`, `topTracks` |
| 105 | Tarik Barri | `estimatedCatalogStreams`, `topTracks` |
| 110 | Tourist | `estimatedCatalogStreams`, `topTracks` |
| 113 | UNIIQU3 | `estimatedCatalogStreams`, `topTracks` |
| 115 | Weval | `estimatedCatalogStreams`, `topTracks` |
| 116 | The xx | `estimatedCatalogStreams`, `topTracks` |
| 117 | Yaeji | `estimatedCatalogStreams`, `topTracks` |
| 118 | Yīn Yīn | `estimatedCatalogStreams`, `topTracks` |
| 119 | yunè pinku | `estimatedCatalogStreams`, `topTracks` |

### Remaining Priority 6: Sales/certification enrichment

- Count: 90 artists
- Missing fields covered: `bpiCertifications`, `highestCertifiedAlbum`
- Research note: Round 2 certification fields did not map cleanly to the current dashboard schema. Keep RIAA zero versus unknown distinction explicit.

| ID | Artist | Explicit missing data |
|---:|---|---|
| 1 | Acid Pauli | `bpiCertifications`, `highestCertifiedAlbum` |
| 2 | AfroRack | `bpiCertifications`, `highestCertifiedAlbum` |
| 3 | Air | `bpiCertifications`, `highestCertifiedAlbum` |
| 4 | Alva Noto | `bpiCertifications`, `highestCertifiedAlbum` |
| 5 | Aphex Twin | `bpiCertifications`, `highestCertifiedAlbum` |
| 6 | Arooj Aftab | `bpiCertifications`, `highestCertifiedAlbum` |
| 7 | Bassnectar | `bpiCertifications`, `highestCertifiedAlbum` |
| 10 | Bicep | `bpiCertifications`, `highestCertifiedAlbum` |
| 12 | Björk | `highestCertifiedAlbum` |
| 13 | Bob Dylan | `highestCertifiedAlbum` |
| 14 | Bonobo | `bpiCertifications`, `highestCertifiedAlbum` |
| 15 | Brian Eno | `bpiCertifications`, `highestCertifiedAlbum` |
| 16 | Cardi B | `highestCertifiedAlbum` |
| 17 | Caribou | `bpiCertifications`, `highestCertifiedAlbum` |
| 18 | Carl Craig | `bpiCertifications`, `highestCertifiedAlbum` |
| 19 | Channel Tres | `bpiCertifications`, `highestCertifiedAlbum` |
| 20 | Charli XCX | `bpiCertifications` |
| 22 | Christian Marclay | `bpiCertifications`, `highestCertifiedAlbum` |
| 23 | Christina Kubisch | `bpiCertifications`, `highestCertifiedAlbum` |
| 24 | Christine Sun Kim | `bpiCertifications`, `highestCertifiedAlbum` |
| 25 | Cigarettes After Sex | `bpiCertifications` |
| 26 | Colin Benders | `bpiCertifications`, `highestCertifiedAlbum` |
| 27 | DARKSIDE | `bpiCertifications`, `highestCertifiedAlbum` |
| 29 | David Sheppard | `bpiCertifications`, `highestCertifiedAlbum` |
| 30 | deadmau5 | `highestCertifiedAlbum` |
| 31 | DeLaurentis | `bpiCertifications`, `highestCertifiedAlbum` |
| 34 | Excision | `bpiCertifications`, `highestCertifiedAlbum` |
| 36 | FKA twigs | `bpiCertifications` |
| 37 | Floating Points | `bpiCertifications`, `highestCertifiedAlbum` |
| 38 | Flying Lotus | `bpiCertifications`, `highestCertifiedAlbum` |
| 39 | Four Tet | `bpiCertifications` |
| 40 | Fred Again | `bpiCertifications` |
| 42 | Gold Panda | `bpiCertifications`, `highestCertifiedAlbum` |
| 44 | Grandbrothers | `bpiCertifications`, `highestCertifiedAlbum` |
| 45 | Grimes | `bpiCertifications`, `highestCertifiedAlbum` |
| 46 | Halina Rice | `bpiCertifications`, `highestCertifiedAlbum` |
| 48 | Hania Rani | `bpiCertifications`, `highestCertifiedAlbum` |
| 49 | Haroon Mirza | `bpiCertifications`, `highestCertifiedAlbum` |
| 50 | Holly Herndon | `bpiCertifications`, `highestCertifiedAlbum` |
| 51 | Ian Dearden | `bpiCertifications`, `highestCertifiedAlbum` |
| 52 | Igor Levit | `bpiCertifications`, `highestCertifiedAlbum` |
| 53 | James Blake | `bpiCertifications`, `highestCertifiedAlbum` |
| 54 | Jamie xx | `bpiCertifications`, `highestCertifiedAlbum` |
| 55 | Janelle Monáe | `bpiCertifications`, `highestCertifiedAlbum` |
| 56 | Jennifer Walshe | `bpiCertifications`, `highestCertifiedAlbum` |
| 57 | Jon Hopkins | `bpiCertifications`, `highestCertifiedAlbum` |
| 58 | Jorja Smith | `bpiCertifications` |
| 59 | Justin Gray | `bpiCertifications`, `highestCertifiedAlbum` |
| 60 | Kaitlyn Aurelia Smith | `bpiCertifications`, `highestCertifiedAlbum` |
| 61 | Karlheinz Stockhausen | `bpiCertifications`, `highestCertifiedAlbum` |
| 62 | Kelela | `bpiCertifications`, `highestCertifiedAlbum` |
| 63 | Kelly Lee Owens | `bpiCertifications`, `highestCertifiedAlbum` |
| 65 | Kiasmos | `bpiCertifications`, `highestCertifiedAlbum` |
| 66 | Kraftwerk | `bpiCertifications`, `highestCertifiedAlbum` |
| 69 | Madame Gandhi | `bpiCertifications`, `highestCertifiedAlbum` |
| 71 | Maribou State | `bpiCertifications`, `highestCertifiedAlbum` |
| 72 | Mat Dryhurst | `bpiCertifications`, `highestCertifiedAlbum` |
| 73 | Max Cooper | `bpiCertifications`, `highestCertifiedAlbum` |
| 74 | Mick Jagger | `bpiCertifications`, `highestCertifiedAlbum` |
| 75 | Mike Oldfield | `bpiCertifications`, `highestCertifiedAlbum` |
| 77 | Moby | `bpiCertifications`, `highestCertifiedAlbum` |
| 78 | Moderat | `bpiCertifications`, `highestCertifiedAlbum` |
| 79 | Monolake / Robert Henke | `bpiCertifications`, `highestCertifiedAlbum` |
| 80 | Naomi Jon | `bpiCertifications`, `highestCertifiedAlbum` |
| 81 | Nicolas Jaar | `bpiCertifications`, `highestCertifiedAlbum` |
| 82 | Nils Frahm | `bpiCertifications`, `highestCertifiedAlbum` |
| 84 | Nitin Sawhney | `bpiCertifications`, `highestCertifiedAlbum` |
| 85 | Photay | `bpiCertifications`, `highestCertifiedAlbum` |
| 90 | Rival Consoles | `bpiCertifications`, `highestCertifiedAlbum` |
| 91 | Robyn | `bpiCertifications`, `highestCertifiedAlbum` |
| 92 | Romy | `bpiCertifications`, `highestCertifiedAlbum` |
| 93 | Ryoji Ikeda | `bpiCertifications`, `highestCertifiedAlbum` |
| 94 | Sampha | `bpiCertifications` |
| 95 | Samson Young | `bpiCertifications`, `highestCertifiedAlbum` |
| 97 | Sofia Kourtesis | `bpiCertifications`, `highestCertifiedAlbum` |
| 99 | Steve Reich | `bpiCertifications`, `highestCertifiedAlbum` |
| 100 | Steven Wilson | `bpiCertifications`, `highestCertifiedAlbum` |
| 101 | Stevie Nicks | `highestCertifiedAlbum` |
| 102 | Suzanne Ciani | `bpiCertifications`, `highestCertifiedAlbum` |
| 105 | Tarik Barri | `bpiCertifications`, `highestCertifiedAlbum` |
| 106 | Tash Sultana | `bpiCertifications`, `highestCertifiedAlbum` |
| 108 | Thom Yorke | `bpiCertifications`, `highestCertifiedAlbum` |
| 109 | Tipper | `bpiCertifications`, `highestCertifiedAlbum` |
| 110 | Tourist | `bpiCertifications`, `highestCertifiedAlbum` |
| 113 | UNIIQU3 | `bpiCertifications`, `highestCertifiedAlbum` |
| 115 | Weval | `bpiCertifications`, `highestCertifiedAlbum` |
| 116 | The xx | `bpiCertifications`, `highestCertifiedAlbum` |
| 117 | Yaeji | `bpiCertifications`, `highestCertifiedAlbum` |
| 118 | Yīn Yīn | `bpiCertifications`, `highestCertifiedAlbum` |
| 119 | yunè pinku | `bpiCertifications`, `highestCertifiedAlbum` |

### Remaining Priority 7: Identity/programming fields

- Count: 119 artists
- Missing fields covered: `primaryGenre`, `cluster`, `countryMarket`, `language`, `yearsActive`
- Research note: Kimi round 2 supplied extra programming fields that are currently unsupported by the dashboard schema. Add schema support before importing those.

| ID | Artist | Explicit missing data |
|---:|---|---|
| 1 | Acid Pauli | `language`, `yearsActive` |
| 2 | AfroRack | `language`, `yearsActive` |
| 3 | Air | `language`, `yearsActive` |
| 4 | Alva Noto | `language`, `yearsActive` |
| 5 | Aphex Twin | `language`, `yearsActive` |
| 6 | Arooj Aftab | `language`, `yearsActive` |
| 7 | Bassnectar | `language`, `yearsActive` |
| 8 | The Beatles | `language`, `yearsActive` |
| 9 | Beyoncé | `language`, `yearsActive` |
| 10 | Bicep | `language`, `yearsActive` |
| 11 | Billie Eilish | `language`, `yearsActive` |
| 12 | Björk | `language`, `yearsActive` |
| 13 | Bob Dylan | `language`, `yearsActive` |
| 14 | Bonobo | `language`, `yearsActive` |
| 15 | Brian Eno | `language`, `yearsActive` |
| 16 | Cardi B | `language`, `yearsActive` |
| 17 | Caribou | `language`, `yearsActive` |
| 18 | Carl Craig | `language`, `yearsActive` |
| 19 | Channel Tres | `language`, `yearsActive` |
| 20 | Charli XCX | `language`, `yearsActive` |
| 21 | The Chemical Brothers | `language`, `yearsActive` |
| 22 | Christian Marclay | `language`, `yearsActive` |
| 23 | Christina Kubisch | `language`, `yearsActive` |
| 24 | Christine Sun Kim | `language`, `yearsActive` |
| 25 | Cigarettes After Sex | `language`, `yearsActive` |
| 26 | Colin Benders | `language`, `yearsActive` |
| 27 | DARKSIDE | `language`, `yearsActive` |
| 28 | Dave Stewart | `language`, `yearsActive` |
| 29 | David Sheppard | `cluster`, `language`, `yearsActive` |
| 30 | deadmau5 | `language`, `yearsActive` |
| 31 | DeLaurentis | `cluster`, `language`, `yearsActive` |
| 32 | Ellie Goulding | `language`, `yearsActive` |
| 33 | Eurythmics | `language`, `yearsActive` |
| 34 | Excision | `language`, `yearsActive` |
| 35 | Fatboy Slim | `language`, `yearsActive` |
| 36 | FKA twigs | `language`, `yearsActive` |
| 37 | Floating Points | `language`, `yearsActive` |
| 38 | Flying Lotus | `language`, `yearsActive` |
| 39 | Four Tet | `language`, `yearsActive` |
| 40 | Fred Again | `language`, `yearsActive` |
| 41 | Future | `language`, `yearsActive` |
| 42 | Gold Panda | `language`, `yearsActive` |
| 43 | Gorillaz | `language`, `yearsActive` |
| 44 | Grandbrothers | `language`, `yearsActive` |
| 45 | Grimes | `language`, `yearsActive` |
| 46 | Halina Rice | `language`, `yearsActive` |
| 47 | Halsey | `language`, `yearsActive` |
| 48 | Hania Rani | `language`, `yearsActive` |
| 49 | Haroon Mirza | `language`, `yearsActive` |
| 50 | Holly Herndon | `language`, `yearsActive` |
| 51 | Ian Dearden | `primaryGenre`, `cluster`, `countryMarket`, `language`, `yearsActive` |
| 52 | Igor Levit | `language`, `yearsActive` |
| 53 | James Blake | `language`, `yearsActive` |
| 54 | Jamie xx | `language`, `yearsActive` |
| 55 | Janelle Monáe | `language`, `yearsActive` |
| 56 | Jennifer Walshe | `cluster`, `language`, `yearsActive` |
| 57 | Jon Hopkins | `language`, `yearsActive` |
| 58 | Jorja Smith | `language`, `yearsActive` |
| 59 | Justin Gray | `cluster`, `countryMarket`, `language`, `yearsActive` |
| 60 | Kaitlyn Aurelia Smith | `language`, `yearsActive` |
| 61 | Karlheinz Stockhausen | `language`, `yearsActive` |
| 62 | Kelela | `language`, `yearsActive` |
| 63 | Kelly Lee Owens | `language`, `yearsActive` |
| 64 | Kendrick Lamar | `language`, `yearsActive` |
| 65 | Kiasmos | `language`, `yearsActive` |
| 66 | Kraftwerk | `language`, `yearsActive` |
| 67 | Lady Gaga | `language`, `yearsActive` |
| 68 | Lana Del Rey | `language`, `yearsActive` |
| 69 | Madame Gandhi | `language`, `yearsActive` |
| 70 | Madonna | `language`, `yearsActive` |
| 71 | Maribou State | `language`, `yearsActive` |
| 72 | Mat Dryhurst | `language`, `yearsActive` |
| 73 | Max Cooper | `language`, `yearsActive` |
| 74 | Mick Jagger | `language`, `yearsActive` |
| 75 | Mike Oldfield | `language`, `yearsActive` |
| 76 | Miley Cyrus | `language`, `yearsActive` |
| 77 | Moby | `language`, `yearsActive` |
| 78 | Moderat | `language`, `yearsActive` |
| 79 | Monolake / Robert Henke | `language`, `yearsActive` |
| 80 | Naomi Jon | `language`, `yearsActive` |
| 81 | Nicolas Jaar | `language`, `yearsActive` |
| 82 | Nils Frahm | `language`, `yearsActive` |
| 83 | Nine Inch Nails | `language`, `yearsActive` |
| 84 | Nitin Sawhney | `language`, `yearsActive` |
| 85 | Photay | `language`, `yearsActive` |
| 86 | Pink Floyd | `language`, `yearsActive` |
| 87 | Portishead | `language`, `yearsActive` |
| 88 | Radiohead | `language`, `yearsActive` |
| 89 | RAYE | `language`, `yearsActive` |
| 90 | Rival Consoles | `language`, `yearsActive` |
| 91 | Robyn | `language`, `yearsActive` |
| 92 | Romy | `language`, `yearsActive` |
| 93 | Ryoji Ikeda | `language`, `yearsActive` |
| 94 | Sampha | `language`, `yearsActive` |
| 95 | Samson Young | `language`, `yearsActive` |
| 96 | Skrillex | `language`, `yearsActive` |
| 97 | Sofia Kourtesis | `language`, `yearsActive` |
| 98 | Steve Miller Band | `language`, `yearsActive` |
| 99 | Steve Reich | `language`, `yearsActive` |
| 100 | Steven Wilson | `language`, `yearsActive` |
| 101 | Stevie Nicks | `language`, `yearsActive` |
| 102 | Suzanne Ciani | `language`, `yearsActive` |
| 103 | SZA | `language`, `yearsActive` |
| 104 | Talking Heads | `language`, `yearsActive` |
| 105 | Tarik Barri | `language`, `yearsActive` |
| 106 | Tash Sultana | `language`, `yearsActive` |
| 107 | Taylor Swift | `language`, `yearsActive` |
| 108 | Thom Yorke | `cluster`, `language`, `yearsActive` |
| 109 | Tipper | `language`, `yearsActive` |
| 110 | Tourist | `language`, `yearsActive` |
| 111 | Tove Lo | `language`, `yearsActive` |
| 112 | Travis Scott | `language`, `yearsActive` |
| 113 | UNIIQU3 | `language`, `yearsActive` |
| 114 | The Weeknd | `language`, `yearsActive` |
| 115 | Weval | `language`, `yearsActive` |
| 116 | The xx | `language`, `yearsActive` |
| 117 | Yaeji | `language`, `yearsActive` |
| 118 | Yīn Yīn | `language`, `yearsActive` |
| 119 | yunè pinku | `language`, `yearsActive` |

## Kimi Agent Swarm Round 3 Prompt

```text
You are Kimi Agent Swarm. Continue the Sonic Sphere Artist Demand Dashboard missing-data research after Codex imported Kimi round 2. Do not repeat completed fields. Focus only on remaining null fields listed in this brief.

Priority order:
1. Resolve the remaining 6 missing Spotify follower counts if verifiable; otherwise return null with not_found_publicly or ambiguous.
2. Resolve the remaining 21 social total/package gaps with official Instagram, X/Twitter, and Facebook evidence.
3. Resolve remaining Spotify identity gaps.
4. Return live/touring metrics in the dashboard schema, not only prose descriptions: latestTourName, latestTourYears, tourGrossUsd, ticketsSold, showsCount, avgGrossPerShow, venueScale, festivalHeadliner, bandsintownFollowers, upcomingShowsCount.
5. Fill remaining catalog/top-track stream gaps with cited values.
6. For certification fields, distinguish no public certification from unknown.

Rules:
- Do not invent values. Keep null when public evidence is unavailable.
- Include source URL, source name, date accessed, confidence, status, and evidence snippet for every field.
- Do not change artist IDs or names.
- Do not compute new demand scores.
- Use these output files: artist_updates_round3.json, sources_round3.csv, conflicts_round3.json, research_summary_round3.md.
- `artist_updates_round3.json` must use dot-path update keys that already exist in the dashboard schema, such as `streaming.spotifyFollowers`, `social.totalReach`, `live.tourGrossUsd`, or `streaming.estimatedCatalogStreams`.
```
