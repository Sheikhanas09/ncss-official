import { BadgeCard } from "@/components/BadgeCard";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  // Rendered outside the site layout, so it brings its own navbar and footer
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1">
        <Container className="grid items-center gap-12 py-16 sm:py-24 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-display text-7xl font-extrabold tracking-tighter text-link sm:text-9xl">404</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">This page is not on the guest list</h1>
            <p className="mt-4 max-w-[50ch] text-lg text-muted">
              The link may be old, or the page may have moved. Head back home and try again from there.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/" arrow>
                Back to home
              </Button>
              <Button href="/events" variant="outline">
                See our events
              </Button>
            </div>
          </div>
          <div className="w-60">
            <BadgeCard id="visitor-pass" name="Lost visitor" role="Page not found" accent="yellow" stripLabel="Visitor pass" stripMeta="404" headingLevel="h2" />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
