import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Landscape } from "@/components/sky/landscape";
import { Sky } from "@/components/sky/sky";
import { getDictionary } from "@/lib/dictionaries";
import {
  isLocale,
  type Locale,
  languageAlternates,
  locales,
  siteUrl,
} from "@/lib/i18n";
import "../globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Applies the stored theme before first paint so there is no flash, and
// whether the sun is up (`data-sky`), which the "auto" theme follows: from
// the last sunrise/sunset <Sky> saved, else 6:00-18:00 on the visitor's clock.
// The last live scene's weather and season (`sky-attrs`, under 6 hours old)
// are restored too, so the first frame already has the right colors.
const themeScript = `history.scrollRestoration="manual";(function(){var h=document.documentElement,d=h.dataset,n=Date.now(),D=864e5,s=null,a=null,x=new Date();x.setHours(6,0,0,0);var r=x.getTime(),e=r+D/2;try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.theme=t;if(localStorage.getItem("sky")==="off")d.skyOff="";s=JSON.parse(localStorage.getItem("sky-sun")||"null");a=JSON.parse(localStorage.getItem("sky-attrs")||"null")}catch(_){}if(s&&s.r&&s.s){var k=Math.round((n-(s.r+s.s)/2)/D)*D;r=s.r+k;e=s.s+k}if(a&&a.attrs&&n-a.at<2.16e7)for(var m in a.attrs)h.setAttribute(m,a.attrs[m]);d.sky=n>r&&n<e?"day":"night";if(!a||d.skyPhase==="day"!==(d.sky==="day"))d.skyPhase=d.sky})()`;

type Props = { params: Promise<{ lang: string }> };

async function getLocale(params: Props["params"]): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  const url = `${siteUrl}/${lang}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: meta.title,
      template: "%s | Titosy Manankasina",
    },
    description: meta.description,
    keywords: meta.keywords,
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
      canonical: `/${lang}`,
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      locale: meta.ogLocale,
      alternateLocale: locales
        .filter((l) => l !== lang)
        .map((l) => getDictionary(l).meta.ogLocale),
      url,
      siteName: meta.siteName,
      title: meta.title,
      description: meta.ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.twitterDescription,
    },
  };
}

function jsonLd(lang: Locale) {
  const { meta } = getDictionary(lang);
  const url = `${siteUrl}/${lang}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Titosy Manankasina",
        url: siteUrl,
        email: "dev.titosy@gmail.com",
        jobTitle: meta.jobTitle,
        description: meta.personDescription,
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
          "PostgreSQL",
          "SQL",
          "GraphQL",
          "DevOps",
          "Kubernetes",
          "Terraform",
          "Figma",
        ],
        knowsLanguage: ["fr", "en"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: meta.siteName,
        description: meta.websiteDescription,
        author: { "@id": `${siteUrl}/#person` },
        inLanguage: [...locales],
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}#webpage`,
        url,
        name: meta.title,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#person` },
        mainEntity: { "@id": `${siteUrl}/#person` },
        description: meta.pageDescription,
        inLanguage: lang,
      },
    ],
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Props["params"];
}>) {
  const lang = await getLocale(params);

  return (
    <html lang={lang} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: runs before paint: restores the saved theme and disables reload scroll restoration (which jumped the page ~100px down)
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }}
        />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <Sky labels={getDictionary(lang).sky} />
        <Header lang={lang} />
        {children}
        <Footer lang={lang} />
        <Landscape hoot={getDictionary(lang).sky.hoot} />
        <Analytics />
      </body>
    </html>
  );
}
