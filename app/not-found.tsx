import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Rendered for URLs that match no locale at all (e.g. /missing.png), so it
// brings its own <html>. Pages under /fr or /en use app/[lang]/not-found.tsx.

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "404 | Titosy Manankasina",
};

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <main className="mx-auto flex min-h-screen max-w-[1080px] flex-col items-center justify-center px-6 text-center">
          <p className="font-mono text-muted text-xs">404</p>
          <h1 className="mt-3 font-semibold text-3xl tracking-[-0.04em]">
            This page doesn't exist.
          </h1>
          <p lang="fr" className="mt-2 text-muted">
            Cette page n'existe pas.
          </p>
          <div className="mt-8 flex gap-3">
            <a
              href="/en"
              hrefLang="en"
              className="inline-flex h-10 items-center rounded-full bg-fg px-4 font-medium text-bg text-sm transition-opacity hover:opacity-85"
            >
              Back to home
            </a>
            <a
              href="/fr"
              hrefLang="fr"
              lang="fr"
              className="inline-flex h-10 items-center rounded-full border border-line px-4 font-medium text-sm transition-colors hover:border-line-strong hover:bg-subtle"
            >
              Retour à l'accueil
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
