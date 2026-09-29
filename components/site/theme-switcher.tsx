"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MonitorIcon, MoonIcon, SunIcon } from "./icons";

type Theme = "system" | "light" | "dark";

const OPTIONS = [
  { value: "system", Icon: MonitorIcon },
  { value: "light", Icon: SunIcon },
  { value: "dark", Icon: MoonIcon },
] as const;

type Labels = Record<Theme, string> & { label: string };

export function ThemeSwitcher({ labels }: { labels: Labels }) {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    if (t === "light" || t === "dark") setTheme(t);
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    const root = document.documentElement;
    try {
      if (next === "system") {
        delete root.dataset.theme;
        localStorage.removeItem("theme");
      } else {
        root.dataset.theme = next;
        localStorage.setItem("theme", next);
      }
    } catch {
      // Storage can be unavailable (private mode); the theme still applies.
    }
  }

  return (
    <fieldset className="flex items-center gap-0.5 rounded-full border border-line p-0.5">
      <legend className="sr-only">{labels.label}</legend>
      {OPTIONS.map(({ value, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={labels[value]}
          aria-pressed={theme === value}
          onClick={() => apply(value)}
          className={cn(
            "grid size-7 place-items-center rounded-full text-muted transition-colors hover:text-fg",
            theme === value &&
              "bg-subtle text-fg shadow-[0_0_0_1px_var(--line)]",
          )}
        >
          <Icon width={14} height={14} />
        </button>
      ))}
    </fieldset>
  );
}
