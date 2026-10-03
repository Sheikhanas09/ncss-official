import type { MetadataRoute } from "next";
import { getEvents, getSiteInfo, getTeams } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, teams, events] = await Promise.all([getSiteInfo(), getTeams(), getEvents()]);
  const url = (path: string) => new URL(path, site.siteUrl).toString();
  return [
    { url: url("/") },
    { url: url("/events") },
    { url: url("/sponsors") },
    { url: url("/alumni") },
    ...teams.map((t) => ({ url: url(`/teams/${t.slug}`) })),
    ...events.map((e) => ({ url: url(`/events/${e.slug}`), lastModified: e.date })),
  ];
}
