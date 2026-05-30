# María Railenz — Portfolio

Live at **[mariarailenz.qzz.io](https://mariarailenz.qzz.io)**  
Netlify fallback: [jade-sfogliatella-c0887e.netlify.app](https://jade-sfogliatella-c0887e.netlify.app) 

## Project structure

```
Railenz/
├── index.html        Home
├── works.html        Portfolio grid
├── about.html        About page
├── contact.html      Contact page
├── 404.html          Custom 404
├── site.css          Shared design system
├── site.js           Cursor, scroll reveals, page transitions
├── assets/
│   ├── work/         Project images (gfx-*.png, ill-*.png)
│   └── *.png         Portrait & hero images
└── netlify.toml      Netlify config (cache headers)
```

## Redeploy

### Option 1 — VS Code task (easiest)

`Ctrl+Shift+P` → **Tasks: Run Task** → **deploy**

### Option 2 — Terminal

Open a **new** terminal in VS Code (`Ctrl+` `` ` ``) and run:

```powershell
netlify deploy --dir . --prod
```

> If `netlify` is not recognised, close the terminal and open a new one — the PATH is set permanently and works in fresh sessions.

### Option 3 — Always works

```powershell
$env:PATH = 'C:\Users\matia\AppData\Local\pnpm\bin;' + $env:PATH
netlify deploy --dir . --prod
```

## Local preview

Press **F5** in VS Code and pick **Serve & Open (Chrome)** or **Serve & Open (Edge)**.

Or run in a terminal:

```powershell
npx serve -l 3000 .
```

## Custom domain DNS

The domain `mariarailenz.qzz.io` is registered at [FreeDomain (DigitalPlat)](https://dash.domain.digitalplat.org/).  
Nameservers are set to Netlify DNS (`dns1–4.p02.nsone.net`), which manages all records automatically.
