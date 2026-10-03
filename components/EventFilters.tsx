"use client";

import { useMemo, useState } from "react";
import type { EventRole, NcssEvent } from "@/types";
import { yearOf } from "@/lib/format";
import { EventCard } from "@/components/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";

type RoleFilter = "All" | EventRole;
const roles: RoleFilter[] = ["All", "Organized", "Managed"];

/** One pill in a segmented control */
function Segment({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
        active ? "bg-brand-deep text-white shadow-sm" : "text-ink hover:bg-pop hover:text-ink-strong"
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`rounded-full px-1.5 text-xs tabular-nums ${active ? "bg-white/20" : "bg-surface"}`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/** Filters run in the browser, so the page itself stays fully static. */
export function EventFilters({ events }: { events: NcssEvent[] }) {
  const years = useMemo(() => [...new Set(events.map((e) => yearOf(e.date)))].sort().reverse(), [events]);
  const [year, setYear] = useState<string>("All");
  const [role, setRole] = useState<RoleFilter>("All");

  const inYear = events.filter((e) => year === "All" || yearOf(e.date) === year);
  const shown = inYear.filter((e) => role === "All" || e.ourRole === role);
  const roleCount = (r: RoleFilter) => (r === "All" ? inYear.length : inYear.filter((e) => e.ourRole === r).length);

  // Group what is shown by year, newest first
  const groups = years
    .map((y) => ({ year: y, items: shown.filter((e) => yearOf(e.date) === y) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      {/* Stays under the navbar while you scroll */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-paper/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-18 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="Filter by year" className="flex max-w-full gap-1 self-start overflow-x-auto rounded-full bg-tint p-1">
            {["All", ...years].map((y) => (
              <Segment key={y} active={year === y} onClick={() => setYear(y)} label={y === "All" ? "All years" : y} />
            ))}
          </div>
          <div role="group" aria-label="Filter by our role" className="flex max-w-full gap-1 self-start overflow-x-auto rounded-full bg-tint p-1">
            {roles.map((r) => (
              <Segment key={r} active={role === r} onClick={() => setRole(r)} label={r} count={roleCount(r)} />
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        Showing {shown.length} of {events.length} {events.length === 1 ? "event" : "events"}
      </p>

      {groups.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No events match these filters">Try another year, or set both filters back to All.</EmptyState>
        </div>
      ) : (
        groups.map((g) => (
          <section
            key={g.year}
            aria-labelledby={`year-${g.year}`}
            className="grid gap-6 border-b border-line py-10 last:border-b-0 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10 lg:py-14"
          >
            <div className="self-start lg:sticky lg:top-40">
              <h2 id={`year-${g.year}`} className="font-display text-6xl leading-none font-extrabold tracking-tighter text-link tabular-nums sm:text-7xl">
                {g.year}
              </h2>
              <p className="mt-2 text-muted">
                {g.items.length} {g.items.length === 1 ? "event" : "events"}
              </p>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2">
              {g.items.map((e, i) => (
                <li key={e.id}>
                  <Reveal index={i}>
                    <EventCard event={e} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  );
}
