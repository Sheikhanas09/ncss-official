import type { Metadata } from "next";
import Image from "next/image";
import { getEvents } from "@/lib/data";
import { EventFilters } from "@/components/EventFilters";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Events",
  description: "Every event NCSS has organized or managed at NUML, with photos and sponsors.",
};

export default async function EventsPage() {
  const events = await getEvents();
  const latest = events[0];
  const stats = [
    { value: events.length, label: events.length === 1 ? "event" : "events" },
    { value: events.filter((e) => e.ourRole === "Organized").length, label: "organized" },
    { value: events.filter((e) => e.ourRole === "Managed").length, label: "managed" },
  ];

  return (
    <>
      <header className="on-brand relative isolate overflow-hidden bg-brand-deep text-white">
        {latest && (
          <>
            <Image src={latest.coverImage.src} alt="" fill preload sizes="100vw" className="-z-20 object-cover" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-brand-deep via-brand-deep/85 to-brand-deep/40" />
          </>
        )}
        <Container className="grid gap-10 pt-14 pb-14 sm:pt-20 sm:pb-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="text-[clamp(3.25rem,11vw,7rem)] leading-[0.9] font-extrabold tracking-tighter">Events</h1>
            <p className="mt-5 max-w-[52ch] text-lg font-semibold">
              Everything we have organized ourselves or managed for others, newest first.
            </p>
          </div>
          {events.length > 0 && (
            <dl className="grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="flex min-w-24 flex-col-reverse rounded-2xl bg-brand-deep/75 p-4 ring-1 ring-white/20 backdrop-blur-md">
                  <dt className="mt-1 text-sm">{s.label}</dt>
                  <dd className="font-display text-3xl leading-none font-extrabold tabular-nums sm:text-4xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Container>
      </header>

      <Container className="pb-12 sm:pb-16">
        {events.length === 0 ? (
          <div className="pt-12">
            <EmptyState title="No events yet">Our first event is on its way. Check back soon.</EmptyState>
          </div>
        ) : (
          <EventFilters events={events} />
        )}
      </Container>
    </>
  );
}
