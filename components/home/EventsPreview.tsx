import { getLatestEvents, getSiteInfo } from "@/lib/data";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export async function EventsPreview() {
  const [events, { copy }] = await Promise.all([getLatestEvents(6), getSiteInfo()]);

  return (
    <Section
      id="events"
      title={copy.eventsTitle}
      intro={<p>{copy.eventsIntro}</p>}
      action={events.length > 0 && <Button href="/events" variant="outline" arrow>All events</Button>}
      tone="surface"
    >
      {events.length === 0 ? (
        <EmptyState title="No events yet">Our first event is on its way. Follow us on Instagram to hear about it first.</EmptyState>
      ) : (
        // Newest event is the big featured card; the rest sit around it
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <li key={event.id} className={i === 0 ? "md:col-span-2 lg:row-span-2" : ""}>
              <Reveal index={i}>
                <EventCard event={event} featured={i === 0} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
