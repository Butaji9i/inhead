import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findViolations, checkRequired, checkJsonLd, checkImgAlt, checkStoreGating, checkRequiredAssets } from './check-dist.mjs';

const page = (content, path = 'index.html') => ({ path, content });

test('clean page passes', () => {
  assert.deepEqual(
    findViolations([page('<a href="mailto:support@inhead.app">support@inhead.app</a>')], []),
    [],
  );
});

test('other email address is rejected', () => {
  const v = findViolations([page('write to someone@example.com')], []);
  assert.equal(v.length, 1);
  assert.match(v[0], /someone@example\.com/);
});

test('github.com link is rejected', () => {
  assert.equal(findViolations([page('<a href="https://github.com/x/y">x</a>')], []).length, 1);
});

test('"maintained by" is rejected case-insensitively', () => {
  assert.equal(findViolations([page('Maintained By someone')], []).length, 1);
});

test('extra forbidden strings are rejected case-insensitively', () => {
  assert.equal(findViolations([page('hello SECRETNAME')], ['secretname']).length, 1);
});

test('empty extra entries are ignored', () => {
  assert.deepEqual(findViolations([page('hello')], ['', '  ']), []);
});

test('binary-like files are not scanned', () => {
  assert.deepEqual(findViolations([page('a@b.co', 'og.png')], []), []);
});

test('missing privacy page is reported', () => {
  assert.equal(checkRequired(['index.html'], 'inhead.app').length, 1);
});

test('wrong CNAME is reported', () => {
  assert.equal(checkRequired(['privacy/index.html'], 'other.example').length, 1);
});

test('missing CNAME is reported', () => {
  assert.equal(checkRequired(['privacy/index.html'], null).length, 1);
});

test('correct CNAME with trailing newline passes', () => {
  assert.deepEqual(checkRequired(['privacy/index.html'], 'inhead.app\n'), []);
});

test('retina asset names like logo@2x.png do not trigger email violations', () => {
  const v = findViolations([page('<img src="/logo@2x.png" srcset="/hero@2x.jpg 2x, /icon@3x.webp 3x">')], []);
  assert.deepEqual(v, []);
});

test('support@inhead.app (allowed) still passes', () => {
  assert.deepEqual(
    findViolations([page('Contact: support@inhead.app')], []),
    [],
  );
});

test('Support@Inhead.App (case-insensitive) still passes', () => {
  assert.deepEqual(
    findViolations([page('Contact: Support@Inhead.App')], []),
    [],
  );
});

test('someone@example.com is still rejected', () => {
  const v = findViolations([page('Email: someone@example.com')], []);
  assert.equal(v.length, 1);
  assert.match(v[0], /someone@example\.com/);
});

test('support@inhead.app.evil.com (lookalike) is rejected', () => {
  const v = findViolations([page('support@inhead.app.evil.com')], []);
  assert.equal(v.length, 1);
  assert.match(v[0], /support@inhead\.app\.evil\.com/);
});

test('@media (prefers-color-scheme: dark) produces no violations', () => {
  assert.deepEqual(
    findViolations([page('@media (prefers-color-scheme: dark) { }')], []),
    [],
  );
});

test('email inside a .css file is flagged', () => {
  assert.equal(findViolations([page('a{content:"a@b.co"}', '_astro/x.css')], []).length, 1);
});

test('minified dark-mode css and @import are not flagged', () => {
  const css = '@import url(x.css);a{color:red}@media(prefers-color-scheme:dark){:root{--x:1}}';
  assert.deepEqual(findViolations([page(css, '_astro/x.css')], []), []);
});

test('github.com in a .js file is flagged', () => {
  assert.equal(findViolations([page('fetch("https://github.com/x")', '_astro/x.js')], []).length, 1);
});

const ld = (obj) => `<script type="application/ld+json">${typeof obj === 'string' ? obj : JSON.stringify(obj)}</script>`;

test('valid json-ld passes', () => {
  assert.deepEqual(checkJsonLd([page(ld({ '@context': 'https://schema.org', '@type': 'WebSite' }))]), []);
});
test('json-ld that does not parse is reported', () => {
  assert.equal(checkJsonLd([page(ld('{ not json'))]).length, 1);
});
test('aggregateRating anywhere in json-ld is reported', () => {
  const bad = ld({ '@graph': [{ '@type': 'MobileApplication', aggregateRating: { ratingValue: 5 } }] });
  assert.equal(checkJsonLd([page(bad)]).length, 1);
});
test('review anywhere in json-ld is reported', () => {
  assert.equal(checkJsonLd([page(ld({ '@graph': [{ review: [] }] }))]).length, 1);
});
test('json-ld in non-html files is ignored', () => {
  assert.deepEqual(checkJsonLd([page(ld('{ not json'), 'notes.txt')]), []);
});

test('img with alt passes, including empty alt', () => {
  assert.deepEqual(checkImgAlt([page('<img src="a.webp" alt="A month view"><img src="b.svg" alt="">')]), []);
});
test('img without alt is reported', () => {
  assert.equal(checkImgAlt([page('<img src="a.webp">')]).length, 1);
});
test('img alt that says placeholder is reported', () => {
  assert.equal(checkImgAlt([page('<img src="a.webp" alt="Placeholder for a screenshot">')]).length, 1);
});

test('store markup is reported while STORE_URL is null', () => {
  assert.equal(checkStoreGating([page(ld({ '@type': 'MobileApplication' }))], true).length, 1);
  assert.equal(checkStoreGating([page('<meta name="apple-itunes-app" content="app-id=1">')], true).length, 1);
});
test('store markup is allowed once STORE_URL is set', () => {
  assert.deepEqual(checkStoreGating([page(ld({ '@type': 'MobileApplication' }))], false), []);
});

test('missing required assets are each reported', () => {
  const all = ['sitemap-index.xml', 'robots.txt', 'favicon.ico', 'apple-touch-icon.png', 'og.png', 'icon-512.png'];
  assert.deepEqual(checkRequiredAssets(all), []);
  assert.equal(checkRequiredAssets(all.filter((p) => p !== 'og.png')).length, 1);
  assert.equal(checkRequiredAssets([]).length, 6);
});

// Fix round 1 regression tests
test('img with data-alt but no alt is flagged', () => {
  assert.equal(checkImgAlt([page('<img src="a.webp" data-alt="x">')]).length, 1);
});
test('img with alt inside title attribute but no alt is flagged', () => {
  assert.equal(checkImgAlt([page('<img src="a.webp" title=\'x alt="y"\'>')]).length, 1);
});
test('img alt with spaces around equals passes', () => {
  assert.deepEqual(checkImgAlt([page('<img src="a.webp" alt = "x">')]), []);
});
test('img with unquoted alt attribute passes', () => {
  assert.deepEqual(checkImgAlt([page('<img src="a.webp" alt=description>')]), []);
});
test('img with > in another attribute and alt passes', () => {
  assert.deepEqual(checkImgAlt([page('<img title="a>b" alt="x">')]), []);
});
test('img with uppercase ALT passes', () => {
  assert.deepEqual(checkImgAlt([page('<img src="a.webp" ALT="x">')]), []);
});
test('img with alt but no value passes', () => {
  assert.deepEqual(checkImgAlt([page('<img src="a.webp" alt>')]), []);
});

test('unquoted-type json-ld with review is flagged', () => {
  assert.equal(checkJsonLd([page('<script type=application/ld+json>{"review":1}</script>')]).length, 1);
});

test('mobileapplication lowercase while STORE_URL is null is flagged', () => {
  assert.equal(checkStoreGating([page('{"@type":"mobileapplication"}')], true).length, 1);
});
test('apple-itunes-app lowercase while STORE_URL is null is flagged', () => {
  assert.equal(checkStoreGating([page('<meta name="apple-itunes-app" content="1">')], true).length, 1);
});

test('checkRequiredAssets accepts ./og.png', () => {
  const all = ['sitemap-index.xml', 'robots.txt', 'favicon.ico', 'apple-touch-icon.png', './og.png', 'icon-512.png'];
  assert.deepEqual(checkRequiredAssets(all), []);
});
test('checkRequiredAssets accepts backslash paths', () => {
  const all = ['sitemap-index.xml', 'robots.txt', 'favicon.ico', 'apple-touch-icon.png', '.\\og.png', 'icon-512.png'];
  assert.deepEqual(checkRequiredAssets(all), []);
});
