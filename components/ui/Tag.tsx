import type { EventRole } from "@/types";

/** "Organized" gets the pop yellow sticker; "Managed" stays quiet. */
export function RoleTag({ role }: { role: EventRole }) {
  const styles =
    role === "Organized"
      ? "bg-pop text-ink-strong -rotate-2"
      : "bg-surface text-ink border border-line";
  return (
    <span className={`inline-block rounded-sm px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${styles}`}>
      {role}
    </span>
  );
}
