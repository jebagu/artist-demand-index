import { SlidersHorizontal, X } from "lucide-react";
import type { ReactNode } from "react";
import type { ArtistRecord, FilterState } from "../types";
import { defaultFilters, uniqueSorted } from "../lib/filters";

type FilterBarProps = {
  artists: ArtistRecord[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  visibleCount: number;
};

export function FilterBar({ artists, filters, setFilters, visibleCount }: FilterBarProps) {
  const clusters = uniqueSorted(artists.map((artist) => artist.identity.cluster));
  const venues = uniqueSorted(artists.map((artist) => artist.live.venueScale));
  const flags = uniqueSorted(artists.flatMap((artist) => artist.qa.missingDataFlags));
  const activeChips = [
    filters.tier !== "all" ? `Tier ${filters.tier}` : null,
    filters.cluster !== "all" ? filters.cluster : null,
    filters.venueScale !== "all" ? filters.venueScale : null,
    filters.confidence !== "all" ? `Confidence ${filters.confidence}` : null,
    filters.missingFlag !== "all" ? filters.missingFlag : null,
    filters.activeTouring ? "Active touring" : null,
    !filters.showIncomplete ? "Complete only" : null,
    filters.hasWarnings ? "Warnings" : null
  ].filter(Boolean);

  return (
    <section className="rounded-lg border border-white/10 bg-panel/86 p-4 shadow-glow" aria-label="Global filters">
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-white">
          <SlidersHorizontal size={18} className="text-mint" />
          <h2 className="text-base font-semibold">Global filters</h2>
          <span className="rounded-md bg-white/8 px-2 py-1 text-xs text-slate-300">{visibleCount} visible</span>
        </div>
        <button
          type="button"
          onClick={() => setFilters(defaultFilters)}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-coral/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-coral/25"
        >
          <X size={15} />
          Clear all
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Select label="Tier" value={filters.tier} onChange={(value) => setFilters({ ...filters, tier: value })}>
          <option value="all">All tiers</option>
          <option value="5">Five-star</option>
          <option value="4">Four-star</option>
          <option value="3">Three-star</option>
          <option value="2">Two-star</option>
          <option value="1">One-star</option>
          <option value="N/A">N/A</option>
        </Select>
        <Select label="Cluster" value={filters.cluster} onChange={(value) => setFilters({ ...filters, cluster: value })}>
          <option value="all">All clusters</option>
          {clusters.map((cluster) => (
            <option key={cluster} value={cluster}>
              {cluster}
            </option>
          ))}
        </Select>
        <Select label="Venue scale" value={filters.venueScale} onChange={(value) => setFilters({ ...filters, venueScale: value })}>
          <option value="all">All venue scales</option>
          {venues.map((venue) => (
            <option key={venue} value={venue}>
              {venue}
            </option>
          ))}
        </Select>
        <Select label="Confidence" value={filters.confidence} onChange={(value) => setFilters({ ...filters, confidence: value })}>
          <option value="all">All confidence</option>
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value}/5
            </option>
          ))}
        </Select>
        <Select label="Missing flag" value={filters.missingFlag} onChange={(value) => setFilters({ ...filters, missingFlag: value })}>
          <option value="all">Any missingness</option>
          {flags.map((flag) => (
            <option key={flag} value={flag}>
              {flag}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Toggle
          label="Active touring 2025-2026"
          checked={filters.activeTouring}
          onChange={(checked) => setFilters({ ...filters, activeTouring: checked })}
        />
        <Toggle
          label="Show incomplete records"
          checked={filters.showIncomplete}
          onChange={(checked) => setFilters({ ...filters, showIncomplete: checked })}
        />
        <Toggle
          label="Has consistency warnings"
          checked={filters.hasWarnings}
          onChange={(checked) => setFilters({ ...filters, hasWarnings: checked })}
        />
      </div>

      {activeChips.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <span key={chip} className="rounded-md bg-mint/10 px-2.5 py-1 text-xs font-medium text-mint">
              {chip}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function Select({
  label,
  value,
  onChange,
  children
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-slate-100 outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
      >
        {children}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-white/20 bg-white/10 text-mint focus:ring-mint/30"
      />
      {label}
    </label>
  );
}
