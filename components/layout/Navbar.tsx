import Link from "next/link";
import { getSiteInfo } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { navLinks } from "./nav-links";

export async function Navbar() {
  const site = await getSiteInfo();

  return (
    <header className="on-brand sticky top-0 z-40 bg-brand text-white">
      <Container className="relative flex h-16 items-center justify-between gap-4 lg:h-18">
        <Link href="/" className="flex items-center gap-3 rounded-full" aria-label={`${site.shortName} home`}>
          <Logo className="h-10 lg:h-12" />
          <span className="font-display text-xl font-extrabold tracking-tight">{site.shortName}</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-pop hover:text-ink-strong"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
