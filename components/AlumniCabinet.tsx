import type { AccentKey, AlumniYear } from "@/types";
import { brandAccent } from "@/lib/accent";
import { BadgeCard } from "@/components/BadgeCard";
import { Avatar } from "@/components/ui/Avatar";
import { Reveal } from "@/components/ui/Reveal";

interface AlumniCabinetProps {
  cabinet: AlumniYear;
  /** Team slug → accent colour, so each lead's label matches their team. */
  accents: Record<string, AccentKey>;
}

/** One past cabinet: the year, the leadership as big photo cards, then every team lead. */
export function AlumniCabinet({ cabinet, accents }: AlumniCabinetProps) {
  const others = cabinet.others ?? [];
  const leaders = [
    { person: cabinet.president, role: "President" },
    { person: cabinet.vicePresident, role: "Vice President" },
    ...others.map((o) => ({ person: o, role: o.title || "Cabinet" })),
  ];
  const total = leaders.length + cabinet.leads.length;
  const faces = [...leaders.map((l) => l.person), ...cabinet.leads].slice(0, 5);

  return (
    <div>
      {/* Year banner */}
      <div className="on-brand relative isolate mb-12 flex flex-wrap items-end justify-between gap-6 overflow-hidden rounded-[28px] bg-brand-deep p-6 text-white sm:p-10">
        <span aria-hidden className="absolute -top-20 -right-16 -z-10 h-56 w-56 rounded-full bg-brand" />
        <div>
          <p className="text-sm font-semibold">Cabinet</p>
          <p className="font-display text-6xl leading-none font-extrabold tracking-tighter tabular-nums sm:text-8xl">{cabinet.year}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex">
            {faces.map((p) => (
              <span key={p.id} className="@container relative -ml-3 inline-flex h-11 w-11 overflow-hidden rounded-full bg-white ring-2 ring-white first:ml-0">
                <Avatar name={p.name} photo={p.photo} sizes="44px" />
              </span>
            ))}
          </span>
          <p className="text-sm leading-snug">
            <span className="block font-bold">{total} people</span>
            {leaders.length} in leadership, {cabinet.leads.length} team leads
          </p>
        </div>
      </div>

      <h3 className="mb-4 text-xl font-bold">Leadership</h3>
      <ul className={`grid grid-cols-2 gap-3 sm:gap-6 ${leaders.length > 2 ? "lg:grid-cols-3" : "lg:max-w-3xl"}`}>
        {leaders.map(({ person, role }, i) => (
          <li key={person.id}>
            <Reveal index={i}>
              <BadgeCard
                id={person.id}
                name={person.name}
                role={role}
                photo={person.photo}
                socials={person.socials}
                accent={brandAccent}
                stripLabel={`NCSS ${cabinet.year}`}
                size="lg"
                headingLevel="h4"
                muted
              />
            </Reveal>
          </li>
        ))}
      </ul>

      <h3 className="mt-14 mb-4 text-xl font-bold">Team leads</h3>
      {cabinet.leads.length === 0 ? (
        <p className="text-muted">No team leads listed for this year.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {cabinet.leads.map((lead, i) => (
            <li key={lead.id}>
              <Reveal index={i}>
                <BadgeCard
                  id={lead.id}
                  name={lead.name}
                  role={`${lead.teamName} lead`}
                  photo={lead.photo}
                  socials={lead.socials}
                  accent={accents[lead.teamSlug] ?? brandAccent}
                  stripLabel={lead.teamName}
                  stripMeta={cabinet.year}
                  headingLevel="h4"
                  muted
                />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
