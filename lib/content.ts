// Loads the site content. Reads the admin panel's saved content from Supabase,
// and falls back to the starter content in /data for anything not saved yet.

import { site } from "@/data/site";
import { teams } from "@/data/teams";
import { members } from "@/data/members";
import { alumni } from "@/data/alumni";
import { sponsors } from "@/data/sponsors";
import { events } from "@/data/events";
import type { ContentKey, ContentMap, SiteInfo } from "@/types";
import { CONTENT_TABLE, isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

/** Starter content, used until the admin saves each section for the first time. */
export const defaultContent: ContentMap = { site, members, teams, events, sponsors, alumni };

/** Pages are rebuilt at most this often (seconds) even without a save from the admin panel. */
const REFRESH_SECONDS = 300;

/** Keeps new site fields working when older saved content does not have them yet. */
export function withSiteDefaults(saved: Partial<SiteInfo>): SiteInfo {
  return {
    ...defaultContent.site,
    ...saved,
    instagram: { ...defaultContent.site.instagram, ...saved.instagram },
    logo: { ...defaultContent.site.logo, ...saved.logo },
    heroImage: { ...defaultContent.site.heroImage, ...saved.heroImage },
    copy: { ...defaultContent.site.copy, ...saved.copy },
    contactLinks: saved.contactLinks ?? defaultContent.site.contactLinks ?? [],
  };
}

async function loadSaved(): Promise<Partial<ContentMap>> {
  if (!isSupabaseConfigured) return {};
  try {
    // One request for everything. Next.js caches it and shares it across the render.
    const res = await fetch(`${supabaseUrl}/rest/v1/${CONTENT_TABLE}?select=key,data`, {
      headers: { apikey: supabaseAnonKey },
      next: { revalidate: REFRESH_SECONDS, tags: ["content"] },
    });
    if (!res.ok) return {};
    const rows = (await res.json()) as { key: ContentKey; data: unknown }[];
    return Object.fromEntries(rows.map((r) => [r.key, r.data])) as Partial<ContentMap>;
  } catch {
    // Supabase unreachable: keep the site up with the starter content
    return {};
  }
}

export async function getContent<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  const saved = await loadSaved();
  const value = saved[key];
  if (value === undefined || value === null) return defaultContent[key];
  if (key === "site") return withSiteDefaults(value as Partial<SiteInfo>) as ContentMap[K];
  return value as ContentMap[K];
}
