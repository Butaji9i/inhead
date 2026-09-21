import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ALLOWED_EMAIL = 'support@inhead.app';
const TEXT_EXT = new Set(['.html', '.xml', '.txt', '.json', '.webmanifest', '.svg', '.css', '.js', '.mjs']);
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z][A-Za-z0-9.-]*\.[A-Za-z]{2,}/g;

const isText = (path) => TEXT_EXT.has(extname(path).toLowerCase()) || path === 'CNAME';

export function findViolations(files, extraForbidden = []) {
  const extras = extraForbidden.map((s) => s.trim().toLowerCase()).filter(Boolean);
  const out = [];
  for (const { path, content } of files) {
    if (!isText(path)) continue;
    const seenEmails = new Set();
    for (const m of content.match(EMAIL) ?? []) {
      if (m.toLowerCase() !== ALLOWED_EMAIL && !seenEmails.has(m.toLowerCase())) {
        out.push(`${path}: email address ${m}`);
        seenEmails.add(m.toLowerCase());
      }
    }
    const lower = content.toLowerCase();
    if (lower.includes('github.com')) out.push(`${path}: contains github.com`);
    if (lower.includes('maintained by')) out.push(`${path}: contains "maintained by"`);
    for (const s of extras) {
      if (lower.includes(s)) out.push(`${path}: contains a forbidden string from FORBIDDEN_STRINGS`);
    }
  }
  return out;
}

export function checkRequired(paths, cname) {
  const out = [];
  if (!paths.includes('privacy/index.html')) out.push('missing privacy/index.html');
  if (cname === null) out.push('missing CNAME');
  else if (cname.trim() !== 'inhead.app') out.push('CNAME must contain exactly inhead.app');
  return out;
}

const isHtml = (path) => path.toLowerCase().endsWith('.html');

function hasKey(node, keys) {
  if (Array.isArray(node)) return node.some((n) => hasKey(n, keys));
  if (node && typeof node === 'object') {
    return Object.keys(node).some((k) => keys.includes(k) || hasKey(node[k], keys));
  }
  return false;
}

export function checkJsonLd(files) {
  const out = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const { path, content } of files) {
    if (!isHtml(path)) continue;
    for (const m of content.matchAll(re)) {
      let data;
      try { data = JSON.parse(m[1]); } catch { out.push(`${path}: JSON-LD does not parse`); continue; }
      if (hasKey(data, ['aggregateRating', 'review'])) out.push(`${path}: JSON-LD contains aggregateRating or review`);
    }
  }
  return out;
}

export function checkImgAlt(files) {
  const out = [];
  for (const { path, content } of files) {
    if (!isHtml(path)) continue;
    for (const m of content.matchAll(/<img\b[^>]*>/gi)) {
      const alt = m[0].match(/\balt=(?:"([^"]*)"|'([^']*)')/i);
      if (!alt) out.push(`${path}: <img> without alt: ${m[0].slice(0, 80)}`);
      else if (/placeholder/i.test(alt[1] ?? alt[2] ?? '')) out.push(`${path}: alt text says placeholder`);
    }
  }
  return out;
}

export function checkStoreGating(files, storeIsNull) {
  if (!storeIsNull) return [];
  const out = [];
  for (const { path, content } of files) {
    if (!isHtml(path)) continue;
    if (content.includes('MobileApplication')) out.push(`${path}: MobileApplication markup while STORE_URL is null`);
    if (content.includes('apple-itunes-app')) out.push(`${path}: apple-itunes-app meta while STORE_URL is null`);
  }
  return out;
}

const REQUIRED_ASSETS = ['sitemap-index.xml', 'robots.txt', 'favicon.ico', 'apple-touch-icon.png', 'og.png', 'icon-512.png'];
export function checkRequiredAssets(paths) {
  return REQUIRED_ASSETS.filter((p) => !paths.includes(p)).map((p) => `missing ${p}`);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function main() {
  const dist = process.argv[2] ?? 'dist';
  const paths = walk(dist).map((p) => relative(dist, p).split('\\').join('/'));
  const files = paths.map((path) => ({
    path,
    content: isText(path) ? readFileSync(join(dist, path), 'utf8') : '',
  }));
  const cname = paths.includes('CNAME') ? readFileSync(join(dist, 'CNAME'), 'utf8') : null;
  const extras = (process.env.FORBIDDEN_STRINGS ?? '').split(',');
  const problems = [...checkRequired(paths, cname), ...findViolations(files, extras)];
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log(`dist checks passed (${paths.length} files)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
