"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/ui/icons";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the email link above still works.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-pop hover:text-ink-strong"
    >
      {copied ? <CheckIcon width={16} height={16} /> : <CopyIcon width={16} height={16} />}
      <span aria-live="polite">{copied ? "Email copied" : "Copy email"}</span>
    </button>
  );
}
