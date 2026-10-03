// All content types for the NCSS site.
// When the admin panel arrives, database rows should map onto these same shapes.

/** Team accent colour names. The actual colours live in app/globals.css. */
export type AccentKey = "teal" | "deep" | "yellow" | "coral" | "blue" | "sea" | "violet";

/** "Leadership" covers any other cabinet post, e.g. General Secretary or Treasurer (set the title). */
export type Role = "President" | "Vice President" | "Leadership" | "Team Lead" | "Member";
export type EventRole = "Organized" | "Managed";
export type EventCategory = "Competition" | "Workshop" | "Seminar" | "Tech talk" | "Community";

export interface ImageRef {
  src: string;
  alt: string;
}

export interface Socials {
  linkedin?: string;
  instagram?: string;
}

export type AboutIcon = "code" | "tools" | "trophy" | "mic" | "heart";

export interface AboutItem {
  title: string;
  text: string;
  icon: AboutIcon;
  accent: AccentKey;
}

/** Headings and short texts of the home page sections, editable from the admin panel. */
export interface SiteCopy {
  leadershipIntro: string;
  teamsTitle: string;
  teamsIntro: string;
  aboutTitle: string;
  aboutStatement: string;
  aboutItems: AboutItem[];
  eventsTitle: string;
  eventsIntro: string;
  sponsorsTitle: string;
  sponsorsIntro: string;
  alumniTitle: string;
  contactBadge: string;
  contactTitle: string;
  contactIntro: string;
}

export interface SiteInfo {
  shortName: string;
  fullName: string;
  university: string;
  city: string;
  tagline: string;
  email: string;
  instagram: { handle: string; url: string };
  logo: ImageRef & { width: number; height: number };
  heroImage: ImageRef & {
    width: number;
    height: number;
    /** Part of the photo kept in view when the screen crops it. Default "center". */
    focus?: "top" | "center" | "bottom";
  };
  /** The active cabinet, e.g. "2026-27". */
  currentYear: string;
  /** Public URL of the deployed site, used for SEO and Open Graph. */
  siteUrl: string;
  copy: SiteCopy;
  /** Extra contact cards next to email and Instagram (WhatsApp, LinkedIn, phone…) */
  contactLinks?: ContactLink[];
}

export type ContactIcon = "whatsapp" | "linkedin" | "facebook" | "youtube" | "phone" | "link";

export interface ContactLink {
  label: string;
  value: string;
  url: string;
  icon: ContactIcon;
}

export interface Person {
  /** Stable id. Also the photo file name in /public/images/people. */
  id: string;
  slug: string;
  name: string;
  role: Role;
  /** Not set for President, Vice President and other leadership. */
  teamSlug?: string;
  /** Shown on the card instead of the role, e.g. "General Secretary" or "Co-lead". */
  title?: string;
  /** Path under /public. When missing, initials are shown instead. */
  photo?: string;
  socials?: Socials;
  year: string;
}

export interface Team {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  accent: AccentKey;
  /** Background photo for the team tile. Without it the tile uses the team colour. */
  coverImage?: ImageRef;
  /** Old field, no longer needed: the lead is the member with role "Team Lead" in this team. */
  leadId?: string;
  /** Old field, no longer needed: members are the people with role "Member" in this team. */
  memberIds?: string[];
  /** Display order on the home page. */
  order: number;
}

/** A team with its people resolved from the member list. */
export interface TeamSummary extends Team {
  /** First team lead (kept for places that show one face) */
  lead?: Person;
  /** Every team lead, so co-leads all get a card */
  leads: Person[];
  members: Person[];
}

export type TeamDetail = TeamSummary;

/** Leadership cards in order: President, Vice President, then any other leadership. */
export type Leadership = Person[];

/** Alumni are stored as frozen copies so later changes never rewrite history. */
export interface AlumniPerson {
  id: string;
  name: string;
  photo?: string;
  socials?: Socials;
}

export interface AlumniLead extends AlumniPerson {
  teamSlug: string;
  teamName: string;
}

export interface AlumniMember extends AlumniPerson {
  title: string;
}

export interface AlumniYear {
  year: string;
  president: AlumniPerson;
  vicePresident: AlumniPerson;
  /** Other cabinet posts that year, e.g. General Secretary */
  others?: AlumniMember[];
  leads: AlumniLead[];
}

export interface Sponsorship {
  eventSlug: string;
  eventName: string;
  year: string;
  type: string;
}

export interface SponsorFeedback {
  quote: string;
  personName: string;
  personTitle: string;
}

export interface Sponsor {
  id: string;
  slug: string;
  name: string;
  logo: string;
  website?: string;
  sponsorships: Sponsorship[];
  feedback?: SponsorFeedback;
}

export interface FeedbackEntry extends SponsorFeedback {
  sponsorId: string;
  sponsorName: string;
  sponsorLogo: string;
}

export interface NcssEvent {
  id: string;
  slug: string;
  title: string;
  /** ISO date, e.g. "2026-03-14". The year filter is taken from this. */
  date: string;
  venue: string;
  category: EventCategory;
  ourRole: EventRole;
  summary: string;
  /** One string per paragraph. */
  description: string[];
  coverImage: ImageRef;
  gallery: ImageRef[];
  /** Optional extra sponsor links. Sponsors listing this event in their sponsorships are linked automatically. */
  sponsorIds?: string[];
}

/** The six content collections. Each is stored as one JSON document in Supabase. */
export interface ContentMap {
  site: SiteInfo;
  members: Person[];
  teams: Team[];
  events: NcssEvent[];
  sponsors: Sponsor[];
  alumni: AlumniYear[];
}

export type ContentKey = keyof ContentMap;

export interface SiteStats {
  events: number;
  members: number;
  sponsors: number;
}
