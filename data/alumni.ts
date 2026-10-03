import type { AlumniYear } from "@/types";

// Past cabinets. Newest year first is not required, the site sorts them.
// Photos go in /public/images/people/<id>.jpg. Leave out "photo" to show initials.
export const alumni: AlumniYear[] = [
  // TODO: placeholder cabinet
  {
    year: "2025-26",
    president: { id: "a-2526-president", name: "Alumni President 2025", photo: "/images/people/a-2526-president.jpg", socials: { linkedin: "https://www.linkedin.com/" } },
    vicePresident: { id: "a-2526-vice-president", name: "Alumni VP 2025", photo: "/images/people/a-2526-vice-president.jpg" },
    leads: [
      { id: "a-2526-em-lead", name: "Alumni Lead 2025-1", teamSlug: "event-management", teamName: "Event Management", photo: "/images/people/a-2526-em-lead.jpg" },
      { id: "a-2526-sec-lead", name: "Alumni Lead 2025-2", teamSlug: "security", teamName: "Security", photo: "/images/people/a-2526-sec-lead.jpg" },
      { id: "a-2526-decor-lead", name: "Alumni Lead 2025-3", teamSlug: "decor", teamName: "Decor", photo: "/images/people/a-2526-decor-lead.jpg" },
      { id: "a-2526-media-lead", name: "Alumni Lead 2025-4", teamSlug: "media", teamName: "Media" },
      { id: "a-2526-er-lead", name: "Alumni Lead 2025-5", teamSlug: "external-relations", teamName: "External Relations", photo: "/images/people/a-2526-er-lead.jpg" },
      { id: "a-2526-ir-lead", name: "Alumni Lead 2025-6", teamSlug: "internal-relations", teamName: "Internal Relations", photo: "/images/people/a-2526-ir-lead.jpg" },
      { id: "a-2526-arts-lead", name: "Alumni Lead 2025-7", teamSlug: "arts-dramatics", teamName: "Arts & Dramatics", photo: "/images/people/a-2526-arts-lead.jpg" },
    ],
  },
  // TODO: placeholder cabinet
  {
    year: "2024-25",
    president: { id: "a-2425-president", name: "Alumni President 2024", photo: "/images/people/a-2425-president.jpg" },
    vicePresident: { id: "a-2425-vice-president", name: "Alumni VP 2024", photo: "/images/people/a-2425-vice-president.jpg" },
    leads: [
      { id: "a-2425-em-lead", name: "Alumni Lead 2024-1", teamSlug: "event-management", teamName: "Event Management", photo: "/images/people/a-2425-em-lead.jpg" },
      { id: "a-2425-sec-lead", name: "Alumni Lead 2024-2", teamSlug: "security", teamName: "Security" },
      { id: "a-2425-decor-lead", name: "Alumni Lead 2024-3", teamSlug: "decor", teamName: "Decor", photo: "/images/people/a-2425-decor-lead.jpg" },
      { id: "a-2425-media-lead", name: "Alumni Lead 2024-4", teamSlug: "media", teamName: "Media", photo: "/images/people/a-2425-media-lead.jpg" },
      { id: "a-2425-er-lead", name: "Alumni Lead 2024-5", teamSlug: "external-relations", teamName: "External Relations", photo: "/images/people/a-2425-er-lead.jpg" },
      { id: "a-2425-ir-lead", name: "Alumni Lead 2024-6", teamSlug: "internal-relations", teamName: "Internal Relations", photo: "/images/people/a-2425-ir-lead.jpg" },
      { id: "a-2425-arts-lead", name: "Alumni Lead 2024-7", teamSlug: "arts-dramatics", teamName: "Arts & Dramatics", photo: "/images/people/a-2425-arts-lead.jpg" },
    ],
  },
];
