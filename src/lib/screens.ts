import type { ImageMetadata } from 'astro';

// Screenshots live in src/assets/screens/ (English) and src/assets/screens/<lang>/ (the app in that language).
// A language without its own copy of a screen, or of its dark version, shows the English one.
const all = import.meta.glob<ImageMetadata>('../assets/screens/**/*.webp', { eager: true, import: 'default' });

const find = (lang: string, file: string): ImageMetadata | undefined =>
  (lang !== 'en' && all[`../assets/screens/${lang}/${file}`]) || all[`../assets/screens/${file}`];

/** The light and dark screenshot of a screen, e.g. screen('ru', 'iphone-week'); `own` when it shows the app in
 *  that language rather than the English fallback. */
export function screen(lang: string, name: string): { light: ImageMetadata; dark?: ImageMetadata; own: boolean } {
  const light = find(lang, `${name}-light.webp`);
  if (!light) throw new Error(`no screenshot ${name}-light.webp`);
  // A language that has its own light screenshot but no dark one shows its light one in both schemes:
  // the app in the reader's language matters more than the colour scheme.
  const ownLight = lang !== 'en' && all[`../assets/screens/${lang}/${name}-light.webp`];
  const dark = ownLight ? all[`../assets/screens/${lang}/${name}-dark.webp`] : find(lang, `${name}-dark.webp`);
  return { light, dark, own: Boolean(ownLight) };
}

/** Whether a screen exists at all (the iPad hero is optional). */
export const hasScreen = (name: string) => Boolean(all[`../assets/screens/${name}-light.webp`]);
