import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://inhead.app',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // The Beta page is parked (src/pages/_beta.astro); old links to it land on the home page.
  redirects: { '/beta': '/' },
  // hreflang alternates for every page in English, Russian and Czech (the languages are in src/i18n.mjs).
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', ru: 'ru', cs: 'cs' } } })],
});
