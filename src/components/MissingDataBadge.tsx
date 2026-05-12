type MissingDataBadgeProps = {
  flags: string[];
};

export function MissingDataBadge({ flags }: MissingDataBadgeProps) {
  if (!flags.length) {
    return <span className="rounded-md border border-mint/30 bg-mint/10 px-2 py-1 text-xs font-medium text-mint">Complete core profile</span>;
  }

  return (
    <span className="rounded-md border border-coral/30 bg-coral/10 px-2 py-1 text-xs font-medium text-coral">
      {flags.length} missing flag{flags.length === 1 ? "" : "s"}
    </span>
  );
}
