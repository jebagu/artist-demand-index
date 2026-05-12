import type { TierOrdinal } from "../types";

export const tierOrder: Array<TierOrdinal> = [5, 4, 3, 2, 1, null];

export const tierMeta: Record<string, { label: string; shortLabel: string; color: string; bg: string; meaning: string }> = {
  "5": {
    label: "Five-star",
    shortLabel: "5-star",
    color: "#49D3A8",
    bg: "rgba(73, 211, 168, 0.16)",
    meaning: "Stadium or arena headliner, major cultural visibility, significant online footprint."
  },
  "4": {
    label: "Four-star",
    shortLabel: "4-star",
    color: "#6BA7FF",
    bg: "rgba(107, 167, 255, 0.16)",
    meaning: "Theater or festival headliner, strong but not always arena-level."
  },
  "3": {
    label: "Three-star",
    shortLabel: "3-star",
    color: "#F2B84B",
    bg: "rgba(242, 184, 75, 0.15)",
    meaning: "Club, mid-size, or niche festival candidate. Useful for targeted programming."
  },
  "2": {
    label: "Two-star",
    shortLabel: "2-star",
    color: "#FF9F6E",
    bg: "rgba(255, 159, 110, 0.14)",
    meaning: "Small venue or rising artist. Treat as emerging or narrow audience."
  },
  "1": {
    label: "One-star",
    shortLabel: "1-star",
    color: "#FF7A70",
    bg: "rgba(255, 122, 112, 0.14)",
    meaning: "Niche, emerging, or non-commercial. Often sound/visual art or experimental programming."
  },
  "N/A": {
    label: "N/A",
    shortLabel: "N/A",
    color: "#9AA8BC",
    bg: "rgba(154, 168, 188, 0.12)",
    meaning: "Insufficient identification or data."
  }
};

export function tierKey(ordinal: TierOrdinal): string {
  return ordinal === null ? "N/A" : String(ordinal);
}

export function tierColor(ordinal: TierOrdinal): string {
  return tierMeta[tierKey(ordinal)]?.color ?? tierMeta["N/A"].color;
}

export function tierBg(ordinal: TierOrdinal): string {
  return tierMeta[tierKey(ordinal)]?.bg ?? tierMeta["N/A"].bg;
}
