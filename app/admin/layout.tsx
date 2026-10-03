import type { Metadata } from "next";

// The admin panel is not linked anywhere on the website and asks search engines not to list it.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex-1">{children}</div>;
}
