/** A plain JSON object being edited in the admin panel. */
export type Doc = Record<string, unknown>;

/** "Arts & Dramatics" → "arts-dramatics" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Short random suffix so new ids never clash */
export function shortId(): string {
  return Math.random().toString(36).slice(2, 7);
}

/** Makes `wanted` unique among `taken` by adding -2, -3 … */
export function uniqueValue(wanted: string, taken: Set<string>): string {
  let value = wanted || shortId();
  let n = 2;
  while (taken.has(value)) value = `${wanted}-${n++}`;
  taken.add(value);
  return value;
}

export const str = (v: unknown): string => (typeof v === "string" ? v : v == null ? "" : String(v));

/** Every image URL inside a value (used to clean up storage when something is deleted). */
export function collectImageUrls(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") {
    if (/^https?:\/\/.+\/storage\/v1\/object\/public\//.test(value)) out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectImageUrls(v, out));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => collectImageUrls(v, out));
  }
  return out;
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
