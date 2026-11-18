import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildJsonLd } from '../src/lib/jsonld.mjs';

const base = { siteUrl: 'https://inhead.app', name: 'Inhead', description: 'A headache diary', contactEmail: 'support@inhead.app' };
const types = (doc) => doc['@graph'].map((n) => n['@type']);

function deepHas(node, keys) {
  if (Array.isArray(node)) return node.some((n) => deepHas(n, keys));
  if (node && typeof node === 'object') return Object.keys(node).some((k) => keys.includes(k) || deepHas(node[k], keys));
  return false;
}

test('home has Organization and WebSite and no app markup while the store URL is null', () => {
  const doc = buildJsonLd({ ...base, path: '/', storeUrl: null });
  assert.equal(doc['@context'], 'https://schema.org');
  assert.deepEqual(types(doc), ['Organization', 'WebSite']);
});

test('organization carries the support email and an absolute logo', () => {
  const org = buildJsonLd({ ...base, path: '/', storeUrl: null })['@graph'][0];
  assert.equal(org.contactPoint.email, 'support@inhead.app');
  assert.equal(org.logo, 'https://inhead.app/icon-512.png');
});

test('MobileApplication appears only when the store URL is set', () => {
  const doc = buildJsonLd({ ...base, path: '/', storeUrl: 'https://apps.apple.com/app/id1' });
  const app = doc['@graph'].find((n) => n['@type'] === 'MobileApplication');
  assert.equal(app.installUrl, 'https://apps.apple.com/app/id1');
  assert.equal(app.operatingSystem, 'iOS');
  assert.equal(app.applicationCategory, 'HealthApplication');
  assert.equal(app.offers.price, '0');
});

test('the privacy page has a WebPage and a two-item breadcrumb', () => {
  const doc = buildJsonLd({ ...base, path: '/privacy/', pageTitle: 'Privacy Policy — Inhead', storeUrl: null });
  assert.deepEqual(types(doc), ['WebPage', 'BreadcrumbList']);
  const crumbs = doc['@graph'][1].itemListElement;
  assert.deepEqual(crumbs.map((c) => [c.position, c.name, c.item]), [
    [1, 'Home', 'https://inhead.app/'],
    [2, 'Privacy', 'https://inhead.app/privacy/'],
  ]);
});

test('never emits aggregateRating or review', () => {
  for (const args of [{ path: '/', storeUrl: null }, { path: '/', storeUrl: 'https://x.example/' }, { path: '/privacy/', storeUrl: null }]) {
    assert.equal(deepHas(buildJsonLd({ ...base, pageTitle: 'P', ...args }), ['aggregateRating', 'review']), false);
  }
});

test('FAQPage carries the questions and answers word for word, on the page that shows them', () => {
  const faq = [{ q: 'Can I log more than one pain level?', a: 'Yes.' }];
  const home = buildJsonLd({ ...base, path: '/', storeUrl: null, faq });
  const node = home['@graph'].find((n) => n['@type'] === 'FAQPage');
  assert.equal(node['@id'], 'https://inhead.app/#faq');
  assert.deepEqual(node.mainEntity, [{ '@type': 'Question', name: faq[0].q, acceptedAnswer: { '@type': 'Answer', text: 'Yes.' } }]);
  const page = buildJsonLd({ ...base, path: '/pain-over-time/', pageTitle: 'P', crumbName: 'Pain over time', storeUrl: null, faq, lang: 'cs', homeUrl: 'https://inhead.app/cs/' });
  assert.deepEqual(types(page), ['WebPage', 'BreadcrumbList', 'FAQPage']);
  assert.equal(page['@graph'][2].url, 'https://inhead.app/cs/pain-over-time/');
  assert.equal(page['@graph'][1].itemListElement[1].name, 'Pain over time');
});

test('no FAQPage without questions', () => {
  assert.ok(!types(buildJsonLd({ ...base, path: '/privacy/', pageTitle: 'P', storeUrl: null })).includes('FAQPage'));
});

test('the app lists its features, and the organization points at its App Store page', () => {
  const store = 'https://apps.apple.com/us/app/inhead/id1';
  const doc = buildJsonLd({ ...base, path: '/', storeUrl: store, features: ['A pain curve per episode'] });
  const app = doc['@graph'].find((n) => n['@type'] === 'MobileApplication');
  assert.deepEqual(app.featureList, ['A pain curve per episode']);
  assert.deepEqual(doc['@graph'][0].sameAs, [store]);
  const page = buildJsonLd({ ...base, path: '/pain-over-time/', pageTitle: 'P', storeUrl: store });
  assert.equal(page['@graph'][0].about['@id'], 'https://inhead.app/#app');
});
