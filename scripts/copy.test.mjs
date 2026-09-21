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

test('the disclaimer is the only place that says "diagnosis"', () => {
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

test('no rating, review or price wording', () => {
  const all = strings({ hero, rows, privacy, cta, footer, disclaimer }).join(' ');
  assert.doesNotMatch(all, /\b(stars?|rated|reviews?|testimonial|\$\d|free trial|pro\b|premium)\b/i);
});
