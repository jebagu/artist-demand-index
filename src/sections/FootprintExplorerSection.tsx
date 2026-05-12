import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis
} from "recharts";
import type { ArtistRecord, MetricKey } from "../types";
import { ChartCard } from "../components/ChartCard";
import { formatCount, formatMoney, formatScore } from "../lib/format";
import { getMetricDefinition, getMetricValue, metricDefinitions } from "../lib/metrics";
import { positiveDomain } from "../lib/scales";
import { tierColor } from "../lib/tier";

type FootprintExplorerSectionProps = {
  artists: ArtistRecord[];
  onSelect: (artist: ArtistRecord) => void;
};

type PlotPoint = {
  artist: string;
  x: number;
  y: number;
  z: number;
  artistRecord: ArtistRecord;
  label: string | null;
};

export function FootprintExplorerSection({ artists, onSelect }: FootprintExplorerSectionProps) {
  const [xMetric, setXMetric] = useState<MetricKey>("spotifyMonthlyListeners");
  const [yMetric, setYMetric] = useState<MetricKey>("socialReach");
  const [sizeMetric, setSizeMetric] = useState<MetricKey>("tourGrossUsd");
  const [scale, setScale] = useState<"log" | "linear">("log");

  const xDef = getMetricDefinition(xMetric);
  const yDef = getMetricDefinition(yMetric);
  const sizeDef = getMetricDefinition(sizeMetric);

  const { plotData, hiddenArtists } = useMemo(() => {
    const points = artists
      .map((artist) => ({
        artist,
        x: getMetricValue(artist, xMetric),
        y: getMetricValue(artist, yMetric),
        z: sizeMetric === "none" ? 1 : getMetricValue(artist, sizeMetric)
      }))
      .filter((point) => point.x !== null && point.y !== null)
      .filter((point) => (scale === "log" ? point.x! > 0 && point.y! > 0 : true));

    const labelIds = new Set(
      [...points]
        .sort((a, b) => (b.x ?? 0) + (b.y ?? 0) - ((a.x ?? 0) + (a.y ?? 0)))
        .slice(0, 8)
        .map((point) => point.artist.id)
    );

    const plotted: PlotPoint[] = points.map((point) => ({
      artist: point.artist.artist,
      x: point.x!,
      y: point.y!,
      z: Math.max(1, point.z ?? 1),
      artistRecord: point.artist,
      label: labelIds.has(point.artist.id) ? point.artist.artist : null
    }));

    const hidden = artists.filter((artist) => {
      const x = getMetricValue(artist, xMetric);
      const y = getMetricValue(artist, yMetric);
      if (x === null || y === null) return true;
      return scale === "log" ? x <= 0 || y <= 0 : false;
    });

    return { plotData: plotted, hiddenArtists: hidden };
  }, [artists, scale, sizeMetric, xMetric, yMetric]);

  const xDomain = scale === "log" ? positiveDomain(plotData.map((point) => point.x)) : ["auto", "auto"];
  const yDomain = scale === "log" ? positiveDomain(plotData.map((point) => point.y)) : ["auto", "auto"];

  return (
    <section id="footprint" className="scroll-mt-32">
      <ChartCard
        title="Footprint Explorer"
        eyebrow="Interactive scatter"
        description="The explorer plots raw footprint metrics from the generated workbook data and excludes missing values instead of plotting them as zero. Spotify monthly listeners and social reach are current public footprint signals, latest public tour gross is a recent live-market signal, and catalog streams or RIAA units are lifetime-style measures. Point color is demand tier; point size follows the selected size metric."
      >
        <div className="mb-5 grid gap-3 md:grid-cols-4">
          <MetricSelect label="X axis" value={xMetric} onChange={setXMetric} />
          <MetricSelect label="Y axis" value={yMetric} onChange={setYMetric} />
          <MetricSelect label="Size" value={sizeMetric} onChange={setSizeMetric} includeNone />
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Scale</span>
            <select
              value={scale}
              onChange={(event) => setScale(event.target.value as "log" | "linear")}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-slate-100 outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
            >
              <option value="log">Log</option>
              <option value="linear">Linear</option>
            </select>
          </label>
        </div>

        <div className="h-[520px]" role="img" aria-label={`${xDef.label} versus ${yDef.label} scatter plot.`}>
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 24, right: 30, bottom: 30, left: 18 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="x"
                name={xDef.label}
                type="number"
                scale={scale}
                domain={xDomain as [number, number]}
                tickFormatter={xDef.formatter}
                stroke="#94A3B8"
              />
              <YAxis
                dataKey="y"
                name={yDef.label}
                type="number"
                scale={scale}
                domain={yDomain as [number, number]}
                tickFormatter={yDef.formatter}
                stroke="#94A3B8"
                width={78}
              />
              <ZAxis dataKey="z" range={sizeMetric === "none" ? [80, 80] : [70, 620]} />
              <Tooltip content={<ScatterTooltip xDef={xDef} yDef={yDef} sizeDef={sizeDef} />} />
              <Scatter
                data={plotData}
                onClick={(point) => {
                  const payload = point as PlotPoint;
                  if (payload.artistRecord) onSelect(payload.artistRecord);
                }}
                cursor="pointer"
              >
                {plotData.map((entry) => (
                  <Cell
                    key={entry.artistRecord.id}
                    fill={tierColor(entry.artistRecord.tier.ordinal)}
                    fillOpacity={Math.max(0.35, (entry.artistRecord.qa.confidenceRating ?? 2) / 5)}
                    stroke={tierColor(entry.artistRecord.tier.ordinal)}
                    strokeWidth={entry.artistRecord.qa.confidenceRating && entry.artistRecord.qa.confidenceRating >= 4 ? 2 : 1}
                  />
                ))}
                <LabelList dataKey="label" content={renderPointLabel} />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <details className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
          <summary className="cursor-pointer font-medium text-slate-100">
            {hiddenArtists.length} artists hidden by missing or non-positive axis values
          </summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {hiddenArtists.slice(0, 80).map((artist) => (
              <button
                key={artist.id}
                type="button"
                onClick={() => onSelect(artist)}
                className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-slate-300 hover:border-mint/40 hover:text-white"
              >
                {artist.artist}
              </button>
            ))}
          </div>
        </details>
      </ChartCard>
    </section>
  );
}

function MetricSelect({
  label,
  value,
  onChange,
  includeNone = false
}: {
  label: string;
  value: MetricKey;
  onChange: (value: MetricKey) => void;
  includeNone?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as MetricKey)}
        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-slate-100 outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
      >
        {metricDefinitions
          .filter((metric) => includeNone || metric.key !== "none")
          .map((metric) => (
            <option key={metric.key} value={metric.key}>
              {metric.label}
            </option>
          ))}
      </select>
    </label>
  );
}

function ScatterTooltip({
  active,
  payload,
  xDef,
  yDef,
  sizeDef
}: {
  active?: boolean;
  payload?: Array<{ payload: PlotPoint }>;
  xDef: ReturnType<typeof getMetricDefinition>;
  yDef: ReturnType<typeof getMetricDefinition>;
  sizeDef: ReturnType<typeof getMetricDefinition>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const artist = point.artistRecord;
  return (
    <div className="max-w-[320px] rounded-lg border border-white/10 bg-panel p-4 text-sm shadow-glow">
      <div className="mb-2 text-base font-semibold text-white">{artist.artist}</div>
      <div className="grid gap-1 text-slate-300">
        <Line label="Tier" value={artist.tier.label ?? "N/A"} />
        <Line label={xDef.shortLabel} value={xDef.formatter(point.x)} />
        <Line label={yDef.shortLabel} value={yDef.formatter(point.y)} />
        {sizeDef.key !== "none" ? <Line label={sizeDef.shortLabel} value={sizeDef.formatter(point.z)} /> : null}
        <Line label="Lifetime RIAA units" value={formatCount(artist.sales.riaaTotalUnits)} />
        <Line label="Heat" value={formatScore(artist.heat.score)} />
        <Line label="Confidence" value={`${artist.qa.confidenceRating ?? "?"}/5`} />
        <Line label="Missing" value={artist.qa.missingDataFlags.length ? artist.qa.missingDataFlags.join(", ") : "None flagged"} />
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[128px_1fr] gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-100">{value}</span>
    </div>
  );
}

function renderPointLabel(props: { x?: string | number; y?: string | number; value?: string | number | null }) {
  const x = Number(props.x);
  const y = Number(props.y);
  if (!props.value || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  return (
    <text x={x + 8} y={y - 8} fill="#CBD5E1" fontSize={11} pointerEvents="none">
      {String(props.value)}
    </text>
  );
}
