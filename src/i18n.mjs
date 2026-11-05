// The site's languages. English is the default and lives at the root; the others under /<lang>/.
// Page copy is in src/data/copy*.mjs; the words around it (navigation, footer, page titles) are here.
import * as en from './data/copy.mjs';
import * as ru from './data/copy.ru.mjs';
import * as cs from './data/copy.cs.mjs';

export const DEFAULT_LANG = 'en';
export const LANGS = ['en', 'ru', 'cs'];

const copies = { en, ru, cs };
export const copyFor = (lang) => copies[lang] ?? copies[DEFAULT_LANG];

// What a language calls itself, for the switcher; `og` is the Open Graph locale.
export const LANG_META = {
  en: { name: 'English', short: 'EN', og: 'en_US' },
  ru: { name: 'Русский', short: 'RU', og: 'ru_RU' },
  cs: { name: 'Čeština', short: 'CS', og: 'cs_CZ' },
};

/** The language of a site path: '/ru/privacy/' → 'ru', '/privacy/' → 'en'. */
export function langFromPath(path) {
  const first = String(path).split('/')[1];
  return LANGS.includes(first) && first !== DEFAULT_LANG ? first : DEFAULT_LANG;
}

/** The path without its language prefix: '/ru/privacy/' → '/privacy/'. */
export function basePath(path) {
  const lang = langFromPath(path);
  return lang === DEFAULT_LANG ? path : path.slice(lang.length + 1) || '/';
}

/** A base path in a language: ('ru', '/privacy/') → '/ru/privacy/'. */
export function localePath(lang, path) {
  return lang === DEFAULT_LANG ? path : `/${lang}${path}`;
}

// The App Store link per language: the same app, in the storefront its readers most likely use, so the
// web page they land on (on a computer) is in their language. On iPhone and iPad any of them opens the
// App Store app in the reader's own storefront.
const STOREFRONT = { en: 'us', ru: 'ru', cs: 'cz' };
export function storeUrlFor(storeUrl, lang) {
  return storeUrl?.replace('/us/', `/${STOREFRONT[lang] ?? 'us'}/`) ?? null;
}

export const ui = {
  en: {
    skip: 'Skip to content',
    navLabel: 'Main',
    home: 'Home',
    privacy: 'Privacy',
    privacyPolicy: 'Privacy policy',
    support: 'Support',
    site: 'Site',
    language: 'Language',
    models: '3D models',
    by: 'by',
    homeTitle: 'Inhead — your headache diary, kept in order',
    homeDescription:
      'Inhead is a headache diary for iPhone and iPad. Record what happened, see what your own records add up to, and take it to your doctor. No account, no server of ours.',
    ogAlt: 'The Inhead app icon beside the words: your headache diary, kept in order.',
    comingSoon: 'Coming soon to the App Store',
    ogNote: 'Now on the App Store',
  },
  ru: {
    skip: 'Перейти к содержанию',
    navLabel: 'Основное меню',
    home: 'Главная',
    privacy: 'Приватность',
    privacyPolicy: 'Политика конфиденциальности',
    support: 'Поддержка',
    site: 'Сайт',
    language: 'Язык',
    models: '3D-модели',
    by: '— автор',
    homeTitle: 'Inhead — ваш дневник головной боли, всё по порядку',
    homeDescription:
      'Inhead — дневник головной боли для iPhone и iPad. Записывайте, что произошло, смотрите, что складывается из ваших записей, и показывайте это врачу. Без аккаунта и без нашего сервера.',
    ogAlt: 'Значок приложения Inhead и слова: ваш дневник головной боли, всё по порядку.',
    comingSoon: 'Скоро в App Store',
    ogNote: 'Уже в App Store',
  },
  cs: {
    skip: 'Přejít na obsah',
    navLabel: 'Hlavní menu',
    home: 'Domů',
    privacy: 'Soukromí',
    privacyPolicy: 'Zásady ochrany soukromí',
    support: 'Podpora',
    site: 'Web',
    language: 'Jazyk',
    models: '3D modely',
    by: 'od',
    homeTitle: 'Inhead — váš deník bolestí hlavy, přehledně uspořádaný',
    homeDescription:
      'Inhead je deník bolestí hlavy pro iPhone a iPad. Zapisujte, co se stalo, podívejte se, co vaše záznamy dávají dohromady, a vezměte je k lékaři. Bez účtu, bez našeho serveru.',
    ogAlt: 'Ikona aplikace Inhead a slova: váš deník bolestí hlavy, přehledně uspořádaný.',
    comingSoon: 'Brzy v App Storu',
    ogNote: 'Nyní v App Storu',
  },
};
