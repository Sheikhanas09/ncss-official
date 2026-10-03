import Image from "next/image";
import Link from "next/link";
import type { Sponsor } from "@/types";
import { TiltCard } from "@/components/ui/TiltCard";

interface SponsorCardProps {
  sponsor: Sponsor;
  /** Slugs of events that have a page. Other sponsorships are shown without a link. */
  eventSlugs: string[];
  headingLevel?: "h2" | "h3";
}

export function SponsorCard({ sponsor, eventSlugs, headingLevel: Heading = "h3" }: SponsorCardProps) {
  const count = sponsor.sponsorships.length;

  return (
    <TiltCard className="h-full rounded-[24px] hover:shadow-xl" max={6}>
      <article className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-surface ring-1 ring-line">
        {/* Logos sit on white in both themes so they always read correctly */}
        <div className="relative flex h-36 items-center justify-center border-b border-line bg-white px-8">
          <div className="relative h-20 w-full max-w-[220px]">
            <Image
              src={sponsor.logo}
              alt={`${sponsor.name} logo`}
              fill
              sizes="220px"
              className="object-contain transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
          {count > 0 && (
            <span className="absolute top-3 right-3 rounded-full bg-tint px-2.5 py-1 text-xs font-semibold text-ink">
              {count} {count === 1 ? "event" : "events"}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <Heading className="text-xl font-bold">{sponsor.name}</Heading>

          {count === 0 ? (
            <p className="mt-3 text-sm text-muted">No sponsored events listed yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {sponsor.sponsorships.map((sp) => (
                <li key={`${sp.eventSlug}-${sp.type}`} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 shrink-0 rounded-md bg-tint px-2 py-0.5 font-semibold text-ink tabular-nums">{sp.year}</span>
                  <span className="min-w-0">
                    {eventSlugs.includes(sp.eventSlug) ? (
                      <Link
                        href={`/events/${sp.eventSlug}`}
                        className="font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-pop"
                      >
                        {sp.eventName}
                      </Link>
                    ) : (
                      <span className="font-semibold">{sp.eventName}</span>
                    )}
                    <span className="block text-muted">{sp.type}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </TiltCard>
  );
}
