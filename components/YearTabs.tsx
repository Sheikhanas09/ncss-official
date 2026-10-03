"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

interface YearTabsProps {
  /** Newest first. */
  years: string[];
  /** One panel per year, in the same order. */
  panels: ReactNode[];
}

/** Accessible tabs: arrow keys move between years, Home/End jump to the ends. */
export function YearTabs({ years, panels }: YearTabsProps) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(i: number) {
    setActive(i);
    tabs.current[i]?.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    const last = years.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (e.key in moves) {
      e.preventDefault();
      select(moves[e.key]);
    }
  }

  return (
    <div>
      {/* A timeline: one dot per year on a line, newest on the left */}
      <div className="overflow-x-auto pt-2 pb-2">
        <div role="tablist" aria-label="Cabinet year" onKeyDown={onKeyDown} className="relative flex min-w-max gap-2 sm:gap-4">
          <span aria-hidden className="absolute top-[22px] right-6 left-6 h-0.5 bg-line" />
          {years.map((year, i) => {
            const selected = i === active;
            return (
              <button
                key={year}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`tab-${year}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`panel-${year}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className="group relative flex w-28 flex-col items-center gap-2 rounded-2xl pb-1 sm:w-32"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ring-4 ring-paper transition duration-300 motion-reduce:transition-none ${
                    selected ? "scale-110 bg-brand-deep" : "bg-tint group-hover:bg-pop"
                  }`}
                >
                  <span className={`h-3 w-3 rounded-full ${selected ? "bg-pop" : "bg-muted/40 group-hover:bg-ink-strong"}`} />
                </span>
                <span
                  className={`font-display text-lg font-bold tabular-nums transition-colors sm:text-xl ${
                    selected ? "text-ink" : "text-muted group-hover:text-ink"
                  }`}
                >
                  {year}
                </span>
                <span className={`-mt-1.5 text-xs ${selected ? "text-link" : "text-muted"}`}>{i === 0 ? "Latest cabinet" : "Cabinet"}</span>
              </button>
            );
          })}
        </div>
      </div>

      {years.map((year, i) => (
        <div
          key={year}
          id={`panel-${year}`}
          role="tabpanel"
          aria-labelledby={`tab-${year}`}
          hidden={i !== active}
          tabIndex={0}
          className="pt-10"
        >
          {panels[i]}
        </div>
      ))}
    </div>
  );
}
