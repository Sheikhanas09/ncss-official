import type { Metadata } from "next";
import Image from "next/image";
import { getAlumniByYear, getTeams } from "@/lib/data";
import { accentMap } from "@/lib/teams";
import { AlumniCabinet } from "@/components/AlumniCabinet";
import { YearTabs } from "@/components/YearTabs";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Alumni",
  description: "Past NCSS cabinets by year: presidents, vice presidents and team leads.",
};

// Slight, fixed angles so the photo collage looks pinned up by hand
const tilts = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1", "-rotate-3", "rotate-2", "-rotate-1"];

export default async function AlumniPage() {
  const [years, teams] = await Promise.all([getAlumniByYear(), getTeams()]);
  const accents = accentMap(teams);

  const people = years.flatMap((y) => [y.president, y.vicePresident, ...(y.others ?? []), ...y.leads]);
  const faces = people.flatMap((p) => (p.photo ? [{ id: p.id, photo: p.photo }] : [])).slice(0, 9);
  const oldest = years.at(-1)?.year;
  const stats = [
    { value: years.length, label: years.length === 1 ? "past cabinet" : "past cabinets" },
    { value: people.length, label: "alumni" },
  ];

  return (
    <>
      <header className="on-brand relative isolate overflow-hidden bg-brand-deep text-white">
        <span aria-hidden className="absolute -top-32 -left-24 -z-10 h-96 w-96 rounded-full bg-brand" />
        <span aria-hidden className="absolute -right-10 -bottom-24 -z-10 h-64 w-64 rounded-full bg-brand opacity-50" />

        <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_auto]">
          <div>
            {oldest && (
              <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-semibold ring-1 ring-white/20">
                Cabinets since {oldest}
              </span>
            )}
            <h1 className="mt-5 text-[clamp(3.25rem,11vw,7rem)] leading-[0.9] font-extrabold tracking-tighter">Alumni</h1>
            <p className="mt-5 max-w-[46ch] text-lg font-semibold">
              The people who ran NCSS before us. Pick a year on the timeline to see that cabinet.
            </p>
            {years.length > 0 && (
              <dl className="mt-8 flex gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="flex min-w-28 flex-col-reverse rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
                    <dt className="mt-1 text-sm">{s.label}</dt>
                    <dd className="font-display text-3xl leading-none font-extrabold tabular-nums sm:text-4xl">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {faces.length >= 3 && (
            <ul aria-hidden className="hidden grid-cols-3 gap-3 sm:grid">
              {faces.map((p, i) => (
                <li
                  key={p.id}
                  className={`relative h-24 w-24 overflow-hidden rounded-2xl bg-white/10 ring-4 ring-white/10 transition duration-300 hover:z-10 hover:scale-110 hover:rotate-0 motion-reduce:transition-none lg:h-28 lg:w-28 ${tilts[i]} ${i % 2 ? "translate-y-3" : ""}`}
                >
                  <Image src={p.photo} alt="" fill sizes="112px" className="object-cover" />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </header>

      <Container className="py-12 sm:py-16">
        {years.length === 0 ? (
          <EmptyState title="No alumni yet">When the current cabinet hands over, they will be listed here.</EmptyState>
        ) : (
          <YearTabs
            years={years.map((y) => y.year)}
            panels={years.map((y) => (
              <AlumniCabinet key={y.year} cabinet={y} accents={accents} />
            ))}
          />
        )}
      </Container>
    </>
  );
}
