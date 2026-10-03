import { getSiteInfo, getTeams } from "@/lib/data";
import { TeamTile } from "@/components/TeamTile";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

// Bento layout on desktop (3 columns): 2+1 / 1+1+1 / 1+2. Extra teams fall back to single tiles.
const spans: Record<number, string> = {
  0: "md:col-span-2",
  6: "lg:col-span-2",
};

export async function TeamsGrid() {
  const [teams, { copy }] = await Promise.all([getTeams(), getSiteInfo()]);

  return (
    <Section
      id="teams"
      title={copy.teamsTitle}
      intro={<p>{copy.teamsIntro}</p>}
      tone="surface"
    >
      {teams.length === 0 ? (
        <EmptyState title="Teams coming soon" />
      ) : (
        <ul className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team, i) => (
            <li key={team.id} className={spans[i] ?? ""}>
              <Reveal index={i}>
                <TeamTile team={team} index={i} wide={Boolean(spans[i])} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
