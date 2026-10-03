const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-03-14" → "14 March 2026" */
export function formatDate(iso: string): string {
  return dateFormat.format(new Date(`${iso}T00:00:00Z`));
}

const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });

/** "2026-03-14" → { day: "14", month: "Mar" } for calendar-style date badges */
export function dateParts(iso: string): { day: string; month: string } {
  const d = new Date(`${iso}T00:00:00Z`);
  return { day: String(d.getUTCDate()), month: monthFormat.format(d) };
}

export function yearOf(iso: string): string {
  return iso.slice(0, 4);
}

/** "Ayesha Khan" → "AK", "Sara" → "S" */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** What a person's card says under their name: their title if set, otherwise their role. */
export function roleLabel(person: { role: string; title?: string }): string {
  if (person.title?.trim()) return person.title.trim();
  return person.role === "Leadership" ? "Cabinet" : person.role;
}
