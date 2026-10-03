import type { ComponentType, SVGProps } from "react";
import type { ContactIcon, ContactLink } from "@/types";
import { FacebookIcon, LinkedInIcon, LinkIcon, PhoneIcon, WhatsAppIcon, YouTubeIcon } from "./icons";

/** Icon for each kind of extra contact link chosen in the admin panel */
export const contactIcons: Record<ContactIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  whatsapp: WhatsAppIcon,
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  phone: PhoneIcon,
  link: LinkIcon,
};

/** Where a contact card points. Fills in phone and WhatsApp links when only a number is given. */
export function contactHref(link: ContactLink): string {
  if (link.url?.trim()) return link.url.trim();
  const digits = link.value.replace(/[^\d+]/g, "");
  if (link.icon === "phone") return `tel:${digits}`;
  if (link.icon === "whatsapp") return `https://wa.me/${digits.replace(/^\+/, "")}`;
  return "#";
}
