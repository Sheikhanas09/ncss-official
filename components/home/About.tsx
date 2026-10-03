import type { ComponentType, SVGProps } from "react";
import type { AboutIcon } from "@/types";
import { getSiteInfo, getStats } from "@/lib/data";
import { accentVars } from "@/lib/accent";
import { CountUp } from "@/components/ui/CountUp";
import { CodeIcon, HeartHandIcon, MicIcon, ToolsIcon, TrophyIcon } from "@/components/ui/icons";
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

  return (
    <Section id="about" title={site.copy.aboutTitle}>
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
              <p className="mt-6 mb-10 max-w-[26ch] font-display text-2xl leading-snug font-bold tracking-tight sm:text-4xl">
                {site.copy.aboutStatement}
              </p>

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
    </Section>
  );
}
