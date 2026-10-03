import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// The public website: navbar and footer around every page
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-pop px-4 py-2 font-semibold text-ink-strong focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
