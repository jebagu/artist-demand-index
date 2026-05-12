import type { ReactNode } from "react";
import clsx from "clsx";

type ChartCardProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function ChartCard({ title, eyebrow, description, children, className }: ChartCardProps) {
  return (
    <section className={clsx("rounded-lg border border-white/10 bg-panel/86 p-5 shadow-glow", className)}>
      <div className="mb-4 flex flex-col gap-1">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint">{eyebrow}</p> : null}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description ? <p className="max-w-3xl text-sm leading-6 text-slate-300">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
