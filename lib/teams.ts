import type { AccentKey, TeamSummary } from "@/types";

/** Team slug → accent, for places that only know a team by its slug (like alumni). */
export function accentMap(teams: TeamSummary[]): Record<string, AccentKey> {
  return Object.fromEntries(teams.map((t) => [t.slug, t.accent]));
}
