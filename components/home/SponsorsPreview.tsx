import { getAllFeedback, getEvents, getSiteInfo, getSponsors } from "@/lib/data";
import { FeedbackMarquee } from "@/components/FeedbackMarquee";
import { SponsorCard } from "@/components/SponsorCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export async function SponsorsPreview() {
  const [sponsors, feedback, events, { copy }] = await Promise.all([getSponsors(), getAllFeedback(), getEvents(), getSiteInfo()]);
  const eventSlugs = events.map((e) => e.slug);

  return (
    <Section
      id="sponsors"
      title={copy.sponsorsTitle}
      intro={<p>{copy.sponsorsIntro}</p>}
      action={sponsors.length > 0 && <Button href="/sponsors" variant="outline" arrow>All sponsors</Button>}
    >
      {sponsors.length === 0 ? (
        <EmptyState title="No sponsors listed yet">Interested in sponsoring an NCSS event? Get in touch below.</EmptyState>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sponsors.slice(0, 8).map((s, i) => (
            <li key={s.id}>
              <Reveal index={i}>
                <SponsorCard sponsor={s} eventSlugs={eventSlugs} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      <h3 className="mt-20 mb-10 text-3xl font-extrabold tracking-tight">What sponsors say</h3>
      {feedback.length === 0 ? (
        <EmptyState title="No feedback yet">Sponsor feedback will appear here after our next event.</EmptyState>
      ) : (
        <FeedbackMarquee items={feedback} />
      )}
    </Section>
  );
}
