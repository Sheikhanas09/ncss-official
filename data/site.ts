import type { SiteInfo } from "@/types";

export const site: SiteInfo = {
  shortName: "NCSS",
  fullName: "NUML Computer Science Society",
  university: "National University of Modern Languages",
  city: "Islamabad",
  // TODO: replace with the final tagline
  tagline:
    "We are the students behind NUML's tech events, workshops and competitions, and we make room for everyone who wants to build.",
  // TODO: replace with the real society email
  email: "ncss@numl.edu.pk",
  instagram: {
    // TODO: replace with the real Instagram handle and link
    handle: "@ncss.numl",
    url: "https://www.instagram.com/ncss.numl",
  },
  logo: {
    // If you replace the logo with a bigger PNG or an SVG, update width/height
    src: "/brand/logo.png",
    width: 224,
    height: 224,
    alt: "NCSS logo",
  },
  heroImage: {
    // TODO: replace /public/images/hero/team.jpg with the real group photo, then update width/height
    src: "/images/hero/team.jpg",
    width: 2400,
    height: 1350,
    alt: "The NCSS team together in one group photo",
  },
  currentYear: "2026-27",
  // TODO: replace with the real domain once deployed
  siteUrl: "https://ncss-numl.vercel.app",
  // Extra contact cards (WhatsApp, LinkedIn, phone…). TODO: add yours, or add them in the admin panel
  contactLinks: [],
  // Home page section texts. TODO: edit copy (also editable in the admin panel)
  copy: {
    leadershipIntro:
      "The people steering this cabinet and all of our teams, from the first planning meeting to the last event of the year.",
    teamsTitle: "Seven teams, one society",
    teamsIntro: "Every NCSS event is the work of seven teams. Pick one to meet the people behind it.",
    aboutTitle: "What NCSS does",
    aboutStatement:
      "Run by computer science students at NUML. We plan the events we wished existed, and make room for everyone who wants to learn, compete or help out.",
    aboutItems: [
      { title: "Tech events", text: "Hackathons, coding contests and showcases that bring students from across Islamabad to NUML.", icon: "code", accent: "teal" },
      { title: "Workshops", text: "Hands-on sessions where you leave having built something, not just listened.", icon: "tools", accent: "coral" },
      { title: "Competitions", text: "Contests for every level, from first year beginners to final year pros.", icon: "trophy", accent: "yellow" },
      { title: "Seminars", text: "Talks from people working in the industry, so you can see where your degree can take you.", icon: "mic", accent: "blue" },
      { title: "Community work", text: "Drives where we take what we know outside the university and share it.", icon: "heart", accent: "violet" },
    ],
    eventsTitle: "Latest events",
    eventsIntro: "Some we organized from scratch, some we managed for others. All of them took a team.",
    sponsorsTitle: "Our sponsors",
    sponsorsIntro: "The partners who made our events bigger, and what they said about working with us.",
    alumniTitle: "Alumni",
    contactBadge: "Students, sponsors and partners welcome",
    contactTitle: "Say hello",
    contactIntro: "Want to join a team, sponsor an event or work with us? Send us an email or a message on Instagram.",
  },
};
