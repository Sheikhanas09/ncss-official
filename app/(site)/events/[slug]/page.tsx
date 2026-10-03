import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug, getEvents, getSponsorsForEvent } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { EventCard } from "@/components/EventCard";
import { Gallery } from "@/components/Gallery";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArrowLeftIcon, CalendarIcon, FlagIcon, MapPinIcon, TagIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { RoleTag } from "@/components/ui/Tag";

// Pages for teams and events added later from the admin panel are built on first visit.
export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(props: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.summary,
    openGraph: { title: event.title, description: event.summary, images: [{ url: event.coverImage.src, alt: event.coverImage.alt }] },
  };
}

export default async function EventPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const [event, allEvents] = await Promise.all([getEventBySlug(slug), getEvents()]);
  if (!event) notFound();
  const sponsors = await getSponsorsForEvent(event);
  const moreEvents = allEvents.filter((e) => e.slug !== event.slug).slice(0, 3);

  const facts: { label: string; value: ReactNode; icon: ReactNode }[] = [
    { label: "Date", value: <time dateTime={event.date}>{formatDate(event.date)}</time>, icon: <CalendarIcon /> },
    { label: "Venue", value: event.venue, icon: <MapPinIcon /> },
    { label: "Type", value: event.category, icon: <TagIcon /> },
    { label: "Our role", value: <RoleTag role={event.ourRole} />, icon: <FlagIcon /> },
  ];

  return (
    <article>
      {/* Full-width cover with the title on top */}
      <header className="on-brand relative isolate flex min-h-[62svh] flex-col overflow-hidden bg-ink-strong text-white">
        <div className="kenburns absolute inset-0 -z-20">
          <Image src={event.coverImage.src} alt={event.coverImage.alt} fill preload sizes="100vw" className="object-cover" />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-ink-strong/95 via-ink-strong/55 to-ink-strong/25" />

        <Container className="flex flex-1 flex-col pt-6 pb-20 sm:pt-8 sm:pb-24">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-pop hover:text-ink-strong"
          >
            <ArrowLeftIcon width={16} height={16} /> All events
          </Link>

          <div className="mt-auto pt-16">
            <div className="flex flex-wrap items-center gap-2">
              <RoleTag role={event.ourRole} />
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/25 backdrop-blur-md">
                {event.category}
              </span>
            </div>
            <h1 className="mt-4 max-w-[18ch] text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] font-extrabold tracking-tighter">
              {event.title}
            </h1>
            <p className="mt-4 max-w-[60ch] text-lg font-semibold">{event.summary}</p>
          </div>
        </Container>
      </header>

      {/* Key facts, overlapping the cover */}
      <Container className="relative z-10 -mt-12">
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="flex items-start gap-3 rounded-2xl bg-surface p-4 shadow-lg ring-1 ring-line sm:p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint text-link">{f.icon}</span>
              <div className="min-w-0">
                <dt className="text-sm text-muted">{f.label}</dt>
                <dd className="mt-0.5 font-semibold break-words">{f.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </Container>

      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="max-w-[65ch] space-y-5 text-lg leading-relaxed">
          <h2 className="text-3xl font-extrabold tracking-tight">About this event</h2>
          {event.description.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <aside aria-labelledby="sponsors-heading">
          <h2 id="sponsors-heading" className="text-xl font-bold">
            Sponsors
          </h2>
          {sponsors.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No sponsors for this event.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {sponsors.map((s) => {
                const types = s.sponsorships.filter((sp) => sp.eventSlug === event.slug).map((sp) => sp.type);
                return (
                  <li key={s.id} className="flex items-center gap-4 rounded-2xl bg-surface p-3 ring-1 ring-line">
                    <span className="relative h-14 w-24 shrink-0 rounded-xl bg-white ring-1 ring-line">
                      <Image src={s.logo} alt={`${s.name} logo`} fill sizes="96px" className="object-contain p-2" />
                    </span>
                    <span className="text-sm">
                      <span className="block font-semibold">{s.name}</span>
                      {types.length > 0 && <span className="text-muted">{types.join(", ")}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </Container>

      <section aria-labelledby="gallery-heading" className="border-t border-line">
        <Container className="py-12 sm:py-16">
          <div className="mb-8 flex items-center gap-3">
            <h2 id="gallery-heading" className="text-3xl font-extrabold tracking-tight">
              Photos
            </h2>
            {event.gallery.length > 0 && (
              <span className="rounded-full bg-tint px-3 py-1 text-sm font-semibold text-link tabular-nums">{event.gallery.length}</span>
            )}
          </div>
          {event.gallery.length === 0 ? (
            <EmptyState title="Photos coming soon">We are still sorting through the photos from this event.</EmptyState>
          ) : (
            <Gallery images={event.gallery} />
          )}
        </Container>
      </section>

      {moreEvents.length > 0 && (
        <section aria-labelledby="more-heading" className="border-t border-line">
          <Container className="py-12 sm:py-16">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 id="more-heading" className="text-3xl font-extrabold tracking-tight">
                More events
              </h2>
              <Button href="/events" variant="outline" arrow>
                All events
              </Button>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {moreEvents.map((e, i) => (
                <li key={e.id}>
                  <Reveal index={i}>
                    <EventCard event={e} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </article>
  );
}
