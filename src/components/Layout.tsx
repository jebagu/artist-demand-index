import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_25%_0%,rgba(73,211,168,0.12),transparent_30%),radial-gradient(circle_at_75%_10%,rgba(107,167,255,0.12),transparent_28%)]" />
      {children}
    </div>
  );
}
