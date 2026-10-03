"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { ImageRef } from "@/types";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/ui/icons";

interface LightboxProps {
  images: ImageRef[];
  /** Index of the open photo, or null when closed. */
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

const controlClass =
  "flex h-12 w-12 items-center justify-center rounded-full bg-surface text-ink transition-colors hover:bg-pop hover:text-ink-strong";

export function Lightbox({ images, index, onClose, onChange }: LightboxProps) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const count = images.length;

  useEffect(() => {
    if (index === null) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onChange((index + 1) % count);
      else if (e.key === "ArrowLeft") onChange((index - 1 + count) % count);
      else if (e.key === "Tab") {
        // Keep keyboard focus inside the viewer
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, count, onClose, onChange]);

  const image = index !== null ? images[index] : undefined;
  const fade = { duration: reduce ? 0 : 0.2 };

  return (
    <AnimatePresence>
      {open && image && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-50 flex flex-col bg-ink-strong/95 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
        >
          <div className="flex items-center justify-between gap-4 p-3 sm:p-5">
            <p className="text-sm tabular-nums" aria-live="polite">
              Photo {index! + 1} of {count}
            </p>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo viewer" className={controlClass}>
              <CloseIcon />
            </button>
          </div>

          {/* Click the dark area around the photo to close */}
          <div className="relative flex-1" onClick={onClose}>
            <motion.div
              key={image.src}
              className="absolute inset-3 sm:inset-x-20 sm:inset-y-4"
              initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-contain" onClick={(e) => e.stopPropagation()} />
            </motion.div>
          </div>

          <div className="flex items-center justify-between gap-4 p-3 sm:p-5">
            <button type="button" onClick={() => onChange((index! - 1 + count) % count)} aria-label="Previous photo" className={controlClass}>
              <ChevronLeftIcon />
            </button>
            <p className="line-clamp-2 text-center text-sm">{image.alt}</p>
            <button type="button" onClick={() => onChange((index! + 1) % count)} aria-label="Next photo" className={controlClass}>
              <ChevronRightIcon />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
