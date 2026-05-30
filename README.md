# María Railenz — Portfolio

Built with **Next.js 15** (App Router), TypeScript, and CSS Modules. Deployed on Vercel.

## Local development

```bash
npm install
npm run dev     # http://localhost:3000
```

## Adding a project

1. Drop the image in `public/images/work/`
2. Add an entry to the `PROJECTS` array in [`lib/projects.ts`](lib/projects.ts)

That's it — the works page, overlay, and home featured grid all source from the same file.

## Project structure

```
app/              Pages (App Router)
components/       Shared UI components
  works/          Works page-specific components
  contact/        Contact form
hooks/            useScrollReveal
lib/              projects.ts — single source of truth for all work data
public/images/    Static assets
```

## Deploy

Push to `main` — Vercel deploys automatically.  
Build command: `npm run build` | Framework: Next.js
