import Image from "next/image";
import Link from "next/link";
import type { NcssEvent } from "@/types";
import { dateParts, formatDate } from "@/lib/format";
import { ArrowRightIcon } from "@/components/ui/icons";
import { RoleTag } from "@/components/ui/Tag";
import { TiltCard } from "@/components/ui/TiltCard";

interface EventCardProps {
  event: NcssEvent;
  /** Big photo card with the text on top of the image. */
  featured?: boolean;
  headingLevel?: "h2" | "h3";
}

/** Calendar-style date tile */
function DateBadge({ iso }: { iso: string }) {
  const { day, month } = dateParts(iso);
  return (
    <time
      dateTime={iso}
      aria-label={formatDate(iso)}
      className="flex w-14 flex-col items-center rounded-2xl bg-surface py-2 text-ink shadow-md"
    >
      <span className="font-display text-2xl leading-none font-extrabold tabular-nums">{day}</span>
      <span className="mt-1 text-[11px] leading-none font-bold tracking-wide text-link uppercase">{month}</span>
    </time>
  );
}

const imageZoom =
  "object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100";

export function EventCard({ event, featured = false, headingLevel: Heading = "h3" }: EventCardProps) {
  const link = (
    // The link covers the whole card
    <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0 after:z-10">
      {event.title}
    </Link>
  );

  if (featured) {
    return (
      <TiltCard className="h-full rounded-[28px]" max={4}>
        <article className="group relative isolate flex h-full min-h-[440px] flex-col overflow-hidden rounded-[28px] bg-ink-strong p-6 text-white sm:p-8 lg:min-h-[560px]">
          <Image
            src={event.coverImage.src}
            alt={event.coverImage.alt}
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            className={`-z-20 ${imageZoom}`}
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-ink-strong/95 via-ink-strong/55 to-transparent" />

          <div className="flex items-start justify-between gap-3">
            <DateBadge iso={event.date} />
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">Latest</span>
              <RoleTag role={event.ourRole} />
            </div>
          </div>

          <div className="mt-auto pt-16">
            <p className="text-sm">
              {event.category} · {event.venue}
            </p>
            <Heading className="mt-2 max-w-[18ch] text-3xl leading-[1.02] font-extrabold tracking-tight sm:text-5xl">{link}</Heading>
            <p className="mt-4 max-w-[55ch] sm:text-lg">{event.summary}</p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-strong transition-colors group-hover:bg-pop">
              View event <ArrowRightIcon width={16} height={16} />
            </span>
          </div>
        </article>
      </TiltCard>
    );
  }

  return (
    <TiltCard className="h-full rounded-[24px] hover:shadow-xl" max={6}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-surface ring-1 ring-line">
        <div className="relative aspect-[16/10] overflow-hidden bg-tint">
          <Image
            src={event.coverImage.src}
            alt={event.coverImage.alt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
            className={imageZoom}
          />
          <div className="absolute top-3 left-3">
            <DateBadge iso={event.date} />
          </div>
          <div className="absolute top-3 right-3">
            <RoleTag role={event.ourRole} />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-sm text-muted">
            {event.category} · {event.venue}
          </p>
          <Heading className="mt-1.5 text-xl leading-snug font-bold">{link}</Heading>
          <p className="mt-2 line-clamp-2 text-muted">{event.summary}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-link">
            View event
            <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </span>
        </div>
      </article>
    </TiltCard>
  );
}
