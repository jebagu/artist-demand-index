import { Database, Search } from "lucide-react";
import type { FilterState } from "../types";

type HeaderProps = {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
};

const navItems = [
  ["Overview", "#overview"],
  ["Explorer", "#footprint"],
  ["Tiers", "#tiers"],
  ["Online", "#online"],
  ["Live & Sales", "#live-sales"],
  ["Genres", "#genres"],
  ["Compare", "#compare"],
  ["Quality", "#quality"],
  ["Methodology", "#methodology"]
];

export function Header({ filters, setFilters }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <a href="#overview" className="flex items-center gap-3 text-white">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-mint/30 bg-mint/10 text-mint">
              <Database size={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Sonic Sphere</span>
              <span className="block text-lg font-semibold">Artist Demand Index</span>
            </span>
          </a>
          <label className="relative block min-w-0 lg:w-[360px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
            <span className="sr-only">Search artists</span>
            <input
              value={filters.query}
              onChange={(event) => setFilters({ ...filters, query: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
              placeholder="Search artist, genre, market..."
            />
          </label>
        </div>
        <nav aria-label="Dashboard sections" className="flex gap-2 overflow-x-auto pb-1">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 rounded-md border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-mint/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-mint/30"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
