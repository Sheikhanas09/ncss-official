import type { Team } from "@/types";

// The 7 NCSS teams. Team names and colours stay the same every year.
// A team's lead and members come from data/members.ts (role + teamSlug).
// accent must be one of: teal, deep, yellow, coral, blue, sea, violet
// coverImage is the tile background photo: /public/images/teams/<slug>.jpg (landscape works best)
export const teams: Team[] = [
  {
    id: "team-event-management",
    slug: "event-management",
    name: "Event Management",
    // TODO: edit copy
    shortDescription: "Plans every event from the first idea to the last chair.",
    description:
      "Event Management turns ideas into real days on the calendar. The team books venues, sets schedules, briefs volunteers and keeps each event running on time.",
    accent: "teal",
    // TODO: replace with a real photo of the Event Management team
    coverImage: { src: "/images/teams/event-management.jpg", alt: "The Event Management team at work" },
    order: 1,
  },
  {
    id: "team-security",
    slug: "security",
    name: "Security",
    // TODO: edit copy
    shortDescription: "Keeps every venue safe, calm and well organised.",
    description:
      "Security manages entry, crowd flow and safety at every NCSS event. They make sure guests feel welcome and that everything stays under control.",
    accent: "deep",
    // TODO: replace with a real photo of the Security team
    coverImage: { src: "/images/teams/security.jpg", alt: "The Security team at work" },
    order: 2,
  },
  {
    id: "team-decor",
    slug: "decor",
    name: "Decor",
    // TODO: edit copy
    shortDescription: "Designs the stages, stalls and spaces you walk into.",
    description:
      "Decor gives every event its look. From stage backdrops to stall layouts, the team plans, builds and sets up the spaces our guests remember.",
    accent: "yellow",
    // TODO: replace with a real photo of the Decor team
    coverImage: { src: "/images/teams/decor.jpg", alt: "The Decor team at work" },
    order: 3,
  },
  {
    id: "team-media",
    slug: "media",
    name: "Media",
    // TODO: edit copy
    shortDescription: "Photos, videos and posts that tell our story.",
    description:
      "Media covers every NCSS event with photos and video, designs our posts and runs our social pages. If you saw it online, Media made it.",
    accent: "coral",
    // TODO: replace with a real photo of the Media team
    coverImage: { src: "/images/teams/media.jpg", alt: "The Media team at work" },
    order: 4,
  },
  {
    id: "team-external-relations",
    slug: "external-relations",
    name: "External Relations",
    // TODO: edit copy
    shortDescription: "Builds partnerships with sponsors and other societies.",
    description:
      "External Relations talks to companies, sponsors and other universities. The team brings in partners, speakers and support that make bigger events possible.",
    accent: "blue",
    // TODO: replace with a real photo of the External Relations team
    coverImage: { src: "/images/teams/external-relations.jpg", alt: "The External Relations team at work" },
    order: 5,
  },
  {
    id: "team-internal-relations",
    slug: "internal-relations",
    name: "Internal Relations",
    // TODO: edit copy
    shortDescription: "Connects NCSS with students and faculty at NUML.",
    description:
      "Internal Relations works with departments, faculty and students inside NUML. The team handles permissions, spreads the word and keeps our members in the loop.",
    accent: "sea",
    // TODO: replace with a real photo of the Internal Relations team
    coverImage: { src: "/images/teams/internal-relations.jpg", alt: "The Internal Relations team at work" },
    order: 6,
  },
  {
    id: "team-arts-dramatics",
    slug: "arts-dramatics",
    name: "Arts & Dramatics",
    // TODO: edit copy
    shortDescription: "Performances, skits and hosting that bring events to life.",
    description:
      "Arts & Dramatics writes and performs skits, hosts ceremonies and adds the creative moments to our events. They prove computer science students can also take the stage.",
    accent: "violet",
    // TODO: replace with a real photo of the Arts & Dramatics team
    coverImage: { src: "/images/teams/arts-dramatics.jpg", alt: "The Arts & Dramatics team at work" },
    order: 7,
  },
];
