// ---------------------------------------------------------------------------
// Interface strings. Portfolio content (projects, careers...) lives in
// portfolio-data.ts; this file holds everything else. `en` must match the
// shape of `fr`, so a missing translation is a type error.
// ---------------------------------------------------------------------------

import type { Locale } from "./i18n";

const fr = {
  meta: {
    title: "Titosy Manankasina | Développeur Fullstack JavaScript & Flutter",
    description:
      "Développeur Fullstack JavaScript & Flutter avec 4+ ans d'expérience. Spécialisé en React, Next.js, TypeScript, Flutter et Node.js. Basé à Madagascar, disponible en remote.",
    ogDescription:
      "Développeur Fullstack JavaScript & Flutter avec 4+ ans d'expérience. React, Next.js, TypeScript, Flutter, Node.js. Disponible en remote.",
    twitterDescription:
      "Développeur Fullstack JavaScript & Flutter avec 4+ ans d'expérience. React, Next.js, TypeScript, Flutter. Disponible en remote.",
    siteName: "Titosy Manankasina | Portfolio",
    ogLocale: "fr_FR",
    jobTitle: "Développeur Fullstack JavaScript & Flutter",
    personDescription:
      "Développeur Fullstack JavaScript & Flutter avec 4+ ans d'expérience en développement web et mobile. Spécialisé en React, Next.js, TypeScript et Flutter.",
    websiteDescription:
      "Portfolio de Titosy Manankasina, Développeur Fullstack JavaScript & Flutter",
    pageDescription:
      "Portfolio professionnel de Titosy Manankasina, développeur Fullstack JavaScript & Flutter avec 4+ ans d'expérience.",
    keywords: [
      "Titosy Manankasina",
      "développeur fullstack",
      "développeur JavaScript",
      "développeur Flutter",
      "développeur React",
      "développeur Next.js",
      "développeur TypeScript",
      "développeur mobile",
      "Flutter Madagascar",
      "développeur fullstack Madagascar",
      "développeur freelance",
      "développeur web",
      "développeur front-end",
      "développeur Node.js",
      "portfolio développeur",
    ],
  },
  og: {
    alt: "Titosy Manankasina | Développeur Fullstack JavaScript & Flutter",
    line1: "Des produits web & mobile,",
    line2: "du pixel à la prod.",
  },
  ids: {
    projects: "projets",
    experience: "experience",
    stack: "stack",
    contact: "contact",
  },
  nav: {
    home: "Accueil",
    projects: "Projets",
    experience: "Expérience",
    stack: "Stack",
    contact: "Contact",
  },
  locale: {
    label: "Langue",
    names: { fr: "Français", en: "English" },
  },
  theme: {
    label: "Thème",
    system: "Thème système",
    light: "Thème clair",
    dark: "Thème sombre",
  },
  status: {
    available: "Disponible",
    remote: "Disponible en remote ou hybride",
  },
  hero: {
    title: "Des produits web & mobile, du pixel à la prod.",
    intro:
      "Je suis Titosy, développeur fullstack JavaScript & Flutter à Antananarivo. J'interviens à chaque étape d'un projet, du cadrage des besoins à la mise en production, pour livrer des solutions simples et efficaces.",
    projects: "Voir les projets",
    contact: "Me contacter",
    diagram:
      "Schéma : des problèmes transitent avec Next.js, Flutter, Nest.js et les LLM jusqu’à un portrait de Titosy en train de coder, qui les transforme en solutions Web, Mobile et API.",
    // What the avatar muses about in its thought bubble: up to 3 lines of
    // ~28 characters; `code` ones are left-aligned.
    thoughts: [
      { text: "Clean Architecture :\nle domaine au centre." },
      { text: "Les dépendances pointent\nvers l’intérieur.\n- Oncle Bob" },
      { text: "class CreateInvoice {\n  execute(input) {}\n}", code: true },
      { text: "SOLID… surtout le S." },
      { text: "if (bug) {\n  fix(bug);\n}", code: true },
      { text: "Un test qui échoue,\npuis le code qui passe." },
      { text: 'git commit -m "wip"', code: true },
      { text: "Nommer, c’est concevoir." },
      { text: "const café = await brew();", code: true },
      { text: "Et si on extrayait\nun use case ?" },
      {
        text: "interface Repository<T> {\n  save(item: T): void\n}",
        code: true,
      },
      { text: "La base de données\nest un détail.\n- Oncle Bob" },
    ],
    // What he answers in the bubble when the visitor plays with him.
    replies: {
      poke: ["Hé, ça chatouille !", "Haha, encore !", "Chut, je debugge !"],
      pokeTired: [
        "Ok, ça suffit...",
        "Je vais ouvrir un ticket.",
        "Sérieusement ?",
      ],
      double: [
        "Double-clic ?\nJe ne suis pas un fichier.",
        "Un seul clic suffit !",
      ],
      drag: [
        "Hé, ne me déplace pas !",
        "Je suis bien ici, merci.",
        "Ça glisse !",
      ],
      chip: ["Bug corrigé !", "Et un ticket de moins.", "Problème résolu."],
      laptop: ["Déployé en prod !", "Ça compile !", "git push, c'est parti !"],
      other: ["Salut ! Un projet en tête ?", "Je peux t'aider ?", "Bonjour !"],
    },
  },
  cv: { download: "Télécharger le CV" },
  projects: {
    label: "Projets",
    title: "Des produits en ligne, utilisés pour de vrai.",
    // The avatar guiding the section, in a speech balloon: up to 3 lines of
    // ~25 characters (scripts/guide-rive.mjs). `hints` are keyed by project slug.
    guide: {
      enter: [
        "Coucou ! Voici mes projets.",
        "Salut ! Viens voir\nce que j'ai construit.",
        "Hé ! Les projets,\nc'est par ici.",
      ],
      back: ["Te revoilà !", "Tu as oublié\nun projet ?", "Re-coucou !"],
      leave: [
        "Où tu vas ?\nNe me laisse pas !",
        "Hé, on n'a pas fini !",
        "Déjà ? Reviens vite !",
      ],
      fast: ["Ne scroll pas si vite !", "Doucement, tu as raté\ndes projets !"],
      hints: {
        predict: "Predict : du C++,\n100 % hors ligne.",
        wasiasup: "WASIA SUP' : mon\ncopilote IA en prod.",
        chantastik: "Chantastik transforme\nun son en vidéo lyrique.",
        "okani-survey": "Okani : un sondage\npour le service public.",
      },
    },
    caseStudy: "Étude de cas",
    previewAlt: "Aperçu de {name}",
    playVideo: "Lire la vidéo de {name}",
    closeVideo: "Fermer le lecteur",
  },
  services: {
    label: "Services",
    title: "Ce que je peux faire pour vous.",
  },
  experience: {
    label: "Expérience",
    title: "Quatre ans à livrer, de l'agence au SaaS.",
    details: "Détails",
  },
  stack: {
    label: "Stack",
    title: "Les outils que j'utilise au quotidien.",
  },
  contact: {
    label: "Contact",
    title: "Construisons quelque chose ensemble.",
    body: "Un produit à lancer, une app à reprendre ou une équipe à renforcer ? Je travaille en remote depuis Madagascar avec des équipes et des clients à l'international.",
    copied: "Adresse copiée",
    copy: "Copier l'adresse e-mail",
  },
  pipeline: {
    aria: "Animation : un nouveau projet passe du cadrage des besoins à la mise en production, puis passe en ligne.",
    folder: "~/nouveau-projet",
    command: "npx lancer --ensemble",
    steps: [
      "Cadrage des besoins",
      "Conception UI/UX",
      "Développement",
      "Mise en production",
    ],
    live: "En ligne",
    url: "votre-projet.app",
  },
  project: {
    back: "Tous les projets",
    visit: "Voir le site",
    source: "Code source",
    highlights: "Points clés",
    tech: "Technologies",
    gallery: "Galerie",
    next: "Projet suivant",
    mainAlt: "Capture principale de {name}",
    shotAlt: "{name}, capture {n}",
  },
  notFound: {
    title: "Cette page n'existe pas.",
    back: "Retour à l'accueil",
  },
};

export type Dictionary = typeof fr;

const en: Dictionary = {
  meta: {
    title: "Titosy Manankasina | Fullstack JavaScript & Flutter Developer",
    description:
      "Fullstack JavaScript & Flutter developer with 4+ years of experience. Specialized in React, Next.js, TypeScript, Flutter and Node.js. Based in Madagascar, available for remote work.",
    ogDescription:
      "Fullstack JavaScript & Flutter developer with 4+ years of experience. React, Next.js, TypeScript, Flutter, Node.js. Available for remote work.",
    twitterDescription:
      "Fullstack JavaScript & Flutter developer with 4+ years of experience. React, Next.js, TypeScript, Flutter. Available for remote work.",
    siteName: "Titosy Manankasina | Portfolio",
    ogLocale: "en_US",
    jobTitle: "Fullstack JavaScript & Flutter Developer",
    personDescription:
      "Fullstack JavaScript & Flutter developer with 4+ years of experience in web and mobile development. Specialized in React, Next.js, TypeScript and Flutter.",
    websiteDescription:
      "Portfolio of Titosy Manankasina, Fullstack JavaScript & Flutter Developer",
    pageDescription:
      "Professional portfolio of Titosy Manankasina, fullstack JavaScript & Flutter developer with 4+ years of experience.",
    keywords: [
      "Titosy Manankasina",
      "fullstack developer",
      "JavaScript developer",
      "Flutter developer",
      "React developer",
      "Next.js developer",
      "TypeScript developer",
      "mobile developer",
      "Flutter Madagascar",
      "fullstack developer Madagascar",
      "freelance developer",
      "remote developer",
      "web developer",
      "front-end developer",
      "Node.js developer",
      "developer portfolio",
    ],
  },
  og: {
    alt: "Titosy Manankasina | Fullstack JavaScript & Flutter Developer",
    line1: "Web & mobile products,",
    line2: "from pixel to prod.",
  },
  ids: {
    projects: "projects",
    experience: "experience",
    stack: "stack",
    contact: "contact",
  },
  nav: {
    home: "Home",
    projects: "Projects",
    experience: "Experience",
    stack: "Stack",
    contact: "Contact",
  },
  locale: {
    label: "Language",
    names: { fr: "Français", en: "English" },
  },
  theme: {
    label: "Theme",
    system: "System theme",
    light: "Light theme",
    dark: "Dark theme",
  },
  status: {
    available: "Available",
    remote: "Available for remote or hybrid work",
  },
  hero: {
    title: "Web & mobile products, from pixel to prod.",
    intro:
      "I'm Titosy, a fullstack JavaScript & Flutter developer based in Antananarivo. I work at every stage of a project, from scoping the requirements to shipping to production, to deliver simple and effective solutions.",
    projects: "View projects",
    contact: "Get in touch",
    diagram:
      "Diagram: problems travel with Next.js, Flutter, Nest.js and LLMs to a portrait of Titosy coding, who turns them into Web, Mobile and API solutions.",
    thoughts: [
      { text: "Clean Architecture:\nthe domain at the center." },
      { text: "Dependencies point\ninward.\n- Uncle Bob" },
      { text: "class CreateInvoice {\n  execute(input) {}\n}", code: true },
      { text: "SOLID… especially the S." },
      { text: "if (bug) {\n  fix(bug);\n}", code: true },
      { text: "A failing test first,\nthen the code that passes." },
      { text: 'git commit -m "wip"', code: true },
      { text: "Naming is designing." },
      { text: "const coffee = await brew();", code: true },
      { text: "What if we extracted\na use case?" },
      {
        text: "interface Repository<T> {\n  save(item: T): void\n}",
        code: true,
      },
      { text: "The database\nis a detail.\n- Uncle Bob" },
    ],
    replies: {
      poke: ["Hey, that tickles!", "Haha, again!", "Shh, I'm debugging!"],
      pokeTired: ["Ok, that's enough...", "I'm filing a ticket.", "Seriously?"],
      double: ["Double-click?\nI'm not a file.", "One click is enough!"],
      drag: ["Hey, don't move me!", "I'm fine right here.", "Whee, slippery!"],
      chip: ["Bug fixed!", "One ticket down.", "Problem solved."],
      laptop: ["Shipped to prod!", "It compiles!", "git push, here we go!"],
      other: ["Hi! Got a project?", "Can I help you?", "Hello!"],
    },
  },
  cv: { download: "Download CV" },
  projects: {
    label: "Projects",
    title: "Products that are live and used for real.",
    guide: {
      enter: [
        "Hi! Here are my projects.",
        "Hey! Come see\nwhat I've built.",
        "Psst! Projects are\nright this way.",
      ],
      back: ["There you are!", "Forgot a project?", "Hi again!"],
      leave: [
        "Where are you going?\nDon't leave me!",
        "Hey, we're not done!",
        "Already? Come back soon!",
      ],
      fast: ["Don't scroll so fast!", "Easy, you skipped\nsome projects!"],
      hints: {
        predict: "Predict: C++,\n100% offline.",
        wasiasup: "WASIA SUP': my AI\ncopilot in production.",
        chantastik: "Chantastik turns a song\ninto a lyric video.",
        "okani-survey": "Okani: a survey\nfor a public service.",
      },
    },
    caseStudy: "Case study",
    previewAlt: "Preview of {name}",
    playVideo: "Play the {name} video",
    closeVideo: "Close the player",
  },
  services: {
    label: "Services",
    title: "What I can do for you.",
  },
  experience: {
    label: "Experience",
    title: "Four years of shipping, from agency to SaaS.",
    details: "Details",
  },
  stack: {
    label: "Stack",
    title: "The tools I use every day.",
  },
  contact: {
    label: "Contact",
    title: "Let's build something together.",
    body: "A product to launch, an app to take over or a team to strengthen? I work remotely from Madagascar with teams and clients around the world.",
    copied: "Email address copied",
    copy: "Copy email address",
  },
  pipeline: {
    aria: "Animation: a new project goes from scoping the requirements to production, then goes live.",
    folder: "~/new-project",
    command: "npx launch --together",
    steps: [
      "Scoping requirements",
      "UI/UX design",
      "Development",
      "Shipping to production",
    ],
    live: "Live",
    url: "your-project.app",
  },
  project: {
    back: "All projects",
    visit: "Visit site",
    source: "Source code",
    highlights: "Highlights",
    tech: "Technologies",
    gallery: "Gallery",
    next: "Next project",
    mainAlt: "Main screenshot of {name}",
    shotAlt: "{name}, screenshot {n}",
  },
  notFound: {
    title: "This page doesn't exist.",
    back: "Back to home",
  },
};

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Fills `{key}` placeholders: `format("Hi {name}", { name: "Ana" })`. */
export function format(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    String(values[key] ?? `{${key}}`),
  );
}
