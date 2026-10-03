import type { CSSProperties } from "react";
import type { AccentKey } from "@/types";

/**
 * Exposes a team accent as three CSS variables for the element and its children:
 *   --acc        the big colour block
 *   --acc-strip  the shade used behind small text (badge strips)
 *   --acc-on     the text colour that passes contrast on both
 * The colours themselves live in app/globals.css.
 */
export function accentVars(accent: AccentKey): CSSProperties {
  return {
    "--acc": `var(--accent-${accent})`,
    "--acc-strip": `var(--accent-${accent}-strip)`,
    "--acc-on": `var(--accent-${accent}-on)`,
  } as CSSProperties;
}

/** Leadership uses the brand teal. */
export const brandAccent: AccentKey = "teal";
