import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://inhead.app',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
