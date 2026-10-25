// English / Spanish copy for the whole site. The visitor's choice lives in the
// `lang` cookie (set by LangToggle), so pages render in it on the server:
// server components read it with getDict() (lib/i18n-server.ts), client
// components with useLang() (components/LangProvider.tsx).

export type Lang = 'en' | 'es';
export const LANG_COOKIE = 'lang';
export const DEFAULT_LANG: Lang = 'en';

export function isLang(v: unknown): v is Lang {
  return v === 'en' || v === 'es';
}

/** Text that may be translated: a plain string reads the same in both languages. */
export type Localized = string | { en: string; es: string };

export function loc(v: Localized, lang: Lang): string {
  return typeof v === 'string' ? v : v[lang];
}

/** A job or a course on the About > Experience page; `details` accept **highlights**. */
export interface TimelineEntry {
  place: string;
  role?: string;
  years: string;
  details?: string[];
}

const en = {
  // cursor label on links to the unfinished works page (lib/site.ts)
  wip: 'WIP',
  // contact folder (ContactFolder): opens from every "Contact" link
  folder: {
    label: 'Contact',
    hint: 'Click to open',
    coverTitle: 'CONTACT FILE',
    coverSub: 'Open me',
    tab: 'OPEN ME',
    title: 'Hello!',
    body: "Tell me what you'd like to bring to life and I'll help you make it real.",
    cta: 'Get in touch',
    close: 'Close',
  },
  // on touch screens (no cursor) tapping those links shows this instead
  wipToast: 'Work in progress — coming soon',
  disc: { illustration: 'Illustration', graphic: 'Graphic Design' },
  cat: {
    Editorial: 'Editorial',
    'Character Design': 'Character Design',
    Branding: 'Branding',
    Posters: 'Posters',
    Events: 'Events',
    Sketchbook: 'Sketchbook',
    Merchandising: 'Merchandising',
  },
  nav: { works: 'Works', about: 'About', contact: 'Contact' },
  controls: {
    theme: 'Theme',
    darkMode: 'Dark mode',
    language: 'Language',
    seasons: { summer: 'Summer', spring: 'Spring', autumn: 'Autumn', winter: 'Winter', main: 'Main' },
  },
  footer: {
    tagline: 'María Railenz | Design & Illustration',
    rights: '© 2026 — Madrid',
  },
  cat_: {
    hello: 'explore the web',
    firstScroll: "I'm Yogur",
    moodsLabel: "Change Yogur's mood",
    moods: { idle: 'Idle', happy: 'Happy', sad: 'Sad', error: 'Confused' },
  },
  hero: { design: 'DESIGN', illustration: 'ILLUSTRATION', arts: 'Arts', cats: 'Cats', scroll: 'Scroll' },
  home: {
    metaTitle: 'María Railenz — Illustration & Graphic Design',
    metaDesc: 'Illustration & Graphic Design. Two crafts, one hand. From the mountains.',
    selected: 'Selected Works',
    ctaPre: 'Shall we give it a ',
    ctaWord: 'spin',
    ctaPost: '?',
    ctaLead: 'Open for commissions, collaborations and full identity projects from early 2026.',
    ctaBtn: "Let's talk",
  },
  featured: {
    open: 'Open',
    openProject: 'Open project',
    openAria: 'Open',
    allProjects: 'All projects',
    prev: 'Previous project',
    next: 'Next project',
  },
  works: {
    metaDesc: 'A growing archive of drawn worlds and designed systems.',
    archive: 'Archive — {n} projects',
    crafts: 'Illustration · Graphic Design',
    title: 'Works',
    sub: 'A growing archive of drawn worlds and designed systems. Filter by craft or by category — every piece is a placeholder ready to be swapped for the real thing.',
    craft: 'Craft',
    category: 'Category',
    all: 'All',
    catShort: { 'Character Design': 'Character' } as Record<string, string>,
    empty: 'Nothing here yet.',
    year: 'Year',
    role: 'Role',
    medium: 'Medium',
    nextProject: 'Next project →',
    nextLabel: 'Next',
    close: 'Close',
    footPre: 'Like',
    footHead: 'what you see?',
    footCta: 'Start a project',
  },
  about: {
    metaDesc: 'Who is María Railenz?',
    label: 'About',
    titlePre: 'Who is María Railenz? ',
    titleEm: '',
    nextImage: 'Next image',
    photoAlt: 'María Railenz at sunset by the sea',
    // **double asterisks** mark the highlighted words (bold, in the accent colour)
    lead: 'I\'m an **illustrator** and **graphic designer** based in Madrid. My home is Arenas de San Pedro, the village in Ávila where I grew up and studied.',
    bio1: 'I\'ve always known that **art** would be a big part of my life, even though choosing a path was hard, because I loved dance, music, photography, drawing... art in any of its forms.',
    bio2: '**Nature** is my muse and my refuge. My cat **Yogur** is the living proof of it. I love to love, and I cry easily.',
    switchLabel: 'Who I am / why I do it',
    tabs: { who: 'WHO', why: 'WHY' },
    // the three inner pages, picked from the switch under the pictures
    // captions of the Experience gallery, in tile order
    gallery: ['cAIo Day 26, iKN Spain', 'Retail Forum 25, iKN Spain', 'Art Studies', 'Final project defence', 'Music'],
    sectionsLabel: 'About pages',
    sections: { about: 'ABOUT', experience: 'EXPERIENCE', more: 'MORE' },
    // placeholder copy until the final text is written
    experience: {
      title: 'Work **experience**',
      items: [
        {
          place: 'iKN Spain',
          role: 'Graphic Designer / Marketing Manager',
          years: '2024/now',
        },
        {
          place: 'Summitify',
          role: 'Graphic Designer',
          years: '2022',
        },
        {
          place: 'IESA Technology Communities',
          role: 'Trainer',
          years: '2022/24',
        },
      ] as TimelineEntry[],
    },
    education: {
      title: '**Education**',
      items: [
        {
          place: 'CEI: School of Design and Marketing',
          role: 'Graphic Design',
          years: '2023/24',
          details: [
            '**Adobe tools:** Photoshop, Illustrator, InDesign.',
            '**Graphic production and creativity:** design elements, typography, printing types, finishes, marketing strategy and corporate identity.',
          ],
        },
        {
          place: 'CRBC School of Art and Design, Ávila',
          role: 'Higher Technician in Illustration',
          years: '2020/22',
        },
        {
          place: 'CRBC School of Art and Design, Ávila',
          role: 'Baccalaureate in Plastic Arts',
          years: '2018/20',
        },
        {
          place: 'Luigi Boccherini Municipal Music School',
          role: 'Musician, Flautist',
          years: '2010/19',
        },
      ] as TimelineEntry[],
    },
    more: {
      title: 'A bit **more** about me',
      paras: [
        'Here goes something else you would like people to know: **hobbies**, **curiosities**, what inspires you.',
        'This text is a placeholder, ready to be replaced with the real one.',
      ],
    },
    // placeholder until the final copy is decided
    whyTitle: 'Why art? Why create?',
    why: [
      'Just like nature, art has always been my way out and my way back to myself. It has allowed me, and still allows me, to explore my **inner world** and the **world around me**.',
      'I feel that **art moves the world**, and even though the world has had plenty of reasons to stop lately, art is still the engine that makes us grow as a society.',
      'I create to **show my inside**, to **understand the outside** and to **fight** for what I believe has to change.',
    ],
  },
  contact: {
    metaDesc: 'Start a project — reply within 48 hours.',
    label: 'Contact',
    reply: 'Reply within 48h',
    titleA: "Let's",
    titleB: 'talk.',
    available: 'Available for projects — early 2026',
    email: 'Email',
    studio: 'Studio',
    studioV: 'Madrid, Spain',
    elsewhere: 'Elsewhere',
    for: 'For',
    forV: 'Commissions · Identity · Collaboration',
    footPre: 'See',
    footHead: 'the work —',
    footCta: 'Browse projects',
    form: {
      step: '(01 — Tell me about it)',
      name: 'Your name',
      email: 'Email',
      need: 'What do you need?',
      both: 'A bit of both',
      project: 'The project',
      placeholder: "Tell me what you're making, the timeline, and anything that excites you about it…",
      send: 'Send message →',
      sending: 'Sending…',
      errName: 'Please tell me your name.',
      errEmail: 'A valid email, please.',
      errDisc: 'Pick at least one.',
      errMsg: 'A line or two would help.',
      thanksA: 'Thanks — ',
      thanksB: 'got it.',
      thanksP: "Your message is on its way (well, it would be once this is wired to a real inbox). I'll get back to you within 48 hours.",
    },
  },
  notFound: {
    code: '404 — Not found',
    text: "That page doesn't exist. Let's get you back on track.",
    back: 'Back home',
  },
};

export type Dict = typeof en;

const es: Dict = {
  wip: 'EN PROCESO',
  folder: {
    label: 'Contacto',
    hint: 'Haz clic para abrir',
    coverTitle: 'ARCHIVO DE CONTACTO',
    coverSub: 'Ábreme',
    tab: 'ÁBREME',
    title: '¡Hola!',
    body: 'Cuéntame a qué te gustaría darle vida y te ayudaré a hacerlo real.',
    cta: 'Contactar',
    close: 'Cerrar',
  },
  wipToast: 'En proceso — muy pronto',
  disc: { illustration: 'Ilustración', graphic: 'Diseño gráfico' },
  cat: {
    Editorial: 'Editorial',
    'Character Design': 'Diseño de personajes',
    Branding: 'Branding',
    Posters: 'Carteles',
    Events: 'Eventos',
    Sketchbook: 'Cuaderno',
    Merchandising: 'Merchandising',
  },
  nav: { works: 'Proyectos', about: 'Sobre mí', contact: 'Contacto' },
  controls: {
    theme: 'Tema',
    darkMode: 'Modo oscuro',
    language: 'Idioma',
    seasons: { summer: 'Verano', spring: 'Primavera', autumn: 'Otoño', winter: 'Invierno', main: 'Principal' },
  },
  footer: {
    tagline: 'María Railenz — Ilustración y Diseño gráfico',
    rights: '© 2026 — Madrid',
  },
  cat_: {
    hello: 'explora la web',
    firstScroll: 'soy Yogur',
    moodsLabel: 'Cambia el humor de Yogur',
    moods: { idle: 'Tranquilo', happy: 'Feliz', sad: 'Triste', error: 'Confundido' },
  },
  hero: { design: 'DISEÑO', illustration: 'ILUSTRACIÓN', arts: 'Artes', cats: 'Gatos', scroll: 'Scroll' },
  home: {
    metaTitle: 'María Railenz — Ilustración y Diseño gráfico',
    metaDesc: 'Ilustración y Diseño gráfico. Dos oficios, una mano. Desde las montañas.',
    selected: 'Trabajos destacados',
    ctaPre: '¿Le damos una ',
    ctaWord: 'vuelta',
    ctaPost: '?',
    ctaLead: 'Disponible para encargos, colaboraciones y proyectos de identidad completos a partir de principios de 2026.',
    ctaBtn: 'Hablemos',
  },
  featured: {
    open: 'Abrir',
    openProject: 'Ver proyecto',
    openAria: 'Abrir',
    allProjects: 'Todos los proyectos',
    prev: 'Proyecto anterior',
    next: 'Proyecto siguiente',
  },
  works: {
    metaDesc: 'Un archivo en crecimiento de mundos dibujados y sistemas diseñados.',
    archive: 'Archivo — {n} proyectos',
    crafts: 'Ilustración · Diseño gráfico',
    title: 'Proyectos',
    sub: 'Un archivo en crecimiento de mundos dibujados y sistemas diseñados. Filtra por oficio o por categoría — cada pieza es provisional, lista para cambiarse por la real.',
    craft: 'Oficio',
    category: 'Categoría',
    all: 'Todo',
    catShort: { 'Character Design': 'Personajes' },
    empty: 'Aún no hay nada aquí.',
    year: 'Año',
    role: 'Rol',
    medium: 'Técnica',
    nextProject: 'Siguiente proyecto →',
    nextLabel: 'Siguiente',
    close: 'Cerrar',
    footPre: '¿Te gusta',
    footHead: 'lo que ves?',
    footCta: 'Empecemos un proyecto',
  },
  about: {
    metaDesc: '¿Quién es María Railenz?',
    label: 'Sobre mí',
    titlePre: '¿Quién es María Railenz? ',
    titleEm: '',
    nextImage: 'Siguiente imagen',
    photoAlt: 'María Railenz en un atardecer junto al mar',
    lead: 'Soy **ilustradora** y **diseñadora gráfica** en Madrid. Mi hogar se encuentra en Arenas de San Pedro, pueblo de Ávila en el que crecí y estudié.',
    bio1: 'Siempre he sabido que el **arte** sería una parte importante en mi vida, aunque fue muy difícil escoger un camino, porque me gustaba el baile, la música, la fotografía, el dibujo... el arte en cualquiera de sus formas.',
    bio2: 'La **naturaleza** es mi musa y refugio. Mi gato **Yogur** es la viva imagen de ello. Amo amar y lloro con facilidad.',
    switchLabel: 'Quién soy / por qué lo hago',
    tabs: { who: 'QUIÉN', why: 'POR QUÉ' },
    gallery: ['cAIo Day 26, iKN Spain', 'Retail Forum 25, iKN Spain', 'Estudios de arte', 'Defensa del proyecto integrado', 'Música'],
    sectionsLabel: 'Páginas de Sobre mí',
    sections: { about: 'SOBRE MÍ', experience: 'EXPERIENCIA', more: 'MÁS' },
    // texto provisional hasta que esté el definitivo
    experience: {
      title: 'Experiencia **laboral**',
      items: [
        {
          place: 'iKN Spain',
          role: 'Diseño gráfico / Marketing Manager',
          years: '2024/hoy',
        },
        {
          place: 'Summitify',
          role: 'Diseño gráfico',
          years: '2022',
        },
        {
          place: 'IESA Comunidades Tecnológicas',
          role: 'Formadora',
          years: '2022/24',
        },
      ] as TimelineEntry[],
    },
    education: {
      title: 'Datos **académicos**',
      items: [
        {
          place: 'CEI: Escuela de Diseño y Marketing',
          role: 'Diseño Gráfico',
          years: '2023/24',
          details: [
            '**Adobe Tools:** Photoshop, Illustrator, InDesign.',
            '**Producción gráfica y creatividad:** elementos del diseño, tipografía, tipos de impresión, acabados, estrategia de marketing e identidad corporativa.',
          ],
        },
        {
          place: 'Escuela de Arte y Superior de CRBC de Ávila',
          role: 'Técnico Superior Ilustración',
          years: '2020/22',
        },
        {
          place: 'Escuela de Arte y Superior de CRBC de Ávila',
          role: 'Bachillerato de artes plásticas',
          years: '2018/20',
        },
        {
          place: 'Escuela Municipal de Música Luigi Boccherini',
          role: 'Músico, Flautista',
          years: '2010/19',
        },
      ] as TimelineEntry[],
    },
    more: {
      title: 'Un poco **más** sobre mí',
      paras: [
        'Aquí irá algo más que quieras que la gente sepa: **aficiones**, **curiosidades**, lo que te inspira.',
        'Este texto es provisional, listo para sustituirlo por el real.',
      ],
    },
    whyTitle: '¿Por qué el arte? ¿Por qué crear?',
    why: [
      'Al igual que la naturaleza, el arte siempre ha sido **vía de escape** y **encuentro conmigo misma**. Me ha permitido y me permite explorar mi **interior** y el **exterior**.',
      'Siento que el **arte mueve el mundo** y, aunque el mundo tenga muchos motivos últimamente para detenerse, el arte sigue siendo el motor que nos hace crecer como sociedad.',
      'Creo para **mostrar mi interior**, para **entender el exterior** y para **luchar** por lo que creo que tiene que cambiar.',
    ],
  },
  contact: {
    metaDesc: 'Empecemos un proyecto — respuesta en 48 horas.',
    label: 'Contacto',
    reply: 'Respuesta en 48h',
    titleA: 'Hablemos',
    titleB: 'un rato.',
    available: 'Disponible para proyectos — principios de 2026',
    email: 'Email',
    studio: 'Estudio',
    studioV: 'Madrid, España',
    elsewhere: 'En otros sitios',
    for: 'Para',
    forV: 'Encargos · Identidad · Colaboraciones',
    footPre: 'Mira',
    footHead: 'el trabajo —',
    footCta: 'Ver proyectos',
    form: {
      step: '(01 — Cuéntame)',
      name: 'Tu nombre',
      email: 'Email',
      need: '¿Qué necesitas?',
      both: 'Un poco de todo',
      project: 'El proyecto',
      placeholder: 'Cuéntame qué estás haciendo, los plazos y todo lo que te ilusiona de ello…',
      send: 'Enviar mensaje →',
      sending: 'Enviando…',
      errName: 'Dime tu nombre, por favor.',
      errEmail: 'Un email válido, por favor.',
      errDisc: 'Elige al menos una opción.',
      errMsg: 'Una o dos frases ayudarían.',
      thanksA: 'Gracias — ',
      thanksB: 'recibido.',
      thanksP: 'Tu mensaje va de camino (bueno, lo irá cuando esto esté conectado a un buzón real). Te responderé en 48 horas.',
    },
  },
  notFound: {
    code: '404 — No encontrada',
    text: 'Esta página no existe. Volvamos al buen camino.',
    back: 'Volver al inicio',
  },
};

export const DICT: Record<Lang, Dict> = { en, es };
