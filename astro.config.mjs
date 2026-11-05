import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://inhead.app',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // The Beta page is parked (src/pages/_beta.astro); old links to it land on the home page.
  redirects: { '/beta': '/' },
  integrations: [sitemap()],
});
