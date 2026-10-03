import Image from "next/image";
import Link from "next/link";
import type { Person, TeamSummary } from "@/types";
import { accentVars } from "@/lib/accent";
import { initials } from "@/lib/format";
import { ArrowRightIcon } from "@/components/ui/icons";
import { TiltCard } from "@/components/ui/TiltCard";
import { focusStyles } from "@/lib/photo";

interface TeamTileProps {
  team: TeamSummary;
  /** Position in the grid, printed as 01, 02 … */
  index: number;
  /** Wide tiles span two columns on desktop and get a bigger title. */
  wide?: boolean;
}

function Face({ person }: { person: Person }) {
  return (
    <span className="relative -ml-2.5 inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface ring-2 ring-white/80 first:ml-0">
      {person.photo ? (
        <Image src={person.photo} alt="" fill sizes="40px" className="object-cover" style={focusStyles(person.photoFocus).image} />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-tint text-xs font-bold text-ink">{initials(person.name)}</span>
      )}
    </span>
  );
}

/** A team tile: photo in the back, a dark fade for readable text, the team colour as accents. */
export function TeamTile({ team, index, wide = false }: TeamTileProps) {
  const people = [...team.leads, ...team.members];
  const faces = people.slice(0, 4);

  return (
    <TiltCard className="h-full rounded-[28px] hover:shadow-xl" max={6}>
      <Link
        href={`/teams/${team.slug}`}
        style={accentVars(team.accent)}
        className="group relative isolate flex h-full min-h-[340px] flex-col overflow-hidden rounded-[28px] bg-acc-strip p-6 text-white sm:min-h-[380px] sm:p-7"
      >
        {team.coverImage && (
          <Image
            src={team.coverImage.src}
            alt=""
            fill
            sizes={wide ? "(min-width: 1024px) 66vw, (min-width: 768px) 100vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
            className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}
        {/* Darker towards the bottom so the text is always readable */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-ink-strong/95 via-ink-strong/60 to-ink-strong/10" />

        <div className="flex items-start justify-between">
          <span className="rounded-full bg-acc-strip px-3 py-1 font-display text-sm font-bold text-acc-on tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            aria-hidden
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-strong transition duration-300 group-hover:-rotate-45 group-hover:bg-pop motion-reduce:transition-none"
          >
            <ArrowRightIcon />
          </span>
        </div>

        <div className="mt-auto pt-10">
          <span aria-hidden className="mb-4 block h-1.5 w-12 rounded-full bg-acc" />
          <h3
            className={`max-w-[14ch] leading-[0.95] font-extrabold tracking-tight ${wide ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"}`}
          >
            {team.name}
          </h3>
          <p className="mt-3 max-w-[42ch]">{team.shortDescription}</p>

          <div className="mt-6 flex items-center gap-3">
            {faces.length > 0 && (
              <span className="flex">
                {faces.map((p) => (
                  <Face key={p.id} person={p} />
                ))}
              </span>
            )}
            <span className="text-sm leading-snug">
              {team.leads.length > 0 && (
                <>
                  Led by <span className="font-semibold">{team.leads.map((l) => l.name).join(" & ")}</span>
                  <br />
                </>
              )}
              {people.length} {people.length === 1 ? "person" : "people"}
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
