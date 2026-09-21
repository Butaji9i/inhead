export const SITE_NAME = 'Inhead';
export const SITE_URL = 'https://inhead.app';
export const CONTACT_EMAIL = 'support@inhead.app';
// null until the app is live. When set, the page links to the App Store and
// emits MobileApplication markup.
// When this is set, also re-run `node scripts/make-og.mjs` from the repo root
// (public/og.png says "Coming soon"), and fill in `@id`/`url` on the
// MobileApplication node in src/lib/jsonld.mjs.
export const STORE_URL: string | null = null;
// numeric App Store id, set together with STORE_URL when the app is live
export const APP_STORE_ID: string | null = null;
