export const SITE_NAME = 'Inhead';
export const SITE_URL = 'https://inhead.app';
export const CONTACT_EMAIL = 'support@inhead.app';
// The App Store page. When set, the pages link to it, the home page emits MobileApplication markup and
// every page carries the Smart App Banner; null (before launch) shows "Coming soon" instead.
// public/og.png states it too: re-run `node scripts/make-og.mjs` from the repo root after changing this.
export const STORE_URL: string | null = 'https://apps.apple.com/us/app/inhead/id6814018609';
// numeric App Store id, set together with STORE_URL
export const APP_STORE_ID: string | null = '6814018609';
// TestFlight public invite link, used by the Beta page. The page is parked while there is no public beta:
// see "Beta page" in README.md.
export const TESTFLIGHT_URL = 'https://testflight.apple.com/join/3gehNKa2';
