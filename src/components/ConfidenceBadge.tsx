import { ShieldCheck } from "lucide-react";

type ConfidenceBadgeProps = {
  value: number | null;
};

export function ConfidenceBadge({ value }: ConfidenceBadgeProps) {
  const label = value === null ? "Unknown confidence" : `Confidence ${value}/5`;
  const color = value === null ? "#9AA8BC" : value >= 4 ? "#49D3A8" : value >= 3 ? "#F2B84B" : "#FF7A70";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium"
      style={{ color, borderColor: `${color}66`, background: `${color}18` }}
      title={label}
    >
      <ShieldCheck size={13} />
      {value ?? "?"}/5
    </span>
  );
}
