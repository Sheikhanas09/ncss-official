import Image from "next/image";
import type { FeedbackEntry } from "@/types";
import { initials } from "@/lib/format";
import { QuoteIcon } from "@/components/ui/icons";

export function FeedbackQuote({ feedback, className = "" }: { feedback: FeedbackEntry; className?: string }) {
  return (
    <figure className={`flex h-full flex-col rounded-[24px] bg-surface p-6 ring-1 ring-line sm:p-7 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-xl bg-pop text-ink-strong">
          <QuoteIcon />
        </span>
        <span className="relative h-9 w-24 rounded-lg bg-white ring-1 ring-line">
          <Image src={feedback.sponsorLogo} alt={`${feedback.sponsorName} logo`} fill sizes="96px" className="object-contain p-1.5" />
        </span>
      </div>

      <blockquote className="mt-5 flex-1 leading-relaxed sm:text-lg">
        <p>{feedback.quote}</p>
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4 text-sm">
        <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-deep font-bold text-white">
          {initials(feedback.personName)}
        </span>
        <span>
          <span className="block font-semibold">{feedback.personName}</span>
          <span className="text-muted">{feedback.personTitle}</span>
        </span>
      </figcaption>
    </figure>
  );
}
