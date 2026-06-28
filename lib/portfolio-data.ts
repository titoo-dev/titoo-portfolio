// ---------------------------------------------------------------------------
// Portfolio data — ported verbatim from the "Portfolio Animated v3" design
// prototype. Asset paths are mapped from the prototype's `assets/` folder to
// the project's `public/` directory.
// ---------------------------------------------------------------------------

export type ExperienceItem = {
  role: string;
  company: string;
  meta: string;
};

export type Career = {
  company: string;
  role: string;
  initial: string;
  period: string;
  type: string;
  location: string;
  current: boolean;
  isEdu?: boolean;
  summary: string;
  responsibilities: string[];
  achievements: string[];
  skills: string[];
};

export type Project = {
  name: string;
  tag: string;
  img: string;
  thumb: string;
  url: string | null;
  github: string | null;
  year: string;
  type: string;
  desc: string;
  overview: string;
  gallery: string[];
  tech: string[];
  highlights: string[];
  stats: { k: string; v: string }[];
};

export type Service = {
  label: string;
  title: string;
  body: string;
  features: string[];
};

export type StackItem = { name: string; logo: string };

export const PROFILE = {
  name: "Titosy Manankasina",
  email: "dev.titosy@gmail.com",
  photo: "/photo.jpg",
  github: "https://github.com/titoo-dev",
  linkedin: "https://www.linkedin.com/in/titosy-manankasina",
  spotify: "https://open.spotify.com/",
  location: {
    city: "ANTANANARIVO",
    country: "MADAGASCAR",
    coords: "18.8792° S, 47.5079° E",
  },
  now: {
    title: "SaaS de gestion de financement",
    company: "@ Fluentech",
    desc: "Micro-frontends Next.js, système RAG & développement agentic avec Claude Code.",
  },
} as const;

export const experience: ExperienceItem[] = [
  {
    role: "Développeur JS / Flutter / Kotlin",
    company: "Fluentech",
    meta: "2025 — Aujourd'hui · Hybride",
  },
  {
    role: "Développeur Fullstack Javascript",
    company: "PUSH-IT",
    meta: "2025 · Hybride",
  },
  {
    role: "Développeur Javascript",
    company: "Bocasay",
    meta: "2022 — 2025 · Hybride",
  },
  {
    role: "Stage Dev JS & Flutter",
    company: "Flit Soft",
    meta: "2022 · À distance",
  },
];

export const careers: Career[] = [
  {
    company: "Fluentech",
    role: "Développeur JS / Flutter / Kotlin",
    initial: "F",
    period: "Oct. 2025 — Aujourd'hui",
    type: "Hybride",
    location: "Antananarivo, Madagascar",
    current: true,
    summary:
      "Mise en place d'une solution SaaS pour la gestion de financement.",
    responsibilities: [
      "Intégration de plusieurs modules micro-frontend avec Next.js.",
      "Intégration des designs / tokens Figma avec un Storybook pour tester les composants réutilisables.",
      "Configuration du serveur de déploiement avec Dokploy.",
      "Gestion des workflows avec Inngest.",
      "Développement d'API backend avec Nest.js.",
      "Développement agentic avec Claude Code.",
      "Gestion et optimisation du contexte avec Byterover, GSD.",
      "Mise en place d'un système RAG pour guider les utilisateurs sur la plateforme.",
    ],
    achievements: [],
    skills: [
      "Next.js",
      "Nest.js",
      "PostgreSQL",
      "Inngest",
      "Langchain",
      "LangGraph",
      "Claude Code",
      "GSD",
      "Spec Driven Dev",
    ],
  },
  {
    company: "PUSH-IT",
    role: "Développeur Fullstack Javascript",
    initial: "P",
    period: "Juil. 2025 — Oct. 2025",
    type: "Hybride",
    location: "Antananarivo, Madagascar",
    current: false,
    summary:
      "Développement d'une application de gestion de licences logicielles.",
    responsibilities: [
      "Intégration de Cryptolens pour la gestion et la sécurisation des licences.",
      "Gestion des mises à jour logicielles avec Mender.io.",
      "Intégration de la facturation et des paiements via Zoho Book.",
      "Développement du frontend avec Next.js.",
      "Conception du backend avec Express, PostgreSQL, TypeORM et GraphQL.",
      "Organisation du projet en monorepo pour faciliter la maintenance.",
    ],
    achievements: [],
    skills: [
      "Next.js",
      "Express",
      "PostgreSQL",
      "TypeORM",
      "GraphQL",
      "Mender.io",
      "Zoho Book",
      "Cryptolens",
      "GitLab CI/CD",
    ],
  },
  {
    company: "Bocasay",
    role: "Développeur Javascript",
    initial: "B",
    period: "Juil. 2022 — Juil. 2025",
    type: "Hybride",
    location: "Antananarivo, Madagascar",
    current: false,
    summary:
      "Développement et maintenance d'une application de gestion de la conformité réglementaire des produits chimiques, cosmétiques, biocides et dispositifs médicaux, en collaboration avec des équipes interfonctionnelles.",
    responsibilities: [
      "Développement des interfaces utilisateurs avec React, ExtJS et Flutter (version mobile).",
      "Intégration des fonctionnalités front-end avec les données serveur via GraphQL.",
      "Participation aux daily meetings et plannings de sprint pour aligner les objectifs.",
    ],
    achievements: [
      "Amélioration de l'efficacité des workflows internes de +30 %.",
      "Implémentation réussie d'une fonctionnalité de gestion des données réglementaires.",
      "Formation des nouveaux membres de l'équipe sur les technologies du projet.",
    ],
    skills: [
      "ReactJS",
      "ExtJS",
      "Flutter",
      "PostgreSQL",
      "GraphQL",
      "GitLab CI/CD",
    ],
  },
  {
    company: "Flit Soft",
    role: "Stage — Développeur JS & Flutter",
    initial: "FS",
    period: "Mars 2022 — Juin 2022",
    type: "À distance",
    location: "Antananarivo, Madagascar",
    current: false,
    summary:
      "Membre d'une équipe chargée des intégrations et outils pour développeurs, avec pour mission d'améliorer et de simplifier l'expérience des équipes techniques.",
    responsibilities: [
      "Intégration d'un paiement Mvola dans une application de partage de voiture / taxi.",
      "Création d'un générateur de code en Dart pour faciliter le développement.",
      "Participation aux réunions et présentation de propositions à l'entreprise.",
    ],
    achievements: [
      "Optimisation des performances d'une application mobile.",
      "Développement et maintenance d'apps mobiles avec Flutter, Dart et Node.js.",
    ],
    skills: ["Flutter", "Dart", "Javascript", "GitHub Actions", "Firebase"],
  },
  {
    company: "ISPM",
    role: "Bachelor — Ingénierie logicielle",
    initial: "🎓",
    period: "2018 — 2022",
    type: "Formation",
    location: "Antananarivo, Madagascar",
    current: false,
    isEdu: true,
    summary:
      "Institut Supérieur Polytechnique de Madagascar. Diplôme d'ingénierie logicielle, moyenne de 3.8 / 4.",
    responsibilities: [],
    achievements: [],
    skills: [
      "Algorithmique",
      "Génie logiciel",
      "Bases de données",
      "Réseaux",
      "Web",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "Tononkira",
    tag: "Flutter · Web · Search",
    img: "/images/tononkira/tononkira_1.png",
    thumb: "/images/tononkira/tononkira_2.png",
    url: "https://tononkira.titosy.dev/",
    github: null,
    year: "2024",
    type: "Application Web & Mobile",
    desc: "Découverte des paroles de chansons malgaches — 15 000+ titres, 2 300 artistes, recherche intelligente & accès hors-ligne.",
    overview:
      "Plateforme complète dédiée à la découverte et l'exploration des paroles de chansons malgaches, offrant un accès à plus de 15 000 chansons de 2 300 artistes avec recherche intelligente, personnalisation et accès hors ligne.",
    gallery: [
      "/images/tononkira/tononkira_1.png",
      "/images/tononkira/tononkira_2.png",
      "/images/tononkira/tononkira_3.png",
      "/images/tononkira/tononkira_4.png",
    ],
    tech: ["Flutter", "Dart", "Next.js", "Search Engine", "Offline-first"],
    highlights: [
      "Application mobile Android avec Flutter offrant un accès hors ligne complet aux paroles.",
      "Moteur de recherche performant permettant de trouver des chansons par paroles, artiste ou titre.",
      "Système de favoris et de playlists personnalisées pour une expérience optimale.",
      "Optimisation des performances pour une application légère et rapide sur tous les appareils.",
      "Base de données de plus de 15 000 chansons et 2 300 artistes malgaches.",
    ],
    stats: [
      { k: "15 000+", v: "Chansons" },
      { k: "2 300", v: "Artistes" },
      { k: "100%", v: "Hors-ligne" },
    ],
  },
  {
    name: "Chantastik",
    tag: "Remotion · Web Audio API",
    img: "/images/chantastik/chantastik_1.png",
    thumb: "/images/chantastik/chantastik_2.png",
    url: "https://chantastik.titosy.dev/",
    github: "https://github.com/titoo-dev/chantastik",
    year: "2024",
    type: "Application Web",
    desc: "Crée des vidéos lyriques animées depuis un fichier audio, avec synchronisation précise et export de fichiers LRC.",
    overview:
      "Une application qui permet de créer de superbes vidéos de paroles à partir de fichiers audio, avec de magnifiques animations et des effets visuels personnalisables.",
    gallery: [
      "/images/chantastik/chantastik_1.png",
      "/images/chantastik/chantastik_2.png",
      "/images/chantastik/chantastik_3.png",
      "/images/chantastik/chantastik_4.png",
    ],
    tech: ["Remotion", "Web Audio API", "React", "TypeScript", "LRC"],
    highlights: [
      "Rendu vidéo des paroles animées propulsé par Remotion.",
      "Web Audio API pour synchroniser précisément l'audio avec les animations.",
      "Système d'annotation des lyrics avec interface intuitive pour le timing.",
      "Génération automatique de fichiers LRC pour la compatibilité avec d'autres lecteurs.",
    ],
    stats: [
      { k: "Frame", v: "Sync parfaite" },
      { k: "LRC", v: "Export" },
      { k: "OSS", v: "Open source" },
    ],
  },
  {
    name: "MAGAPE",
    tag: "Next.js · TypeScript · Tailwind",
    img: "/images/magape/magape_1.png",
    thumb: "/images/magape/magape_2.png",
    url: "https://megape.vercel.app/",
    github: null,
    year: "2024",
    type: "Plateforme communautaire",
    desc: "Plateforme communautaire chrétienne francophone — podcasts, enseignements bibliques & boutique en ligne.",
    overview:
      "Plateforme dédiée à rassembler la communauté chrétienne francophone à travers des ressources enrichissantes, des contenus audiovisuels et des produits inspirants, créant des ponts d'unité entre les chrétiens.",
    gallery: [
      "/images/magape/magape_1.png",
      "/images/magape/magape_2.png",
      "/images/magape/magape_3.png",
      "/images/magape/magape_4.png",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "CMS", "E-commerce"],
    highlights: [
      "Plateforme complète avec Next.js et TypeScript pour la francophonie chrétienne.",
      "Système de gestion de contenu pour podcasts, émissions et enseignements bibliques.",
      "Boutique en ligne intégrée pour les produits MAGAPE (maillots, ebooks, cahiers).",
      "Interface moderne et responsive avec Tailwind CSS.",
      "Cahier Magape Kids, un outil éducatif centré sur la Bible pour les enfants.",
    ],
    stats: [
      { k: "CMS", v: "Contenus" },
      { k: "Shop", v: "Boutique" },
      { k: "FR", v: "Francophone" },
    ],
  },
  {
    name: "Okani Survey",
    tag: "Next.js · Mobile · Gov",
    img: "/images/okani-survey/okani_1.png",
    thumb: "/images/okani-survey/okani_2.png",
    url: "https://okani-survey.vercel.app/",
    github: null,
    year: "2025",
    type: "Plateforme gouvernementale",
    desc: "Plateforme de sondage gouvernementale (Gabon) évaluant le service public foncier. Web + app cross-platform.",
    overview:
      "Plateforme de sondage gouvernementale officielle évaluant la satisfaction des usagers du service public foncier au Gabon, mandatée par la DGCBF dans le cadre de la modernisation de l'administration publique.",
    gallery: [
      "/images/okani-survey/okani_1.png",
      "/images/okani-survey/okani_2.png",
      "/images/okani-survey/okani_3.png",
    ],
    tech: ["Next.js", "TypeScript", "Cross-platform", "Tailwind CSS", "Mobile"],
    highlights: [
      "Plateforme web interactive avec Next.js pour recueillir les retours des usagers.",
      "Application mobile cross-platform disponible sur App Store et Google Play.",
      "Processus de sondage simplifié en 6 étapes couvrant le parcours foncier (ANUTTC).",
      "Système de collecte de données anonyme et sécurisé garantissant la confidentialité.",
      "Déploiement ciblé : Libreville, Lambaréné et Mouila.",
    ],
    stats: [
      { k: "6", v: "Étapes" },
      { k: "5-10 min", v: "Durée" },
      { k: "3", v: "Villes" },
    ],
  },
];

export const services: Service[] = [
  {
    label: "Web",
    title: "Développement Web",
    body: "Applications web modernes et performantes avec React, Next.js et TypeScript.",
    features: [
      "React / Next.js",
      "Sites responsives",
      "Progressive Web Apps",
      "Intégration API",
    ],
  },
  {
    label: "Mobile",
    title: "Applications Mobile",
    body: "Applications cross-platform avec Flutter. Une expérience fluide sur iOS et Android.",
    features: [
      "Apps Flutter",
      "UI/UX mobile",
      "Intégration Firebase",
      "App Store & Play Store",
    ],
  },
  {
    label: "Design",
    title: "Design UI/UX",
    body: "Interfaces élégantes et accessibles avec Figma. Des designs modernes qui captivent.",
    features: [
      "Prototypage Figma",
      "Design System",
      "Interface responsive",
      "Accessibilité",
    ],
  },
  {
    label: "Conseil",
    title: "Consulting & Formation",
    body: "Accompagnement technique et formation de vos équipes sur les technologies modernes.",
    features: [
      "Audit technique",
      "Formation React/Flutter",
      "Code review",
      "Best practices",
    ],
  },
];

export const stackA: StackItem[] = [
  { name: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs/1c1c1c" },
  { name: "React", logo: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "Node.js", logo: "https://cdn.simpleicons.org/nodedotjs/5FA04E" },
  { name: "Nest.js", logo: "https://cdn.simpleicons.org/nestjs/E0234E" },
  { name: "GraphQL", logo: "https://cdn.simpleicons.org/graphql/E10098" },
  { name: "PostgreSQL", logo: "https://cdn.simpleicons.org/postgresql/4169E1" },
  { name: "Tailwind", logo: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
  { name: "Express", logo: "https://cdn.simpleicons.org/express/1c1c1c" },
  { name: "TypeORM", logo: "https://cdn.simpleicons.org/typeorm/FE0803" },
];

export const stackB: StackItem[] = [
  { name: "Flutter", logo: "https://cdn.simpleicons.org/flutter/02569B" },
  { name: "Dart", logo: "https://cdn.simpleicons.org/dart/0175C2" },
  { name: "Kotlin", logo: "https://cdn.simpleicons.org/kotlin/7F52FF" },
  { name: "React Native", logo: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "Firebase", logo: "https://cdn.simpleicons.org/firebase/DD2C00" },
  { name: "Figma", logo: "https://cdn.simpleicons.org/figma/F24E1E" },
  { name: "Docker", logo: "https://cdn.simpleicons.org/docker/2496ED" },
  { name: "LangGraph", logo: "https://cdn.simpleicons.org/langchain/1C3C3C" },
  { name: "Claude Code", logo: "https://cdn.simpleicons.org/claude/D97757" },
  { name: "Vercel", logo: "https://cdn.simpleicons.org/vercel/1c1c1c" },
];

export const interests: string[] = [
  "🎸 Guitare",
  "🎮 Jeux vidéo",
  "🍳 Cuisine",
  "🤖 IA",
  "⛓ Blockchain",
];

// Coverflow album art for the music card (deterministic placeholder seeds,
// matching the prototype).
export const albums: string[] = [
  "https://picsum.photos/seed/titoo-cover-1/260/260",
  "https://picsum.photos/seed/titoo-cover-2/260/260",
  "https://picsum.photos/seed/titoo-cover-3/260/260",
  "https://picsum.photos/seed/titoo-cover-4/260/260",
  "https://picsum.photos/seed/titoo-cover-5/260/260",
];

// Coverflow slot transforms (5 positions, centre is index 2).
export const slots = [
  { x: -116, y: 28, deg: -28, scale: 0.8, z: 1, op: 0.9 },
  { x: -56, y: 10, deg: -14, scale: 0.92, z: 3, op: 1 },
  { x: 0, y: -8, deg: 0, scale: 1.0, z: 6, op: 1 },
  { x: 56, y: 10, deg: 14, scale: 0.92, z: 3, op: 1 },
  { x: 116, y: 28, deg: 28, scale: 0.8, z: 1, op: 0.9 },
] as const;
