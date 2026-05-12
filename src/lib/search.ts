import Fuse from "fuse.js";
import type { ArtistRecord } from "../types";

export function createArtistSearch(artists: ArtistRecord[]) {
  return new Fuse(artists, {
    keys: ["artist", "identity.primaryGenre", "identity.cluster", "identity.countryMarket"],
    threshold: 0.28,
    ignoreLocation: true
  });
}
