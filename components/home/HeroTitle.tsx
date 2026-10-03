"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";

/** The hero heading, with each word rising into place one after another. */
export function HeroTitle({ text, id, className }: { text: string; id: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <h1 id={id} className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 + i * 0.09 }}
            >
              {word}
            </motion.span>
          </span>
          {/* The space sits outside the clipped box so words never run together */}
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </h1>
  );
}
