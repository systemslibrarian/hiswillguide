# HisWillGuide.com

A calm, Scripture-centered guide to discerning God's will through surrender, Scripture, prayer, wisdom, and obedient trust.

**🌐 Live demo: [HisWillGuide.com](https://hiswillguide.com)**

## Features

- Elegant dark/light theme with toggle
- Branded homepage for **HisWillGuide.com**
- Four anchor sections: Scripture, Prayer, Wisdom, Discernment
- Interactive 8-step guide for discerning God's will
- Per-step reflection checklist saved in localStorage
- Reflection journal saved in localStorage
- Fully mobile-responsive (320px to desktop)
- WCAG 2.1 AA accessible (screen readers, keyboard, high contrast)
- Deployed automatically via GitHub Actions to GitHub Pages

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deployment

This site deploys automatically to **GitHub Pages** on every push to `main` via GitHub Actions.

### Custom domain setup

1. In your GitHub repo, go to **Settings → Pages**.
2. Under **Source**, select **GitHub Actions**.
3. Under **Custom domain**, enter `HisWillGuide.com`.
4. Configure your DNS provider to point to GitHub Pages:
   - **A records** (apex domain):
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **CNAME record** (www):
     ```
     www → systemslibrarian.github.io
     ```
5. Check **Enforce HTTPS** once DNS propagates.

## Tech stack

- [React 18](https://react.dev)
- [Vite 5](https://vitejs.dev)
- [GitHub Actions](https://docs.github.com/en/actions) for CI/CD
- [GitHub Pages](https://pages.github.com) for hosting
