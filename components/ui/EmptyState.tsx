import type { ReactNode } from "react";

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-line px-6 py-10">
      <p className="font-display text-xl font-bold">{title}</p>
      {children && <p className="mt-2 max-w-[60ch] text-muted">{children}</p>}
    </div>
  );
}
