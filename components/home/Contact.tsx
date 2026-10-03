import type { ReactNode } from "react";
import { getSiteInfo } from "@/lib/data";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { contactHref, contactIcons } from "@/components/ui/contact-icons";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, InstagramIcon, MailIcon, MapPinIcon } from "@/components/ui/icons";

interface ContactCardProps {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  external?: boolean;
}

function ContactCard({ href, icon, label, value, external = false }: ContactCardProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center gap-4 rounded-[24px] bg-surface p-4 text-ink transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-muted">{label}</span>
        <span className="block font-display text-lg font-bold break-words sm:text-2xl">{value}</span>
      </span>
      <span
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tint transition duration-300 group-hover:-rotate-45 group-hover:bg-pop group-hover:text-ink-strong motion-reduce:transition-none"
      >
        <ArrowRightIcon />
      </span>
    </a>
  );
}

export async function Contact() {
  const site = await getSiteInfo();

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-20 border-t border-line py-16 sm:py-24">
      <Container>
        <div className="on-brand relative isolate overflow-hidden rounded-[32px] bg-brand-deep px-5 py-12 text-white sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          {/* Flat decorative shapes */}
          <span aria-hidden className="absolute -top-28 -right-28 -z-10 h-80 w-80 rounded-full bg-brand" />
          <span aria-hidden className="absolute -bottom-16 left-1/3 -z-10 h-40 w-40 rounded-full bg-brand opacity-60" />
          <span aria-hidden className="absolute top-10 right-10 -z-10 hidden h-6 w-6 rotate-12 rounded-md bg-pop sm:block" />

          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-14">
            <div>
              <p className="inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
                {site.copy.contactBadge}
              </p>
              <h2 id="contact-heading" className="mt-5 text-5xl leading-[0.95] font-extrabold tracking-tighter sm:text-7xl">
                {site.copy.contactTitle}
              </h2>
              <p className="mt-5 max-w-[42ch] text-lg">
                {site.copy.contactIntro}
              </p>
              <p className="mt-6 flex items-center gap-2 text-sm">
                <MapPinIcon width={18} height={18} />
                {site.university}, {site.city}
              </p>
            </div>

            <div>
              <ul className="grid gap-4">
                <li>
                  <ContactCard href={`mailto:${site.email}`} icon={<MailIcon width={24} height={24} />} label="Email us" value={site.email} />
                </li>
                <li>
                  <ContactCard
                    href={site.instagram.url}
                    icon={<InstagramIcon width={24} height={24} />}
                    label="Follow us on Instagram (opens in a new tab)"
                    value={site.instagram.handle}
                    external
                  />
                </li>
                {(site.contactLinks ?? []).map((link, i) => {
                  const Icon = contactIcons[link.icon] ?? contactIcons.link;
                  const href = contactHref(link);
                  const external = href.startsWith("http");
                  return (
                    <li key={`${link.label}-${i}`}>
                      <ContactCard
                        href={href}
                        icon={<Icon width={24} height={24} />}
                        label={external ? `${link.label} (opens in a new tab)` : link.label}
                        value={link.value}
                        external={external}
                      />
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4">
                <CopyEmailButton email={site.email} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
