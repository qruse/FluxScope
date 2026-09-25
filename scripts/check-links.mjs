import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve('dist');
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = (process.env.BASE_PATH || (process.env.GITHUB_PAGES && repository && !process.env.CUSTOM_DOMAIN ? `/${repository}/` : '/')).replace(/\/$/, '');
const htmlFiles = [];
function visit(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (entry.name.endsWith('.html')) htmlFiles.push(path);
  }
}
visit(root);

const errors = [];
for (const file of htmlFiles) {
  const route = `/${relative(root, file).replaceAll('\\', '/').replace(/index\.html$/, '')}`;
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) continue;
    const url = new URL(href, `https://local.invalid${route}`);
    if (url.hostname !== 'local.invalid') continue;
    const path = decodeURIComponent(url.pathname);
    if (base && !path.startsWith(`${base}/`)) {
      errors.push(`${relative(root, file)} → ${href}`);
      continue;
    }
    const target = resolve(root, `.${path.slice(base.length)}`);
    if (!target.startsWith(root) || !(existsSync(target) || existsSync(join(target, 'index.html')) || existsSync(`${target}.html`))) {
      errors.push(`${relative(root, file)} → ${href}`);
    }
  }
}

if (errors.length) {
  console.error(`Broken internal links:\n${errors.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Checked internal links in ${htmlFiles.length} HTML pages.`);
}
