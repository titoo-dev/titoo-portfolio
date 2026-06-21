import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#dcdad3",
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
        className={`${schibstedGrotesk.variable} ${spaceMono.variable} antialiased overflow-x-hidden`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
