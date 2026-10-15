export type Discipline = 'illustration' | 'graphic';

export type Category =
  | 'Editorial'
  | 'Character Design'
  | 'Branding'
  | 'Posters'
  | 'Events';

export interface Project {
  id: string;
  title: string;
  disc: Discipline;
  cat: Category;
  year: string;
  img: string;
  role: string;
  med: string;
  desc: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'bloom-states',
    title: 'Las Caras de la Mente',
    disc: 'illustration',
    cat: 'Editorial',
    year: '2025',
    img: '/images/work/las-caras-de-la-mente-libro.jpg',
    role: 'Illustration, Art Direction',
    med: 'Digital · Risograph',
    desc:
      'Las caras de la mente es un proyecto que surge al unir dos pasiones personales; el interés por el funcionamiento de la mente y el arte.\n\n' +
      'Las caras de la mente es una interpretación de algunos trastornos mentales en forma de ilustración y poesía cuya intención es invitar a la reflexión individual.\n\n' +
      'Para complementar y contextualizar, cada apartado cuenta con un anexo que contiene información de cada trastorno tratado; pero este libro no tiene por finalidad educar o diagnosticar. Las caras de la mente quiere transmitir, provocar y mover emociones.',
  },
  // ---------- PLANTILLAS de Selected Works: rellenar con el proyecto real ----------
  // img: guarda la imagen en public/images/work/ y pon aquí su ruta
  // disc: 'illustration' | 'graphic'
  // cat: 'Editorial' | 'Character Design' | 'Branding' | 'Posters' | 'Events'
  // desc: párrafos separados por '\n\n' (en Selected Works solo se ve el primero)
  {
    id: 'proyecto-2',
    title: 'Proyecto 2',
    disc: 'illustration',
    cat: 'Editorial',
    year: '2025',
    img: '/images/work/ill-2.png', // provisional
    role: 'Rol',
    med: 'Técnica · Medio',
    desc: 'Descripción del proyecto.',
  },
  {
    id: 'proyecto-3',
    title: 'Proyecto 3',
    disc: 'graphic',
    cat: 'Branding',
    year: '2025',
    img: '/images/work/gfx-1.png', // provisional
    role: 'Rol',
    med: 'Técnica · Medio',
    desc: 'Descripción del proyecto.',
  },
  {
    id: 'proyecto-4',
    title: 'Proyecto 4',
    disc: 'illustration',
    cat: 'Character Design',
    year: '2025',
    img: '/images/work/ill-3.png', // provisional
    role: 'Rol',
    med: 'Técnica · Medio',
    desc: 'Descripción del proyecto.',
  },
  // ---------- fin de plantillas ----------
  {
    id: 'paper-creatures',
    title: 'Paper Creatures',
    disc: 'illustration',
    cat: 'Character Design',
    year: '2024',
    img: '/images/work/ill-2.png',
    role: 'Character Design',
    med: 'Cut paper · Digital',
    desc: 'A cast of friendly creatures designed for a children’s app. Each character is built from simple geometry so it can be animated, stickered and printed without losing its charm.',
  },
  {
    id: 'nocturne',
    title: 'Nocturne',
    disc: 'illustration',
    cat: 'Editorial',
    year: '2024',
    img: '/images/work/ill-3.png',
    role: 'Illustration',
    med: 'Ink · Digital',
    desc: 'Cover and interior illustrations for a collection of night-time short stories. A restrained teal-and-ink palette carries the mood from dusk to dawn.',
  },
  {
    id: 'wild-index',
    title: 'Wild Index',
    disc: 'illustration',
    cat: 'Posters',
    year: '2023',
    img: '/images/work/ill-4.png',
    role: 'Illustration, Layout',
    med: 'Gouache · Digital',
    desc: 'An illustrated index of imaginary flora, published as a fold-out poster. Halftone textures give the digital work a printed, tactile feel.',
  },
  {
    id: 'fauna-type',
    title: 'Fauna Type',
    disc: 'illustration',
    cat: 'Character Design',
    year: '2023',
    img: '/images/work/ill-5.png',
    role: 'Lettering, Illustration',
    med: 'Digital',
    desc: 'A playful display alphabet where every letter hides an animal. Designed for a kids’ science brand that wanted learning to feel like a game.',
  },
  {
    id: 'solstice-press',
    title: 'Solstice Press',
    disc: 'illustration',
    cat: 'Editorial',
    year: '2022',
    img: '/images/work/ill-6.png',
    role: 'Cover Illustration',
    med: 'Screenprint · Digital',
    desc: 'Seasonal cover artwork for an independent literary press. Concentric suns and orbits became a recurring motif across four issues.',
  },
  {
    id: 'northbound',
    title: 'Northbound',
    disc: 'graphic',
    cat: 'Branding',
    year: '2025',
    img: '/images/work/gfx-1.png',
    role: 'Brand Identity, Art Direction',
    med: 'Identity System',
    desc: 'A complete visual identity for a travel collective — logotype, grid system, and a flexible toolkit of modular blocks that hold the brand together across print and screen.',
  },
  {
    id: 'format-01',
    title: 'Format 01',
    disc: 'graphic',
    cat: 'Branding',
    year: '2024',
    img: '/images/work/gfx-2.png',
    role: 'Identity, Typography',
    med: 'Identity System',
    desc: 'A monogram-led identity for a design studio. The brandmark is a single letterform that flexes between a stamp, a pattern and a loading state.',
  },
];

export const DISC_LABEL: Record<Discipline, string> = {
  illustration: 'Illustration',
  graphic: 'Graphic Design',
};

export const FEATURED_PROJECT_IDS = ['bloom-states', 'proyecto-2', 'proyecto-3', 'proyecto-4'] as const;

export function getFeaturedProjects(): Project[] {
  return FEATURED_PROJECT_IDS
    .map((id) => PROJECTS.find((p) => p.id === id))
    .filter((p): p is Project => p !== undefined)
    .slice(0, 4);
}
