import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hero, rows, privacy, cta, footer, disclaimer } from '../src/data/copy.mjs';

const FORBIDDEN = /\b(diagnos\w*|detect\w*|identif\w*|predict\w*|treat\w*|prevent\w*|reduc\w*|cure\w*)\b/i;

function strings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out));
  return out;
}

test('landing copy avoids the words the app itself may not use', () => {
  const all = strings({ hero, rows, privacy, cta, footer });
  for (const s of all) assert.doesNotMatch(s, FORBIDDEN, `forbidden word in: ${s}`);
});

test('the disclaimer says it is not a diagnosis and not medical advice', () => {
  assert.match(disclaimer, /not a diagnosis/);
  assert.match(disclaimer, /not medical advice/);
});

test('three rows in the agreed order', () => {
  assert.deepEqual(rows.map((r) => r.key), ['record', 'see', 'share']);
  for (const r of rows) assert.ok(r.title && r.lead && r.points.length >= 2, r.key);
});

test('three privacy tiles', () => {
  assert.equal(privacy.tiles.length, 3);
});

const MONEY = /[$€£]\s?\d|\d\s?(USD|EUR|CZK|Kč)\b/i;
const WORDS = /\b(stars?|rated|reviews?|testimonial|free trial|pro|premium|subscription|subscribe|paid|prices?|pricing)\b/i;
const bad = (s) => MONEY.test(s) || WORDS.test(s);

test('no rating, review or price wording', () => {
  const all = strings({ hero, rows, privacy, cta, footer, disclaimer }).join(' ');
  assert.equal(bad(all), false);
});

test('the price and rating guards actually match', () => {
  for (const s of ['costs $5', '€9.99 a month', '5-star rated', 'Pro plan', 'subscribe now']) assert.ok(bad(s), s);
  for (const s of ['Private by design', 'Provide a report', 'professional wording']) assert.ok(!bad(s), s);
});
