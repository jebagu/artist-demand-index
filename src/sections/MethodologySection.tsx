import type { DataHealth } from "../types";
import { ChartCard } from "../components/ChartCard";

type MethodologySectionProps = {
  health: DataHealth;
};

export function MethodologySection({ health }: MethodologySectionProps) {
  return (
    <section id="methodology" className="scroll-mt-32">
      <ChartCard title="Methodology" eyebrow="Snapshot and caveats">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <h3 className="font-semibold text-white">Snapshot</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">May 12, 2026. The app parses the workbook at build time and uses generated JSON at runtime.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <h3 className="font-semibold text-white">Normalization</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              The workbook applies a log transform, log10(raw_value + 1), then percentile-ranks each dimension to a 0-100 scale. The composite score uses the workbook's original weights: Spotify monthly listeners 35%, social followers 25%, latest public tour gross 25%, and lifetime RIAA units 15%. The dashboard displays those workbook scores rather than recalculating demand in the browser.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <h3 className="font-semibold text-white">Important caveat</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              The app does not create a new score. It visualizes the existing workbook score and raw source detail-tab data. Tour gross represents the latest public tour gross captured in the workbook, while catalog streams and RIAA units are lifetime-style signals.
            </p>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <h3 className="font-semibold text-white">Source families</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Spotify, Kworb.net, Instagram, X/Twitter, Facebook, Bandsintown, RIAA, BPI, Billboard, Pollstar, Wikipedia, Chartmetric.
          </p>
        </div>
        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <h3 className="font-semibold text-white">Parsed workbook tabs</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {health.sourceTabs.map((tab) => (
              <span key={tab} className="rounded-md bg-white/8 px-2.5 py-1 text-xs text-slate-300">
                {tab}
              </span>
            ))}
          </div>
        </div>
      </ChartCard>
    </section>
  );
}
