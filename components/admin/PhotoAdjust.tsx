"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { PhotoFocus } from "@/types";
import { clampFocus, DEFAULT_FOCUS, focusStyles } from "@/lib/photo";
import { smallButton } from "./Fields";

interface Props {
  src: string;
  focus?: PhotoFocus;
  onSave: (focus: PhotoFocus) => void;
  onClose: () => void;
}

/**
 * Shows the photo inside a frame shaped exactly like a person card on the website,
 * with the name panel drawn on top, so faces can be moved clear of it.
 * Drag the photo (mouse or finger), or use the sliders.
 */
export function PhotoAdjust({ src, focus, onSave, onClose }: Props) {
  const [f, setF] = useState<PhotoFocus>(clampFocus(focus));
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; start: PhotoFocus } | null>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, start: f };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    const box = frameRef.current?.getBoundingClientRect();
    if (!d || !box) return;
    // Dragging the photo right shows more of its left side, so the focus moves the other way
    const speed = 100 / d.start.zoom;
    setF(
      clampFocus({
        ...d.start,
        x: d.start.x - ((e.clientX - d.x) / box.width) * speed,
        y: d.start.y - ((e.clientY - d.y) / box.height) * speed,
      }),
    );
  }

  const styles = focusStyles(f);
  const slider = (label: string, key: keyof PhotoFocus, min: number, max: number, step: number) => (
    <label className="grid gap-1 text-sm font-semibold">
      {label}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={f[key]}
        onChange={(e) => setF(clampFocus({ ...f, [key]: Number(e.target.value) }))}
        className="accent-brand-deep"
      />
    </label>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-strong/60 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Adjust photo"
        className="grid max-h-full w-full max-w-2xl gap-6 overflow-y-auto rounded-3xl bg-paper p-5 shadow-2xl sm:grid-cols-[260px_1fr] sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Same shape as the card on the website */}
        <div>
          <div
            ref={frameRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
            className="relative mx-auto aspect-[4/5] w-full max-w-[260px] cursor-grab touch-none overflow-hidden rounded-[22px] bg-tint ring-1 ring-line select-none active:cursor-grabbing"
          >
            <div className="pointer-events-none absolute inset-0" style={styles.wrapper}>
              <Image src={src} alt="" fill unoptimized draggable={false} className="object-cover" style={styles.image} />
            </div>
            {/* Preview of what sits on top of the photo on the card */}
            <span className="pointer-events-none absolute top-2.5 left-2.5 rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-white">Team</span>
            <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 rounded-2xl bg-surface/90 px-4 py-3 backdrop-blur-md">
              <p className="font-display font-bold">Name here</p>
              <p className="text-xs text-muted">Role</p>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-muted">Drag the photo to move it</p>
        </div>

        <div className="grid content-start gap-5">
          <div>
            <h2 className="font-display text-2xl font-bold">Adjust photo</h2>
            <p className="mt-1 text-sm text-muted">Keep the face above the name panel. This is exactly how the card looks on the website.</p>
          </div>
          {slider("Zoom", "zoom", 1, 3, 0.05)}
          {slider("Left ↔ Right", "x", 0, 100, 1)}
          {slider("Up ↕ Down", "y", 0, 100, 1)}
          <div className="flex flex-wrap gap-2 pt-2">
            <button type="button" className={smallButton} onClick={() => setF(DEFAULT_FOCUS)}>
              Reset
            </button>
            <button type="button" className={`${smallButton} ml-auto`} onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex min-h-10 items-center rounded-full bg-brand-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-pop hover:text-ink-strong"
              onClick={() => onSave(f)}
            >
              Use this
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
