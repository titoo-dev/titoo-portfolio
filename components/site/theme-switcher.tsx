"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MonitorIcon, MoonIcon, SunIcon } from "./icons";

type Theme = "system" | "light" | "dark";

const OPTIONS = [
  { value: "system", label: "Thème système", Icon: MonitorIcon },
  { value: "light", label: "Thème clair", Icon: SunIcon },
  { value: "dark", label: "Thème sombre", Icon: MoonIcon },
] as const;

export function ThemeSwitcher() {
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
      <legend className="sr-only">Thème</legend>
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
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
