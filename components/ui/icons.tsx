import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

export const LinkedInIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 10.5V16M8 7.5v.01M12 16v-3.2c0-1.5 1-2.3 2-2.3s2 .8 2 2.3V16M12 10.5V16" />
  </svg>
);

export const InstagramIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5v.01" />
  </svg>
);

export const MailIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const SunIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const MoonIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ExternalIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);

export const QuoteIcon = (p: IconProps) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M4 18v-5.5C4 8.4 6.2 6 10 5l.7 1.7C8.6 7.5 7.6 8.8 7.5 11H10v7H4Zm10 0v-5.5c0-4.1 2.2-6.5 6-7.5l.7 1.7c-2.1.8-3.1 2.1-3.2 4.3H20v7h-6Z" />
  </svg>
);

export const PauseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M9 6v12M15 6v12" />
  </svg>
);

export const PlayIcon = (p: IconProps) => (
  <svg {...base} fill="currentColor" {...p}>
    <path d="M8 5.5v13l10-6.5-10-6.5Z" />
  </svg>
);

export const MapPinIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const CopyIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const CodeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
  </svg>
);

export const ToolsIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5a4 4 0 0 0-2-2Z" />
    <path d="M5 5l4 4" />
    <path d="M3 7l4-4" />
  </svg>
);

export const TrophyIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
    <path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M10 17h4" />
  </svg>
);

export const MicIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" />
  </svg>
);

export const HeartHandIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 8.5C10.6 6 7 6.2 7 9c0 2.4 5 5.5 5 5.5s5-3.1 5-5.5c0-2.8-3.6-3-5-.5Z" />
    <path d="M3 17h4l3 2h6.5a1.5 1.5 0 0 0 0-3H13" />
  </svg>
);

export const CalendarIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

export const TagIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3.5 12.3V4.5a1 1 0 0 1 1-1h7.8l8.2 8.2a1.5 1.5 0 0 1 0 2.1l-6.7 6.7a1.5 1.5 0 0 1-2.1 0l-8.2-8.2Z" />
    <circle cx="8" cy="8" r="1.4" />
  </svg>
);

export const FlagIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
  </svg>
);

export const PhoneIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 4h3.5l1.5 4.5-2 1.5a11 11 0 0 0 6 6l1.5-2 4.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5A16 16 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4Z" />
  </svg>
);

export const WhatsAppIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 20l1.3-4A8 8 0 1 1 8.4 19L4 20Z" />
    <path d="M9 9.5c.3 2.2 2.3 4.4 4.6 5l1.2-1.3-1.8-.9-.8.8a4 4 0 0 1-2-2l.8-.8-.9-1.8L9 9.5Z" />
  </svg>
);

export const FacebookIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M15.5 8H14a2 2 0 0 0-2 2v11M9.5 13H15" />
  </svg>
);

export const YouTubeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10 9.5 5 2.5-5 2.5v-5Z" />
  </svg>
);

export const LinkIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </svg>
);
