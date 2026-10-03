import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { getSiteInfo } from "@/lib/data";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz"],
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteInfo();
  const title = `${site.shortName}, ${site.fullName}`;
  return {
    metadataBase: new URL(site.siteUrl),
    title: { default: title, template: `%s · ${site.shortName}` },
    description: site.tagline,
    openGraph: {
      type: "website",
      siteName: site.fullName,
      title,
      description: site.tagline,
      images: [{ url: site.heroImage.src, width: site.heroImage.width, height: site.heroImage.height, alt: site.heroImage.alt }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#03828E",
};

// Light (white) by default. Only switches to dark if the visitor chose it with the toggle.
const themeScript = `try{if(localStorage.getItem("ncss-theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
