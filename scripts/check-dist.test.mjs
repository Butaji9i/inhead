import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findViolations, checkRequired } from './check-dist.mjs';

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
