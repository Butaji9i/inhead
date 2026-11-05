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
- `src/pages/_beta.astro` the parked Beta page (see below)
- `src/components/`, `src/layouts/`, `src/styles/` the UI
- `src/data/copy.mjs` page text; `src/config.ts` site settings, incl. the App Store link `STORE_URL`
- `src/assets/screens/` optimised screenshots; `public/` static files (incl. `CNAME`)
- `public/models/` the hero's 3D iPhone and iPad, built from the Sketchfab downloads by
  `node scripts/make-models.mjs <iphone_17_pro.glb> <ipad_pro13in_black_m4.glb>`; drawn by `src/scripts/devices3d.ts`
- `scripts/` build checks, tests and the accessibility scan

## Beta page

The TestFlight beta page is parked while there is no public beta: the leading underscore in
`src/pages/_beta.astro` keeps Astro from building it, and `/beta/` redirects to the home page
(`redirects` in `astro.config.mjs`). Its copy (`beta`, `homeBeta` in `src/data/copy.mjs`), styles
(`src/styles/beta.css`) and `TESTFLIGHT_URL` stay in place. To bring it back for a later beta:

1. rename it to `src/pages/beta.astro` and drop the redirect;
2. restore the Beta links in `Nav.astro`, `Footer.astro` and the home page (the pill and the
   softlink, see commit 34d21e1) and the `current === 'beta'` highlight in `Base.astro`;
3. add `/beta/` back to `scripts/a11y.mjs`, and drop the "links to the parked /beta/ page" rule in
   `checkStoreLinks` (`scripts/check-dist.mjs`).
