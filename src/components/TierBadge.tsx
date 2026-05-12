import type { TierOrdinal } from "../types";
import { tierBg, tierColor, tierKey, tierMeta } from "../lib/tier";

type TierBadgeProps = {
  ordinal: TierOrdinal;
  compact?: boolean;
};

export function TierBadge({ ordinal, compact = false }: TierBadgeProps) {
  const key = tierKey(ordinal);
  const meta = tierMeta[key];
  return (
    <span
      className="inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-semibold"
      style={{ color: tierColor(ordinal), background: tierBg(ordinal), borderColor: `${tierColor(ordinal)}66` }}
    >
      <span aria-hidden="true">{ordinal ? "★".repeat(ordinal) : "N/A"}</span>
      {!compact ? <span>{meta.shortLabel}</span> : null}
    </span>
  );
}
