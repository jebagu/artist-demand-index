import { Activity, AlertTriangle, Music2, ShieldCheck, Star, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ArtistRecord, DataHealth, SummaryStats } from "../types";
import { formatCount, formatScore } from "../lib/format";
import { tierColor, tierKey, tierMeta, tierOrder } from "../lib/tier";
import { KpiCard } from "../components/KpiCard";
import { ChartCard } from "../components/ChartCard";

type OverviewSectionProps = {
  artists: ArtistRecord[];
  summary: SummaryStats;
  health: DataHealth;
};

export function OverviewSection({ artists, summary, health }: OverviewSectionProps) {
  const tierData = tierOrder.map((tier) => {
    const key = tierKey(tier);
    return {
      tier,
      label: tierMeta[key].label,
      count: summary.tierCounts[key] ?? 0
    };
  });

  return (
    <section id="overview" className="scroll-mt-32">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-mint">Research intelligence</p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl">
            Artist Demand Index
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            119 artists across streaming, social, live, sales, catalog, and cultural heat. Snapshot: May 12, 2026.
          </p>
        </div>
        <div className="rounded-lg border border-amber/25 bg-amber/10 p-4 text-sm leading-6 text-slate-100">
          <div className="mb-2 flex items-center gap-2 font-semibold text-amber">
            <AlertTriangle size={17} />
            Data-quality note
          </div>
          {health.dataQualityNote}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <KpiCard label="Total artists" value={formatCount(summary.totalArtistCount)} icon={<Music2 size={18} />} accent="mint" />
        <KpiCard label="Five-star" value={formatCount(summary.tierCounts["5"] ?? 0)} icon={<Star size={18} />} accent="mint" />
        <KpiCard label="Four-star" value={formatCount(summary.tierCounts["4"] ?? 0)} icon={<Star size={18} />} accent="sky" />
        <KpiCard label="Three-star" value={formatCount(summary.tierCounts["3"] ?? 0)} icon={<Activity size={18} />} accent="amber" />
        <KpiCard
          label="Avg confidence"
          value={`${formatScore(summary.averageConfidence)}/5`}
          icon={<ShieldCheck size={18} />}
          accent="sky"
        />
        <KpiCard
          label="Usable social"
          value={formatCount(summary.missingnessCounts.socialReach?.available ?? 0)}
          detail={`${formatCount(summary.missingnessCounts.tourGrossUsd?.available ?? 0)} latest public tour gross`}
          icon={<Users size={18} />}
          accent="coral"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ChartCard
          title="Demand Tier Distribution"
          description="This distribution uses the demand tier already assigned in the workbook normalization tab. Tiers are driven by the workbook's composite demand score and qualifier notes, while N/A remains explicit for artists without enough usable demand evidence. The dashboard does not promote or demote artists into new tiers."
        >
          <div className="h-[310px]" role="img" aria-label="Horizontal bar chart showing demand tier distribution.">
            <ResponsiveContainer>
              <BarChart data={tierData} layout="vertical" margin={{ left: 14, right: 24 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" allowDecimals={false} />
                <YAxis type="category" dataKey="label" width={92} stroke="#CBD5E1" />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{ background: "#11151E", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {tierData.map((entry) => (
                    <Cell key={entry.label} fill={tierColor(entry.tier)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="What This Means" eyebrow="Executive readout">
          <div className="grid gap-3">
            {[
              `The roster splits into two useful pools: a commercial headliner pool and a Sonic Sphere specialty pool. The largest bucket is three-star club or niche festival candidates, while ${summary.tierCounts["5"] ?? 0} artists are currently modeled as five-star names.`,
              "The online footprint is highly skewed. A small number of global stars dominate social reach and streaming, so footprint charts use log scaling and keep smaller artists visible.",
              "Data quality is part of the story. Many artists lack latest public tour gross, social, or certification data. Treat tiers as directional and use the QA panel before booking decisions."
            ].map((copy) => (
              <div key={copy} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-200">
                {copy}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Current filtered source has {artists.length} artists loaded from generated JSON.
          </p>
        </ChartCard>
      </div>
    </section>
  );
}
