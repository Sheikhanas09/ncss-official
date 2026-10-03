import Link from "next/link";
import type { ReactNode } from "react";
import { getSiteInfo, getTeams } from "@/lib/data";
import { accentVars } from "@/lib/accent";
import { Container } from "@/components/ui/Container";
import { contactHref, contactIcons } from "@/components/ui/contact-icons";
import { ArrowRightIcon, InstagramIcon, MailIcon, MapPinIcon } from "@/components/ui/icons";
import { Logo } from "./Logo";
import { navLinks } from "./nav-links";

const linkClass = "rounded-sm text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline";

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-sm font-bold tracking-wide text-pop">{title}</h2>
      <ul className="mt-4 grid gap-2.5">{children}</ul>
    </div>
  );
}

/** Round icon button for a social or contact link */
function SocialButton({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-colors hover:bg-pop hover:text-ink-strong hover:ring-pop"
    >
      {children}
    </a>
  );
}

export async function Footer() {
  const [site, teams] = await Promise.all([getSiteInfo(), getTeams()]);
  const year = new Date().getFullYear();
  const extra = site.contactLinks ?? [];

  return (
    <footer className="on-brand relative isolate mt-4 overflow-hidden rounded-t-[36px] bg-brand-deep text-white sm:rounded-t-[48px]">
      {/* Flat decorative circles */}
      <span aria-hidden className="absolute -top-32 -right-24 -z-10 h-80 w-80 rounded-full bg-brand opacity-60" />
      <span aria-hidden className="absolute top-1/2 -left-20 -z-10 h-48 w-48 rounded-full bg-brand opacity-30" />

      <Container className="grid grid-cols-2 gap-x-6 gap-y-12 pt-14 pb-6 sm:pt-20 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-10">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3 rounded-full" aria-label={`${site.shortName} home`}>
            <Logo className="h-14" />
            <span>
              <span className="block font-display text-2xl leading-none font-extrabold">{site.shortName}</span>
              <span className="mt-1 block text-sm text-white/85">{site.fullName}</span>
            </span>
          </Link>
          <p className="mt-6 max-w-[38ch] text-white/85">{site.tagline}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <SocialButton href={site.instagram.url} label={`Instagram ${site.instagram.handle}`}>
              <InstagramIcon />
            </SocialButton>
            {extra.map((link, i) => {
              const Icon = contactIcons[link.icon] ?? contactIcons.link;
              return (
                <SocialButton key={`${link.label}-${i}`} href={contactHref(link)} label={link.label}>
                  <Icon />
                </SocialButton>
              );
            })}
            <SocialButton href={`mailto:${site.email}`} label={`Email ${site.email}`}>
              <MailIcon />
            </SocialButton>
          </div>
        </div>

        <nav aria-label="Footer">
          <Column title="Explore">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/events" className={linkClass}>
                All events
              </Link>
            </li>
          </Column>
        </nav>

        <nav aria-label="Teams">
          <Column title="Teams">
            {teams.map((t) => (
              <li key={t.id} style={accentVars(t.accent)}>
                <Link href={`/teams/${t.slug}`} className={`${linkClass} inline-flex items-center gap-2`}>
                  <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-acc ring-1 ring-white/40" />
                  {t.name}
                </Link>
              </li>
            ))}
          </Column>
        </nav>

        <div className="col-span-2 lg:col-span-1">
          <Column title="Get in touch">
            <li>
              <a href={`mailto:${site.email}`} className={`${linkClass} inline-flex items-center gap-2 break-all`}>
                <MailIcon width={18} height={18} className="shrink-0" /> {site.email}
              </a>
            </li>
            <li>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-2`}>
                <InstagramIcon width={18} height={18} className="shrink-0" /> {site.instagram.handle}
              </a>
            </li>
            {extra.map((link, i) => {
              const Icon = contactIcons[link.icon] ?? contactIcons.link;
              const href = contactHref(link);
              return (
                <li key={`${link.label}-${i}`}>
                  <a
                    href={href}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`${linkClass} inline-flex items-center gap-2`}
                  >
                    <Icon width={18} height={18} className="shrink-0" /> {link.value}
                  </a>
                </li>
              );
            })}
            <li className="inline-flex items-start gap-2 text-white/85">
              <MapPinIcon width={18} height={18} className="mt-0.5 shrink-0" />
              <span>
                {site.university}, {site.city}
              </span>
            </li>
          </Column>
        </div>
      </Container>

      {/* Big wordmark */}
      <Container>
        <p
          aria-hidden
          className="pointer-events-none -mb-[0.18em] font-display text-[clamp(4.5rem,20vw,15rem)] leading-none font-extrabold tracking-tighter text-white/[0.07] select-none"
        >
          {site.shortName}
        </p>
      </Container>

      <div className="border-t border-white/15 bg-ink-strong/20">
        <Container className="flex flex-col gap-3 py-5 text-sm text-white/85 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.fullName}. All rights reserved.
          </p>
          <a href="#main" className="group inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2 font-semibold text-white transition-colors hover:bg-pop hover:text-ink-strong sm:self-auto">
            Back to top
            <ArrowRightIcon width={16} height={16} className="-rotate-90" />
          </a>
        </Container>
      </div>
    </footer>
  );
}
