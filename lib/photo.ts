import type { CSSProperties } from "react";
import type { PhotoFocus } from "@/types";

/** Without a saved focus, keep the upper part of portraits in view: that is where faces usually are. */
export const DEFAULT_FOCUS: PhotoFocus = { x: 50, y: 30, zoom: 1 };

export function clampFocus(f: Partial<PhotoFocus> | undefined): PhotoFocus {
  const n = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) ? v : d);
  return {
    x: Math.min(100, Math.max(0, n(f?.x, DEFAULT_FOCUS.x))),
    y: Math.min(100, Math.max(0, n(f?.y, DEFAULT_FOCUS.y))),
    zoom: Math.min(3, Math.max(1, n(f?.zoom, 1))),
  };
}

/** Styles for the image (which part shows) and its wrapper (zoom towards that part). */
export function focusStyles(focus: Partial<PhotoFocus> | undefined): { image: CSSProperties; wrapper: CSSProperties } {
  const f = clampFocus(focus);
  return {
    image: { objectPosition: `${f.x}% ${f.y}%` },
    wrapper: f.zoom > 1 ? { transform: `scale(${f.zoom})`, transformOrigin: `${f.x}% ${f.y}%` } : {},
  };
}

/** Logos start centred at their normal size. */
export const DEFAULT_LOGO_FOCUS: PhotoFocus = { x: 50, y: 50, zoom: 1 };

/** Logos can also be made smaller (zoom below 1), unlike photos. */
export function clampLogoFocus(f: Partial<PhotoFocus> | undefined): PhotoFocus {
  const n = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) ? v : d);
  return {
    x: Math.min(100, Math.max(0, n(f?.x, DEFAULT_LOGO_FOCUS.x))),
    y: Math.min(100, Math.max(0, n(f?.y, DEFAULT_LOGO_FOCUS.y))),
    zoom: Math.min(3, Math.max(0.5, n(f?.zoom, 1))),
  };
}

/**
 * Style for a logo shown with object-contain: x/y 50 is centred, 0 and 100 move it
 * half its box to either side. Works in every logo box, whatever its size.
 */
export function logoStyle(focus: Partial<PhotoFocus> | undefined): CSSProperties {
  const f = clampLogoFocus(focus);
  if (f.x === 50 && f.y === 50 && f.zoom === 1) return {};
  return { transform: `translate(${f.x - 50}%, ${f.y - 50}%) scale(${f.zoom})` };
}
