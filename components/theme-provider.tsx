"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";

export type Theme =
  | "default"
  | "minimal"
  | "tech-gradient"
  | "brutalism"
  | "gamification"
  | "grid-modular";

const pathToTheme: Record<string, Theme> = {
  "/": "default",
  "/minimal": "minimal",
  "/tech-gradient": "tech-gradient",
  "/brutalism": "brutalism",
  "/gamification": "gamification",
  "/grid-modular": "grid-modular",
};

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "default",
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = pathToTheme[pathname] || "default";

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme === "default" ? "" : theme
    );
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
