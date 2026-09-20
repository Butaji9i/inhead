import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ALLOWED_EMAIL = 'support@inhead.app';
const TEXT_EXT = new Set(['.html', '.xml', '.txt', '.json', '.webmanifest', '.svg']);
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

const isText = (path) => TEXT_EXT.has(extname(path).toLowerCase()) || path === 'CNAME';

export function findViolations(files, extraForbidden = []) {
  const extras = extraForbidden.map((s) => s.trim().toLowerCase()).filter(Boolean);
  const out = [];
  for (const { path, content } of files) {
    if (!isText(path)) continue;
    for (const m of content.match(EMAIL) ?? []) {
      if (m.toLowerCase() !== ALLOWED_EMAIL) out.push(`${path}: email address ${m}`);
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
