import { getLeadership, getSiteInfo, getStats, getTeams } from "@/lib/data";
import { brandAccent } from "@/lib/accent";
import { roleLabel } from "@/lib/format";
import { BadgeCard } from "@/components/BadgeCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";

export async function Leadership() {
  const [leaders, site, teams, stats] = await Promise.all([
    getLeadership(),
    getSiteInfo(),
    getTeams(),
    getStats(),
  ]);

  const facts = [
    { value: site.currentYear, label: "cabinet" },
    { value: String(teams.length), label: teams.length === 1 ? "team" : "teams" },
    { value: String(stats.members), label: "members" },
  ];

  return (
    <section
      id="leadership"
      aria-labelledby="leadership-heading"
      className="relative isolate scroll-mt-20 overflow-hidden border-t border-line py-16 sm:py-24"
    >
      {/* Big faint year in the background */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 bottom-6 -z-10 font-display text-[clamp(6rem,20vw,16rem)] leading-none font-extrabold tracking-tighter text-tint select-none"
      >
        {site.currentYear}
      </span>

      <Container
        className={`grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 ${leaders.length > 2 ? "lg:items-start" : "lg:items-center"}`}
      >
        {/* With many leadership cards, the text stays in view while the cards scroll */}
        <div className={leaders.length > 2 ? "lg:sticky lg:top-28" : ""}>
          <span className="inline-block rounded-full bg-tint px-3 py-1 text-sm font-semibold text-link">
            {site.shortName} {site.currentYear}
          </span>
          <h2 id="leadership-heading" className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Leadership
          </h2>
          <p className="mt-5 max-w-[42ch] text-lg text-muted">{site.copy.leadershipIntro}</p>

          <dl className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse rounded-2xl bg-surface p-3 ring-1 ring-line sm:p-4">
                <dt className="mt-1 text-sm text-muted">{f.label}</dt>
                <dd className="font-display text-lg font-extrabold whitespace-nowrap tabular-nums sm:text-2xl">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <Button href="/#teams" arrow>
              Meet the teams
            </Button>
          </div>
        </div>

        {leaders.length === 0 ? (
          <EmptyState title="Leadership coming soon">The new cabinet will be announced here.</EmptyState>
        ) : (
          // Every card in the right-hand column sits a little lower so the grid feels less rigid
          <ul className="grid grid-cols-2 items-start gap-3 sm:gap-6">
            {leaders.map((p, i) => (
              <li key={p.id} className={i % 2 === 1 ? "mt-10 sm:mt-16" : ""}>
                <Reveal index={i}>
                  <BadgeCard
                    id={p.id}
                    name={p.name}
                    role={roleLabel(p)}
                    photo={p.photo}
                    socials={p.socials}
                    accent={brandAccent}
                    stripLabel={`${site.shortName} ${p.year}`}
                    size="lg"
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
