import { getLatestAlumni, getSiteInfo, getTeams } from "@/lib/data";
import { accentMap } from "@/lib/teams";
import { AlumniCabinet } from "@/components/AlumniCabinet";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";

export async function AlumniPreview() {
  const [latest, teams, { copy }] = await Promise.all([getLatestAlumni(), getTeams(), getSiteInfo()]);

  return (
    <Section
      id="alumni"
      title={copy.alumniTitle}
      intro={
        latest ? (
          <p>Every cabinet hands over to the next. Here is the {latest.year} cabinet that came before us.</p>
        ) : (
          <p>Past cabinets will be listed here.</p>
        )
      }
      action={latest && <Button href="/alumni" variant="outline" arrow>All past cabinets</Button>}
      tone="surface"
    >
      {latest ? (
        <AlumniCabinet cabinet={latest} accents={accentMap(teams)} />
      ) : (
        <EmptyState title="No alumni yet">When this year&apos;s cabinet hands over, they will be listed here.</EmptyState>
      )}
    </Section>
  );
}
