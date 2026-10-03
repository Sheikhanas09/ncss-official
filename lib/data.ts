// The only way pages and components get content.
// Content comes from lib/content.ts: whatever the admin saved in Supabase,
// or the starter content in /data for sections not saved yet.

import { getContent } from "@/lib/content";
import type {
  AlumniYear,
  FeedbackEntry,
  Leadership,
  NcssEvent,
  Person,
  SiteInfo,
  SiteStats,
  Sponsor,
  Team,
  TeamDetail,
  TeamSummary,
} from "@/types";

const byNewestDate = (a: NcssEvent, b: NcssEvent) => b.date.localeCompare(a.date);

export async function getSiteInfo(): Promise<SiteInfo> {
  return getContent("site");
}

/** Everyone in the active cabinet (the year set in site info). */
async function getCurrentMembers(): Promise<Person[]> {
  const [site, members] = await Promise.all([getContent("site"), getContent("members")]);
  return members.filter((p) => p.year === site.currentYear);
}

export async function getPersonById(id: string): Promise<Person | undefined> {
  return (await getContent("members")).find((p) => p.id === id);
}

const leadershipRank: Partial<Record<Person["role"], number>> = { President: 0, "Vice President": 1, Leadership: 2 };

/** President, Vice President, then every other leadership post, in the order set in the admin panel. */
export async function getLeadership(): Promise<Leadership> {
  const current = await getCurrentMembers();
  return current
    .map((p, i) => ({ p, i, rank: leadershipRank[p.role] }))
    .filter((x): x is { p: Person; i: number; rank: number } => x.rank !== undefined)
    .sort((a, b) => a.rank - b.rank || a.i - b.i)
    .map((x) => x.p);
}

/**
 * A team's lead and members come from the member list: the person with role
 * "Team Lead" in that team, and everyone with role "Member" in that team.
 * Older content that still uses leadId / memberIds keeps working.
 */
function withPeople(team: Team, current: Person[], all: Person[]): TeamSummary {
  const inTeam = current.filter((p) => p.teamSlug === team.slug);
  const byId = (id: string) => all.find((p) => p.id === id);
  let leads = inTeam.filter((p) => p.role === "Team Lead");
  if (leads.length === 0 && team.leadId) leads = [byId(team.leadId)].filter((p): p is Person => Boolean(p));
  let people = inTeam.filter((p) => p.role === "Member");
  if (people.length === 0 && team.memberIds?.length) {
    people = team.memberIds.map(byId).filter((p): p is Person => Boolean(p));
  }
  return { ...team, lead: leads[0], leads, members: people };
}

export async function getTeams(): Promise<TeamSummary[]> {
  const [teams, current, all] = await Promise.all([getContent("teams"), getCurrentMembers(), getContent("members")]);
  return [...teams].sort((a, b) => a.order - b.order).map((t) => withPeople(t, current, all));
}

export async function getTeamBySlug(slug: string): Promise<TeamDetail | undefined> {
  return (await getTeams()).find((t) => t.slug === slug);
}

/** Past cabinets, newest year first. */
export async function getAlumniByYear(): Promise<AlumniYear[]> {
  return [...(await getContent("alumni"))].sort((a, b) => b.year.localeCompare(a.year));
}

export async function getLatestAlumni(): Promise<AlumniYear | undefined> {
  return (await getAlumniByYear())[0];
}

export async function getSponsors(): Promise<Sponsor[]> {
  return (await getContent("sponsors")).map((s) => ({
    ...s,
    sponsorships: [...s.sponsorships].sort((a, b) => b.year.localeCompare(a.year)),
  }));
}

export async function getSponsorsForEvent(event: NcssEvent): Promise<Sponsor[]> {
  return (await getContent("sponsors")).filter(
    (s) => event.sponsorIds?.includes(s.id) || s.sponsorships.some((sp) => sp.eventSlug === event.slug),
  );
}

export async function getAllFeedback(): Promise<FeedbackEntry[]> {
  return (await getContent("sponsors")).flatMap((s) =>
    s.feedback?.quote ? [{ ...s.feedback, sponsorId: s.id, sponsorName: s.name, sponsorLogo: s.logo }] : [],
  );
}

/** All events, newest first. */
export async function getEvents(): Promise<NcssEvent[]> {
  return [...(await getContent("events"))].sort(byNewestDate);
}

export async function getLatestEvents(count: number): Promise<NcssEvent[]> {
  return (await getEvents()).slice(0, count);
}

export async function getEventBySlug(slug: string): Promise<NcssEvent | undefined> {
  return (await getContent("events")).find((e) => e.slug === slug);
}

/** Counted from the content, never typed in by hand. */
export async function getStats(): Promise<SiteStats> {
  const [events, current, sponsors] = await Promise.all([getContent("events"), getCurrentMembers(), getContent("sponsors")]);
  return { events: events.length, members: current.length, sponsors: sponsors.length };
}
