import type { ComponentType, SVGProps } from "react";
import type { AboutIcon } from "@/types";
import { getSiteInfo, getStats } from "@/lib/data";
import { accentVars } from "@/lib/accent";
import { CountUp } from "@/components/ui/CountUp";
import { Button } from "@/components/ui/Button";
import { CheckIcon, CodeIcon, FlagIcon, HeartHandIcon, MicIcon, ToolsIcon, TrophyIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/** Icon names the admin panel can pick for each "what we do" card */
const icons: Record<AboutIcon, Icon> = {
  code: CodeIcon,
  tools: ToolsIcon,
  trophy: TrophyIcon,
  mic: MicIcon,
  heart: HeartHandIcon,
};

export async function About() {
  const [stats, site] = await Promise.all([getStats(), getSiteInfo()]);
  const numbers = [
    { value: stats.events, label: stats.events === 1 ? "event" : "events" },
    { value: stats.members, label: "members this year" },
    { value: stats.sponsors, label: stats.sponsors === 1 ? "sponsor" : "sponsors" },
  ].filter((n) => n.value > 0);
  const joinPoints = site.copy.aboutJoinPoints.filter((p) => p.trim());

  return (
    <Section id="about" title={site.copy.aboutTitle} intro={site.copy.aboutIntro || undefined}>
      {/* Bento: the story card takes 2×2 on desktop, activities fill the rest */}
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <li className="md:col-span-2 lg:row-span-2">
          <Reveal>
            <div className="on-brand relative isolate flex h-full min-h-[380px] flex-col overflow-hidden rounded-[28px] bg-brand-deep p-7 text-white sm:p-10">
              <span aria-hidden className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-brand" />
              <span aria-hidden className="absolute top-10 right-12 -z-10 hidden h-6 w-6 rotate-12 rounded-md bg-pop sm:block" />

              <p className="inline-block self-start rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
                {site.shortName} at {site.city}
              </p>
              <p className={`mt-6 max-w-[26ch] font-display text-2xl leading-snug font-bold tracking-tight sm:text-4xl ${site.copy.aboutStory ? "" : "mb-10"}`}>
                {site.copy.aboutStatement}
              </p>
              {site.copy.aboutStory && <p className="mt-5 mb-10 max-w-[52ch] text-white/85 sm:text-lg">{site.copy.aboutStory}</p>}

              {numbers.length > 0 && (
                <dl className="mt-auto grid grid-cols-3 items-start gap-4 border-t border-white/20 pt-6 sm:pt-8">
                  {numbers.map((n) => (
                    <div key={n.label} className="flex flex-col-reverse">
                      <dt className="mt-1 text-sm sm:text-base">{n.label}</dt>
                      <dd className="font-display text-5xl leading-none font-extrabold tabular-nums sm:text-7xl">
                        <CountUp value={n.value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </Reveal>
        </li>

        {site.copy.aboutItems.map((item, i) => {
          const Icon = icons[item.icon] ?? CodeIcon;
          return (
            <li key={`${i}-${item.title}`}>
              <Reveal index={i + 1}>
                <article
                  style={accentVars(item.accent)}
                  className="group flex h-full flex-col rounded-[24px] bg-surface p-6 ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-acc-strip text-acc-on transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none">
                    <Icon width={24} height={24} />
                  </span>
                  <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-muted">{item.text}</p>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>

      {/* Mission, vision and why join */}
      {(site.copy.aboutMission || site.copy.aboutVision || joinPoints.length > 0) && (
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {(site.copy.aboutMission || site.copy.aboutVision) && (
            <Reveal>
              <div className="grid h-full gap-5">
                {[
                  { label: "Our mission", text: site.copy.aboutMission, Icon: FlagIcon },
                  { label: "Our vision", text: site.copy.aboutVision, Icon: TrophyIcon },
                ]
                  .filter((b) => b.text)
                  .map(({ label, text, Icon }) => (
                    <article key={label} className="flex flex-col rounded-[24px] bg-tint p-6 sm:p-7">
                      <span className="flex items-center gap-2 text-sm font-semibold tracking-wide text-link uppercase">
                        <Icon width={18} height={18} />
                        {label}
                      </span>
                      <p className="mt-3 font-display text-lg leading-snug font-bold sm:text-xl">{text}</p>
                    </article>
                  ))}
              </div>
            </Reveal>
          )}

          {joinPoints.length > 0 && (
            <Reveal index={1} className="lg:col-span-2">
              <div className="flex h-full flex-col rounded-[24px] bg-surface p-6 ring-1 ring-line sm:p-8">
                <h3 className="text-2xl font-bold sm:text-3xl">{site.copy.aboutJoinTitle}</h3>
                <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 sm:text-lg">
                  {joinPoints.map((point, i) => (
                    <li key={`${i}-${point}`} className="flex items-start gap-3">
                      <span aria-hidden className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pop text-ink-strong">
                        <CheckIcon width={14} height={14} />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-7">
                  <Button href="/#contact" arrow>
                    Join a team
                  </Button>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      )}

      {/* How an event comes together */}
      {site.copy.aboutSteps.length > 0 && (
        <div className="mt-16">
          {site.copy.aboutStepsTitle && <h3 className="text-2xl font-bold sm:text-3xl">{site.copy.aboutStepsTitle}</h3>}
          <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {site.copy.aboutSteps.map((step, i) => (
              <li key={`${i}-${step.title}`}>
                <Reveal index={i}>
                  <div className="h-full border-t-4 border-brand pt-5">
                    <span className="font-display text-5xl leading-none font-extrabold text-link tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <h4 className="mt-3 text-lg font-bold">{step.title}</h4>
                    <p className="mt-1 text-muted">{step.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Section>
  );
}
