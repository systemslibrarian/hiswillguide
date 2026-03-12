# HisWillGuide.com — Render-Ready React Site

A polished one-page React/Vite site for **HisWillGuide.com**, designed for a GitHub-to-Render deployment flow.

## Features

- elegant dark Scripture-centered design
- branded homepage for **HisWillGuide.com**
- four anchor sections: Scripture, Prayer, Wisdom, Discernment
- interactive 8-step guide for discerning God's will
- per-step reflection checklist saved in localStorage
- reflection journal saved in localStorage
- static-site friendly for easy hosting on Render

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm install
npm run build
npm run preview
```

## Deploy to GitHub + Render

1. Create a new GitHub repository.
2. Upload this project to the repo root.
3. In Render, create a **Static Site** and connect the GitHub repo.
4. Use these settings:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. Deploy.

A `render.yaml` file is included, so Render can often detect the correct setup automatically.

## Suggested next improvements

- add a custom domain for `HisWillGuide.com`
- add favicon / social preview image
- add a Scripture library page or devotionals page later
- migrate into Next.js later if you want multi-page routing
