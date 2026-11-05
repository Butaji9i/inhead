import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LANGS, copyFor, ui, langFromPath, basePath, localePath, storeUrlFor } from '../src/i18n.mjs';

function strings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  // `key` names a row or tile in code; it is not text anyone reads.
  else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => k !== 'key' && strings(v, out));
  return out;
}

// The shape of a value with its strings blanked: two languages match when they have the same keys, rows and points.
const shape = (v) => (typeof v === 'string' ? '' : Array.isArray(v) ? v.map(shape) : v && typeof v === 'object'
  ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === 'key' ? x : shape(x)])) : v);

const PAGE_COPY = ['hero', 'rows', 'privacy', 'cta', 'shots', 'footer', 'disclaimer'];

test('every language has the same copy, row for row and point for point', () => {
  const en = copyFor('en');
  for (const lang of LANGS) {
    const c = copyFor(lang);
    for (const k of PAGE_COPY) assert.deepEqual(shape(c[k]), shape(en[k]), `${lang}.${k}`);
    assert.deepEqual(Object.keys(ui[lang]).sort(), Object.keys(ui.en).sort(), `ui.${lang}`);
  }
});

test('no copy is left in English in another language', () => {
  const en = new Set(strings(PAGE_COPY.map((k) => copyFor('en')[k])));
  for (const lang of ['ru', 'cs']) {
    for (const s of strings(PAGE_COPY.map((k) => copyFor(lang)[k]))) assert.ok(!en.has(s), `${lang} still English: ${s}`);
  }
});

// The words the app may not use (scripts/copy.test.mjs has the English), in the stems the app's own Russian
// and Czech guard uses (headacher-ios InheadTests/CatalogLanguage.swift) plus the marketing verbs.
const FORBIDDEN = {
  ru: /(диагно|выявл|обнаруж|распозна|предсказ|прогноз|вылеч|лечит|исцел|предотвра|профилакт|уменьша|снижа|облегч|избав|критерии выполн|соответству\S*\s+критери|злоупотребл|избыточн|хроническ|эффективн|помога)/i,
  cs: /(diagnó|diagnost|odhal|rozpozn|identifik|předpov|vyléč|léčí|prevenc|předcház|sníž|snižuj|úlev|zmírň|kritéria splněn|splňuj\S*\s+kritéri|nadužív|chronick|účinn|pomáh)/i,
};

test('Russian and Czech copy avoid the words the app itself may not use', () => {
  for (const lang of ['ru', 'cs']) {
    const c = copyFor(lang);
    // The disclaimer is the app's own sentence and mentions treatment on purpose, as the English one does.
    for (const s of strings(['hero', 'rows', 'privacy', 'cta', 'shots', 'footer'].map((k) => c[k]))) {
      assert.doesNotMatch(s, FORBIDDEN[lang], `${lang}: ${s}`);
    }
  }
});

test('the guards actually match', () => {
  for (const s of ['не является диагнозом', 'выявляет триггеры', 'соответствуют критериям', 'предотвращает приступы']) assert.match(s, FORBIDDEN.ru, s);
  for (const s of ['nejde o diagnózu', 'odhalí spouštěče', 'kritéria splněna', 'pomáhá předcházet']) assert.match(s, FORBIDDEN.cs, s);
});

const MONEY = /(\d\s?(₽|руб|Kč|CZK|USD|EUR|€|\$)|[$€]\s?\d)/i;
const PRICE_WORDS = /(бесплатн|цен[аы]|подписк|рейтинг|звёзд|звезд|отзыв|премиум|zdarma|cena|předplat|hodnocen|hvězd|recenz|prémi)/i;

test('no rating, review or price wording in Russian or Czech', () => {
  for (const lang of ['ru', 'cs']) {
    const all = strings(PAGE_COPY.map((k) => copyFor(lang)[k])).join(' ');
    assert.doesNotMatch(all, MONEY, lang);
    assert.doesNotMatch(all, PRICE_WORDS, lang);
  }
});

// The disclaimer is the app's own sentence, verbatim (headacher-ios AppDisclaimer.swift, Localizable.xcstrings).
test('the disclaimers are the app’s own', () => {
  assert.equal(copyFor('ru').disclaimer,
    'Inhead — дневник головной боли. Он описывает записанное и не является медицинской оценкой; это не медицинская рекомендация — о своих симптомах и лечении поговорите с врачом.');
  assert.equal(copyFor('cs').disclaimer,
    'Inhead je deník bolestí hlavy, který popisuje, co bylo zaznamenáno, a nehodnotí zdravotní stav. Nenahrazuje lékařskou radu — o svých příznacích a léčbě se poraďte s lékařem.');
});

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  cs: ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'],
};
const POLICY = { en: 'src/pages/privacy.md', ru: 'src/pages/ru/privacy.md', cs: 'src/pages/cs/privacy.md' };

function lastUpdated(lang) {
  const text = readFileSync(new URL(`../${POLICY[lang]}`, import.meta.url), 'utf8');
  const m = /\*\*[^*\d]*(\d{1,2})\.?\s+(\p{L}+)\s+(\d{4})/u.exec(text);
  assert.ok(m, `${POLICY[lang]}: no "Last updated" date`);
  const month = MONTHS[lang].indexOf(m[2]);
  assert.ok(month >= 0, `${POLICY[lang]}: unknown month ${m[2]}`);
  return `${m[3]}-${month + 1}-${m[1]}`;
}

test('the translated privacy policies carry the English one’s date', () => {
  // When the English policy changes, its translations change with it, or this fails.
  for (const lang of ['ru', 'cs']) assert.equal(lastUpdated(lang), lastUpdated('en'), POLICY[lang]);
});

test('paths: language, base path and localized path', () => {
  assert.equal(langFromPath('/'), 'en');
  assert.equal(langFromPath('/privacy/'), 'en');
  assert.equal(langFromPath('/ru/'), 'ru');
  assert.equal(langFromPath('/cs/privacy/'), 'cs');
  assert.equal(langFromPath('/russia/'), 'en');
  assert.equal(basePath('/ru/'), '/');
  assert.equal(basePath('/cs/privacy/'), '/privacy/');
  assert.equal(basePath('/privacy/'), '/privacy/');
  assert.equal(localePath('en', '/privacy/'), '/privacy/');
  assert.equal(localePath('ru', '/'), '/ru/');
});

test('store links follow the storefront of each language', () => {
  const us = 'https://apps.apple.com/us/app/inhead/id6814018609';
  assert.equal(storeUrlFor(us, 'en'), us);
  assert.equal(storeUrlFor(us, 'ru'), 'https://apps.apple.com/ru/app/inhead/id6814018609');
  assert.equal(storeUrlFor(us, 'cs'), 'https://apps.apple.com/cz/app/inhead/id6814018609');
  assert.equal(storeUrlFor(null, 'cs'), null);
});
