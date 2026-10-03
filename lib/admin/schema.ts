// Describes every editable section of the website for the admin panel.
// The forms are built from these descriptions, so adding a field here
// is enough to make it editable.

import type { ContentKey, ContentMap } from "@/types";
import { type Doc, slugify, str, uniqueValue, shortId } from "./utils";

export interface Option {
  value: string;
  label: string;
}

/** Everything the forms can look at, e.g. to list teams in a dropdown */
export interface Ctx {
  content: ContentMap;
}

interface Base {
  key: string;
  label: string;
  help?: string;
  required?: boolean;
}

export type Field =
  | (Base & { type: "text" | "textarea" | "url" | "email" | "date"; placeholder?: string })
  | (Base & { type: "select"; options: Option[] | ((ctx: Ctx) => Option[]); emptyLabel?: string })
  /** url: a plain image URL string · ref: { src, alt } · sized: { src, alt, width, height } */
  | (Base & { type: "image"; variant: "url" | "ref" | "sized"; folder: string })
  | (Base & { type: "gallery"; folder: string })
  | (Base & { type: "paragraphs" })
  | (Base & { type: "group"; fields: Field[] })
  | (Base & { type: "list"; itemLabel: string; fields: Field[]; newItem: (ctx: Ctx) => Doc; summary: (item: Doc) => string })
  | { type: "heading"; key: string; label: string; help?: string };

export interface CollectionConfig {
  key: ContentKey;
  label: string;
  description: string;
  kind: "single" | "list";
  fields: Field[];
  /** list only */
  itemLabel?: string;
  newItem?: (ctx: Ctx) => Doc;
  title?: (item: Doc) => string;
  subtitle?: (item: Doc, ctx: Ctx) => string;
  thumb?: (item: Doc) => string | undefined;
  /** Order matters on the site (teams) */
  reorderable?: boolean;
  /** Fills ids, slugs and derived fields right before saving */
  prepare?: (value: unknown, ctx: Ctx) => unknown;
}

// ---------- Shared option lists ----------

const accentOptions: Option[] = [
  { value: "teal", label: "Teal" },
  { value: "deep", label: "Dark teal" },
  { value: "yellow", label: "Yellow" },
  { value: "coral", label: "Coral" },
  { value: "blue", label: "Blue" },
  { value: "sea", label: "Sea green" },
  { value: "violet", label: "Violet" },
];

const teamOptions = (ctx: Ctx): Option[] => ctx.content.teams.map((t) => ({ value: t.slug, label: t.name }));
const eventOptions = (ctx: Ctx): Option[] =>
  [...ctx.content.events].sort((a, b) => b.date.localeCompare(a.date)).map((e) => ({ value: e.slug, label: `${e.title} (${e.date.slice(0, 4)})` }));

const socialsGroup: Field = {
  type: "group",
  key: "socials",
  label: "Social links (optional)",
  fields: [
    { type: "url", key: "linkedin", label: "LinkedIn link", placeholder: "https://www.linkedin.com/in/…" },
    { type: "url", key: "instagram", label: "Instagram link", placeholder: "https://www.instagram.com/…" },
  ],
};

/** Removes empty strings and empty objects so the saved content stays clean */
function tidy(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(tidy);
  if (value && typeof value === "object") {
    const out: Doc = {};
    for (const [k, v] of Object.entries(value)) {
      const t = tidy(v);
      if (t === "" || t === undefined) continue;
      if (t && typeof t === "object" && !Array.isArray(t) && Object.keys(t).length === 0) continue;
      out[k] = t;
    }
    return out;
  }
  return value;
}

/** Gives every item a unique id (and slug) based on its name */
function withIds(items: Doc[], opts: { prefix: string; nameKey: string; slug?: boolean }): Doc[] {
  const ids = new Set(items.map((i) => str(i.id)).filter(Boolean));
  const slugs = new Set<string>();
  return items.map((item) => {
    const next = { ...item };
    if (opts.slug) {
      next.slug = uniqueValue(slugify(str(next.slug) || str(next[opts.nameKey])), slugs);
    }
    if (!str(next.id)) {
      next.id = uniqueValue(`${opts.prefix}-${opts.slug ? str(next.slug) : slugify(str(next[opts.nameKey]))}`, ids);
    }
    return next;
  });
}

/** Alumni people keep their own ids */
function alumniPersonId(person: Doc, year: string, role: string): Doc {
  return str(person.id) ? person : { ...person, id: `a-${year.replace(/\D/g, "")}-${role}-${shortId()}` };
}

// ---------- The six sections ----------

export const collections: CollectionConfig[] = [
  {
    key: "site",
    label: "Site & home page",
    description: "Society name, contact details, logo, hero photo and the texts of every home page section.",
    kind: "single",
    fields: [
      { type: "heading", key: "h-basics", label: "Basics" },
      { type: "text", key: "shortName", label: "Short name", required: true, placeholder: "NCSS" },
      { type: "text", key: "fullName", label: "Full name", required: true, help: "Shown as the big title on the home page." },
      { type: "text", key: "university", label: "University", required: true },
      { type: "text", key: "city", label: "City", required: true },
      { type: "textarea", key: "tagline", label: "Tagline", required: true, help: "The line under the big title, and the description search engines show." },
      {
        type: "text",
        key: "currentYear",
        label: "Current cabinet year",
        required: true,
        placeholder: "2026-27",
        help: "Members with this year are shown as the current cabinet. Change it when a new cabinet takes over.",
      },
      { type: "url", key: "siteUrl", label: "Website address", help: "Used for link previews, e.g. https://ncss.vercel.app" },

      { type: "heading", key: "h-contact", label: "Contact" },
      { type: "email", key: "email", label: "Society email", required: true },
      {
        type: "group",
        key: "instagram",
        label: "Instagram",
        fields: [
          { type: "text", key: "handle", label: "Handle", placeholder: "@ncss.numl" },
          { type: "url", key: "url", label: "Link", placeholder: "https://www.instagram.com/ncss.numl" },
        ],
      },
      {
        type: "list",
        key: "contactLinks",
        label: "More contact cards",
        help: "Shown in the Contact section and the footer, after email and Instagram.",
        itemLabel: "contact card",
        newItem: () => ({ label: "", value: "", url: "", icon: "whatsapp" }),
        summary: (i) => [str(i.label) || "New contact card", str(i.value)].filter(Boolean).join(" · "),
        fields: [
          {
            type: "select",
            key: "icon",
            label: "Type",
            required: true,
            options: [
              { value: "whatsapp", label: "WhatsApp" },
              { value: "phone", label: "Phone" },
              { value: "linkedin", label: "LinkedIn" },
              { value: "facebook", label: "Facebook" },
              { value: "youtube", label: "YouTube" },
              { value: "link", label: "Other link" },
            ],
          },
          { type: "text", key: "label", label: "Label", required: true, placeholder: "Message us on WhatsApp" },
          { type: "text", key: "value", label: "What to show", required: true, placeholder: "+92 300 1234567 or a handle" },
          { type: "text", key: "url", label: "Link (optional for phone and WhatsApp)", placeholder: "https://…" },
        ],
      },

      { type: "heading", key: "h-images", label: "Logo and hero photo" },
      { type: "image", key: "logo", label: "Logo", variant: "sized", folder: "brand", help: "Square PNG, at least 256 × 256 px." },
      { type: "image", key: "heroImage", label: "Hero team photo", variant: "sized", folder: "hero", help: "Wide (landscape) group photo, like 3:2. Keep everyone's faces in the top two thirds: the title sits on the bottom part." },
      {
        type: "group",
        key: "heroImage",
        label: "Hero photo focus",
        help: "If faces get cut off on wide screens, choose which part of the photo should stay in view.",
        fields: [
          {
            type: "select",
            key: "focus",
            label: "Keep in view",
            options: [
              { value: "center", label: "Middle (default)" },
              { value: "top", label: "Top (faces near the top of the photo)" },
              { value: "bottom", label: "Bottom" },
            ],
          },
        ],
      },

      { type: "heading", key: "h-copy", label: "Home page texts" },
      {
        type: "group",
        key: "copy",
        label: "Section headings and texts",
        fields: [
          { type: "textarea", key: "leadershipIntro", label: "Leadership: text" },
          { type: "text", key: "teamsTitle", label: "Teams: heading" },
          { type: "textarea", key: "teamsIntro", label: "Teams: text" },
          { type: "text", key: "aboutTitle", label: "About: heading" },
          { type: "textarea", key: "aboutStatement", label: "About: big statement" },
          {
            type: "list",
            key: "aboutItems",
            label: "About: what we do",
            itemLabel: "activity",
            newItem: () => ({ title: "", text: "", icon: "code", accent: "teal" }),
            summary: (i) => str(i.title) || "New activity",
            fields: [
              { type: "text", key: "title", label: "Title", required: true },
              { type: "textarea", key: "text", label: "Text" },
              {
                type: "select",
                key: "icon",
                label: "Icon",
                options: [
                  { value: "code", label: "Code" },
                  { value: "tools", label: "Tools" },
                  { value: "trophy", label: "Trophy" },
                  { value: "mic", label: "Microphone" },
                  { value: "heart", label: "Heart" },
                ],
              },
              { type: "select", key: "accent", label: "Colour", options: accentOptions },
            ],
          },
          { type: "text", key: "eventsTitle", label: "Events: heading" },
          { type: "textarea", key: "eventsIntro", label: "Events: text" },
          { type: "text", key: "sponsorsTitle", label: "Sponsors: heading" },
          { type: "textarea", key: "sponsorsIntro", label: "Sponsors: text" },
          { type: "text", key: "alumniTitle", label: "Alumni: heading" },
          { type: "text", key: "contactBadge", label: "Contact: small label" },
          { type: "text", key: "contactTitle", label: "Contact: heading" },
          { type: "textarea", key: "contactIntro", label: "Contact: text" },
        ],
      },
    ],
    prepare: (value) => tidy(value),
  },

  {
    key: "members",
    label: "Leadership & members",
    description:
      "Every person card on the site. President, Vice President and other leadership (General Secretary, Treasurer…) appear in Leadership; team leads and members appear on their team. Use ↑ ↓ to change the order of the cards.",
    kind: "list",
    itemLabel: "person",
    reorderable: true,
    newItem: (ctx) => ({ id: "", slug: "", name: "", role: "Member", teamSlug: ctx.content.teams[0]?.slug ?? "", year: ctx.content.site.currentYear }),
    title: (i) => str(i.name) || "New person",
    subtitle: (i, ctx) => {
      const team = ctx.content.teams.find((t) => t.slug === i.teamSlug);
      return [str(i.title) || str(i.role), team?.name, str(i.year)].filter(Boolean).join(" · ");
    },
    thumb: (i) => str(i.photo) || undefined,
    fields: [
      { type: "text", key: "name", label: "Full name", required: true },
      {
        type: "select",
        key: "role",
        label: "Role",
        required: true,
        options: [
          { value: "President", label: "President" },
          { value: "Vice President", label: "Vice President" },
          { value: "Leadership", label: "Other leadership (General Secretary, Treasurer…)" },
          { value: "Team Lead", label: "Team Lead" },
          { value: "Member", label: "Member" },
        ],
        help: "Leadership roles show in the Leadership section. Each team shows its Team Leads first, then its Members.",
      },
      {
        type: "text",
        key: "title",
        label: "Title on the card (optional)",
        placeholder: "General Secretary, Co-lead, Faculty Advisor…",
        help: "Shown under the name instead of the role. Needed for “Other leadership”.",
      },
      { type: "select", key: "teamSlug", label: "Team", options: teamOptions, emptyLabel: "No team (leadership)" },
      { type: "text", key: "year", label: "Cabinet year", required: true, placeholder: "2026-27", help: "Must match the current cabinet year in Site settings to show on the site." },
      { type: "image", key: "photo", label: "Photo", variant: "url", folder: "people", help: "Portrait photo works best. Without a photo, initials are shown." },
      socialsGroup,
    ],
    prepare: (value) =>
      withIds((tidy(value) as Doc[]).map((p) => (["President", "Vice President", "Leadership"].includes(str(p.role)) ? { ...p, teamSlug: undefined } : p)), {
        prefix: "p",
        nameKey: "name",
      }).map((p) => ({ ...p, slug: str(p.slug) || slugify(str(p.name)) })),
  },

  {
    key: "teams",
    label: "Teams",
    description: "The teams, their colours and tile photos. Team leads and members are set in Leadership & members.",
    kind: "list",
    itemLabel: "team",
    reorderable: true,
    newItem: () => ({ id: "", slug: "", name: "", shortDescription: "", description: "", accent: "teal", order: 99 }),
    title: (i) => str(i.name) || "New team",
    subtitle: (i) => str(i.shortDescription),
    thumb: (i) => str((i.coverImage as Doc | undefined)?.src) || undefined,
    fields: [
      { type: "text", key: "name", label: "Team name", required: true },
      { type: "text", key: "slug", label: "Web address name", help: "Used in the link, e.g. /teams/media. Leave empty to create it from the name." },
      { type: "text", key: "shortDescription", label: "One-line description", required: true },
      { type: "textarea", key: "description", label: "Full description", required: true },
      { type: "select", key: "accent", label: "Team colour", options: accentOptions, required: true },
      { type: "image", key: "coverImage", label: "Tile and header photo", variant: "ref", folder: "teams", help: "Landscape photo of the team." },
    ],
    prepare: (value) =>
      withIds(tidy(value) as Doc[], { prefix: "team", nameKey: "name", slug: true }).map((t, i) => ({ ...t, order: i + 1 })),
  },

  {
    key: "events",
    label: "Events",
    description: "Every event with its cover photo, details and photo gallery.",
    kind: "list",
    itemLabel: "event",
    newItem: () => ({
      id: "",
      slug: "",
      title: "",
      date: new Date().toISOString().slice(0, 10),
      venue: "",
      category: "Workshop",
      ourRole: "Organized",
      summary: "",
      description: [""],
      gallery: [],
    }),
    title: (i) => str(i.title) || "New event",
    subtitle: (i) => [str(i.date), str(i.ourRole), str(i.category)].filter(Boolean).join(" · "),
    thumb: (i) => str((i.coverImage as Doc | undefined)?.src) || undefined,
    fields: [
      { type: "text", key: "title", label: "Event title", required: true },
      { type: "text", key: "slug", label: "Web address name", help: "Used in the link, e.g. /events/code-sprint-2026. Leave empty to create it from the title." },
      { type: "date", key: "date", label: "Date", required: true },
      { type: "text", key: "venue", label: "Venue", required: true },
      {
        type: "select",
        key: "category",
        label: "Type",
        required: true,
        options: ["Competition", "Workshop", "Seminar", "Tech talk", "Community"].map((v) => ({ value: v, label: v })),
      },
      {
        type: "select",
        key: "ourRole",
        label: "Our role",
        required: true,
        options: [
          { value: "Organized", label: "Organized (NCSS ran it)" },
          { value: "Managed", label: "Managed (NCSS managed it for someone else)" },
        ],
      },
      { type: "textarea", key: "summary", label: "Short summary", required: true, help: "One or two lines shown on the event cards." },
      { type: "paragraphs", key: "description", label: "Full description" },
      { type: "image", key: "coverImage", label: "Cover photo", variant: "ref", folder: "events", required: true },
      { type: "gallery", key: "gallery", label: "Photo gallery", folder: "events" },
    ],
    prepare: (value) =>
      withIds(tidy(value) as Doc[], { prefix: "e", nameKey: "title", slug: true }).map((e) => ({
        ...e,
        description: ((e.description as unknown[] | undefined) ?? []).map(str).filter((p) => p.trim()),
        gallery: (e.gallery as unknown[] | undefined) ?? [],
      })),
  },

  {
    key: "sponsors",
    label: "Sponsors",
    description: "Sponsor logos, which events they sponsored, and their feedback.",
    kind: "list",
    itemLabel: "sponsor",
    newItem: () => ({ id: "", slug: "", name: "", logo: "", sponsorships: [] }),
    title: (i) => str(i.name) || "New sponsor",
    subtitle: (i) => {
      const n = Array.isArray(i.sponsorships) ? i.sponsorships.length : 0;
      return `${n} ${n === 1 ? "sponsorship" : "sponsorships"}`;
    },
    thumb: (i) => str(i.logo) || undefined,
    fields: [
      { type: "text", key: "name", label: "Sponsor name", required: true },
      { type: "image", key: "logo", label: "Logo", variant: "url", folder: "sponsors", required: true, help: "PNG with a transparent or white background works best." },
      { type: "url", key: "website", label: "Website (optional)" },
      {
        type: "list",
        key: "sponsorships",
        label: "Sponsorships",
        itemLabel: "sponsorship",
        newItem: () => ({ eventSlug: "", eventName: "", year: String(new Date().getFullYear()), type: "" }),
        summary: (i) => [str(i.eventName) || "Event", str(i.type), str(i.year)].filter(Boolean).join(" · "),
        fields: [
          { type: "select", key: "eventSlug", label: "Event", options: eventOptions, emptyLabel: "An event not listed on the site" },
          { type: "text", key: "eventName", label: "Event name", help: "Filled in for you when you pick an event above." },
          { type: "text", key: "year", label: "Year", required: true, placeholder: "2026" },
          { type: "text", key: "type", label: "Sponsorship type", required: true, placeholder: "Title sponsor, Food partner…" },
        ],
      },
      {
        type: "group",
        key: "feedback",
        label: "Feedback quote (optional)",
        fields: [
          { type: "textarea", key: "quote", label: "Quote" },
          { type: "text", key: "personName", label: "Person's name" },
          { type: "text", key: "personTitle", label: "Person's job title", placeholder: "Marketing Manager, Company" },
        ],
      },
    ],
    prepare: (value, ctx) =>
      withIds(tidy(value) as Doc[], { prefix: "s", nameKey: "name", slug: true }).map((s) => ({
        ...s,
        sponsorships: ((s.sponsorships as Doc[] | undefined) ?? []).map((sp) => {
          const event = ctx.content.events.find((e) => e.slug === sp.eventSlug);
          return {
            ...sp,
            eventSlug: str(sp.eventSlug),
            eventName: str(sp.eventName) || event?.title || "Event",
            year: str(sp.year) || event?.date.slice(0, 4) || "",
          };
        }),
      })),
  },

  {
    key: "alumni",
    label: "Alumni",
    description: "Past cabinets: President, Vice President, other leadership and team leads for each year. Add as many people as you need.",
    kind: "list",
    itemLabel: "cabinet",
    newItem: () => ({ year: "", president: { name: "" }, vicePresident: { name: "" }, leads: [] }),
    title: (i) => (str(i.year) ? `Cabinet ${str(i.year)}` : "New cabinet"),
    subtitle: (i) => {
      const p = (i.president as Doc | undefined)?.name;
      return p ? `President: ${str(p)}` : "";
    },
    thumb: (i) => str((i.president as Doc | undefined)?.photo) || undefined,
    fields: [
      { type: "text", key: "year", label: "Cabinet year", required: true, placeholder: "2025-26" },
      {
        type: "group",
        key: "president",
        label: "President",
        fields: [
          { type: "text", key: "name", label: "Name", required: true },
          { type: "image", key: "photo", label: "Photo", variant: "url", folder: "alumni" },
          socialsGroup,
        ],
      },
      {
        type: "group",
        key: "vicePresident",
        label: "Vice President",
        fields: [
          { type: "text", key: "name", label: "Name", required: true },
          { type: "image", key: "photo", label: "Photo", variant: "url", folder: "alumni" },
          socialsGroup,
        ],
      },
      {
        type: "list",
        key: "others",
        label: "Other leadership (General Secretary, Treasurer…)",
        itemLabel: "person",
        newItem: () => ({ name: "", title: "" }),
        summary: (i) => [str(i.name) || "New person", str(i.title)].filter(Boolean).join(" · "),
        fields: [
          { type: "text", key: "name", label: "Name", required: true },
          { type: "text", key: "title", label: "Title", required: true, placeholder: "General Secretary" },
          { type: "image", key: "photo", label: "Photo", variant: "url", folder: "alumni" },
          socialsGroup,
        ],
      },
      {
        type: "list",
        key: "leads",
        label: "Team leads",
        itemLabel: "lead",
        newItem: (ctx) => ({ name: "", teamSlug: ctx.content.teams[0]?.slug ?? "" }),
        summary: (i) => str(i.name) || "New lead",
        fields: [
          { type: "text", key: "name", label: "Name", required: true },
          { type: "select", key: "teamSlug", label: "Team", options: teamOptions, required: true },
          { type: "image", key: "photo", label: "Photo", variant: "url", folder: "alumni" },
          socialsGroup,
        ],
      },
    ],
    prepare: (value, ctx) =>
      (tidy(value) as Doc[]).map((cabinet) => {
        const year = str(cabinet.year);
        return {
          ...cabinet,
          president: alumniPersonId((cabinet.president as Doc) ?? { name: "" }, year, "president"),
          vicePresident: alumniPersonId((cabinet.vicePresident as Doc) ?? { name: "" }, year, "vp"),
          others: ((cabinet.others as Doc[] | undefined) ?? []).map((o) => alumniPersonId(o, year, "cabinet")),
          leads: ((cabinet.leads as Doc[] | undefined) ?? []).map((lead) => ({
            ...alumniPersonId(lead, year, "lead"),
            teamName: ctx.content.teams.find((t) => t.slug === lead.teamSlug)?.name ?? str(lead.teamName),
          })),
        };
      }),
  },
];

/** Required fields that are still empty, as readable messages */
export function findMissing(fields: Field[], value: unknown, where = ""): string[] {
  const doc = (value ?? {}) as Doc;
  const out: string[] = [];
  for (const f of fields) {
    if (f.type === "heading") continue;
    const v = doc[f.key];
    const label = where ? `${where} → ${f.label}` : f.label;
    if (f.type === "group") out.push(...findMissing(f.fields, v, label));
    else if (f.type === "list") (Array.isArray(v) ? v : []).forEach((item, i) => out.push(...findMissing(f.fields, item, `${label} ${i + 1}`)));
    else if (f.required) {
      const empty = f.type === "image" ? !(typeof v === "string" ? v : str((v as Doc | undefined)?.src)) : !str(v).trim();
      if (empty) out.push(label);
    }
  }
  return out;
}
