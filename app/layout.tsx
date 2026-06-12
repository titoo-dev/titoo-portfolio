import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const departureMono = localFont({
  src: "./fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#b2b1b1",
};

const siteUrl = "https://titosy.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Titosy Manankasina — Développeur Fullstack JavaScript & Flutter",
    template: "%s | Titosy Manankasina",
  },
  description:
    "Développeur Fullstack JavaScript & Flutter avec 4+ ans d'expérience. Spécialisé en React, Next.js, TypeScript, Flutter et Node.js. Basé à Madagascar, disponible en remote.",
  keywords: [
    "Titosy Manankasina",
    "développeur fullstack",
    "développeur JavaScript",
    "développeur Flutter",
    "React developer",
    "Next.js developer",
    "TypeScript developer",
    "développeur mobile",
    "Flutter Madagascar",
    "fullstack developer Madagascar",
    "développeur React",
    "développeur freelance",
    "web developer",
    "front-end developer",
    "Node.js developer",
    "portfolio développeur",
  ],
  authors: [{ name: "Titosy Manankasina", url: siteUrl }],
  creator: "Titosy Manankasina",
  publisher: "Titosy Manankasina",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: "Titosy Manankasina — Portfolio",
    title: "Titosy Manankasina — Développeur Fullstack JavaScript & Flutter",
    description:
      "Développeur Fullstack JavaScript & Flutter avec 4+ ans d'expérience. React, Next.js, TypeScript, Flutter, Node.js. Disponible en remote.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Titosy Manankasina — Développeur Fullstack JavaScript & Flutter",
    description:
      "Développeur Fullstack JavaScript & Flutter avec 4+ ans d'expérience. React, Next.js, TypeScript, Flutter. Disponible en remote.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Titosy Manankasina",
      url: siteUrl,
      email: "dev.titosy@gmail.com",
      jobTitle: "Développeur Fullstack JavaScript & Flutter",
      description:
        "Développeur Fullstack JavaScript & Flutter avec 4+ ans d'expérience en développement web et mobile. Spécialisé en React, Next.js, TypeScript et Flutter.",
      image: `${siteUrl}/photo.jpg`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Antananarivo",
        addressCountry: "MG",
      },
      sameAs: [
        "https://www.linkedin.com/in/titosy-manankasina",
        "https://github.com/titoo-dev",
      ],
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Flutter",
        "Dart",
        "Node.js",
        "Tailwind CSS",
        "MySQL",
        "Figma",
      ],
      knowsLanguage: ["fr", "en"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Titosy Manankasina — Portfolio",
      description:
        "Portfolio de Titosy Manankasina, Développeur Fullstack JavaScript & Flutter",
      author: { "@id": `${siteUrl}/#person` },
      inLanguage: ["fr", "en"],
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "Titosy Manankasina — Développeur Fullstack JavaScript & Flutter",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#person` },
      mainEntity: { "@id": `${siteUrl}/#person` },
      description:
        "Portfolio professionnel de Titosy Manankasina — Développeur Fullstack JavaScript & Flutter avec 4+ ans d'expérience.",
      inLanguage: "fr",
    },
    {
      "@type": "SiteNavigationElement",
      "@id": `${siteUrl}/#navigation`,
      name: [
        "À propos",
        "Services",
        "Expérience",
        "Projets",
        "Compétences",
        "Formation",
      ],
      url: [
        `${siteUrl}/#a-propos`,
        `${siteUrl}/#services`,
        `${siteUrl}/#experience`,
        `${siteUrl}/#projets`,
        `${siteUrl}/#competences`,
        `${siteUrl}/#formation`,
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${departureMono.variable} antialiased overflow-x-hidden`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
