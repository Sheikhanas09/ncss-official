import type { Person } from "@/types";

// Everyone in the current cabinet (and anyone else you want a card for).
// - id must be unique and never change. The photo file is /public/images/people/<id>.jpg
// - Leave out "photo" and the card shows the person's initials instead.
// - Team membership: set teamSlug, and role "Team Lead" or "Member".
export const members: Person[] = [
  // Leadership
  { id: "p-2627-president", slug: "president", name: "President Name", role: "President", photo: "/images/people/p-2627-president.jpg", socials: { linkedin: "https://www.linkedin.com/", instagram: "https://www.instagram.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-vice-president", slug: "vice-president", name: "Vice President Name", role: "Vice President", photo: "/images/people/p-2627-vice-president.jpg", socials: { linkedin: "https://www.linkedin.com/" }, year: "2026-27" }, // TODO: placeholder

  // event-management
  { id: "p-2627-em-lead", slug: "em-lead", name: "Lead Name 1", role: "Team Lead", teamSlug: "event-management", photo: "/images/people/p-2627-em-lead.jpg", socials: { linkedin: "https://www.linkedin.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-em-1", slug: "em-1", name: "Member Name 1", role: "Member", teamSlug: "event-management", photo: "/images/people/p-2627-em-1.jpg", socials: { instagram: "https://www.instagram.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-em-2", slug: "em-2", name: "Member Name 2", role: "Member", teamSlug: "event-management", photo: "/images/people/p-2627-em-2.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-em-3", slug: "em-3", name: "Member Name 3", role: "Member", teamSlug: "event-management", photo: "/images/people/p-2627-em-3.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-em-4", slug: "em-4", name: "Member Name 4", role: "Member", teamSlug: "event-management", year: "2026-27" }, // TODO: placeholder

  // security
  { id: "p-2627-sec-lead", slug: "sec-lead", name: "Lead Name 2", role: "Team Lead", teamSlug: "security", photo: "/images/people/p-2627-sec-lead.jpg", socials: { linkedin: "https://www.linkedin.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-sec-1", slug: "sec-1", name: "Member Name 5", role: "Member", teamSlug: "security", photo: "/images/people/p-2627-sec-1.jpg", socials: { instagram: "https://www.instagram.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-sec-2", slug: "sec-2", name: "Member Name 6", role: "Member", teamSlug: "security", photo: "/images/people/p-2627-sec-2.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-sec-3", slug: "sec-3", name: "Member Name 7", role: "Member", teamSlug: "security", photo: "/images/people/p-2627-sec-3.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-sec-4", slug: "sec-4", name: "Member Name 8", role: "Member", teamSlug: "security", year: "2026-27" }, // TODO: placeholder

  // decor
  { id: "p-2627-decor-lead", slug: "decor-lead", name: "Lead Name 3", role: "Team Lead", teamSlug: "decor", photo: "/images/people/p-2627-decor-lead.jpg", socials: { linkedin: "https://www.linkedin.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-decor-1", slug: "decor-1", name: "Member Name 9", role: "Member", teamSlug: "decor", photo: "/images/people/p-2627-decor-1.jpg", socials: { instagram: "https://www.instagram.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-decor-2", slug: "decor-2", name: "Member Name 10", role: "Member", teamSlug: "decor", photo: "/images/people/p-2627-decor-2.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-decor-3", slug: "decor-3", name: "Member Name 11", role: "Member", teamSlug: "decor", photo: "/images/people/p-2627-decor-3.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-decor-4", slug: "decor-4", name: "Member Name 12", role: "Member", teamSlug: "decor", year: "2026-27" }, // TODO: placeholder

  // media
  { id: "p-2627-media-lead", slug: "media-lead", name: "Lead Name 4", role: "Team Lead", teamSlug: "media", photo: "/images/people/p-2627-media-lead.jpg", socials: { linkedin: "https://www.linkedin.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-media-1", slug: "media-1", name: "Member Name 13", role: "Member", teamSlug: "media", photo: "/images/people/p-2627-media-1.jpg", socials: { instagram: "https://www.instagram.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-media-2", slug: "media-2", name: "Member Name 14", role: "Member", teamSlug: "media", photo: "/images/people/p-2627-media-2.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-media-3", slug: "media-3", name: "Member Name 15", role: "Member", teamSlug: "media", photo: "/images/people/p-2627-media-3.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-media-4", slug: "media-4", name: "Member Name 16", role: "Member", teamSlug: "media", year: "2026-27" }, // TODO: placeholder

  // external-relations
  { id: "p-2627-er-lead", slug: "er-lead", name: "Lead Name 5", role: "Team Lead", teamSlug: "external-relations", photo: "/images/people/p-2627-er-lead.jpg", socials: { linkedin: "https://www.linkedin.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-er-1", slug: "er-1", name: "Member Name 17", role: "Member", teamSlug: "external-relations", photo: "/images/people/p-2627-er-1.jpg", socials: { instagram: "https://www.instagram.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-er-2", slug: "er-2", name: "Member Name 18", role: "Member", teamSlug: "external-relations", photo: "/images/people/p-2627-er-2.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-er-3", slug: "er-3", name: "Member Name 19", role: "Member", teamSlug: "external-relations", photo: "/images/people/p-2627-er-3.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-er-4", slug: "er-4", name: "Member Name 20", role: "Member", teamSlug: "external-relations", year: "2026-27" }, // TODO: placeholder

  // internal-relations
  { id: "p-2627-ir-lead", slug: "ir-lead", name: "Lead Name 6", role: "Team Lead", teamSlug: "internal-relations", photo: "/images/people/p-2627-ir-lead.jpg", socials: { linkedin: "https://www.linkedin.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-ir-1", slug: "ir-1", name: "Member Name 21", role: "Member", teamSlug: "internal-relations", photo: "/images/people/p-2627-ir-1.jpg", socials: { instagram: "https://www.instagram.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-ir-2", slug: "ir-2", name: "Member Name 22", role: "Member", teamSlug: "internal-relations", photo: "/images/people/p-2627-ir-2.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-ir-3", slug: "ir-3", name: "Member Name 23", role: "Member", teamSlug: "internal-relations", photo: "/images/people/p-2627-ir-3.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-ir-4", slug: "ir-4", name: "Member Name 24", role: "Member", teamSlug: "internal-relations", year: "2026-27" }, // TODO: placeholder

  // arts-dramatics
  { id: "p-2627-arts-lead", slug: "arts-lead", name: "Lead Name 7", role: "Team Lead", teamSlug: "arts-dramatics", photo: "/images/people/p-2627-arts-lead.jpg", socials: { linkedin: "https://www.linkedin.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-arts-1", slug: "arts-1", name: "Member Name 25", role: "Member", teamSlug: "arts-dramatics", photo: "/images/people/p-2627-arts-1.jpg", socials: { instagram: "https://www.instagram.com/" }, year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-arts-2", slug: "arts-2", name: "Member Name 26", role: "Member", teamSlug: "arts-dramatics", photo: "/images/people/p-2627-arts-2.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-arts-3", slug: "arts-3", name: "Member Name 27", role: "Member", teamSlug: "arts-dramatics", photo: "/images/people/p-2627-arts-3.jpg", year: "2026-27" }, // TODO: placeholder
  { id: "p-2627-arts-4", slug: "arts-4", name: "Member Name 28", role: "Member", teamSlug: "arts-dramatics", year: "2026-27" }, // TODO: placeholder
];
