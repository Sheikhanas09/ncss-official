import type { AccentKey, PhotoFocus, Socials } from "@/types";
import { accentVars } from "@/lib/accent";
import { Avatar } from "@/components/ui/Avatar";
import { TiltCard } from "@/components/ui/TiltCard";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/icons";

type BadgeSize = "lg" | "md" | "sm";

interface BadgeCardProps {
  id: string;
  name: string;
  role: string;
  photo?: string;
  photoFocus?: PhotoFocus;
  socials?: Socials;
  accent: AccentKey;
  /** Shown in the coloured label on the photo, usually the team name. */
  stripLabel: string;
  /** Extra line under the role, e.g. the alumni year. */
  stripMeta?: string;
  size?: BadgeSize;
  /** Alumni: smaller, black and white until hovered. */
  muted?: boolean;
  headingLevel?: "h2" | "h3" | "h4";
}

const sizes: Record<BadgeSize, { card: string; photo: string; name: string; role: string; img: string }> = {
  lg: {
    card: "max-w-[290px]",
    photo: "aspect-[4/5]",
    name: "text-lg sm:text-xl",
    role: "text-sm",
    img: "(min-width: 640px) 290px, 50vw",
  },
  md: {
    card: "max-w-[220px]",
    photo: "aspect-[4/5]",
    name: "text-sm sm:text-base",
    role: "text-xs",
    img: "(min-width: 1024px) 220px, (min-width: 640px) 30vw, 50vw",
  },
  sm: {
    card: "max-w-[190px]",
    photo: "aspect-[4/5]",
    name: "text-sm",
    role: "text-xs",
    img: "(min-width: 1024px) 190px, 50vw",
  },
};

const socialClass =
  "flex h-8 w-8 items-center justify-center rounded-full bg-tint text-ink transition-colors hover:bg-pop hover:text-ink-strong";

/** A person card: full photo, team label on top, name and role on a frosted panel. */
export function BadgeCard({
  name,
  role,
  photo,
  photoFocus,
  socials,
  accent,
  stripLabel,
  stripMeta,
  size = "md",
  muted = false,
  headingLevel: Heading = "h3",
}: BadgeCardProps) {
  const s = sizes[size];
  const hasSocials = Boolean(socials?.linkedin || socials?.instagram);

  return (
    <article className={`group mx-auto w-full ${s.card}`} style={accentVars(accent)}>
      <TiltCard className="overflow-hidden rounded-[22px] bg-tint shadow-badge ring-1 ring-line group-hover:shadow-xl">
        <div className={`@container relative ${s.photo}`}>
          <Avatar
            name={name}
            photo={photo}
            focus={photoFocus}
            sizes={s.img}
            muted={muted}
            className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>

        <span className="absolute top-2.5 left-2.5 max-w-[calc(100%-1.25rem)] truncate rounded-full bg-acc-strip px-2.5 py-1 text-[11px] leading-none font-semibold text-acc-on ring-1 ring-white/60 sm:top-3 sm:left-3 sm:text-xs">
          {stripLabel}
        </span>

        {/* Below the photo on phones, floating over it on bigger screens */}
        <div className="relative m-2 rounded-2xl bg-surface/90 px-3 py-2.5 backdrop-blur-md sm:absolute sm:inset-x-2.5 sm:bottom-2.5 sm:m-0 sm:px-4 sm:py-3">
          <Heading className={`font-display leading-tight font-bold ${s.name}`}>{name}</Heading>
          <p className={`mt-0.5 text-muted ${s.role}`}>{role}</p>
          {stripMeta && <p className="mt-0.5 text-xs font-semibold text-link tabular-nums">{stripMeta}</p>}

          {hasSocials && (
            <ul className="mt-2 flex gap-1.5">
              {socials?.linkedin && (
                <li>
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${name} on LinkedIn`} className={socialClass}>
                    <LinkedInIcon width={16} height={16} />
                  </a>
                </li>
              )}
              {socials?.instagram && (
                <li>
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${name} on Instagram`} className={socialClass}>
                    <InstagramIcon width={16} height={16} />
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </TiltCard>
    </article>
  );
}
