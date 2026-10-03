import Image from "next/image";
import Link from "next/link";
import { getSiteInfo, getStats, getTeams } from "@/lib/data";
import { initials } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroReveal } from "./HeroReveal";
import { HeroTitle } from "./HeroTitle";
import { focusStyles } from "@/lib/photo";

/** Logo with the society name spinning around it. */
function LogoRing({ text, logo }: { text: string; logo: { src: string; alt: string; width: number; height: number } }) {
  return (
    <div className="relative h-40 w-40 xl:h-48 xl:w-48">
      <svg viewBox="0 0 200 200" aria-hidden className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="hero-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-white font-sans text-[13px] font-semibold tracking-[0.2em] uppercase">
          <textPath href="#hero-ring" textLength="486" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-[26%] rounded-full bg-white p-1 shadow-xl">
        <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} unoptimized className="h-full w-full" />
      </div>
    </div>
  );
}

export async function Hero() {
  const [site, teams, stats] = await Promise.all([getSiteInfo(), getTeams(), getStats()]);
  const leads = teams.flatMap((t) => t.leads);
  const faces = leads.slice(0, 5);

  // Which part of the photo stays in view when the screen crops it (set in the admin panel)
  const focus = { top: "center 20%", center: "center 40%", bottom: "center 75%" }[site.heroImage.focus ?? "center"];
  // Soft shadow keeps white text readable without hiding the photo behind a dark layer
  const readable = "[text-shadow:0_2px_18px_rgb(0_0_0/0.45)]";

  return (
    <section
      aria-labelledby="hero-heading"
      className="on-brand relative isolate flex flex-col overflow-hidden bg-ink-strong text-white lg:min-h-[calc(100svh-4.5rem)] lg:justify-end"
    >
      {/*
        Team photo, slowly zooming.
        Phones and tablets: the whole photo at its own shape on top, fading into the dark background, text below.
        Computers: the photo fills the hero behind the text.
      */}
      <HeroReveal part="photo" className="relative aspect-[3/2] w-full overflow-hidden lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto">
        <div className="kenburns absolute inset-0">
          <Image
            src={site.heroImage.src}
            alt={site.heroImage.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: focus }}
          />
        </div>
        {/* Light fades only behind the text: the bottom, and a little on the left. The rest of the photo stays clear. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-ink-strong to-transparent lg:h-[70%] lg:from-ink-strong/85 lg:via-ink-strong/35"
        />
        <div aria-hidden className="absolute inset-y-0 left-0 hidden w-2/3 bg-linear-to-r from-ink-strong/45 via-transparent to-transparent lg:block" />
      </HeroReveal>

      <Container className="relative -mt-6 pb-12 sm:-mt-10 sm:pb-16 lg:mt-0 lg:pt-24 lg:pb-20">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <HeroReveal part="title">
              <p className="inline-flex items-center gap-2 rounded-full bg-ink-strong/40 px-4 py-1.5 text-sm font-semibold ring-1 ring-white/25 backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-pop opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pop" />
                </span>
                {site.currentYear} cabinet
              </p>
            </HeroReveal>

            <HeroTitle
              id="hero-heading"
              text={site.fullName}
              className={`mt-5 max-w-[14ch] text-[clamp(2.75rem,8vw,6rem)] leading-[0.92] font-extrabold tracking-tighter ${readable}`}
            />

            <HeroReveal part="title">
              <p className={`mt-5 max-w-[48ch] text-lg font-semibold sm:text-xl ${readable}`}>{site.tagline}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/#teams" variant="light" arrow>
                  Meet the teams
                </Button>
                <Link
                  href="/#events"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink-strong/35 px-6 py-3 font-semibold text-white ring-1 ring-white/40 backdrop-blur-md transition-colors hover:bg-pop hover:text-ink-strong hover:ring-pop"
                >
                  See our events
                </Link>
              </div>

              {faces.length > 0 && (
                <Link href="/#teams" className="group mt-8 inline-flex items-center gap-4 rounded-full py-1 pr-2">
                  <span className="flex">
                    {faces.map((p) => (
                      <span key={p.id} className="relative -ml-3 inline-flex h-11 w-11 overflow-hidden rounded-full bg-tint ring-2 ring-white first:ml-0">
                        {p.photo ? (
                          <Image src={p.photo} alt="" fill sizes="44px" className="object-cover" style={focusStyles(p.photoFocus).image} />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-xs font-bold text-ink">{initials(p.name)}</span>
                        )}
                      </span>
                    ))}
                  </span>
                  <span className={`text-sm leading-snug ${readable}`}>
                    <span className="block font-bold">
                      {stats.members} students · {teams.length} teams
                    </span>
                    <span className="underline-offset-4 group-hover:underline">Meet the people behind {site.shortName}</span>
                  </span>
                </Link>
              )}
            </HeroReveal>
          </div>

          <div className="hidden lg:block">
            <LogoRing text={`${site.fullName} • ${site.shortName} • ${site.city} • `} logo={site.logo} />
          </div>
        </div>
      </Container>
    </section>
  );
}
