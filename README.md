# Inhead website

Source of https://inhead.app: a landing page for the Inhead headache diary and
its privacy policy.

- `src/pages/privacy.md` is the source of truth for the privacy policy, served
  at `/privacy/`. Change it through a pull request.
- `src/config.ts` holds the App Store URL. While it is `null`, the page shows a
  "Coming soon" label.
- Built with Astro as static HTML and deployed to GitHub Pages by GitHub Actions.
- `public/CNAME` keeps the custom domain in every build.

Develop: `npm ci`, then `npm run dev`. Before opening a pull request run
`npm test`, `npm run build` and `npm run check`.
