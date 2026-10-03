import type { MetadataRoute } from "next";
import { getSiteInfo } from "@/lib/data";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteInfo();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.siteUrl).toString(),
  };
}
