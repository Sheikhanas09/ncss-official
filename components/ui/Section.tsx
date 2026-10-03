import type { ReactNode } from "react";
import { Container } from "./Container";

type Tone = "paper" | "surface" | "brand";

const tones: Record<Tone, string> = {
  paper: "border-t border-line bg-paper text-ink",
  surface: "border-t border-line bg-surface text-ink",
  brand: "on-brand bg-brand-deep text-white",
};

interface SectionProps {
  id: string;
  title: string;
  intro?: ReactNode;
  /** Right side of the heading row, e.g. a "See all" button. */
  action?: ReactNode;
  tone?: Tone;
  children: ReactNode;
}

export function Section({ id, title, intro, action, tone = "paper", children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-20 py-16 sm:py-24 ${tones[tone]}`}>
      <Container>
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[65ch]">
            <h2 id={headingId} className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {title}
            </h2>
            {intro && <div className={`mt-4 text-lg ${tone === "brand" ? "text-white" : "text-muted"}`}>{intro}</div>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
        {children}
      </Container>
    </section>
  );
}
