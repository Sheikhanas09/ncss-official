"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** The single page-load moment: the team photo and the title arrive together. */
export function HeroReveal({ children, part, className }: { children: ReactNode; part: "title" | "photo"; className?: string }) {
  const reduce = useReducedMotion();
  // The photo settles from a slight zoom; the title rises into place
  const from = part === "title" ? { opacity: 0, y: 28 } : { opacity: 0, scale: 1.06 };

  return (
    <motion.div
      className={className}
      initial={reduce ? false : from}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: part === "photo" ? 1 : 0.7, ease: [0.2, 0.8, 0.2, 1], delay: part === "title" ? 0.1 : 0 }}
    >
      {children}
    </motion.div>
  );
}
