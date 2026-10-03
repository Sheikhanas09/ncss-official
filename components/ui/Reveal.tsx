"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Cards rise in one after another as they scroll into view. */
export function Reveal({ children, index = 0, className = "h-full" }: { children: ReactNode; index?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: (index % 4) * 0.08 }}
    >
      {children}
    </motion.div>
  );
}
