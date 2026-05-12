import fs from "node:fs";
import path from "node:path";

const generatedDir = path.join(process.cwd(), "src/data/generated");
const requiredFiles = ["artists.json", "summaryStats.json", "dataHealth.json"];

for (const file of requiredFiles) {
  const target = path.join(generatedDir, file);
  if (!fs.existsSync(target)) {
    throw new Error(`Missing generated file: ${target}`);
  }
}

const artists = JSON.parse(fs.readFileSync(path.join(generatedDir, "artists.json"), "utf8"));
const summaryStats = JSON.parse(fs.readFileSync(path.join(generatedDir, "summaryStats.json"), "utf8"));

function fail(message: string): never {
  throw new Error(`Data validation failed: ${message}`);
}

function warn(message: string): void {
  console.warn(`Data validation warning: ${message}`);
}

if (!Array.isArray(artists)) fail("artists.json must contain an array.");
if (artists.length !== 119) fail(`expected 119 artists, found ${artists.length}.`);

const ids = new Set<number>();
for (const artist of artists) {
  if (typeof artist.id !== "number") fail(`invalid id for ${artist.artist ?? "unknown artist"}.`);
  if (ids.has(artist.id)) fail(`duplicate artist id ${artist.id}.`);
  ids.add(artist.id);
  if (!artist.artist || typeof artist.artist !== "string") fail(`blank artist name for id ${artist.id}.`);

  const ordinal = artist.tier?.ordinal;
  if (ordinal !== null && ![1, 2, 3, 4, 5].includes(ordinal)) {
    fail(`tier ordinal out of range for ${artist.artist}.`);
  }

  const composite = artist.tier?.compositeScore;
  if (composite !== null && (typeof composite !== "number" || composite < 0 || composite > 100)) {
    fail(`composite score out of range for ${artist.artist}.`);
  }

  for (const [key, score] of Object.entries(artist.normalized ?? {})) {
    if (score !== null && (typeof score !== "number" || score < 0 || score > 100)) {
      fail(`${key} out of range for ${artist.artist}.`);
    }
  }

  const numericPaths = [
    ["streaming", "spotifyMonthlyListeners"],
    ["streaming", "spotifyFollowers"],
    ["streaming", "estimatedCatalogStreams"],
    ["social", "totalReach"],
    ["live", "tourGrossUsd"],
    ["sales", "riaaTotalUnits"],
    ["heat", "score"],
    ["qa", "confidenceRating"],
    ["qa", "completenessScore"]
  ];
  for (const [group, key] of numericPaths) {
    const value = artist[group]?.[key];
    if (value !== null && value !== undefined && (typeof value !== "number" || value < 0)) {
      fail(`${group}.${key} must be non-negative for ${artist.artist}.`);
    }
  }

  const atmos = artist.atmos;
  if (!atmos || !["pending", "researched"].includes(atmos.status)) {
    fail(`invalid Atmos research status for ${artist.artist}.`);
  }
  if (atmos.status === "pending" && atmos.hasAtmosAlbum !== null) {
    fail(`pending Atmos research must not have a Yes/No value for ${artist.artist}.`);
  }
  if (atmos.status === "researched" && typeof atmos.hasAtmosAlbum !== "boolean") {
    fail(`researched Atmos row needs a Yes/No value for ${artist.artist}.`);
  }
  if (!Array.isArray(atmos.albums)) {
    fail(`Atmos albums must be an array for ${artist.artist}.`);
  }
  if (atmos.hasAtmosAlbum === true && atmos.albums.length === 0) {
    fail(`Atmos Yes row needs at least one album for ${artist.artist}.`);
  }
  if (atmos.hasAtmosAlbum === false && atmos.albums.length > 0) {
    fail(`Atmos No row must not include albums for ${artist.artist}.`);
  }
  for (const album of atmos.albums) {
    if (!album.title || typeof album.title !== "string") fail(`blank Atmos album title for ${artist.artist}.`);
    if (album.releaseYear !== null && (typeof album.releaseYear !== "number" || album.releaseYear < 1900)) {
      fail(`invalid Atmos album release year for ${artist.artist}: ${album.title}.`);
    }
    if (album.sourceService !== null && typeof album.sourceService !== "string") {
      fail(`invalid Atmos album source service for ${artist.artist}: ${album.title}.`);
    }
    if (!Array.isArray(album.sourceUrls) || album.sourceUrls.some((url: unknown) => typeof url !== "string" || !url)) {
      fail(`invalid Atmos album source URLs for ${artist.artist}: ${album.title}.`);
    }
    if (album.confidence !== null && (typeof album.confidence !== "number" || album.confidence < 1 || album.confidence > 5)) {
      fail(`invalid Atmos album confidence for ${artist.artist}: ${album.title}.`);
    }
    if (album.notes !== null && typeof album.notes !== "string") {
      fail(`invalid Atmos album notes for ${artist.artist}: ${album.title}.`);
    }
  }
}

if (summaryStats.totalArtistCount !== artists.length) {
  fail("summaryStats totalArtistCount does not match artists.json.");
}

const missingTour = artists.length - (summaryStats.missingnessCounts?.tourGrossUsd?.available ?? 0);
if (missingTour < 1) warn("tour gross has no missing values; check that unknown zeroes were not preserved.");
if (!summaryStats.consistencyWarningCount) warn("no consistency warnings generated.");

console.log(`Validated ${artists.length} artists.`);
