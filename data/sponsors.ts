import type { Sponsor } from "@/types";

// Sponsors. Each sponsorship links to an event by its slug (see data/events.ts).
// Logos go in /public/images/sponsors/ (PNG with a transparent or white background works best).
export const sponsors: Sponsor[] = [
  // TODO: placeholder sponsor
  {
    id: "s-sponsor-one",
    slug: "sponsor-one",
    name: "Sponsor One",
    logo: "/images/sponsors/s-sponsor-one.png",
    website: "https://example.com",
    sponsorships: [
      { eventSlug: "code-sprint-2026", eventName: "Code Sprint 2026", year: "2026", type: "Title sponsor" },
      { eventSlug: "web-dev-bootcamp", eventName: "Web Dev Bootcamp", year: "2025", type: "Title sponsor" },
    ],
    feedback: {
      quote: "The NCSS team was organised and quick to reply. Our brand was visible all day and we met some very talented students.",
      personName: "Contact Person 1",
      personTitle: "Marketing Manager, Sponsor One",
    },
  },
  // TODO: placeholder sponsor
  {
    id: "s-sponsor-two",
    slug: "sponsor-two",
    name: "Sponsor Two",
    logo: "/images/sponsors/s-sponsor-two.png",
    website: "https://example.com",
    sponsorships: [
      { eventSlug: "code-sprint-2026", eventName: "Code Sprint 2026", year: "2026", type: "Food partner" },
      { eventSlug: "community-tech-drive", eventName: "Community Tech Drive", year: "2025", type: "Food partner" },
    ],
    feedback: {
      quote: "Working with NCSS felt easy from the first meeting. They kept every promise they made in the proposal.",
      personName: "Contact Person 2",
      personTitle: "Owner, Sponsor Two",
    },
  },
  // TODO: placeholder sponsor
  {
    id: "s-sponsor-three",
    slug: "sponsor-three",
    name: "Sponsor Three",
    logo: "/images/sponsors/s-sponsor-three.png",
    website: "https://example.com",
    sponsorships: [
      { eventSlug: "ai-workshop-2026", eventName: "Hands-on AI Workshop", year: "2026", type: "Workshop partner" },
    ],
    feedback: {
      quote: "The workshop was full, the students were curious and the whole day ran on time. We would sponsor again.",
      personName: "Contact Person 3",
      personTitle: "Community Lead, Sponsor Three",
    },
  },
  // TODO: placeholder sponsor
  {
    id: "s-sponsor-four",
    slug: "sponsor-four",
    name: "Sponsor Four",
    logo: "/images/sponsors/s-sponsor-four.png",
    sponsorships: [
      { eventSlug: "career-talk-2025", eventName: "Careers in Tech Talk", year: "2025", type: "Venue partner" },
      { eventSlug: "code-sprint-2026", eventName: "Code Sprint 2026", year: "2026", type: "Prize sponsor" },
    ],
    feedback: {
      quote: "A friendly, professional team. They shared photos and a short report after the event, which we really liked.",
      personName: "Contact Person 4",
      personTitle: "HR Lead, Sponsor Four",
    },
  },
];
