import type { NcssEvent } from "@/types";

// All events. The site sorts them by date (newest first).
// Photos go in /public/images/events/<slug>/ : cover.jpg plus gallery photos.
// ourRole is "Organized" (NCSS ran it) or "Managed" (NCSS managed it for someone else).
// Sponsors are linked from data/sponsors.ts (each sponsor lists the events it sponsored).
export const events: NcssEvent[] = [
  // TODO: placeholder event
  {
    id: "e-code-sprint-2026",
    slug: "code-sprint-2026",
    title: "Code Sprint 2026",
    date: "2026-05-16",
    venue: "NUML Main Auditorium",
    category: "Competition",
    ourRole: "Organized",
    summary: "A six hour team coding contest for students from universities across Islamabad.",
    description: [
      "A six hour team coding contest for students from universities across Islamabad. This paragraph is placeholder text. Replace it with what happened, who took part and what people took away from the day.",
      "Add a second paragraph for highlights, winners, speakers or thanks. Keep each paragraph short so it reads well on a phone.",
    ],
    coverImage: { src: "/images/events/code-sprint-2026/cover.jpg", alt: "Code Sprint 2026 cover photo" },
    gallery: [
      { src: "/images/events/code-sprint-2026/1.jpg", alt: "Code Sprint 2026, photo 1" },
      { src: "/images/events/code-sprint-2026/2.jpg", alt: "Code Sprint 2026, photo 2" },
      { src: "/images/events/code-sprint-2026/3.jpg", alt: "Code Sprint 2026, photo 3" },
      { src: "/images/events/code-sprint-2026/4.jpg", alt: "Code Sprint 2026, photo 4" },
      { src: "/images/events/code-sprint-2026/5.jpg", alt: "Code Sprint 2026, photo 5" },
      { src: "/images/events/code-sprint-2026/6.jpg", alt: "Code Sprint 2026, photo 6" },
    ],
  },
  // TODO: placeholder event
  {
    id: "e-ai-workshop-2026",
    slug: "ai-workshop-2026",
    title: "Hands-on AI Workshop",
    date: "2026-03-07",
    venue: "CS Lab 3, NUML",
    category: "Workshop",
    ourRole: "Organized",
    summary: "A beginner friendly day of building small machine learning projects together.",
    description: [
      "A beginner friendly day of building small machine learning projects together. This paragraph is placeholder text. Replace it with what happened, who took part and what people took away from the day.",
      "Add a second paragraph for highlights, winners, speakers or thanks. Keep each paragraph short so it reads well on a phone.",
    ],
    coverImage: { src: "/images/events/ai-workshop-2026/cover.jpg", alt: "Hands-on AI Workshop cover photo" },
    gallery: [
      { src: "/images/events/ai-workshop-2026/1.jpg", alt: "Hands-on AI Workshop, photo 1" },
      { src: "/images/events/ai-workshop-2026/2.jpg", alt: "Hands-on AI Workshop, photo 2" },
      { src: "/images/events/ai-workshop-2026/3.jpg", alt: "Hands-on AI Workshop, photo 3" },
      { src: "/images/events/ai-workshop-2026/4.jpg", alt: "Hands-on AI Workshop, photo 4" },
      { src: "/images/events/ai-workshop-2026/5.jpg", alt: "Hands-on AI Workshop, photo 5" },
    ],
  },
  // TODO: placeholder event
  {
    id: "e-cyber-safety-seminar",
    slug: "cyber-safety-seminar",
    title: "Cyber Safety Seminar",
    date: "2026-02-12",
    venue: "Seminar Hall, NUML",
    category: "Seminar",
    ourRole: "Managed",
    summary: "Industry speakers on staying safe online, managed by NCSS for the CS department.",
    description: [
      "Industry speakers on staying safe online, managed by NCSS for the CS department. This paragraph is placeholder text. Replace it with what happened, who took part and what people took away from the day.",
      "Add a second paragraph for highlights, winners, speakers or thanks. Keep each paragraph short so it reads well on a phone.",
    ],
    coverImage: { src: "/images/events/cyber-safety-seminar/cover.jpg", alt: "Cyber Safety Seminar cover photo" },
    gallery: [
      { src: "/images/events/cyber-safety-seminar/1.jpg", alt: "Cyber Safety Seminar, photo 1" },
      { src: "/images/events/cyber-safety-seminar/2.jpg", alt: "Cyber Safety Seminar, photo 2" },
      { src: "/images/events/cyber-safety-seminar/3.jpg", alt: "Cyber Safety Seminar, photo 3" },
      { src: "/images/events/cyber-safety-seminar/4.jpg", alt: "Cyber Safety Seminar, photo 4" },
    ],
  },
  // TODO: placeholder event
  {
    id: "e-community-tech-drive",
    slug: "community-tech-drive",
    title: "Community Tech Drive",
    date: "2025-12-06",
    venue: "Community Centre, Islamabad",
    category: "Community",
    ourRole: "Organized",
    summary: "Students taught basic computer skills to school children for a day.",
    description: [
      "Students taught basic computer skills to school children for a day. This paragraph is placeholder text. Replace it with what happened, who took part and what people took away from the day.",
      "Add a second paragraph for highlights, winners, speakers or thanks. Keep each paragraph short so it reads well on a phone.",
    ],
    coverImage: { src: "/images/events/community-tech-drive/cover.jpg", alt: "Community Tech Drive cover photo" },
    gallery: [
      { src: "/images/events/community-tech-drive/1.jpg", alt: "Community Tech Drive, photo 1" },
      { src: "/images/events/community-tech-drive/2.jpg", alt: "Community Tech Drive, photo 2" },
      { src: "/images/events/community-tech-drive/3.jpg", alt: "Community Tech Drive, photo 3" },
      { src: "/images/events/community-tech-drive/4.jpg", alt: "Community Tech Drive, photo 4" },
      { src: "/images/events/community-tech-drive/5.jpg", alt: "Community Tech Drive, photo 5" },
    ],
  },
  // TODO: placeholder event
  {
    id: "e-career-talk-2025",
    slug: "career-talk-2025",
    title: "Careers in Tech Talk",
    date: "2025-11-01",
    venue: "NUML Main Auditorium",
    category: "Tech talk",
    ourRole: "Managed",
    summary: "Alumni working in software shared how they got their first jobs.",
    description: [
      "Alumni working in software shared how they got their first jobs. This paragraph is placeholder text. Replace it with what happened, who took part and what people took away from the day.",
      "Add a second paragraph for highlights, winners, speakers or thanks. Keep each paragraph short so it reads well on a phone.",
    ],
    coverImage: { src: "/images/events/career-talk-2025/cover.jpg", alt: "Careers in Tech Talk cover photo" },
    gallery: [
      { src: "/images/events/career-talk-2025/1.jpg", alt: "Careers in Tech Talk, photo 1" },
      { src: "/images/events/career-talk-2025/2.jpg", alt: "Careers in Tech Talk, photo 2" },
      { src: "/images/events/career-talk-2025/3.jpg", alt: "Careers in Tech Talk, photo 3" },
      { src: "/images/events/career-talk-2025/4.jpg", alt: "Careers in Tech Talk, photo 4" },
    ],
  },
  // TODO: placeholder event
  {
    id: "e-web-dev-bootcamp",
    slug: "web-dev-bootcamp",
    title: "Web Dev Bootcamp",
    date: "2025-10-11",
    venue: "CS Lab 1, NUML",
    category: "Workshop",
    ourRole: "Organized",
    summary: "A weekend bootcamp where first year students built and shipped their first website.",
    description: [
      "A weekend bootcamp where first year students built and shipped their first website. This paragraph is placeholder text. Replace it with what happened, who took part and what people took away from the day.",
      "Add a second paragraph for highlights, winners, speakers or thanks. Keep each paragraph short so it reads well on a phone.",
    ],
    coverImage: { src: "/images/events/web-dev-bootcamp/cover.jpg", alt: "Web Dev Bootcamp cover photo" },
    gallery: [
      { src: "/images/events/web-dev-bootcamp/1.jpg", alt: "Web Dev Bootcamp, photo 1" },
      { src: "/images/events/web-dev-bootcamp/2.jpg", alt: "Web Dev Bootcamp, photo 2" },
      { src: "/images/events/web-dev-bootcamp/3.jpg", alt: "Web Dev Bootcamp, photo 3" },
      { src: "/images/events/web-dev-bootcamp/4.jpg", alt: "Web Dev Bootcamp, photo 4" },
      { src: "/images/events/web-dev-bootcamp/5.jpg", alt: "Web Dev Bootcamp, photo 5" },
    ],
  },
];
