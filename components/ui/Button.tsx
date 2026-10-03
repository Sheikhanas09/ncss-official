import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

type Variant = "primary" | "outline" | "light" | "outline-light";

const variants: Record<Variant, string> = {
  // On paper / surface
  primary: "bg-brand-deep text-white hover:bg-pop hover:text-ink-strong",
  outline: "border-2 border-ink text-ink hover:border-pop hover:bg-pop hover:text-ink-strong",
  // On teal areas
  light: "bg-white text-brand-deep hover:bg-pop hover:text-ink-strong",
  "outline-light": "border-2 border-white text-white hover:border-pop hover:bg-pop hover:text-ink-strong",
};

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
}

export function Button({ href, children, variant = "primary", arrow = false }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors ${variants[variant]}`}
    >
      {children}
      {arrow && <ArrowRightIcon />}
    </Link>
  );
}
