import type { ReactNode } from "react";
import clsx from "clsx";

type KpiCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  accent?: "mint" | "sky" | "amber" | "coral";
};

const accents = {
  mint: "text-mint",
  sky: "text-sky",
  amber: "text-amber",
  coral: "text-coral"
};

export function KpiCard({ label, value, detail, icon, accent = "mint" }: KpiCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel/80 p-4">
      <div className="mb-3 flex items-center justify-between gap-3 text-sm text-slate-400">
        <span>{label}</span>
        {icon ? <span className={clsx("inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/5", accents[accent])}>{icon}</span> : null}
      </div>
      <div className="text-3xl font-semibold text-white">{value}</div>
      {detail ? <div className="mt-2 text-sm leading-5 text-slate-400">{detail}</div> : null}
    </div>
  );
}
