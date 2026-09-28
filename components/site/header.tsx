import Link from "next/link";
import { PROFILE } from "@/lib/portfolio-data";
import { GithubIcon } from "./icons";
import { Logo } from "./logo";

const NAV = [
  { href: "/#projets", label: "Projets" },
  { href: "/#experience", label: "Expérience" },
  { href: "/#stack", label: "Stack" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-line border-b bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-medium text-sm tracking-tight"
        >
          <Logo />
          <span>Titosy Manankasina</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-subtle hover:text-fg md:block"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="rounded-md p-2 text-muted transition-colors hover:bg-subtle hover:text-fg"
          >
            <GithubIcon />
          </a>
          <Link
            href="/#contact"
            className="ml-2 inline-flex h-8 items-center rounded-full bg-fg px-3.5 font-medium text-bg text-sm transition-opacity hover:opacity-85"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
