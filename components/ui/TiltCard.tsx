"use client";

import { useReducedMotion } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  /** Classes for the card box. Give it the same rounded corners as the card. */
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
}

/**
 * Makes a picture card follow the mouse in 3D with a soft moving light.
 * Mouse only: touch screens and "reduce motion" get a still card.
 */
export function TiltCard({ children, className = "", max = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const reduce = useReducedMotion();

  function setVars(rx: number, ry: number, gx: number, gy: number) {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
      el.style.setProperty("--gx", `${gx}%`);
      el.style.setProperty("--gy", `${gy}%`);
    });
  }

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setVars((0.5 - py) * max, (px - 0.5) * max, px * 100, py * 100);
  }

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={() => setVars(0, 0, 50, 50)} className={`tilt relative ${className}`}>
      {children}
      <span aria-hidden className="tilt-glare" />
    </div>
  );
}
