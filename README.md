# inhead.app

Source of the website at https://inhead.app: a static site built with
[Astro](https://astro.build) and deployed to GitHub Pages by GitHub Actions.

## Develop

```sh
npm ci
npm run dev        # local dev server
npm test           # unit tests
npm run build      # static build into dist/
npm run check      # checks on the built site
npm run preview    # serve dist/ on :4321 (needed for npm run a11y)
npm run a11y       # accessibility scan of the built pages
```

## Layout

- `src/pages/` pages; `src/pages/privacy.md` is the privacy policy, served at `/privacy/`
- `src/components/`, `src/layouts/`, `src/styles/` the UI
- `src/data/copy.mjs` page text; `src/config.ts` site settings
- `src/assets/screens/` optimised screenshots; `public/` static files (incl. `CNAME`)
- `scripts/` build checks, tests and the accessibility scan
