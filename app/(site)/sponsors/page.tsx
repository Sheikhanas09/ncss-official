import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllFeedback, getEvents, getSponsors } from "@/lib/data";
import { FeedbackMarquee } from "@/components/FeedbackMarquee";
import { SponsorCard } from "@/components/SponsorCard";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "The sponsors and partners behind NCSS events, and what they said about working with us.",
};

// Slight, fixed angles so the logo collage looks pinned up by hand
const tilts = ["-rotate-3", "rotate-2", "rotate-3", "-rotate-2", "-rotate-1", "rotate-1"];

export default async function SponsorsPage() {
  const [sponsors, feedback, events] = await Promise.all([getSponsors(), getAllFeedback(), getEvents()]);
  const eventSlugs = events.map((e) => e.slug);

  // Every sponsorship as one row, for the timeline
  const rows = sponsors.flatMap((s) => s.sponsorships.map((sp) => ({ ...sp, sponsor: s })));
  const years = [...new Set(rows.map((r) => r.year))].sort().reverse();
  const stats = [
    { value: sponsors.length, label: sponsors.length === 1 ? "sponsor" : "sponsors" },
    { value: rows.length, label: rows.length === 1 ? "sponsorship" : "sponsorships" },
    { value: new Set(rows.map((r) => r.eventSlug)).size, label: "events backed" },
  ];

  return (
    <>
      <header className="on-brand relative isolate overflow-hidden bg-brand-deep text-white">
        <span aria-hidden className="absolute -top-32 -left-24 -z-10 h-96 w-96 rounded-full bg-brand" />
        <span aria-hidden className="absolute -right-10 -bottom-24 -z-10 h-64 w-64 rounded-full bg-brand opacity-50" />

        <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_auto]">
          <div>
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-semibold ring-1 ring-white/20">
              Our partners
            </span>
            <h1 className="mt-5 text-[clamp(3.25rem,11vw,7rem)] leading-[0.9] font-extrabold tracking-tighter">Sponsors</h1>
            <p className="mt-5 max-w-[46ch] text-lg font-semibold">
              Thank you to every partner who backed our events. Here is who sponsored what, and when.
            </p>
            {sponsors.length > 0 && (
              <dl className="mt-8 grid max-w-md grid-cols-3 items-start gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
                    <dt className="mt-1 text-sm">{s.label}</dt>
                    <dd className="font-display text-3xl leading-none font-extrabold tabular-nums sm:text-4xl">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {sponsors.length >= 2 && (
            <ul aria-hidden className="hidden grid-cols-2 gap-4 sm:grid">
              {sponsors.slice(0, 6).map((s, i) => (
                <li
                  key={s.id}
                  className={`relative h-24 w-44 rounded-2xl bg-white shadow-xl ring-4 ring-white/10 transition duration-300 hover:z-10 hover:scale-110 hover:rotate-0 motion-reduce:transition-none lg:h-28 lg:w-52 ${tilts[i]} ${i % 2 ? "translate-y-4" : ""}`}
                >
                  <Image src={s.logo} alt="" fill sizes="208px" className="object-contain p-4" />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </header>

      {/* All sponsors */}
      <section aria-labelledby="partners-heading">
        <Container className="py-14 sm:py-20">
          <h2 id="partners-heading" className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Who backed us
          </h2>
          {sponsors.length === 0 ? (
            <EmptyState title="No sponsors listed yet">Interested in sponsoring an NCSS event? Email us.</EmptyState>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {sponsors.map((s, i) => (
                <li key={s.id}>
                  <Reveal index={i}>
                    <SponsorCard sponsor={s} eventSlugs={eventSlugs} headingLevel="h3" />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      {/* Timeline: every sponsorship, grouped by year */}
      {rows.length > 0 && (
        <section aria-labelledby="timeline-heading" className="border-t border-line">
          <Container className="py-14 sm:py-20">
            <h2 id="timeline-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Sponsorship timeline
            </h2>
            <p className="mt-3 max-w-[55ch] text-lg text-muted">Every sponsorship, year by year.</p>

            {years.map((year) => {
              const items = rows.filter((r) => r.year === year);
              return (
                <div key={year} className="grid gap-5 border-b border-line py-10 last:border-b-0 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
                  <div className="self-start lg:sticky lg:top-28">
                    <h3 className="font-display text-6xl leading-none font-extrabold tracking-tighter text-link tabular-nums">{year}</h3>
                    <p className="mt-2 text-muted">
                      {items.length} {items.length === 1 ? "sponsorship" : "sponsorships"}
                    </p>
                  </div>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {items.map((r, i) => (
                      <li key={`${r.sponsor.id}-${r.eventSlug}-${r.type}`}>
                        <Reveal index={i}>
                          <div className="group flex h-full items-center gap-4 rounded-2xl bg-surface p-3 ring-1 ring-line transition duration-300 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                            <span className="relative h-14 w-24 shrink-0 rounded-xl bg-white ring-1 ring-line">
                              <Image src={r.sponsor.logo} alt={`${r.sponsor.name} logo`} fill sizes="96px" className="object-contain p-2" />
                            </span>
                            <span className="min-w-0 flex-1 text-sm">
                              <span className="block font-bold">{r.sponsor.name}</span>
                              <span className="mt-1 inline-block rounded-full bg-tint px-2 py-0.5 text-xs font-semibold text-link">{r.type}</span>
                              <span className="mt-1 block text-muted">
                                {eventSlugs.includes(r.eventSlug) ? (
                                  <Link href={`/events/${r.eventSlug}`} className="font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-pop">
                                    {r.eventName}
                                  </Link>
                                ) : (
                                  r.eventName
                                )}
                              </span>
                            </span>
                          </div>
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </Container>
        </section>
      )}

      <section aria-labelledby="feedback-heading" className="border-t border-line">
        <Container className="py-14 sm:py-20">
          <h2 id="feedback-heading" className="mb-10 text-3xl font-extrabold tracking-tight sm:text-4xl">
            What sponsors say
          </h2>
          {feedback.length === 0 ? (
            <EmptyState title="No feedback yet">Sponsor feedback will appear here after our next event.</EmptyState>
          ) : (
            <FeedbackMarquee items={feedback} />
          )}

          {/* Invite new sponsors */}
          <Link
            href="/#contact"
            className="on-brand group relative isolate mt-16 flex flex-col gap-6 overflow-hidden rounded-[28px] bg-brand-deep p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10"
          >
            <span aria-hidden className="absolute -top-20 -right-16 -z-10 h-56 w-56 rounded-full bg-brand" />
            <span>
              <span className="block font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Sponsor an NCSS event</span>
              <span className="mt-2 block max-w-[50ch] text-lg">
                Put your brand in front of NUML&apos;s computer science students. Get in touch and we will share the details.
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 py-3 font-semibold text-brand-deep transition-colors group-hover:bg-pop group-hover:text-ink-strong sm:self-auto">
              Get in touch <ArrowRightIcon width={18} height={18} />
            </span>
          </Link>
        </Container>
      </section>
    </>
  );
}
