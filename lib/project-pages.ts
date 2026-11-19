import { loc, type Localized } from './i18n';

// ============================================================================
// Detail pages of the projects: the sections that go under the cover of
// /works/<id> (the page itself is app/works/[id]/page.tsx, the pieces that draw
// these sections are in components/project/). Only projects listed in
// PROJECT_PAGES get sections; the others show just the cover and the text from
// lib/projects.ts.
//
// Text: Localized = a plain string, or { en, es }. **Double asterisks** mark the
// highlighted words, as everywhere else on the site.
//
// Pictures: every picture is a "slot". A slot with no picture yet shows a
// placeholder that says what goes there and which file name to use. To fill
// one: save the file in public/images/work/<project>/ with the name shown on
// the placeholder, then add that name to READY below.
// ============================================================================

export interface ImageSlot {
  /** file name inside the project's image folder (shown on the placeholder) */
  file: string;
  /** set when the file is in READY; without it the slot shows its placeholder */
  src?: string;
  /** aspect ratio of the box, as a CSS aspect-ratio value */
  ratio: string;
  /** what should go here (shown on the placeholder, and used as alt text) */
  hint: Localized;
  caption?: Localized;
  /** CSS object-position, to choose which part of a cropped picture stays visible */
  position?: string;
  /** show the whole picture on a plain background (diagrams, cut-outs) instead of cropping it */
  contain?: boolean;
}

export interface SplitBlock {
  kind: 'split';
  /** sub-heading above the text, for sections that have several parts */
  heading?: Localized;
  text: Localized[];
  /** a smaller line under the text */
  note?: Localized;
  /** one picture, or several side by side */
  images: ImageSlot[];
}

export interface SizesBlock {
  kind: 'sizes';
  /** sub-heading above the module, for sections that have several */
  heading?: Localized;
  intro: Localized;
  chips: Localized[];
  items: { label: Localized; value: string }[];
  image: ImageSlot;
}

export interface AestheticBlock {
  kind: 'aesthetic';
  /** sub-heading above the module, for sections that have several */
  heading?: Localized;
  /** one box per typeface, each with its specimen (the name is the alt text) */
  fonts: { name: string; image: ImageSlot }[];
  colours: {
    /** cyan, magenta, yellow, black (%) */
    cmyk: [number, number, number, number];
    /** how it looks on screen (CMYK has no exact RGB) */
    swatch: string;
    /** a dark swatch takes light text */
    dark: boolean;
  }[];
}

export interface IllustrationsBlock {
  kind: 'illustrations';
  items: {
    id: string;
    /** short name on the picker */
    name: Localized;
    /** full name, under the pictures */
    full?: Localized;
    portrait: ImageSlot;
    entity: ImageSlot;
  }[];
}

export interface SpecsBlock {
  kind: 'specs';
  /** sub-heading above the module, for sections that have several */
  heading?: Localized;
  intro: Localized;
  groups: { title: Localized; rows: { label: Localized; value: Localized }[] }[];
  note: Localized;
  image: ImageSlot;
}

export type Block = SplitBlock | SizesBlock | AestheticBlock | IllustrationsBlock | SpecsBlock;

export interface Section {
  /** anchor of the section (#id) */
  id: string;
  title: Localized;
  blocks: Block[];
}

export interface ProjectPage {
  sections: Section[];
}

// ---------------------------------------------------------------------------
// Las caras de la mente (id: bloom-states)
// ---------------------------------------------------------------------------

const FOLDER = '/images/work/las-caras-de-la-mente/';

// Pictures that are already in the folder. Add the file name here once you've
// saved it (e.g. '02-1-libro-interior.png') and its slot shows it.
const READY: string[] = [
  '01-briefing.jpg',
  '02-1-libro-interior.png',
  '02-2-cubierta.jpg',
  '03-1-cartel-informativo.jpg',
  '03-2-cartel-publicitario.png',
  '04-publicidad.jpg',
  '04-1-poster-1.jpg',
  '04-1-poster-2.jpg',
  '04-2-marcapaginas.jpg',
  '05-tamanos.png',
  '06-tipografia-caecilla.png',
  '06-tipografia-reem.png',
  '06-tipografia-acumin.png',
  '08-reticula.jpg',
  // illustrations: <disorder>-retrato / -entidad
  ...['ansiedad', 'depresion', 'bipolaridad', 'anorexia', 'esquizofrenia', 'tea', 'tdah', 'tept', 'tlp'].flatMap((id) => [
    `07-${id}-retrato.jpg`,
    `07-${id}-entidad.jpg`,
  ]),
];

function pic(
  file: string,
  ratio: string,
  hint: Localized,
  extra: Partial<Pick<ImageSlot, 'caption' | 'position' | 'contain'>> = {},
): ImageSlot {
  return { file, src: READY.includes(file) ? FOLDER + file : undefined, ratio, hint, ...extra };
}

const caras: ProjectPage = {
  sections: [
    // ------------------------------------------------------------ Briefing
    {
      id: 'briefing',
      title: 'Briefing',
      blocks: [
        {
          kind: 'split',
          text: [
            {
              es: 'El proyecto cuenta con dos partes: el **libro** Las caras de la mente y el **material publicitario**.',
              en: 'The project has two parts: the **book** Las caras de la mente (The Faces of the Mind) and the **promotional material**.',
            },
            {
              es: 'Las ilustraciones que contiene el interior del libro fueron creadas con motivo del trabajo final del Grado de Ilustración, en 2022.',
              en: 'The illustrations inside the book were created for the final project of the Illustration Degree, in 2022.',
            },
            {
              es: 'La realización de la maqueta y su optimización para impresión ha sido el proceso que se ha llevado a cabo para el proyecto final de Adobe Tools.',
              en: 'Laying out the book and optimising it for print was the process carried out for the Adobe Tools final project.',
            },
            {
              es: 'El libro además tiene una **cubierta**, creada en Illustrator y posteriormente maquetada en InDesign.',
              en: 'The book also has a **cover**, created in Illustrator and later laid out in InDesign.',
            },
            {
              es: 'En cuanto al material publicitario se han realizado: dos **carteles**, dos **pósters** y un **marcapáginas**. Estos se han creado con Illustrator y Photoshop y maquetado en InDesign para su finalidad principal: la impresión.',
              en: 'The promotional material consists of two **posters**, two **prints** and a **bookmark**. They were created with Illustrator and Photoshop and laid out in InDesign for their main purpose: printing.',
            },
            {
              es: 'La **finalidad** del proyecto es acercar la salud mental y los trastornos psicológicos a través de la ilustración y la poesía. Además se han creado los materiales publicitarios para su posterior distribución y expansión, para dar a conocer el producto.',
              en: 'The **aim** of the project is to bring mental health and psychological disorders closer through illustration and poetry. The promotional materials were also created for later distribution and expansion, to make the product known.',
            },
          ],
          images: [
            pic('01-briefing.jpg', '4 / 5', {
              es: 'Imagen de conjunto: el libro y el material publicitario',
              en: 'Overview: the book and the promotional material',
            }),
          ],
        },
      ],
    },

    // ------------------------------------------------------------ Libro (Libro, Cubierta, Retícula)
    {
      id: 'libro',
      title: { es: 'Libro', en: 'Book' },
      blocks: [
        {
          kind: 'split',
          text: [
            {
              es: 'Está dividido en 9 capítulos y tiene 64 páginas. Cada capítulo trata sobre un trastorno psicológico y tiene dos partes:',
              en: 'It is divided into 9 chapters and has 64 pages. Each chapter is about a psychological disorder and has two parts:',
            },
            {
              es: 'La **primera parte** contiene un poema inspirado por el trastorno y un dibujo a carboncillo que simboliza la entidad que vive dentro de la persona que lo padece.',
              en: 'The **first part** contains a poem inspired by the disorder and a charcoal drawing that symbolises the entity that lives inside the person who suffers from it.',
            },
            {
              es: 'La **segunda parte** contiene una descripción a partir de un manual de diagnóstico (DSM-5) para su mejor entendimiento y un retrato digital que expresa el sentimiento del trastorno.',
              en: 'The **second part** contains a description based on a diagnostic manual (DSM-5) for better understanding and a digital portrait that expresses the feeling of the disorder.',
            },
          ],
          note: {
            es: 'La información técnica de maquetación está en el apartado Retícula.',
            en: 'The technical layout information is in the Grid section.',
          },
          images: [
            pic('02-1-libro-interior.png', '4 / 3', {
              es: 'Interior del libro abierto: página con retrato y texto',
              en: 'The open book: a page with a portrait and text',
            }),
          ],
        },
        {
          kind: 'split',
          heading: { es: 'Cubierta', en: 'Cover' },
          text: [
            {
              es: 'La cubierta contiene una **portada**, **contraportada**, **dos solapas** e **interior**.',
              en: 'The cover has a **front cover**, **back cover**, **two flaps** and an **inside**.',
            },
            {
              es: 'La portada y la contraportada están realizadas con **Illustrator**. Es una ilustración que **engloba** el significado de las partes que tiene cada capítulo. Se trata de una cabeza humana con manos que en su interior lleva las cabezas de las entidades de cada trastorno.',
              en: 'The front and back covers were made with **Illustrator**. It is an illustration that **gathers** the meaning of the parts of each chapter: a human head with hands that carries inside it the heads of the entities of each disorder.',
            },
            {
              es: 'El interior de la portada se trata de un **patrón** creado en **Illustrator** a partir de las cabezas de las entidades de los trastornos. Una vez distribuidas de la manera correcta, se ha creado como **muestra** y se ha optimizado para que tenga el tamaño y colocación correcta.',
              en: 'The inside of the cover is a **pattern** created in **Illustrator** from the heads of the disorders’ entities. Once distributed correctly, it was made into a **sample** and optimised to have the right size and placement.',
            },
            {
              es: 'Por último, se ha maquetado en **InDesign** tanto las solapas, como el texto que faltaba en la portada y contraportada. Se ha añadido también en las anotaciones las **guías necesarias** para que la imprenta localice las zonas de doblez.',
              en: 'Finally, the flaps, and the text missing on the front and back covers, were laid out in **InDesign**. The **guides** the printer needs to locate the fold lines were also added to the notes.',
            },
          ],
          images: [
            pic(
              '02-2-cubierta.jpg',
              '4 / 3',
              { es: 'La cubierta desplegada: portada, contraportada, solapas e interior', en: 'The cover laid flat: front, back, flaps and inside' },
              { contain: true },
            ),
          ],
        },
        {
          kind: 'specs',
          heading: { es: 'Retícula', en: 'Grid' },
          intro: {
            es: 'Para la maquetación del libro se ha utilizado una **retícula/cuadrícula base** con:',
            en: 'The book layout uses a **baseline grid** with:',
          },
          groups: [
            {
              title: { es: 'Retícula base', en: 'Baseline grid' },
              rows: [
                { label: { es: 'Inicio', en: 'Start' }, value: '12 mm' },
                { label: { es: 'Respecto a', en: 'Relative to' }, value: { es: 'Principio de página', en: 'Top of page' } },
                { label: { es: 'Incremento cada', en: 'Increment every' }, value: '13 mm' },
              ],
            },
            {
              title: { es: 'Columnas', en: 'Columns' },
              rows: [
                { label: { es: 'Columnas', en: 'Columns' }, value: '4' },
                { label: { es: 'Medianil', en: 'Gutter' }, value: { es: '4,233 mm', en: '4.233 mm' } },
              ],
            },
            {
              title: { es: 'Márgenes', en: 'Margins' },
              rows: [
                { label: { es: 'Superior', en: 'Top' }, value: '12 mm' },
                { label: { es: 'Inferior', en: 'Bottom' }, value: '15 mm' },
                { label: { es: 'Interior', en: 'Inside' }, value: '12 mm' },
                { label: { es: 'Exterior', en: 'Outside' }, value: '15 mm' },
              ],
            },
          ],
          note: {
            es: 'El texto está **alineado a la izquierda** y tiene los **estilos** correspondientes creados.',
            en: 'The text is **left-aligned** and has the corresponding **styles** created.',
          },
          image: pic('08-reticula.jpg', '4 / 3', {
            es: 'Doble página de InDesign con la retícula a la vista',
            en: 'An InDesign spread with the grid showing',
          }),
        },
      ],
    },

    // ------------------------------------------------------------ Ilustraciones
    {
      id: 'ilustraciones',
      title: { es: 'Ilustraciones', en: 'Illustrations' },
      blocks: [
        {
          kind: 'illustrations',
          items: [
            { id: 'ansiedad', name: { es: 'Ansiedad', en: 'Anxiety' } },
            { id: 'depresion', name: { es: 'Depresión', en: 'Depression' } },
            { id: 'bipolaridad', name: { es: 'Bipolaridad', en: 'Bipolarity' } },
            { id: 'anorexia', name: { es: 'Anorexia', en: 'Anorexia' } },
            { id: 'esquizofrenia', name: { es: 'Esquizofrenia', en: 'Schizophrenia' } },
            {
              id: 'tea',
              name: { es: 'TEA', en: 'ASD' },
              full: { es: 'Trastorno del espectro autista', en: 'Autism spectrum disorder' },
            },
            {
              id: 'tdah',
              name: { es: 'TDAH', en: 'ADHD' },
              full: {
                es: 'Trastorno por déficit de atención e hiperactividad',
                en: 'Attention deficit hyperactivity disorder',
              },
            },
            {
              id: 'tept',
              name: { es: 'TEPT', en: 'PTSD' },
              full: { es: 'Trastorno de estrés postraumático', en: 'Post-traumatic stress disorder' },
            },
            {
              id: 'tlp',
              name: { es: 'TLP', en: 'BPD' },
              full: { es: 'Trastorno límite de la personalidad', en: 'Borderline personality disorder' },
            },
          ].map((it) => ({
            ...it,
            portrait: pic(`07-${it.id}-retrato.jpg`, '1 / 1', {
              es: `Retrato digital: ${loc(it.name, 'es')}`,
              en: `Digital portrait: ${loc(it.name, 'en')}`,
            }),
            entity: pic(`07-${it.id}-entidad.jpg`, '1 / 1', {
              es: `Entidad a carboncillo: ${loc(it.name, 'es')}`,
              en: `Charcoal entity: ${loc(it.name, 'en')}`,
            }),
          })),
        },
      ],
    },

    // ------------------------------------------------------------ Publicidad (crowdfunding, carteles, pósters, marcapáginas)
    {
      id: 'publicidad',
      title: { es: 'Publicidad', en: 'Advertising' },
      blocks: [
        {
          kind: 'split',
          text: [
            {
              es: 'Para este apartado he creado **pósters** y **marcapáginas**. Estos dos elementos tienen la misma finalidad:',
              en: 'For this section I created **prints** and a **bookmark**. Both share the same purpose:',
            },
            {
              es: 'Antes de sacar a la venta el libro, una posibilidad para poder asumir los costes de producción es realizar un **crowdfunding**. De esta manera, el trabajo tendrá una financiación.',
              en: 'Before the book goes on sale, one way to cover the production costs is a **crowdfunding** campaign. This way, the work gets funded.',
            },
            {
              es: 'Tanto los pósters como el marcapáginas serían elementos de **recompensa** para las personas que aporten económicamente al proyecto.',
              en: 'Both the prints and the bookmark would be **rewards** for the people who contribute financially to the project.',
            },
          ],
          images: [
            pic('04-publicidad.jpg', '4 / 3', {
              es: 'El libro abierto sobre un fondo de color (mockup)',
              en: 'The open book on a coloured background (mockup)',
            }),
          ],
        },
        {
          kind: 'split',
          heading: { es: 'Cartel informativo', en: 'Information poster' },
          text: [
            {
              es: 'Este cartel tiene la **finalidad** de **comunicar** el lugar, día y hora de la presentación oficial del libro. El cartel está hecho con **Photoshop** y contiene un gráfico basado en la composición de tres elementos: uno de los retratos y un dibujo a carboncillo de los que aparecen en el libro y un mockup creado desde cero para mostrar el libro.',
              en: 'This poster is meant to **communicate** the place, day and time of the book’s official launch. It was made with **Photoshop** and contains a graphic based on the composition of three elements: one of the portraits and a charcoal drawing from the book, and a mockup created from scratch to show the book.',
            },
            {
              es: 'Para la composición del título de cartel se ha utilizado **Illustrator**, jugando con la distribución de las palabras y ordenándose como si se tratara de un **puzle**.',
              en: 'The title of the poster was composed in **Illustrator**, playing with the arrangement of the words and ordering them as if they were a **puzzle**.',
            },
            {
              es: 'Se ha añadido también un subtítulo para dar más información al espectador del contenido del libro.',
              en: 'A subtitle was also added to tell the viewer more about the content of the book.',
            },
            {
              es: 'Por último, he creado dos apartados para exponer la fecha, lugar y hora del evento. En estos apartados he jugado con los tamaños y tipos de fuente para atraer al espectador a lo más importante.',
              en: 'Finally, I created two blocks to show the date, place and time of the event, playing with sizes and typefaces to draw the viewer to what matters most.',
            },
          ],
          images: [
            pic('03-1-cartel-informativo.jpg', '4 / 5', {
              es: 'Mockup del cartel informativo en la calle',
              en: 'Mockup of the information poster on the street',
            }, { position: '51% 50%' }),
          ],
        },
        {
          kind: 'split',
          heading: { es: 'Cartel publicitario', en: 'Advertising poster' },
          text: [
            {
              es: 'Este cartel tiene la **finalidad** de **llamar la atención** al espectador por la ilustración que contiene. Simplemente es un anuncio del libro que más que dar respuestas, pretende dejar una sensación de incertidumbre.',
              en: 'This poster is meant to **catch the viewer’s attention** with its illustration. It is simply an ad for the book that, rather than giving answers, aims to leave a feeling of uncertainty.',
            },
            {
              es: 'La ilustración está creada con **Illustrator**, se trata de una forma de cara que, con un efecto de **degradado**, se repite cada vez más pequeña hacia el centro creando sensación de profundidad. Al final, se encuentra una de las caras de las ilustraciones del libro.',
              en: 'The illustration was made with **Illustrator**: a face shape that, with a **gradient** effect, repeats ever smaller towards the centre, creating a sense of depth. At the end sits one of the faces from the book’s illustrations.',
            },
            {
              es: 'Al igual que en el cartel informativo, el texto se ha añadido posteriormente en la maquetación de **InDesign**. En la parte textual se da la mínima información para fomentar la idea anterior de intriga.',
              en: 'As with the information poster, the text was added later in the **InDesign** layout. The text gives minimal information to feed that idea of intrigue.',
            },
          ],
          images: [
            pic('03-2-cartel-publicitario.png', '4 / 5', {
              es: 'Mockup del cartel publicitario',
              en: 'Mockup of the advertising poster',
            }),
          ],
        },
        {
          kind: 'split',
          heading: { es: 'Pósters', en: 'Prints' },
          text: [
            {
              es: 'Uno de los pósters está creado con **Photoshop** y el otro con **Illustrator**.',
              en: 'One of the prints was made with **Photoshop** and the other with **Illustrator**.',
            },
            {
              es: 'El primero tiene como tema el trastorno del espectro autista. Se ha creado una composición en la que se juega con un fondo desorganizado, una mancha de pintura y la propia ilustración a carboncillo. En el proceso han hecho falta varios procesos de **selección** para llegar al resultado final.',
              en: 'The first is about autism spectrum disorder. The composition plays with a disorganised background, a paint stain and the charcoal illustration itself. Several **selection** processes were needed to reach the final result.',
            },
            {
              es: 'El texto se ha añadido en **InDesign**, que cuenta con el título y la descripción.',
              en: 'The text, with the title and the description, was added in **InDesign**.',
            },
            {
              es: 'El segundo póster cuenta con una ilustración vectorial de uno de los retratos del libro. Además, a través de una **fusión** y una **distorsión**, se ha creado el fondo que recuerda al mar por encima del retrato. Por último, también en Illustrator, se ha añadido la palabra Ansiedad y se ha distorsionado, para crear un efecto desordenado.',
              en: 'The second print features a vector illustration of one of the book’s portraits. Through a **blend** and a **distortion**, a background reminiscent of the sea was created above the portrait. Finally, also in Illustrator, the word Anxiety was added and distorted to create a messy effect.',
            },
          ],
          images: [
            pic('04-1-poster-1.jpg', '4 / 5', {
              es: 'Póster del trastorno del espectro autista',
              en: 'Print about autism spectrum disorder',
            }, { caption: { es: 'Póster 1', en: 'Print 1' }, position: '42% 50%' }),
            pic('04-1-poster-2.jpg', '4 / 5', {
              es: 'Póster de la ansiedad',
              en: 'Print about anxiety',
            }, { caption: { es: 'Póster 2', en: 'Print 2' }, position: '31% 50%' }),
          ],
        },
        {
          kind: 'split',
          heading: { es: 'Marcapáginas', en: 'Bookmark' },
          text: [
            {
              es: 'El **marcapáginas** cuenta con el anverso y el reverso. Ambas partes están creadas en **Photoshop** y el texto se ha añadido posteriormente en la maquetación de **InDesign**.',
              en: 'The **bookmark** has a front and a back. Both sides were created in **Photoshop** and the text was added later in the **InDesign** layout.',
            },
            {
              es: 'Uno de los lados tiene una representación oscura con dos ilustraciones a carboncillo fundidas con el fondo utilizando modos de **fusión de capas**. El otro lado contiene dos de los retratos también fusionados con un fondo más claro.',
              en: 'One side has a dark composition with two charcoal illustrations merged into the background using **layer blend modes**. The other side holds two of the portraits, also merged into a lighter background.',
            },
            {
              es: 'Ambos lados tienen en el fondo el **patrón** que se utiliza en el interior de la cubierta.',
              en: 'Both sides have the **pattern** used on the inside of the cover in the background.',
            },
          ],
          images: [
            pic('04-2-marcapaginas.jpg', '4 / 5', {
              es: 'Anverso y reverso del marcapáginas',
              en: 'Front and back of the bookmark',
            }),
          ],
        },
      ],
    },

    // ------------------------------------------------------------ Estética y formatos (tipografías, color, tamaños)
    {
      id: 'estetica',
      title: { es: 'Estética y formatos', en: 'Aesthetics & formats' },
      blocks: [
        {
          kind: 'aesthetic',
          heading: { es: 'Estética', en: 'Aesthetics' },
          fonts: [
            {
              name: 'Caecilla LT Std',
              image: pic('06-tipografia-caecilla.png', '7 / 5', 'Caecilla LT Std: 45 Light, 56 Italic, 55 Roman, 75 Bold, 76 Bold Italic, 85 Heavy'),
            },
            {
              name: 'Reem Kufi Fun',
              image: pic('06-tipografia-reem.png', '7 / 5', 'Reem Kufi Fun: Regular, Medium, SemiBold, Bold'),
            },
            {
              name: 'Acumin Variable Concept',
              image: pic('06-tipografia-acumin.png', '7 / 5', 'Acumin Variable Concept: Condensed Thin, Extracondensed Extralight, Extracondensed'),
            },
          ],
          colours: [
            { cmyk: [52, 9, 15, 86], swatch: '#20363b', dark: true },
            { cmyk: [0, 0, 0, 0], swatch: '#ffffff', dark: false },
            { cmyk: [91, 79, 62, 97], swatch: '#050505', dark: true },
          ],
        },
        {
          kind: 'sizes',
          heading: { es: 'Tamaños', en: 'Sizes' },
          intro: {
            es: 'Todos los archivos finales son para **imprenta**:',
            en: 'All final files are **print-ready**:',
          },
          chips: ['CMYK', { es: '300 ppp', en: '300 ppi' }, { es: 'Sangre 3 mm', en: 'Bleed 3 mm' }],
          items: [
            { label: { es: 'Libro', en: 'Book' }, value: '147 × 210 mm' },
            { label: { es: 'Carteles', en: 'Posters' }, value: '594 × 841 mm' },
            { label: { es: 'Pósters', en: 'Prints' }, value: '420 × 594 mm' },
            { label: { es: 'Marcapáginas', en: 'Bookmark' }, value: '50 × 210 mm' },
            { label: { es: 'Cubierta', en: 'Cover' }, value: '399 × 210 mm' },
          ],
          image: pic(
            '05-tamanos.png',
            '4 / 5',
            { es: 'Esquema de los tamaños, a escala', en: 'Diagram of the sizes, to scale' },
            { position: '85% 50%' },
          ),
        },
      ],
    },
  ],
};

/** Detail sections by project id. */
export const PROJECT_PAGES: Record<string, ProjectPage> = {
  'bloom-states': caras,
};
