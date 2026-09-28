"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex h-11 items-center gap-3 rounded-full border border-line bg-bg pr-2 pl-5 font-mono text-sm transition-colors hover:border-line-strong"
    >
      {email}
      <span className="grid size-7 place-items-center rounded-full bg-subtle text-muted transition-colors group-hover:text-fg">
        {copied ? (
          <CheckIcon width={14} height={14} className="text-success" />
        ) : (
          <CopyIcon width={14} height={14} />
        )}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Adresse copiée" : ""}
      </span>
    </button>
  );
}
