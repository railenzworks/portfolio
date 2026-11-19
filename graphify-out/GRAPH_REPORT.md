# Graph Report - portfolio  (2026-11-19)

## Corpus Check
- 56 files · ~28,403 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 47 file(s) not represented in the graph (top: .css 26, .ttf 19, .example 1)
- WARNING: 47 of 147 files seen (32%) have no supported extractor and are missing from this graph entirely. It may look complete while representing only part of the codebase.

## Summary
- 318 nodes · 675 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6398d83a`
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
- next
- LangProvider.tsx
- eslint.config.mjs
- María Railenz — Portfolio
- allowBuilds
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `useLang()` - 39 edges
2. `react` - 28 edges
3. `getDict()` - 22 edges
4. `next` - 22 edges
5. `compilerOptions` - 16 edges
6. `TransitionLink()` - 15 edges
7. `Footer()` - 14 edges
8. `RootLayout()` - 13 edges
9. `Project` - 12 edges
10. `HomePage()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `getDict()`  [EXTRACTED]
  app/about/page.tsx → lib/i18n-server.ts
- `AboutPage()` --calls--> `AboutPages()`  [EXTRACTED]
  app/about/page.tsx → components/AboutPages.tsx
- `generateMetadata()` --calls--> `getDict()`  [EXTRACTED]
  app/calendario/page.tsx → lib/i18n-server.ts
- `generateMetadata()` --calls--> `getDict()`  [EXTRACTED]
  app/contact/page.tsx → lib/i18n-server.ts
- `RootLayout()` --calls--> `ContactFolder()`  [EXTRACTED]
  app/layout.tsx → components/ContactFolder.tsx

## Import Cycles
- None detected.

## Communities (14 total, 1 thin omitted)

### Community 0 - "layout.tsx"
Cohesion: 0.06
Nodes (37): metadata, parkinsansMono, parkinsansRead, railenz, RootLayout(), valleySans, BottomBlur(), CALENDAR_EVENT (+29 more)

### Community 1 - "app/page.tsx"
Cohesion: 0.11
Nodes (29): AboutPage(), CAROUSEL_PHOTOS, GALLERY, generateMetadata(), pick(), generateMetadata(), ContactPage(), generateMetadata() (+21 more)

### Community 2 - "WorksGrid.tsx"
Cohesion: 0.10
Nodes (29): Arrow(), FeaturedTabs(), FeaturedTabsProps, PIP_COLOR, ProjectCover(), ProjectCoverProps, ASPECT, PIP_COLOR (+21 more)

### Community 3 - "useLang"
Cohesion: 0.14
Nodes (18): AboutBio(), highlight(), Tab, AboutCarousel(), AboutCarouselProps, CarouselImage, SLOTS, slotTransform() (+10 more)

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

### Community 8 - "next"
Cohesion: 0.15
Nodes (10): escapeHtml(), fail(), POST(), CONTACT_EVENT, ContactFolder(), Stage, TransitionLinkProps, WIP_EVENT (+2 more)

### Community 9 - "LangProvider.tsx"
Cohesion: 0.26
Nodes (11): LangContext, DEFAULT_LANG, Dict, DICT, en, es, isLang(), Lang (+3 more)

### Community 10 - "eslint.config.mjs"
Cohesion: 0.25
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 11 - "María Railenz — Portfolio"
Cohesion: 0.33
Nodes (5): Adding a project, Deploy, Local development, María Railenz — Portfolio, Project structure

### Community 12 - "allowBuilds"
Cohesion: 0.50
Nodes (3): allowBuilds, sharp, unrs-resolver

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `layout.tsx` to `app/page.tsx`, `WorksGrid.tsx`, `useLang`, `FooterSeasonFx.tsx`, `package.json`, `next`, `LangProvider.tsx`?**
  _High betweenness centrality (0.221) - this node is a cross-community bridge._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05565638233514821 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `layout.tsx`, `app/page.tsx`, `WorksGrid.tsx`, `useLang`, `package.json`, `LangProvider.tsx`?**
  _High betweenness centrality (0.163) - this node is a cross-community bridge._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11265969802555169 - nodes in this community are weakly interconnected._
- **Why does `useLang()` connect `useLang` to `layout.tsx`, `app/page.tsx`, `WorksGrid.tsx`, `next`, `LangProvider.tsx`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Should `WorksGrid.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0975609756097561 - nodes in this community are weakly interconnected._
- **Should `useLang` be split into smaller, more focused modules?**
  _Cohesion score 0.1354679802955665 - nodes in this community are weakly interconnected._