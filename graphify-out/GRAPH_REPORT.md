# Graph Report - portfolio  (2026-11-19)

## Corpus Check
- 65 files · ~38,492 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 54 file(s) not represented in the graph (top: .css 31, .ttf 19, (none) 2)
- WARNING: 54 of 249 files seen (22%) have no supported extractor and are missing from this graph entirely. It may look complete while representing only part of the codebase.

## Summary
- 388 nodes · 833 edges · 17 communities (16 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2343a9ff`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- layout.tsx
- app/page.tsx
- WorksGrid.tsx
- useLang
- FooterSeasonFx.tsx
- package.json
- OvalMark.tsx
- compilerOptions
- route.ts
- LangProvider.tsx
- eslint.config.mjs
- Pasos
- allowBuilds
- vercel.json
- HeroLetters.tsx
- Navegación del código: usar graphify (OBLIGATORIO)
- [id]/page.tsx

## God Nodes (most connected - your core abstractions)
1. `useLang()` - 39 edges
2. `react` - 32 edges
3. `next` - 25 edges
4. `getDict()` - 24 edges
5. `TransitionLink()` - 19 edges
6. `loc()` - 17 edges
7. `Footer()` - 16 edges
8. `compilerOptions` - 16 edges
9. `RootLayout()` - 13 edges
10. `Localized` - 12 edges

## Surprising Connections (you probably didn't know these)
- `7. Selector de ilustraciones (`components/project/Illustrations.tsx` + `.module.css`)` --references--> `FeaturedTabs()`  [INFERRED]
  docs/plan-estetica-las-caras-de-la-mente.md → components/FeaturedTabs.tsx
- `FeaturedTabsProps` --references--> `Project`  [EXTRACTED]
  components/FeaturedTabs.tsx → lib/projects.ts
- `ProjectCoverProps` --references--> `Project`  [EXTRACTED]
  components/ProjectCover.tsx → lib/projects.ts
- `WorkCardProps` --references--> `Project`  [EXTRACTED]
  components/WorkCard.tsx → lib/projects.ts
- `ProjectOverlayProps` --references--> `Project`  [EXTRACTED]
  components/works/ProjectOverlay.tsx → lib/projects.ts

## Import Cycles
- None detected.

## Communities (17 total, 1 thin omitted)

### Community 0 - "layout.tsx"
Cohesion: 0.05
Nodes (44): metadata, parkinsansMono, parkinsansRead, railenz, RootLayout(), valleySans, AboutGalleryProps, COLS (+36 more)

### Community 1 - "app/page.tsx"
Cohesion: 0.12
Nodes (34): AboutPage(), CAROUSEL_PHOTOS, GALLERY, generateMetadata(), pick(), generateMetadata(), ContactPage(), generateMetadata() (+26 more)

### Community 2 - "WorksGrid.tsx"
Cohesion: 0.08
Nodes (32): Arrow(), FeaturedTabsProps, PIP_COLOR, ProjectCover(), ProjectCoverProps, ASPECT, PIP_COLOR, SHORT_CAT (+24 more)

### Community 3 - "useLang"
Cohesion: 0.11
Nodes (21): AboutBio(), highlight(), Tab, AboutCarousel(), AboutCarouselProps, CarouselImage, SLOTS, slotTransform() (+13 more)

### Community 4 - "FooterSeasonFx.tsx"
Cohesion: 0.09
Nodes (24): FooterFlock(), HAWKS, isSpringDay(), MODEL, SEPARATE, TAN_HALF_FOV, TARGET, CLOUD_SHAPES (+16 more)

### Community 5 - "package.json"
Cohesion: 0.09
Nodes (26): dependencies, next@^15.3.3, react@^19.0.0, react-dom@^19.0.0, devDependencies, eslint@^9, eslint-config-next@^15.3.3, @types/node@^22 (+18 more)

### Community 6 - "OvalMark.tsx"
Cohesion: 0.16
Nodes (19): ITEMS, MarqueeProps, arc(), crossings(), ellipseProps(), fmt(), Oval, OVAL_VARIANTS (+11 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "route.ts"
Cohesion: 0.83
Nodes (3): escapeHtml(), fail(), POST()

### Community 9 - "LangProvider.tsx"
Cohesion: 0.28
Nodes (10): LangContext, DEFAULT_LANG, Dict, DICT, en, es, isLang(), Lang (+2 more)

### Community 10 - "eslint.config.mjs"
Cohesion: 0.25
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 11 - "Pasos"
Cohesion: 0.12
Nodes (16): 10. Comprobación, 1. Cabecera de cada sección (`components/project/ProjectSections.module.css`), 2. Subtítulos y texto, 3. Espaciado, 4. Cambio de pestaña con fundido (sin `.reveal` dentro de los paneles), 5. Tarjetas de cristal en lugar de bordes, 6. Datos de Tamaños y Retícula, como la tarjeta de la cabecera, 7. Selector de ilustraciones (`components/project/Illustrations.tsx` + `.module.css`) (+8 more)

### Community 12 - "allowBuilds"
Cohesion: 0.50
Nodes (3): allowBuilds, sharp, unrs-resolver

### Community 14 - "HeroLetters.tsx"
Cohesion: 0.47
Nodes (4): buildScatter(), HeroLetters(), LetterMeta, seededRandom()

### Community 15 - "Navegación del código: usar graphify (OBLIGATORIO)"
Cohesion: 0.40
Nodes (4): graphify, Mantener el grafo actualizado (OBLIGATORIO), Navegación del código: usar graphify (OBLIGATORIO), Qué se versiona

### Community 16 - "[id]/page.tsx"
Cohesion: 0.10
Nodes (26): Arrow(), IllustrationItem, Illustrations(), IllustrationsProps, pad(), Picture(), PictureProps, isPortrait() (+18 more)

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `layout.tsx` to `app/page.tsx`, `WorksGrid.tsx`, `useLang`, `FooterSeasonFx.tsx`, `package.json`, `LangProvider.tsx`, `HeroLetters.tsx`, `[id]/page.tsx`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.050724637681159424 - nodes in this community are weakly interconnected._
- **Why does `next` connect `layout.tsx` to `app/page.tsx`, `WorksGrid.tsx`, `useLang`, `package.json`, `route.ts`, `LangProvider.tsx`, `[id]/page.tsx`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11655874190564293 - nodes in this community are weakly interconnected._
- **Why does `useLang()` connect `useLang` to `layout.tsx`, `app/page.tsx`, `WorksGrid.tsx`, `LangProvider.tsx`, `HeroLetters.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `WorksGrid.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07536231884057971 - nodes in this community are weakly interconnected._
- **Should `useLang` be split into smaller, more focused modules?**
  _Cohesion score 0.11051693404634581 - nodes in this community are weakly interconnected._