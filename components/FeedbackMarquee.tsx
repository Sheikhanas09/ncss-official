"use client";

import { useState, type CSSProperties } from "react";
import type { FeedbackEntry } from "@/types";
import { FeedbackQuote } from "@/components/FeedbackQuote";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";

/** Seconds each review takes to move one card width. Higher = slower. */
const SECONDS_PER_CARD = 9;
/** Enough cards in one loop to fill wide screens. */
const MIN_CARDS = 6;

/**
 * Sponsor reviews sliding slowly from left to right in an endless loop.
 * Pauses on hover and with the Pause button. With "reduce motion" turned on,
 * it becomes a plain row you can scroll sideways.
 */
export function FeedbackMarquee({ items }: { items: FeedbackEntry[] }) {
  const [paused, setPaused] = useState(false);

  // Repeat the reviews so one loop is always wider than the screen
  const repeats = Math.max(1, Math.ceil(MIN_CARDS / items.length));
  const loop = Array.from({ length: repeats }, () => items).flat();
  const style = { "--marquee-duration": `${loop.length * SECONDS_PER_CARD}s` } as CSSProperties;

  const renderSet = (hidden: boolean) =>
    loop.map((f, i) => (
      // Screen readers hear each review once
      <li key={`${f.sponsorId}-${i}`} aria-hidden={hidden || i >= items.length || undefined} className="mr-5 flex shrink-0">
        <FeedbackQuote feedback={f} className="w-[300px] sm:w-[400px]" />
      </li>
    ));

  return (
    <div className="marquee" data-paused={paused || undefined} style={style}>
      <div className="marquee-viewport py-2">
        <div className="marquee-track flex w-max">
          <ul className="flex">{renderSet(false)}</ul>
          <ul className="marquee-dup flex" aria-hidden>
            {renderSet(true)}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="marquee-toggle mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-line px-4 text-sm font-semibold transition-colors hover:border-pop hover:bg-pop hover:text-ink-strong"
      >
        {paused ? <PlayIcon width={16} height={16} /> : <PauseIcon width={16} height={16} />}
        {paused ? "Play reviews" : "Pause reviews"}
      </button>
    </div>
  );
}
