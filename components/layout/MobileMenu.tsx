"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, InstagramIcon, MailIcon } from "@/components/ui/icons";
import { navLinks } from "./nav-links";

interface MobileMenuProps {
  email: string;
  instagram: { handle: string; url: string };
}

/** Full screen menu under the navbar on phones and tablets. */
export function MobileMenu({ email, instagram }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    // Close if the screen grows to desktop width, where the menu button is hidden
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onResize = () => desktop.matches && setOpen(false);
    // Stop the page scrolling behind the menu
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);
  const bar = "absolute left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-current transition duration-300 motion-reduce:transition-none";

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-pop hover:text-ink-strong ${
          open ? "bg-white/15 text-white" : "text-white"
        }`}
      >
        {/* Three bars that turn into a cross */}
        <span aria-hidden className={`${bar} ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[15px]"}`} />
        <span aria-hidden className={`${bar} top-1/2 -translate-y-1/2 ${open ? "scale-x-0 opacity-0" : ""}`} />
        <span aria-hidden className={`${bar} ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[15px]"}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Main"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="on-brand fixed inset-x-0 top-16 bottom-0 isolate flex flex-col overflow-y-auto overscroll-contain bg-brand-deep text-white"
          >
            {/* Same shapes as the About card */}
            <span aria-hidden className="pointer-events-none absolute -right-28 -bottom-28 -z-10 h-80 w-80 rounded-full bg-brand" />
            <span aria-hidden className="pointer-events-none absolute right-10 bottom-52 -z-10 h-6 w-6 rotate-12 rounded-md bg-pop" />

            <p className="mx-auto w-full max-w-6xl px-6 pt-6 text-xs font-semibold tracking-[0.2em] text-white/60 uppercase sm:px-8">Menu</p>
            <ul className="mx-auto w-full max-w-6xl px-4 pt-2 sm:px-6">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: reduce ? 0 : 0.05 + i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
                  className="border-b border-white/10 last:border-b-0"
                >
                  <Link
                    href={link.href}
                    onClick={close}
                    className="group flex items-center gap-4 rounded-2xl px-2 py-3.5 transition-colors hover:bg-white/10"
                  >
                    <span className="w-6 text-sm font-semibold text-white/50 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-display text-2xl font-bold tracking-tight">{link.label}</span>
                    <span
                      aria-hidden
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition duration-300 group-hover:bg-pop group-hover:text-ink-strong group-active:bg-pop group-active:text-ink-strong"
                    >
                      <ArrowRightIcon width={18} height={18} />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: reduce ? 0 : 0.35 }}
              className="mx-auto mt-auto flex w-full max-w-6xl items-center gap-3 px-6 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8"
            >
              <Link
                href="/#contact"
                onClick={close}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-pop px-6 font-semibold text-ink-strong transition-colors hover:bg-white"
              >
                Get in touch <ArrowRightIcon width={18} height={18} />
              </Link>
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${instagram.handle}`}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/30 transition-colors hover:border-pop hover:bg-pop hover:text-ink-strong"
              >
                <InstagramIcon />
              </a>
              <a
                href={`mailto:${email}`}
                aria-label={`Email ${email}`}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/30 transition-colors hover:border-pop hover:bg-pop hover:text-ink-strong"
              >
                <MailIcon />
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
