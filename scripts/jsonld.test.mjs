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
