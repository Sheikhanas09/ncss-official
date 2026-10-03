import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteInfo, getTeamBySlug, getTeams } from "@/lib/data";
import { accentVars } from "@/lib/accent";
import { initials, roleLabel } from "@/lib/format";
import { BadgeCard } from "@/components/BadgeCard";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

// Pages for teams and events added later from the admin panel are built on first visit.
export async function generateStaticParams() {
  const teams = await getTeams();
  return teams.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/teams/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const team = await getTeamBySlug(slug);
  if (!team) return {};
  return {
    title: team.name,
    description: team.shortDescription,
    ...(team.coverImage && { openGraph: { images: [{ url: team.coverImage.src, alt: team.coverImage.alt }] } }),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function TeamPage(props: PageProps<"/teams/[slug]">) {
  const { slug } = await props.params;
  const [team, allTeams, site] = await Promise.all([getTeamBySlug(slug), getTeams(), getSiteInfo()]);
  if (!team) notFound();

  const position = allTeams.findIndex((t) => t.slug === team.slug) + 1;
  const otherTeams = allTeams.filter((t) => t.slug !== team.slug);
  const people = [...team.leads, ...team.members];

  return (
    <div style={accentVars(team.accent)}>
      {/* Photo header */}
      <header className="on-brand relative isolate flex min-h-[56svh] flex-col overflow-hidden bg-acc-strip text-white">
        {team.coverImage && (
          <div className="kenburns absolute inset-0 -z-20">
            <Image src={team.coverImage.src} alt="" fill preload sizes="100vw" className="object-cover" />
          </div>
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-ink-strong/95 via-ink-strong/60 to-ink-strong/25" />

        <Container className="flex flex-1 flex-col pt-6 pb-12 sm:pt-8 sm:pb-16">
          <Link
            href="/#teams"
            className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-pop hover:text-ink-strong"
          >
            <ArrowLeftIcon width={16} height={16} /> All teams
          </Link>

          <div className="mt-auto pt-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-acc-strip px-3 py-1 font-display text-sm font-bold text-acc-on tabular-nums">
              Team {pad(position)} / {pad(allTeams.length)}
            </span>
            <span aria-hidden className="mt-5 block h-1.5 w-14 rounded-full bg-acc" />
            <h1 className="mt-4 max-w-[14ch] text-[clamp(3rem,10vw,7rem)] leading-[0.9] font-extrabold tracking-tighter">
              {team.name}
            </h1>
            <p className="mt-4 max-w-[52ch] text-lg font-semibold">{team.shortDescription}</p>

            {people.length > 0 && (
              <div className="mt-8 flex items-center gap-4">
                <span className="flex">
                  {people.slice(0, 6).map((p) => (
                    <span key={p.id} className="relative -ml-3 inline-flex h-11 w-11 overflow-hidden rounded-full bg-tint ring-2 ring-white first:ml-0">
                      {p.photo ? (
                        <Image src={p.photo} alt="" fill sizes="44px" className="object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold text-ink">{initials(p.name)}</span>
                      )}
                    </span>
                  ))}
                </span>
                <span className="text-sm">
                  <span className="block font-bold">
                    {people.length} {people.length === 1 ? "person" : "people"}
                  </span>
                  {site.shortName} {site.currentYear}
                </span>
              </div>
            )}
          </div>
        </Container>
      </header>

      {/* About + lead */}
      <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-16">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">About the team</h2>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed sm:text-xl">{team.description}</p>

          <dl className="mt-8 grid max-w-md grid-cols-2 gap-3">
            <div className="flex flex-col-reverse rounded-2xl bg-surface p-4 ring-1 ring-line">
              <dt className="mt-1 text-sm text-muted">members</dt>
              <dd className="font-display text-2xl font-extrabold tabular-nums">{team.members.length}</dd>
            </div>
            <div className="flex flex-col-reverse rounded-2xl bg-surface p-4 ring-1 ring-line">
              <dt className="mt-1 text-sm text-muted">cabinet</dt>
              <dd className="font-display text-2xl font-extrabold whitespace-nowrap tabular-nums">{site.currentYear}</dd>
            </div>
          </dl>
        </div>

        <section aria-labelledby="lead-heading">
          <h2 id="lead-heading" className="mb-4 flex items-center gap-2 text-xl font-bold">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-acc" />
            {team.leads.length > 1 ? "Team leads" : "Team lead"}
          </h2>
          {team.leads.length > 0 ? (
            <ul className="grid gap-5">
              {team.leads.map((lead, i) => (
                <li key={lead.id}>
                  <Reveal index={i}>
                    <BadgeCard
                      id={lead.id}
                      name={lead.name}
                      role={lead.title?.trim() || `Lead, ${team.name}`}
                      photo={lead.photo}
                      socials={lead.socials}
                      accent={team.accent}
                      stripLabel={team.name}
                      size="lg"
                    />
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Lead to be announced" />
          )}
        </section>
      </Container>

      {/* Members */}
      <section aria-labelledby="members-heading" className="border-t border-line">
        <Container className="py-14 sm:py-20">
          <div className="mb-8 flex items-center gap-3">
            <h2 id="members-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Members
            </h2>
            {team.members.length > 0 && (
              <span className="rounded-full bg-acc-strip px-3 py-1 text-sm font-bold text-acc-on tabular-nums">{team.members.length}</span>
            )}
          </div>
          {team.members.length === 0 ? (
            <EmptyState title="No members listed yet">This team is still being put together.</EmptyState>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {team.members.map((m, i) => (
                <li key={m.id}>
                  <Reveal index={i}>
                    <BadgeCard
                      id={m.id}
                      name={m.name}
                      role={roleLabel(m)}
                      photo={m.photo}
                      socials={m.socials}
                      accent={team.accent}
                      stripLabel={team.name}
                    />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      {/* Other teams as small photo tiles */}
      <nav aria-labelledby="other-teams-heading" className="border-t border-line">
        <Container className="py-14 sm:py-20">
          <h2 id="other-teams-heading" className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Other teams
          </h2>
          <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
            {otherTeams.map((t) => (
              <li key={t.id} style={accentVars(t.accent)} className="w-52 shrink-0 snap-start sm:w-auto">
                <TiltCard className="h-full rounded-[20px]" max={8}>
                  <Link
                    href={`/teams/${t.slug}`}
                    className="group relative isolate flex h-40 flex-col justify-end overflow-hidden rounded-[20px] bg-acc-strip p-4 text-white"
                  >
                    {t.coverImage && (
                      <Image
                        src={t.coverImage.src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 180px, (min-width: 640px) 33vw, 208px"
                        className="-z-20 object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    )}
                    <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-ink-strong/90 via-ink-strong/40 to-transparent" />
                    <span aria-hidden className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-strong transition duration-300 group-hover:-rotate-45 group-hover:bg-pop motion-reduce:transition-none">
                      <ArrowRightIcon width={16} height={16} />
                    </span>
                    <span aria-hidden className="mb-2 block h-1 w-8 rounded-full bg-acc" />
                    <span className="font-display text-lg leading-tight font-bold">{t.name}</span>
                  </Link>
                </TiltCard>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </div>
  );
}
