"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { navLinks } from "./nav-links";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-pop hover:text-ink-strong"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full border-t border-white/25 bg-brand"
      >
        <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-3 font-display text-2xl font-bold text-white hover:bg-pop hover:text-ink-strong"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
